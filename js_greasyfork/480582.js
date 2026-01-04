// ==UserScript==
// @name         AbleSci Auto Sign
// @namespace    com.ablesci.scripts
// @version      0.1
// @description  Check sign status and simulate click if not signed
// @match        *://www.ablesci.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ablesci.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480582/AbleSci%20Auto%20Sign.user.js
// @updateURL https://update.greasyfork.org/scripts/480582/AbleSci%20Auto%20Sign.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Element class name
    const elementClassName = 'btn-sign';

    // Check sign status
    const signStatus = document.getElementsByClassName(elementClassName)[0];
    if (typeof signStatus === 'undefined') {
        console.log('Already signed');
        return; // No action needed if already signed
    }

    // Simulate click if not signed
    const btn = document.getElementsByClassName(elementClassName)[0];
    if (btn) {
        console.log('Not signed, simulating click');
        btn.click();
    }
})();
