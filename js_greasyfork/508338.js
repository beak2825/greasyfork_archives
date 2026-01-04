// ==UserScript==
// @name         Torn Recolour Scamming Pips
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Recolour the red-yellow-green scamming pips for those with colour blindness
// @author       TheProfessor [1425134] and QueenLunara [3408686]
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508338/Torn%20Recolour%20Scamming%20Pips.user.js
// @updateURL https://update.greasyfork.org/scripts/508338/Torn%20Recolour%20Scamming%20Pips.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function recolorElements() {
        if (typeof $ === 'undefined') return;
        $("div[class^='zone_'][class*=' high_']").css({ "background-color": "rgba(0, 255, 0, 0.8)" });
        $("div[class^='zone_'][class*=' medium_']").css({ "background-color": "rgba(0, 255, 0, 0.5)" });
        $("div[class^='zone_'][class*='low_']").css({ "background-color": "rgba(0, 255, 0, 0.25)" });
        $("div[class^='zone_'][class*='fail_']").css({ "background-color": "rgba(216, 27, 96)" });
        $("div[class^='zone_'][class*='hesitation_']").css({ "background-color": "rgba(230, 225, 188, 0.75)" });
    }
    function observeDOM() {
        new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setTimeout(recolorElements, 100);
                }
            });
        }).observe(document.body, { childList: true, subtree: true });
    }
    function init() {
        recolorElements();
        observeDOM();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
