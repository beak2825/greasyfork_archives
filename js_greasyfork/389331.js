// ==UserScript==
// @name         urbtix purchase
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ticket.urbtix.hk/internet/*/secure/event/*/performance/*/expressPurchase
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389331/urbtix%20purchase.user.js
// @updateURL https://update.greasyfork.org/scripts/389331/urbtix%20purchase.meta.js
// ==/UserScript==


(function() {
 window.location.href="javascript:confirmReview()";
})();
