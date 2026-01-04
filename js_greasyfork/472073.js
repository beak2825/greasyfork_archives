// ==UserScript==
// @name         Okoun - Spoiler Fix
// @namespace    http://your-namespace.com
// @version      1.0
// @author       w4t3r1ily
// @description  Changes white text to transparent while keeping other colors the same.
// @match        https://www.okoun.cz/*
// @icon         https://opu.peklo.biz/p/23/07/24/1690208260-9b0c4.png
// @downloadURL https://update.greasyfork.org/scripts/472073/Okoun%20-%20Spoiler%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/472073/Okoun%20-%20Spoiler%20Fix.meta.js
// ==/UserScript==

(function() {
    const elements = document.querySelectorAll('*');
    for (let i = 0; i < elements.length; i++) {
        const color = window.getComputedStyle(elements[i]).color;
        if (color === 'rgb(255, 255, 255)' || color === 'white') {
            elements[i].style.color = 'transparent';
        }
    }
})();