// ==UserScript==
// @name        Youtube Un-Shortify
// @description Redirect YouTube #Shorts to regular video pages
// @author      MissingNO123
// @namespace   https://greasyfork.org/en/users/878446-missingno123
// @version     2
// @grant       none
// @match       https://*.youtube.com/shorts/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/440318/Youtube%20Un-Shortify.user.js
// @updateURL https://update.greasyfork.org/scripts/440318/Youtube%20Un-Shortify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = (window.location.href).replace(/\.com\/shorts\//, ".com/watch?v=");
})();
