// ==UserScript==
// @name         F95 Autoclick Download redirect button
// @namespace    https://f95zone.to
// @version      1.0
// @description  Automatically clicks on Download button.
// @match        https://f95zone.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470848/F95%20Autoclick%20Download%20redirect%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/470848/F95%20Autoclick%20Download%20redirect%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        let button = document.querySelector('a.host_link');
        if (button) {
            button.click();
        }
    }, 100); // wait
})();