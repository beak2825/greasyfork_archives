// ==UserScript==
// @name         Lolz Comment Toggle
// @namespace    https://lolz.live/unique
// @version      1.0
// @description  Показывать/скрывать комментарии на lolz.live
// @author       https://lolz.live/unique
// @license      MIT
// @match        https://lolz.live/*
// @icon         https://lolz.live/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535061/Lolz%20Comment%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/535061/Lolz%20Comment%20Toggle.meta.js
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
            const commentBlock2 = postContainer.querySelector('.messageSimple');

            let targetBlock = null;
            let commentElements = [];
            let commentMore = [];

            if (commentBlock) {
                const comments = commentBlock.querySelectorAll('.commentInfo');
                if (comments.length > 0) {
                    targetBlock = commentBlock;
                    commentElements = commentBlock.querySelectorAll('.comment');
                    commentMore = commentBlock.querySelectorAll('.commentMore');
                }
            }

            if (!targetBlock && commentBlock2) {
                const comments2 = commentBlock2.querySelectorAll('.commentInfo');
                if (comments2.length > 0) {
                    targetBlock = commentBlock2;
                    commentElements = commentBlock2.querySelectorAll('.comment');
                    commentMore = commentBlock2.querySelectorAll('.commentMore');
                }
            }

            if (!targetBlock || commentElements.length === 0) return;

            // Скрываем комментарии
            commentElements.forEach(comment => comment.style.display = 'none');
            commentMore.forEach(comment => comment.style.display = 'none');

            // Создаём кнопку
            const showCommentsLi = document.createElement('li');
            const showCommentsBtn = document.createElement('a');
            showCommentsBtn.className = 'commentMore CommentLoader';
            showCommentsBtn.textContent = 'Показать комментарии';
            showCommentsBtn.style.cursor = 'pointer';
            if (commentBlock2) {
                showCommentsBtn.style.marginLeft = '70px';
            }

            let commentsHidden = true;

            showCommentsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                commentsHidden = !commentsHidden;
                commentElements.forEach(comment => comment.style.display = commentsHidden ? 'none' : '');
                commentMore.forEach(comment => comment.style.display = commentsHidden ? 'none' : '');
                showCommentsBtn.textContent = commentsHidden ? 'Показать комментарии' : 'Скрыть комментарии';
            });

            showCommentsLi.appendChild(showCommentsBtn);

            targetBlock.parentElement.insertBefore(showCommentsLi, targetBlock.nextSibling);
        });
    });
})();
