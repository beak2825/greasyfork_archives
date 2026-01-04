// ==UserScript==
// @name         Bloxd Adblock
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Lets you play bloxd.io without having to view ads
// @author       CyphrNX
// @match        https://bloxd.io/
// @match        https://staging.bloxd.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525451/Bloxd%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/525451/Bloxd%20Adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var elementsToHide = document.querySelectorAll('#gameadsbanner, .AdContainer, #cmpbox, .CookieConsent, [id*="fc-"], [class*="fc-"]');

        elementsToHide.forEach(function(element) {
            if (element) {
                element.style.display = 'none';
            }
        });
    }, 100);
})();
