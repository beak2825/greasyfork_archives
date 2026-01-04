// ==UserScript==
// @name         ChatGPT desktop notification for completed response/answer
// @author       NWP
// @description  Sends a desktop notification when the ChatGPT response/answer has finished generating. It allows for toggle button dragging, memorizes the toggle button position, prevents the toggle button from going out of window bounds, and remembers the state.
// @namespace    https://greasyfork.org/users/877912
// @version      0.3
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/499156/ChatGPT%20desktop%20notification%20for%20completed%20responseanswer.user.js
// @updateURL https://update.greasyfork.org/scripts/499156/ChatGPT%20desktop%20notification%20for%20completed%20responseanswer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let stopButtonDetected = false;
    let notificationsEnabled = GM_getValue('notificationsEnabled', true);

    function sendNotification(title, text) {
        if (notificationsEnabled) {
            GM_notification({
                title: title,
                text: text,
                timeout: 5000
            });
        }
    }

    function checkButtonState() {
        const stopButton = document.querySelector('button.mb-1.me-1.flex.h-8.w-8.items-center.justify-center.rounded-full.bg-black.text-white:not([disabled]) svg.icon-lg rect');
        if (stopButton) {
            if (!stopButtonDetected) {
                stopButtonDetected = true;
            }
        } else if (stopButtonDetected) {
            sendNotification('Answer finished', 'The ChatGPT answer completed.');
            stopButtonDetected = false;
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                checkButtonState();
            }
        });
    });

    const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['disabled', 'hidden'] };

    observer.observe(document.body, config);

    checkButtonState();

    function toggleNotifications() {
        notificationsEnabled = !notificationsEnabled;
        GM_setValue('notificationsEnabled', notificationsEnabled);
        updateToggleButton();
    }

    function updateToggleButton() {
        const buttonText = notificationsEnabled ? "ON" : "OFF";
        document.getElementById('notificationToggle').textContent = `Answer notification: ${buttonText}`;
    }

    function updateButtonPosition() {
        const button = document.getElementById('notificationToggle');
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const leftPercent = GM_getValue('buttonLeftPercent', 90);
        const topPercent = GM_getValue('buttonTopPercent', 90);

        button.style.left = `${leftPercent}%`;
        button.style.top = `${topPercent}%`;

        const buttonRect = button.getBoundingClientRect();
        if (buttonRect.right > viewportWidth) {
            button.style.left = `${viewportWidth - buttonRect.width}px`;
        }
        if (buttonRect.bottom > viewportHeight) {
            button.style.top = `${viewportHeight - buttonRect.height}px`;
        }
    }

    function createToggleButton() {
        const button = document.createElement('div');
        button.id = 'notificationToggle';
        button.style.position = 'fixed';
        button.style.width = '11.875em';
        button.style.height = '2.5em';
        button.style.padding = '0.5em';
        button.style.backgroundColor = '#444';
        button.style.color = '#fff';
        button.style.borderRadius = '0.5em';
        button.style.cursor = 'pointer';
        button.style.zIndex = 10000;
        button.style.userSelect = 'none';
        button.style.MozUserSelect = 'none';
        button.style.WebkitUserSelect = 'none';
        button.textContent = `Answer notification: ${notificationsEnabled ? "ON" : "OFF"}`;
        button.addEventListener('click', toggleNotifications);

        let isDragging = false;
        let offsetX, offsetY;

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;

                const buttonWidth = button.offsetWidth;
                const buttonHeight = button.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                if (newLeft < 0) {
                    button.style.left = '0px';
                } else if (newLeft + buttonWidth > viewportWidth) {
                    button.style.left = `${viewportWidth - buttonWidth}px`;
                } else {
                    button.style.left = `${newLeft}px`;
                }

                if (newTop < 0) {
                    button.style.top = '0px';
                } else if (newTop + buttonHeight > viewportHeight) {
                    button.style.top = `${viewportHeight - buttonHeight}px`;
                } else {
                    button.style.top = `${newTop}px`;
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                button.style.cursor = 'pointer';

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                const leftPercent = (parseInt(button.style.left) / viewportWidth) * 100;
                const topPercent = (parseInt(button.style.top) / viewportHeight) * 100;

                GM_setValue('buttonLeftPercent', leftPercent);
                GM_setValue('buttonTopPercent', topPercent);
            }
        });

        window.addEventListener('resize', updateButtonPosition);

        document.body.appendChild(button);
        updateButtonPosition();
    }

    createToggleButton();
})();