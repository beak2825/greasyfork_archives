// ==UserScript==
// @name         Bloxd Adblock
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Lets you play bloxd.io without having to view ads
// @author       Devappl
// @match        https://bloxd.io/
// @match        https://staging.bloxd.io/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486709/Bloxd%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/486709/Bloxd%20Adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var elementsToHide = document.querySelectorAll('#gameadsbanner, .AdContainer, #cmpbox, .CookieConsent, [id*="fc-"], [class*="fc-"]');

        elementsToHide.forEach(function(element) {
            if (element) {
                element.style.opacity = '0';
                element.style.width = '0';
                element.style.height = '0';
            }
        });
    }, 100);
})();