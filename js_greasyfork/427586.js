// ==UserScript==
// @name         Quick Inverse Images color by Alt+C
// @namespace    https://snomiao.com
// @version      0.1
// @description  Alt+C to inverse images on all page, use for win10 inverse color mode (as a dark mode, while images shows right colors)
// @author       snomiao
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427586/Quick%20Inverse%20Images%20color%20by%20Alt%2BC.user.js
// @updateURL https://update.greasyfork.org/scripts/427586/Quick%20Inverse%20Images%20color%20by%20Alt%2BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '';
    head.appendChild(style);

    const toggle = () =>
        (style.innerHTML = style.innerHTML ? '' : `img{filter: invert(100%);}`);
    window.addEventListener('keydown', (e) => {
        if (e.altKey && !e.shiftKey && !e.ctrlKey && e.code == 'KeyC') {
            toggle();
        }
    });
})();
