// ==UserScript==
// @name         Dante Unlocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script unlocks archived subjects on Dante.
// @author       DaveIT
// @match        https://dante.iis.p.lodz.pl/
// @icon         https://dante.iis.p.lodz.pl/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431022/Dante%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/431022/Dante%20Unlocker.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    let buttons = null;
    let interval = null

    function unlockButtons() {
        buttons = document.getElementsByClassName('btn btn-primary mb-3');

        for(let button of buttons) {
            button.disabled = false;
        }
    }

    // if you want to clear interval
    interval = setInterval(unlockButtons, 1);

})();