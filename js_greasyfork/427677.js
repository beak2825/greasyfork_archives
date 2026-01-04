// ==UserScript==
// @name         Agar.io Click Buttons
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Click blue potion buttons automatically!
// @author       KanjiasDev
// @match        https://agar.io/
// @icon         https://www.google.com/s2/favicons?domain=agar.io
// @grant        none
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/427677/Agario%20Click%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/427677/Agario%20Click%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickButtons() {
        if (!window.core) return;

        var blueButtons = document.getElementsByClassName("potion-slot-button blue");
        if (blueButtons[0]) {
            blueButtons[0].click();
        }
    }

    setInterval(clickButtons, 10000);
})();
