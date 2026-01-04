
// ==UserScript==
// @name         Asurascans auto-close
// @namespace    Asurascans
// @version      1
// @description  Automatically clicks the close button on Asurascans pages when it appears
// @match        https://www.asurascans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470670/Asurascans%20auto-close.user.js
// @updateURL https://update.greasyfork.org/scripts/470670/Asurascans%20auto-close.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var closeButton = document.getElementById("closeButton");
        if (closeButton) {
            closeButton.click();
        }
    }, 150);

})();