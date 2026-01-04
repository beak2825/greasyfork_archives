// ==UserScript==
// @name         BusTimes Favourites
// @namespace    https://bustimes.org/
// @version      1.9
// @description  Favourite pages on bustimes.org to the homepage. Drag to reorder. Dark/light mode compatible.
// @author       dylan
// @match        https://bustimes.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543869/BusTimes%20Favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/543869/BusTimes%20Favourites.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FAVORITES_KEY = 'bustimes_favorites';

    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    }

    function saveFavorites(favs) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    }

    function isFavorited(url) {
        return getFavorites().some(fav => fav.url === url);
    }

    function toggleFavorite() {
        const url = window.location.href;
        const title = document.title.replace(' – bustimes.org', '');
        let favs = getFavorites();

        if (isFavorited(url)) {
            favs = favs.filter(fav => fav.url !== url);
        } else {
            favs.push({ url, title });
        }

        saveFavorites(favs);
        updateStar();
    }

    function getStarColor() {
        return document.body.classList.contains('dark-mode') ? '#ffcc00' : '#f5a623';
    }

    function updateStar() {
        const star = document.getElementById('bustimes-fav-star');
        if (!star) return;
        star.textContent = isFavorited(window.location.href) ? '★' : '☆';
        star.style.color = getStarColor();
    }

    function addStarButton() {
        const header = document.querySelector('header.site-header');
        const searchForm = header?.querySelector('form.search');
        const searchInput = searchForm?.querySelector('input[type="search"]');

        if (!header || !searchForm || !searchInput) return;

        const starBtn = document.createElement('button');
        starBtn.id = 'bustimes-fav-star';
        starBtn.textContent = isFavorited(window.location.href) ? '★' : '☆';
        starBtn.title = 'Click to favourite this page';
        starBtn.style.fontSize = '20px';
        starBtn.style.marginRight = '0.5rem';
        starBtn.style.paddingLeft = '18px';
        starBtn.style.cursor = 'pointer';
        starBtn.style.border = 'none';
        starBtn.style.background = 'transparent';
        starBtn.style.color = getStarColor();
        starBtn.onclick = toggleFavorite;

        const mapLink = header.querySelector('a[href="/map"]');
        if (mapLink) {
            mapLink.parentElement.insertBefore(starBtn, mapLink);
        }

        const observer = new MutationObserver(updateStar);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    function displayFavoritesOnHomepage() {
        if (location.pathname !== '/') return;

        const favs = getFavorites();
        if (favs.length === 0) return;

        const container = document.createElement('div');
        container.style.margin = '1rem';
        container.style.padding = '1rem';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.background = document.body.classList.contains('dark-mode') ? '#333' : '#f9f9f9';
        container.style.color = document.body.classList.contains('dark-mode') ? '#eee' : '#000';

        const title = document.createElement('h2');
        title.textContent = '⭐ Your Favourites';
        title.style.marginBottom = '0.5rem';
        container.appendChild(title);

        const list = document.createElement('ul');
        list.id = 'bustimes-fav-list';
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';

        favs.forEach((fav, index) => {
            const li = document.createElement('li');
            li.draggable = true;
            li.dataset.index = index;
            li.style.padding = '0.5rem';
            li.style.marginBottom = '0.5rem';
            li.style.cursor = 'move';
            li.style.background = document.body.classList.contains('dark-mode') ? '#444' : '#fff';
            li.style.border = '1px solid #ccc';
            li.style.borderRadius = '4px';
            li.style.transition = 'background 0.2s ease';

            // Added flexbox styles to align link and delete button
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.justifyContent = 'space-between';

            const a = document.createElement('a');
            a.href = fav.url;
            a.textContent = fav.title;
            a.style.color = 'inherit';
            a.style.textDecoration = 'none';
            a.draggable = false;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✖'; // cross symbol
            deleteBtn.title = 'Remove from favourites';
            deleteBtn.style.background = 'transparent';
            deleteBtn.style.border = 'none';
            deleteBtn.style.color = document.body.classList.contains('dark-mode') ? '#f88' : '#d00';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.fontSize = '16px';
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.draggable = false;

            deleteBtn.onclick = () => {
                let favs = getFavorites();
                favs = favs.filter(f => f.url !== fav.url);
                saveFavorites(favs);
                // Refresh the list UI:
                const container = li.closest('div');
                container.remove();
                displayFavoritesOnHomepage();
            };

            li.appendChild(a);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });

        container.appendChild(list);

        const main = document.querySelector('main');
        if (main) {
            main.prepend(container);
        } else {
            document.body.prepend(container);
        }

        setupDragAndDrop(list);
    }

    function setupDragAndDrop(listElement) {
        let draggedEl = null;

        listElement.addEventListener('dragstart', (e) => {
            draggedEl = e.target;
            e.target.classList.add('dragging');
        });

        listElement.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        listElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(listElement, e.clientY);
            if (afterElement == null) {
                listElement.appendChild(draggedEl);
            } else {
                listElement.insertBefore(draggedEl, afterElement);
            }
        });

        listElement.addEventListener('drop', () => {
            const newOrder = Array.from(listElement.children).map(li => {
                const link = li.querySelector('a');
                return {
                    url: link.href,
                    title: link.textContent
                };
            });
            saveFavorites(newOrder);
        });

        const style = document.createElement('style');
        style.textContent = `
            #bustimes-fav-list li.dragging {
                opacity: 0.5;
                background: #999 !important;
            }
            #bustimes-fav-list {
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Init
    addStarButton();
    displayFavoritesOnHomepage();
})();
