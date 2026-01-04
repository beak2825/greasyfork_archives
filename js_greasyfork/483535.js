// ==UserScript==
// @name         CopyNameButton
// @version      2.1
// @description  Добавляет кнопку скопировать ник возле каждого сообщения в теме
// @author       k1erry
// @license      MIT
// @icon         https://cdn-icons-png.flaticon.com/512/1622/1622069.png
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*
// @namespace    http://tampermonkey.net/
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/483535/CopyNameButton.user.js
// @updateURL https://update.greasyfork.org/scripts/483535/CopyNameButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentNotification = null;

    function copyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    function showNotification(message) {
        if (currentNotification) {
            document.body.removeChild(currentNotification);
        }

        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';

        document.body.appendChild(notification);
        currentNotification = notification;

        setTimeout(() => {
            document.body.removeChild(notification);
            currentNotification = null;
        }, 3000);
    }

    function addCopyButtonToUsername(usernameElement, usernameText) {
        const parentElement = usernameElement.parentNode;

        if (parentElement.querySelector('img[title="Скопировать ник"]')) return;

        const copyIcon = document.createElement('img');
        copyIcon.src = 'https://cdn-icons-png.flaticon.com/512/1622/1622069.png';
        copyIcon.style.width = '16px';
        copyIcon.style.height = '16px';
        copyIcon.style.marginLeft = '10px';
        copyIcon.style.cursor = 'pointer';
        copyIcon.title = 'Скопировать ник';

        copyIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            copyTextToClipboard(usernameText);
            showNotification('Ник "' + usernameText + '" скопирован в буфер обмена.');

            parentElement.removeChild(copyIcon);
        });

        parentElement.insertBefore(copyIcon, usernameElement.nextSibling);
    }

    function processPost(postElement) {
        const authorName = postElement.getAttribute('data-author');
        if (authorName) {
            const usernameElement = postElement.querySelector('.userText .username.poster');
            if (usernameElement) {
                addCopyButtonToUsername(usernameElement, authorName);
            }
        }
    }

    function processComment(commentElement) {
        const authorUsername = commentElement.querySelector('a.username.poster');
        if (authorUsername) {
            addCopyButtonToUsername(authorUsername, authorUsername.textContent.trim());
        }
    }

    function observeNewContent(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const comment = node.closest('li.comment');
                        const post = node.closest('li.message');
                        if (comment) processComment(comment);
                        if (post) processPost(post);
                    }
                });
            }
        }
    }

    const comments = document.querySelectorAll('li.comment');
    const posts = document.querySelectorAll('li.message');
    comments.forEach(processComment);
    posts.forEach(processPost);

    const contentContainer = document.querySelector('#content');
    if (contentContainer) {
        const observer = new MutationObserver(observeNewContent);
        observer.observe(contentContainer, { childList: true, subtree: true });
    }
})();
