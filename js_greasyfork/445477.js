// ==UserScript==
// @name         Better Airstrikes for PnW
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sets "Target Aircraft" as the default option for Airstrikes.
// @author       RandomNoobster
// @match        https://politicsandwar.com/nation/war/airstrike/war*
// @icon         https://politicsandwar.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445477/Better%20Airstrikes%20for%20PnW.user.js
// @updateURL https://update.greasyfork.org/scripts/445477/Better%20Airstrikes%20for%20PnW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fields = document.getElementsByName("attacktype");
    fields[0].selectedIndex = 1
})();