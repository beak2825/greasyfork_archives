// ==UserScript==
// @name         Disable Confirmations
// @namespace    http://samueldillow.com/
// @version      0.1
// @description  Disables the are you sure you want to leave this page confirmations.
// @author       Samuel Dillow
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12205/Disable%20Confirmations.user.js
// @updateURL https://update.greasyfork.org/scripts/12205/Disable%20Confirmations.meta.js
// ==/UserScript==

var removeBefores, timeout;

removeBefores = function() {
    // Remove the before
    window.onbeforeunload = null;
    // Fibbonacci the delays to prevent spammage while keeping tabs on the timeout
    timeout = (timeout + timeout) || 1000;
    // Do it again when we time out
    setTimeout(removeBefores, timeout);
};

removeBefores();
