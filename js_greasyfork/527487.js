// ==UserScript==
// @name         Color Changer with Comic Sans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes background color every 5 seconds, page in Comic Sans
// @author       You
// @match        *://*/*
// @grant        none
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/527487/Color%20Changer%20with%20Comic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/527487/Color%20Changer%20with%20Comic%20Sans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change font to Comic Sans
    document.body.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function changeBackgroundColor() {
        document.body.style.backgroundColor = getRandomColor();
    }

    setInterval(changeBackgroundColor, 5000);
})();