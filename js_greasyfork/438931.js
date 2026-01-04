// ==UserScript==
// @name         Better tech for Cyber Nations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Selects "10.0 Technology" by default when going to the "Technology" page.
// @author       RandomNoobster
// @match        https://www.cybernations.net/technology_purchase.asp*
// @icon         https://www.google.com/s2/favicons?domain=cybernations.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438931/Better%20tech%20for%20Cyber%20Nations.user.js
// @updateURL https://update.greasyfork.org/scripts/438931/Better%20tech%20for%20Cyber%20Nations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let newpurchase = document.getElementsByName("newpurchase")[0];
    newpurchase.value = 10;
})();