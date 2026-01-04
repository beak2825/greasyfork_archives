// ==UserScript==
// @name         Followy back/close button
// @namespace    https://greasyfork.org/en/users/1148791-vuccala
// @author       Vuccala
// @icon         https://archive.org/download/backX/backX.png
// @version      1.0
// @description  Inserts a back + close button that approaches your mouse pointer as you move it.
// @match        *://*/*
// @grant        window.close
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474083/Followy%20backclose%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/474083/Followy%20backclose%20button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const backButton = document.createElement('button');
    backButton.innerHTML = '🔙';
    backButton.style.position = 'fixed';
    backButton.style.zIndex = '9999';
    backButton.style.border = 'none';
    backButton.style.backgroundColor = 'transparent';
    backButton.style.fontSize = '24px';
    backButton.style.cursor = 'pointer';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✖️';
    closeButton.style.position = 'fixed';
    closeButton.style.zIndex = '9999';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';

    document.body.appendChild(backButton);
    document.body.appendChild(closeButton);

    // Hides Back button if no history or if about:newtab
    function updateEmoji() {
        if (window.history.length <= 1 || document.referrer === '') {
            backButton.innerHTML = '';
        }
    }

    backButton.addEventListener('click', () => {
        history.back();
    });

    closeButton.addEventListener('click', () => {
        window.close();
    });

    const chasingSpeed = 0.05;
    let emojiX = window.innerWidth / 2;
    let emojiY = window.innerHeight / 2;

    function updateEmojiPosition(event) {
        const emojiSize = 24;
        const targetX = event.clientX - emojiSize / 2;
        const targetY = event.clientY - emojiSize / 2;

        emojiX += (targetX - emojiX) * chasingSpeed;
        emojiY += (targetY - emojiY) * chasingSpeed;

        backButton.style.left = emojiX + -10 + 'px';
        backButton.style.top = emojiY + 'px';
        closeButton.style.left = emojiX + 20 + 'px';
        closeButton.style.top = emojiY + 'px';

    }

    window.addEventListener('popstate', updateEmoji);
    document.addEventListener('mousemove', updateEmojiPosition);

    // Initial emoji update
    updateEmoji();
})();