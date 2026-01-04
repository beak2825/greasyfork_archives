// ==UserScript==
// @name         GitHub Notifications Highlight
// @namespace    https://github.com/GooglyBlox
// @version      1.5
// @description  Highlight notifications pertaining to yourself on GitHub and place them at the top of the home feed.
// @author       GooglyBlox
// @match        https://github.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525727/GitHub%20Notifications%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/525727/GitHub%20Notifications%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightNotifications() {
        const notifications = document.querySelectorAll('.js-feed-item-component');

        let importantContainer = document.querySelector('#important-notifications');
        if (!importantContainer) {
            importantContainer = document.createElement('div');
            importantContainer.id = 'important-notifications';
            importantContainer.style.border = '2px solid #f39c12';
            importantContainer.style.padding = '10px';
            importantContainer.style.marginBottom = '20px';
            importantContainer.style.backgroundColor = '#594b00';
            importantContainer.style.marginTop = '20px';
            const importantTitle = document.createElement('h3');
            importantTitle.textContent = 'Important Notifications';
            importantContainer.appendChild(importantTitle);

            const homeTitle = document.querySelector('h2[data-target="feed-container.feedTitle"]');
            if (homeTitle) {
                const parentContainer = homeTitle.parentElement;
                parentContainer.insertAdjacentElement('afterend', importantContainer);
            }
        }

        const processedNotifications = new Set();

        notifications.forEach(notification => {
            const notificationId = notification.id;
            if (!notificationId || processedNotifications.has(notificationId)) {
                return;
            }

            const header = notification.querySelector('header');
            if (!header) return;

            const notificationText = header.textContent.toLowerCase();
            const isImportant = (
                notificationText.includes('starred') &&
                (notificationText.includes('your repository') || notificationText.includes('your repositories')) ||
                notificationText.includes('forked') && notificationText.includes('your repository') ||
                notificationText.includes('started following')
            );


            if (isImportant && !notification.closest('#important-notifications')) {
                importantContainer.appendChild(notification);
                processedNotifications.add(notificationId);
            }
        });
    }

    const feedContainer = document.querySelector('.news');
    if (feedContainer) {
        const observer = new MutationObserver(() => {
            setTimeout(highlightNotifications, 500);
        });
        observer.observe(feedContainer, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        highlightNotifications()
    });
})();
