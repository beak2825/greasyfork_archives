// ==UserScript==
// @name         Custom Cursor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Just A Custom Cursor
// @author       Brioche
// @match        https://pixelplanet.fun/*
// @match        https://pixmap.fun/*
// @match        https://pixelya.fun/*
// @icon         https://files.catbox.moe/wz07sm.cur
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518498/Custom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/518498/Custom%20Cursor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const customCursorURL = 'https://files.catbox.moe/your-link';
    const cursorSize = 32;

    const validExtensions = ['png', 'cur'];
    const fileExtension = customCursorURL.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
        console.error;
        return;
    }

    function applyCursor(cursorURL) {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                cursor: url('${cursorURL}') ${cursorSize / 2} ${cursorSize / 2}, auto !important;
            }
        `;
        document.head.appendChild(style);
        const observer = new MutationObserver(() => {
            document.body.style.cursor = `url('${cursorURL}') ${cursorSize / 2} ${cursorSize / 2}, auto !important`;
        });
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }

    const testImage = new Image();
    testImage.onload = function () {
        if (fileExtension === 'png' && (testImage.width > cursorSize || testImage.height > cursorSize)) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = cursorSize;
            canvas.height = cursorSize;
            ctx.drawImage(testImage, 0, 0, cursorSize, cursorSize);

            const resizedCursorURL = canvas.toDataURL('image/png');
            applyCursor(resizedCursorURL);
        } else {
            applyCursor(customCursorURL);
        }
    };

    testImage.onerror = function () {
        console.error;
    };

    testImage.src = customCursorURL;
})();
