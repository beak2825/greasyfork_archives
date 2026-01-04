// ==UserScript==
// @name         Bow Insta Helper
// @namespace    -
// @version      1
// @description  adjusts upgradeHolder pos to match bow insta.
// @author       -
// @match        *://*moomoo.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476279/Bow%20Insta%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/476279/Bow%20Insta%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the element with id "#upgradeHolder"
    var upgradeHolder = document.querySelector("#upgradeHolder");

    if (upgradeHolder) {
        // Modify the CSS properties
        upgradeHolder.style.top = "470px";
        upgradeHolder.style.left = "170px";
        upgradeHolder.style.fontWeight = "100";
        upgradeHolder.style.width = "100%";
        upgradeHolder.style.position = "absolute";
        upgradeHolder.style.textAlign = "center";
    }
})();





