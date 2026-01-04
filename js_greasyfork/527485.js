// ==UserScript==
// @name         Emoji Drop with Comic Sans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Emojis fall and bounce from mouse clicks, page in Comic Sans
// @author       You
// @match        *://*/*
// @grant        none
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/527485/Emoji%20Drop%20with%20Comic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/527485/Emoji%20Drop%20with%20Comic%20Sans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change font to Comic Sans
    document.body.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';

    function randomEmoji() {
        const emojis = ['🌟', '🍒', '🍎', '🍊', '🍋', '🍐', '🍑', '🍓', '🥝', '🥥'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    function createEmoji(event) {
        const emoji = document.createElement('div');
        emoji.textContent = randomEmoji();
        emoji.style.position = 'fixed';
        emoji.style.left = `${event.clientX}px`;
        emoji.style.top = `${event.clientY}px`;
        emoji.style.fontSize = `${20 + Math.random() * 30}px`;
        emoji.style.opacity = '1';
        emoji.style.transition = 'all 1s, opacity 3s';
        
        document.body.appendChild(emoji);

        const fallTime = 2000 + Math.random() * 2000;
        setTimeout(() => {
            emoji.style.top = `${window.innerHeight}px`;
            emoji.style.opacity = '0';
            setTimeout(() => {
                emoji.style.top = `${window.innerHeight - (emoji.offsetHeight * 2)}px`;
                setTimeout(() => {
                    emoji.style.top = `${window.innerHeight}px`;
                    setTimeout(() => {
                        emoji.remove();
                    }, 1000);
                }, 100);
            }, fallTime * 0.7);
        }, 0);
    }

    document.addEventListener('click', (e) => {
        for (let i = 0; i < 5; i++) {
            createEmoji(e);
        }
    });
})();