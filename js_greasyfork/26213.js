// ==UserScript==
// @name        iFinnmark Paywall Remover
// @description iFinnmark Paywall Remover.
// @version     0.1
// @match       http://www.ifinnmark.no/*
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/91430
// @downloadURL https://update.greasyfork.org/scripts/26213/iFinnmark%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/26213/iFinnmark%20Paywall%20Remover.meta.js
// ==/UserScript==
(function() {
    GM_addStyle(".aid-background-blur {--webkit-filter:none;filter:none;}");
    GM_addStyle(".aid-incentive-overlay {display:none;}");
    GM_addStyle("#aid-overlay {display:none;}");
})();