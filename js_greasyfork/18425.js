// ==UserScript==
// @name        Auto reload image after error, Referral Denied
// @description Avoids error: Referral Denied You don't have permission to access xyz on this server
// @namespace   cuzi
// @oujs:author cuzi
// @version     1
// @license     GPL-3.0
// @include     /^http.+\.jpg$/
// @include     /^http.+\.jpeg$/
// @include     /^http.+\.png$/
// @include     /^http.+\.gif$/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18425/Auto%20reload%20image%20after%20error%2C%20Referral%20Denied.user.js
// @updateURL https://update.greasyfork.org/scripts/18425/Auto%20reload%20image%20after%20error%2C%20Referral%20Denied.meta.js
// ==/UserScript==
(function() {
"use strict";
  if(!document.querySelector("img")) {
    document.location.href += "";
  }
})();