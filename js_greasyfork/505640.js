// ==UserScript==
// @name         w2g open
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  witam
// @author       DURMAZ
// @match        https://player.w2g.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505640/w2g%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/505640/w2g%20open.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickOpenButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim() === 'Open') {
                button.click();
                console.log('Kliknięto przycisk "Open", zatrzymuję skrypt.');
                clearInterval(intervalId);
            }
        });
    }

    const intervalId = setInterval(clickOpenButtons, 1000);

})();
