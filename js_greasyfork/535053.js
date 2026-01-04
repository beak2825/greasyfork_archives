// ==UserScript==
// @name         Lolz Post Visibility Extended
// @namespace    https://lolz.live/unique
// @version      1.6
// @description  Локальное скрытие постов и комментариев на lolz.live для всех страниц
// @author       https://lolz.live/unique
// @license      MIT
// @match        https://lolz.live/*
// @icon         https://lolz.live/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535053/Lolz%20Post%20Visibility%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/535053/Lolz%20Post%20Visibility%20Extended.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElements(selector, callback) {
        const observer = new MutationObserver(() => {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                callback(elements);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElements('.secondaryContent.blockLinksList', (menus) => {
        menus.forEach((menu) => {
            const postContainer = menu.closest('li[id^="profile-post-"], li[id^="post-"]');
            if (!postContainer) return;

            const commentBlock = postContainer.querySelector('.messageResponse');

            // Проверка на наличие комментариев
            const comments = commentBlock ? commentBlock.querySelectorAll('.commentInfo') : [];

            // Если комментариев нет, скрываем кнопки для их показа
            if (!commentBlock || comments.length === 0) {
                return;
            }

            // Кнопка скрытия поста
            const togglePostBtn = document.createElement('a');
            togglePostBtn.textContent = 'Скрыть';
            togglePostBtn.className = 'OverlayTrigger';
            togglePostBtn.style.cursor = 'pointer';

            let hidden = false;

            togglePostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                hidden = !hidden;
                postContainer.style.opacity = hidden ? '0.3' : '1';
                togglePostBtn.textContent = hidden ? 'Вернуть' : 'Скрыть';
            });

            menu.appendChild(togglePostBtn);

            // Кнопка показа/скрытия комментариев
            if (commentBlock) {
                const commentElements = commentBlock.querySelectorAll('.comment');
                const commentMore = commentBlock.querySelectorAll('.commentMore')
                commentElements.forEach(comment => comment.style.display = 'none');
                commentMore.forEach(comment => comment.style.display = 'none');

                const showCommentsLi = document.createElement('li');
                const showCommentsBtn = document.createElement('a');
                showCommentsBtn.className = 'commentMore CommentLoader';
                showCommentsBtn.textContent = 'Показать комментарии';
                showCommentsBtn.style.cursor = 'pointer';

                let commentsHidden = true;

                showCommentsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    commentsHidden = !commentsHidden;
                    commentElements.forEach(comment => comment.style.display = commentsHidden ? 'none' : '');
                    commentMore.forEach(comment => comment.style.display = commentsHidden ? 'none' : '');
                    showCommentsBtn.textContent = commentsHidden ? 'Показать комментарии' : 'Скрыть комментарии';
                });

                showCommentsLi.appendChild(showCommentsBtn);
                commentBlock.parentElement.insertBefore(showCommentsLi, commentBlock.nextSibling);
            }

        });
    });
})();
