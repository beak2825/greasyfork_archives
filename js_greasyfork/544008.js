// ==UserScript==
// @name         Pardus Forum Button Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Completely remove the Forum button from the top navigation bar in Pardus. As if it was never there.
// @author       Solarix
// @match        https://*.pardus.at/menu.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544008/Pardus%20Forum%20Button%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/544008/Pardus%20Forum%20Button%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const menuButtons = document.querySelectorAll('td.menubutton');

    menuButtons.forEach(button => {
        const forumImg = button.querySelector('img[alt="Forum"]');
        if (forumImg) {
            const tdToRemove = button;
            const spacer = tdToRemove.previousElementSibling;

            // Remove the button and its left-hand spacer
            if (tdToRemove) tdToRemove.remove();
            if (spacer && spacer.tagName === 'TD' && spacer.innerHTML.includes('&nbsp;')) {
                spacer.remove();
            }
        }
    });
})();
