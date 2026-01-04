// ==UserScript==
// @name         Recolour Scamming Pips (Colorblind Friendly)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Recolour the red-yellow-green scamming pips for colourblind accessibility
// @author       TheProfessor [1425134]
// @match        https://www.torn.com/loader.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508304/Recolour%20Scamming%20Pips%20%28Colorblind%20Friendly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508304/Recolour%20Scamming%20Pips%20%28Colorblind%20Friendly%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        div[class^='zone_'][class*=' high_'] {
            background-color: rgba(0, 255, 0, 0.8) !important;
        }
        div[class^='zone_'][class*=' medium_'] {
            background-color: rgba(0, 255, 0, 0.5) !important;
        }
        div[class^='zone_'][class*='low_'] {
            background-color: rgba(0, 255, 0, 0.25) !important;
        }
        div[class^='zone_'][class*='fail_'] {
            background-color: rgba(216, 27, 96) !important;
        }
        div[class^='zone_'][class*='hesitation_'] {
            background-color: rgba(230, 225, 188, 0.75) !important;
        }
    `);
})();
