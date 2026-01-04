// ==UserScript==
// @name         Badge Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle visibility of chat badges
// @author       guildedbird
// @match        https://pixelplace.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532846/Badge%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/532846/Badge%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EXCLUDED_BADGES = [
        "/img/badges/moderator.png",
        "/img/badges/chat-moderator.png",
        "/img/badges/former-global-moderator.png",
        "/img/badges/painting-moderator.png",
        "/img/badges/painting-owner.png",
        "/img/badges/admin.png"
    ];

    function updateBadgeVisibility(showBadges) {
        const images = document.querySelectorAll('#chat .messages .row img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (!EXCLUDED_BADGES.includes(src)) {
                img.style.display = showBadges ? '' : 'none';
            }
        });
    }

    function showNotification(isEnabled) {
        setTimeout(() => {
            const notifications = document.querySelector('#notification');
            if (!notifications) return;

            const existingNotification = notifications.querySelector('.box');
            if (existingNotification) existingNotification.remove();

            const notification = document.createElement('div');
            notification.className = isEnabled ? 'box success' : 'box warning';
            notification.innerHTML = `
                <div class="icon"></div>
                <div class="content">
                    <div class="title">Tools</div>
                    <div class="description">Badges are now ${isEnabled ? 'displayed in' : 'hidden from'} chat</div>
                </div>`;

            notifications.appendChild(notification);

            setTimeout(() => {
                notification.style.transition = 'opacity 1s';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 1000);
            }, 6000);
        });
    }


    const checkbox = document.createElement('a');
    checkbox.href = '#';
    checkbox.classList.add('input-checkbox', 'selected');
    checkbox.setAttribute('data-name', 'tools-enable-flair');

    checkbox.innerHTML = `
        <div>
            <div class="input">
                <div></div>
            </div>
        </div>
        <div>
            <div class="header">Display badges</div>
            <div class="content">
                Display badges in chat. Note: This does not disable mod badges
            </div>
        </div>`;

    checkbox.addEventListener('click', function(e) {
        e.preventDefault();
        checkbox.classList.toggle('selected');
        const isSelected = checkbox.classList.contains('selected');
        updateBadgeVisibility(isSelected);
        showNotification(isSelected);
    });

    const modalContent = document.querySelector('#modals .box[data-id="main"] .box-content[data-id="tools"] div form');
    if (modalContent) {
        const formChildren = modalContent.children;
        if (formChildren.length >= 18) {
            modalContent.insertBefore(checkbox, formChildren[17]);
        } else {
            modalContent.appendChild(checkbox);
        }
    }

    const observer = new MutationObserver(() => {
        updateBadgeVisibility(true);
    });

    const chat = document.querySelector('#chat .messages');
    if (chat) {
        observer.observe(chat, { childList: true, subtree: true });
    }

})();