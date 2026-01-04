// ==UserScript==
// @name         Meteologix AdBlock
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  Pretend to be a paid account to avoid ads and popups.
// @author       James Tan
// @match        https://meteologix.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at      document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524706/Meteologix%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/524706/Meteologix%20AdBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var paywall = document.getElementById('paywall-account-type')
    paywall.setAttribute('data-value', 'payaccount')
    log(paywall.data-value)
})();