// ==UserScript==
// @name        CrazyHD Smart Search Enabler - chd4.com
// @description Enables CrazyHD smartsearch box for all ranks.
// @namespace   Violentmonkey Scripts
// @match       https://www.chd4.com*/*
// @run-at       document-end
// @version 0.0.1.20211204062947
// @downloadURL https://update.greasyfork.org/scripts/436532/CrazyHD%20Smart%20Search%20Enabler%20-%20chd4com.user.js
// @updateURL https://update.greasyfork.org/scripts/436532/CrazyHD%20Smart%20Search%20Enabler%20-%20chd4com.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  let sSearch = document.querySelector("#smartkey");
  sSearch.disabled = false;
  sSearch.placeholder = "SmartSearch is turned on. Type away...";


})();