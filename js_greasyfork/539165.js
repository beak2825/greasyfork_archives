// ==UserScript==
// @name         Slither.io Change Snake Head To Emoji Toggle With T
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Toggles a centered emoji overlay in Slither.io with T key
// @match        http://slither.com/io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539165/Slitherio%20Change%20Snake%20Head%20To%20Emoji%20Toggle%20With%20T.user.js
// @updateURL https://update.greasyfork.org/scripts/539165/Slitherio%20Change%20Snake%20Head%20To%20Emoji%20Toggle%20With%20T.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const emojis = ['💀', '🤣', '🤬','😎']; //
    let currentIndex = 0;
    let emojiDiv;

    window.addEventListener('load', () => {
        emojiDiv = document.createElement('div');
        emojiDiv.textContent = emojis[currentIndex];
        emojiDiv.style.position = 'fixed';
        emojiDiv.style.top = '50%';
        emojiDiv.style.left = '50%';
        emojiDiv.style.transform = 'translate(-50%, -50%)';
        emojiDiv.style.fontSize = '48px';
        emojiDiv.style.zIndex = 9999;
        emojiDiv.style.pointerEvents = 'none';
        emojiDiv.style.userSelect = 'none';
        document.body.appendChild(emojiDiv);
    });

    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 't') {
            currentIndex = (currentIndex + 1) % emojis.length;
            if (emojiDiv) emojiDiv.textContent = emojis[currentIndex];
        }
    });
})();
