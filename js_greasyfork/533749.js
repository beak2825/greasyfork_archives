// ==UserScript==
// @name         Better Sturdy
// @namespace    dunkydonut
// @version      1.1
// @description  Easy image filtering and post marking + hide your own posts
// @author       ILoveS10
// @license      MIT
// @match        https://sturdychan.help/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533749/Better%20Sturdy.user.js
// @updateURL https://update.greasyfork.org/scripts/533749/Better%20Sturdy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hiddenCount = 0;
    const hiddenDisplay = document.querySelector('#hidden');
    const hiddenPosts = new Map();

    function updateHiddenDisplay() {
        if (hiddenDisplay) hiddenDisplay.textContent = `Hidden: ${hiddenPosts.size}`;
    }

    function hashFiltering(postElement) {
        const image = postElement.querySelector('figure img');
        const filterArea = document.querySelector('#filterArea');
        if (!image || !filterArea) return null;

        const imageURL = image.src;
        const filenameWithExt = imageURL.split('/').pop();
        const filenameWithoutExt = filenameWithExt.split('.')[0];
        const hashLine = `hash:${filenameWithoutExt}`;

        filterArea.value += `\n${hashLine}`;
        return hashLine;
    }

    function showMessage(text, undoCallback) {
        const message = document.createElement('div');
        message.id = 'sturdy-message';
        message.style.position = 'fixed';
        message.style.top = '30px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.backgroundColor = '#000';
        message.style.color = '#fff';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '8px';
        message.style.zIndex = '10000';
        message.style.fontSize = '16px';
        message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        message.style.display = 'flex';
        message.style.alignItems = 'center';
        message.style.gap = '10px';

        const textNode = document.createElement('span');
        textNode.textContent = text;

        const showButton = document.createElement('button');
        showButton.textContent = '[Show]';
        showButton.style.background = 'none';
        showButton.style.color = '#0af';
        showButton.style.border = 'none';
        showButton.style.cursor = 'pointer';
        showButton.style.fontSize = '16px';

        const undoButton = document.createElement('button');
        undoButton.textContent = '[Undo]';
        undoButton.style.background = 'none';
        undoButton.style.color = '#0af';
        undoButton.style.border = 'none';
        undoButton.style.cursor = 'pointer';
        undoButton.style.fontSize = '16px';

        showButton.addEventListener('click', () => {
            const filterBox = document.getElementById('megukascript-options');
            const filterTabs = filterBox?.querySelectorAll('.tab-link');
            const filtersTab = Array.from(filterTabs || []).find(tab => tab.dataset.id === '1');
            const filterArea = document.getElementById('filterArea');

            if (filterBox) filterBox.style.display = 'block';
            if (filtersTab) filtersTab.click();
            if (filterArea) filterArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        undoButton.addEventListener('click', () => {
            undoCallback();
            message.remove();
        });

        message.appendChild(textNode);
        message.appendChild(showButton);
        message.appendChild(undoButton);
        document.body.appendChild(message);

        const removeMessage = () => {
            message.remove();
            document.removeEventListener('keydown', onKeyDown);
        };

        const onKeyDown = (e) => {
            if (e.key === 'Escape') removeMessage();
        };

        document.addEventListener('keydown', onKeyDown);
        setTimeout(removeMessage, 10000);
    }

    function hideReplies(post) {
        const backlinks = post.querySelectorAll('.backlinks a.post-link[data-id]');
        backlinks.forEach(link => {
            const replyId = link.getAttribute('data-id');
            const replyPost = document.getElementById(`p${replyId}`);
            if (replyPost && !hiddenPosts.has(replyPost)) {
                const originalClass = replyPost.className;
                replyPost.classList.add('hidden');
                hiddenPosts.set(replyPost, originalClass);
            }
        });
    }

    function addButtons() {
        const dropdowns = document.querySelectorAll('ul.popup-menu.glass');

        dropdowns.forEach(dropdown => {
            const post = dropdown.closest('article');
            if (!post) return;

            if (!dropdown.querySelector('li[data-id="hide"]')) {
                const hideItem = document.createElement('li');
                hideItem.setAttribute('data-id', 'hide');
                hideItem.textContent = 'Hide';
                hideItem.addEventListener('click', e => {
                    e.stopPropagation();
                    const originalClass = post.classList.contains('postMine') ? 'glass postMine' : 'glass';
                    post.classList.remove('postMine');
                    post.classList.add('hidden');
                    hiddenPosts.set(post, originalClass);
                    hideReplies(post);
                    updateHiddenDisplay();
                });
                dropdown.insertBefore(hideItem, dropdown.firstChild);
            }

            if (!dropdown.querySelector('li[data-id="addHashToFilter"]')) {
                const hasImage = post.querySelector('figcaption a[download]');
                if (hasImage) {
                    const hashFilter = document.createElement('li');
                    hashFilter.setAttribute('data-id', 'addHashToFilter');
                    hashFilter.textContent = 'Filter Hash';

                    hashFilter.addEventListener('click', e => {
                        e.stopPropagation();
                        const hashLine = hashFiltering(post);
                        if (!hashLine) return;

                        const saveButton = document.getElementById('filterArea_button');
                        if (saveButton) saveButton.click();

                        showMessage('Image Filtered. Refresh page.', () => {
                            const filterArea = document.querySelector('#filterArea');
                            if (!filterArea) return;
                            const lines = filterArea.value.split('\n').filter(line => line.trim() !== hashLine);
                            filterArea.value = lines.join('\n');
                            if (saveButton) saveButton.click();
                        });
                    });

                    dropdown.appendChild(hashFilter);
                }
            }
        });
    }

    addButtons();
    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    function addToggleMarkButtons() {
        document.querySelectorAll('article.glass .popup-menu.glass').forEach(menu => {
            const article = menu.closest('article');
            if (!article) return;

            let existingToggle = menu.querySelector('li[data-id="toggle-own"]');
            if (!existingToggle) {
                const toggleItem = document.createElement('li');
                toggleItem.setAttribute('data-id', 'toggle-own');

                function updateToggleText() {
                    toggleItem.textContent = article.classList.contains('postMine') ?
                        'Unmark post as your own' : 'Mark post as your own';
                }

                toggleItem.addEventListener('click', () => {
                    const postId = article.id.replace('p', '');
                    const replySelectors = `a.post-link[data-id="${postId}"]`;

                    if (article.classList.contains('postMine')) {
                        article.classList.remove('postMine');
                        const author = article.querySelector('b.name i');
                        if (author && author.textContent.trim() === '(You)') author.remove();
                        document.querySelectorAll(replySelectors).forEach(link => {
                            const replyArticle = link.closest('article');
                            if (replyArticle) {
                                link.innerHTML = link.innerHTML.replace(' (You)', '');
                                replyArticle.classList.remove('postReply');
                            }
                        });
                    } else {
                        article.classList.add('postMine');
                        const nameSpan = article.querySelector('b.name span');
                        if (nameSpan && !article.querySelector('b.name i')) {
                            const youMarker = document.createElement('i');
                            youMarker.textContent = ' (You)';
                            nameSpan.insertAdjacentElement('afterend', youMarker);
                        }
                        document.querySelectorAll(replySelectors).forEach(link => {
                            const replyArticle = link.closest('article');
                            if (replyArticle && !link.innerHTML.includes(' (You)')) {
                                link.innerHTML = link.innerHTML.replace(/(&gt;&gt;\d+)/, '$1 (You)');
                                replyArticle.classList.add('postReply');
                            }
                        });
                    }
                    updateToggleText();
                });

                updateToggleText();
                menu.appendChild(toggleItem);
            }
        });
    }

    addToggleMarkButtons();
    const toggleObserver = new MutationObserver(addToggleMarkButtons);
    toggleObserver.observe(document.body, { childList: true, subtree: true });

    if (hiddenDisplay) {
        hiddenDisplay.addEventListener('click', () => {
            hiddenPosts.forEach((originalClass, post) => {
                post.className = originalClass;
            });
            hiddenPosts.clear();
            updateHiddenDisplay();
        });
    }
})();