// ==UserScript==
// @name         Adblocker enabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toleriere Adblocker auf www.derstandard.at
// @author       GP
// @match        http*://www.derstandard.at/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=derstandard.at
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491086/Adblocker%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/491086/Adblocker%20enabler.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.setInterval(() => {
    document.cookie = '__adblocker=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    document.cookie = "zonck=; path=/; expires=Thu, 01-Jan-70 00:00:01 GMT;domain=.derstandard.at;";
  }, 1000);
})();