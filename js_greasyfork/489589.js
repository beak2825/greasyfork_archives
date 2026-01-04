    // ==UserScript==
    // @name         Anilist Remover
    // @name:ru      Anilist скрытие
    // @namespace    Kellen's userstyles
    // @author       kln (t.me/kln_lzt)
    // @version      1.0
    // @description  Removes specific anime/manga from recommendations and results on Anilist
    // @description:ru  Возможность удалить выбранное аниме или мангу из рекомендаций и поиска на Anilist
    // @match        https://anilist.co/*
    // @icon         https://anilist.co/favicon.ico
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489589/Anilist%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/489589/Anilist%20Remover.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        const anilistPatterns = {
            manga: /^https:\/\/anilist\.co\/manga\/.*/,
            anime: /^https:\/\/anilist\.co\/anime\/.*/,
            settings: /^https:\/\/anilist\.co\/settings\/media/
        };
     
        function getMediaUrl() {
            const urlPath = window.location.pathname;
            const urlParts = urlPath.split('/');
            const mediaType = urlParts[1];
            const mediaId = urlParts[2];
            const mediaTitle = urlParts[3];
            return `https://anilist.co/${mediaType}/${mediaId}/${mediaTitle}`;
        }
      function getMediaId() {
        const urlPath = window.location.pathname;
        const urlParts = urlPath.split('/');
        const mediaType = urlParts[1];
        const mediaId = urlParts[2];
        return `${mediaType}/${mediaId}`;
    }
     
        function getCookie(name) {
            const cookieName = `${name}=`;
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
     
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i].trim();
                if (cookie.indexOf(cookieName) === 0) {
                    return cookie.substring(cookieName.length, cookie.length);
                }
            }
            return '';
        }
     
        function setCookie(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        }
     
        function getRemovalList() {
            const removalListCookie = getCookie('removalList');
            return removalListCookie ? JSON.parse(removalListCookie) : [];
        }
     
        function addToRemovalList(mediaUrl) {
            const removalList = getRemovalList();
            if (!removalList.includes(mediaUrl)) {
                removalList.push(mediaUrl);
                setCookie('removalList', JSON.stringify(removalList), 365);
            }
        }
     
        function removeFromRemovalList(mediaUrl) {
            const removalList = getRemovalList();
            const index = removalList.indexOf(mediaUrl);
            if (index !== -1) {
                removalList.splice(index, 1);
                setCookie('removalList', JSON.stringify(removalList), 365);
            }
        }
    function toggleMediaRemoval() {
        const currentMediaUrl = getMediaUrl();
        const removalList = getRemovalList();
     
        if (removalList.includes(currentMediaUrl)) {
            removeFromRemovalList(currentMediaUrl);
        } else {
            addToRemovalList(currentMediaUrl);
        }
     
        updateRemovalButton();
      renderRemovalList(document.getElementById('removalList'));
    }
     
     
        // Функция для обновления текста кнопки удаления на основе статуса удаления текущего медиа
    function updateRemovalButton() {
        const currentMediaId = getMediaId();
        const removalList = getRemovalList();
        const isInRemovalList = removalList.some(url => url.includes(currentMediaId));
     
        const buttonText = isInRemovalList ? 'Show this anime' : 'Hide this anime';
        const removalButton = document.getElementById('removalButton');
     
        if (removalButton) {
            removalButton.textContent = buttonText;
        } else {
            console.error('Removal button not found!');
        }
    }
     
     
     
     
    function createRemovalSection() {
        const content = document.querySelector('.content');
        if (!content) return;
     
        const existingSection = document.getElementById('removalSection');
        if (existingSection) {
            existingSection.remove();
        }
     
        const removalSection = document.createElement('div');
        removalSection.id = 'removalSection';
        removalSection.classList.add('section');
     
        const heading = document.createElement('h2');
        heading.textContent = 'Removal List';
        removalSection.appendChild(heading);
     
        const removalList = document.createElement('div');
        removalList.id = 'removalList';
        removalSection.appendChild(removalList);
     
        content.appendChild(removalSection);
     
        renderRemovalList(removalList);
    }
     
     
    function renderRemovalList(removalList) {
       if (!removalList) return; // Добавлена проверка на null
     
        removalList.innerHTML = '';
     
        const removedMedia = getRemovalList();
     
        if (removedMedia.length === 0) {
            const noMediaMessage = document.createElement('div');
            noMediaMessage.textContent = 'No anime/manga in the removal list.';
            removalList.appendChild(noMediaMessage);
            return;
        }
     
        removedMedia.forEach(mediaUrl => {
            const mediaTitle = mediaUrl.split('/').pop();
     
            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('name');
          mediaDiv.style.display = 'flex';
    mediaDiv.style.flexDirection = 'row';
    mediaDiv.style.flexWrap = 'nowrap';
    mediaDiv.style.justifyContent = 'space-between';
    mediaDiv.style.alignItems = 'center';
    mediaDiv.style.alignContent = 'normal';
          mediaDiv.style.marginBottom = '20px';
     
            const mediaLink = document.createElement('a');
            mediaLink.href = mediaUrl;
            mediaLink.textContent = mediaTitle;
     
            const removeButton = document.createElement('div');
            removeButton.classList.add('button', 'danger');
          removeButton.style.margin = '0';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                removeFromRemovalList(mediaUrl);
                renderRemovalList(removalList); // Pass the removalList element
            });
     
            mediaDiv.appendChild(mediaLink);
            mediaDiv.appendChild(removeButton);
            removalList.appendChild(mediaDiv);
        });
    }
    function isAnilistPage() {
        const currentUrl = window.location.href;
        return Object.values(anilistPatterns).some(pattern => pattern.test(currentUrl));
    }
     
     
    function createRemovalButton() {
        if (isAnilistPage()) {
            const existingButton = document.getElementById('removalButton');
            if (existingButton) {
                // Кнопка уже существует, ничего не делать
                return;
            }
     
            const dropdownMenu = document.querySelector('.el-dropdown-menu');
            const firstListItem = dropdownMenu?.querySelector('li');
     
            if (dropdownMenu && firstListItem) {
                const removalButton = document.createElement('li');
                removalButton.id = 'removalButton';
                removalButton.textContent = 'Checking Removal Status...';
                removalButton.classList.add('el-dropdown-menu__item');
                removalButton.addEventListener('click', toggleMediaRemoval);
     
                dropdownMenu.insertBefore(removalButton, firstListItem);
     
                updateRemovalButton();
            } else {
                // Попытаться создать кнопку позже
                setTimeout(createRemovalButton, 500);
            }
        }
    }
     
    function handlePageChange() {
        const currentUrl = window.location.href;
        const removalButton = document.getElementById('removalButton');
        const removalDropdown = document.getElementById('removalDropdown');
        const removalSection = document.getElementById('removalSection');
     
        if (anilistPatterns.manga.test(currentUrl) || anilistPatterns.anime.test(currentUrl)) {
            if (!removalButton) {
                createRemovalButton();
            }
            if (removalDropdown) {
                removalDropdown.remove();
            }
            if (removalSection) {
                removalSection.remove();
            }
        } else if (anilistPatterns.settings.test(currentUrl) && currentUrl.includes('/media')) {
            if (!removalButton) {
                createRemovalButton();
            }
            if (!removalSection) {
                createRemovalSection();
            }
        } else {
            if (removalButton) {
                removalButton.remove();
            }
            if (removalDropdown) {
                removalDropdown.remove();
            }
            if (removalSection) {
                removalSection.remove();
            }
        }
    }
     
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    handlePageChange();
                    removeMedia();
                }
            });
        });
     
        observer.observe(document.body, { childList: true, subtree: true });
    }
     
    function removeMedia() {
        const removalList = getRemovalList();
     
        removalList.forEach(mediaUrl => {
            const mediaId = mediaUrl.split('/')[4];
            const mediaLinks = document.querySelectorAll(`a[href*="/anime/${mediaId}/"], a[href*="/manga/${mediaId}/"]`);
            mediaLinks.forEach(link => {
                const recommendationCard = link.closest('.recommendation-card');
                if (recommendationCard) {
                    recommendationCard.remove();
                }
     
                const resultElement = link.closest('.result');
                if (resultElement) {
                    resultElement.remove();
                }
     
                const mediaCard = link.closest('.media-card');
                if (mediaCard) {
                    mediaCard.remove();
                }
            });
        });
    }
     
    window.addEventListener('load', function() {
        handlePageChange();
        observeDOMChanges();
     
        const currentUrl = window.location.href;
        if (anilistPatterns.settings.test(currentUrl)) {
            createRemovalSection();
        }
    });
     
    window.addEventListener('hashchange', handlePageChange);
      window.addEventListener('popstate', handlePageChange);
     
    removeMedia();
    })();

