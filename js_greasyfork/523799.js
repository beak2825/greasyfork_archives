// ==UserScript==
// @name         Oglaf.com keyboard shortcuts
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  Arrow right for next, arrow left for previous
// @author       https://github.com/Yarillo4/
// @match        https://*.oglaf.com/*
// @exclude      https://*.oglaf.com/archive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oglaf.com
// @grant        none
// @license      MIT https://opensource.org/license/mit
// @downloadURL https://update.greasyfork.org/scripts/523799/Oglafcom%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/523799/Oglafcom%20keyboard%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            document.querySelector('a.button.next').click();
        } else if (event.key === 'ArrowLeft') {
            document.querySelector('a.button.previous').click();
        }
    });

})();