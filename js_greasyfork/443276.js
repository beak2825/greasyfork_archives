/*jshint esversion: 6 */
// ==UserScript==
// @name         Un-disable password field on TreasuryDirect
// @namespace    http://evermiss.net/
// @version      0.1
// @description  Fixes the garbage password prompt.
// @author       Brendan Early
// @source       https://github.com/mymindstorm/tampermonkey-scripts
// @supportURL   https://github.com/mymindstorm/tampermonkey-scripts/issues
// @license      MIT
// @match        https://www.treasurydirect.gov/RS/PW-Display.do
// @icon         https://www.google.com/s2/favicons?domain=treasurydirect.gov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443276/Un-disable%20password%20field%20on%20TreasuryDirect.user.js
// @updateURL https://update.greasyfork.org/scripts/443276/Un-disable%20password%20field%20on%20TreasuryDirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', (event) => {
        for (const input of document.getElementsByClassName("pwordinput")) {
            input.readOnly = false
        }
    });
})();
