// ==UserScript==
// @name         RIN Donors name glow
// @version      2.1
// @description  Makes cs.rin.ru "Donors" user rank/group glow in yellow.
// @author       Guess
// @match        https://cs.rin.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cs.rin.ru
// @grant        none
// @namespace https://greasyfork.org/users/1122886
// @downloadURL https://update.greasyfork.org/scripts/502024/RIN%20Donors%20name%20glow.user.js
// @updateURL https://update.greasyfork.org/scripts/502024/RIN%20Donors%20name%20glow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
@keyframes yellowglow{0%{text-shadow:0 0 5px #bf9f00}50%{text-shadow:0 0 20px #bf9f00}100%{text-shadow:0 0 5px #bf9f00}}.yellowtxtglow{animation:yellowglow 2s infinite}
    `;
    document.head.appendChild(style);
    function glowstuff() {
        const elements = document.querySelectorAll('*[style*="color: #BF9F00"]');
        elements.forEach(element => {
            element.classList.add('yellowtxtglow');
        });
    }
    glowstuff();
    const observer = new MutationObserver(glowstuff);
    observer.observe(document.body, { childList: true, subtree: true });
})();