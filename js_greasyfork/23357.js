// ==UserScript==
// @name        Yahoo Mail - Skip "secure your account" page
// @namespace   Hydroxides
// @description Automatically skip the "Help us keep your account safe" page
// @version     1.01
// @include     https://login.yahoo.com/account/update?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23357/Yahoo%20Mail%20-%20Skip%20%22secure%20your%20account%22%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/23357/Yahoo%20Mail%20-%20Skip%20%22secure%20your%20account%22%20page.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  var formElement = document.getElementsByClassName("do-it-later text-sm")[0];
  if(formElement !== null) {
    formElement.click();
  }
}, false);