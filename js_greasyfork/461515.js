// ==UserScript==
// @name         RK9 Destroyer 9000
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicks all the checkboxes for the registration but not the submit button.
// @author       You
// @match        https://rk9.gg/register/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rk9.gg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461515/RK9%20Destroyer%209000.user.js
// @updateURL https://update.greasyfork.org/scripts/461515/RK9%20Destroyer%209000.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        document.getElementById("rules-english-c19-tab").click();
        document.getElementById("appearance").click();
        document.getElementById("terms").click();
        // I am not adding the button click for fairness...
    };
})();