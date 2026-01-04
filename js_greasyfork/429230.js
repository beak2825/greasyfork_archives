// ==UserScript==
// @name         @FREEBNB.CC - Auto Claim
// @namespace    http://tampermonkey.net/
// @version      1.0 BETA
// @description  Auto Claim FreeBNB.cc
// @author       SYABIZ TECH
// @match        *://freebnb.cc/*
// @icon         https://freebnb.cc/assets/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429230/%40FREEBNBCC%20-%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/429230/%40FREEBNBCC%20-%20Auto%20Claim.meta.js
// ==/UserScript==


(function() {
    'use strict';

    setInterval(function() {
  document.querySelector("a.claim-btn").click();
}, 60000);

})();