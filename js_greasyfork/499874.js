// ==UserScript==
// @name         Translate to English
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Translate any webpage to English using Google Translate with a draggable button and toggle shortcut.
// @author       Shadow_Kurgansk
// @license MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/499874/Translate%20to%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/499874/Translate%20to%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and style the button
    function createButton() {
        const button = document.createElement('button');
        button.innerHTML = 'Translate to English';
        button.style.position = 'fixed';
        button.style.top = GM_getValue('buttonTop', '50px');
        button.style.left = GM_getValue('buttonLeft', '50px');
        button.style.zIndex = '10000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4285F4';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'move';
        button.style.display = GM_getValue('buttonVisible', false) ? 'block' : 'none';
        document.body.appendChild(button);
        return button;
    }

    const button = createButton();
    let isButtonVisible = GM_getValue('buttonVisible', false);

    // Function to toggle button visibility
    function toggleButtonVisibility() {
        isButtonVisible = !isButtonVisible;
        button.style.display = isButtonVisible ? 'block' : 'none';
        GM_setValue('buttonVisible', isButtonVisible);
    }

    // Toggle button visibility with CTRL + M
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'm') {
            toggleButtonVisibility();
        }
    });

    // Draggable functionality
    let isDragging = false;
    let offsetX, offsetY;

    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - button.offsetLeft;
        offsetY = e.clientY - button.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newLeft = `${e.clientX - offsetX}px`;
            const newTop = `${e.clientY - offsetY}px`;
            button.style.left = newLeft;
            button.style.top = newTop;
            GM_setValue('buttonLeft', newLeft);
            GM_setValue('buttonTop', newTop);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Handle translation
    const originalUrl = window.location.href;
    const isTranslated = originalUrl.includes('translate.google.com');

    function updateButtonText() {
        button.innerHTML = isTranslated ? 'View Original' : 'Translate to English';
    }

    updateButtonText();

    button.addEventListener('click', () => {
        if (!isTranslated) {
            const googleTranslateUrl = `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(originalUrl)}`;
            window.location.href = googleTranslateUrl;
        } else {
            // Extract the original URL from the Google Translate URL
            const originalUrl = new URL(window.location.href).searchParams.get('u');
            if (originalUrl) {
                window.location.href = originalUrl;
            }
        }
        updateButtonText();
    });

    // Show notification on first run
    if (!GM_getValue('translateButtonNotificationShown')) {
        GM_setValue('translateButtonNotificationShown', true);
        const notification = document.createElement('div');
        notification.innerHTML = 'Press CTRL + M to toggle the Translate to English button';
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#000';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
})();