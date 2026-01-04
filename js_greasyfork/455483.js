// ==UserScript==
// @name         TMS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press . to return badge
// @author       You
// @license      MIT 
// @match        http://kmvpwtmswb1/tms_TB
// @match        http://kmvpwtmswb1/TMS_TB
// @match        http://kmvpwtmswb1/TMS_TB/TemporaryBadge
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.kmvpwtmswb1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455483/TMS.user.js
// @updateURL https://update.greasyfork.org/scripts/455483/TMS.meta.js
// ==/UserScript==

(function() {
    'use strict';

var input = document.getElementById("txtTbadgeId");
input.addEventListener("keypress", function(event) {
  if (event.key === ".") {
    event.preventDefault();
    document.getElementById("returnCardBtn").click();
  }
});

})();