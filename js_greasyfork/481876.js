// ==UserScript==
// @name         No Washington Post Paywall Please
// @namespace    http://tampermonkey.net/
// @version      2023-12-10
// @description  Removes the Washington Post paywall.
// @author       darraghd493
// @match        *://*.washingtonpost.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=washingtonpost.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481876/No%20Washington%20Post%20Paywall%20Please.user.js
// @updateURL https://update.greasyfork.org/scripts/481876/No%20Washington%20Post%20Paywall%20Please.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector(".checkout-paywall-overlay").remove();
    document.body.style = "";
})();