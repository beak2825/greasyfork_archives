// ==UserScript==
// @name         TreasuryDirect Copypaste
// @namespace    https://www.treasurydirect.gov/RS/PW-Display.do
// @version      0.2
// @description  Allow credentials to be pasted from a password manager into the TreasuryDirect login form.
// @author       David Carter
// @license      MIT
// @match        https://www.treasurydirect.gov/RS/PW-Display.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=treasurydirect.gov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450292/TreasuryDirect%20Copypaste.user.js
// @updateURL https://update.greasyfork.org/scripts/450292/TreasuryDirect%20Copypaste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("input[class='pwordinput']").removeAttribute("readonly");
})();