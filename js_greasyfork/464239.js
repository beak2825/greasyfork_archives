// ==UserScript==
// @name         9gag show comments
// @version      0.0.1
// @description  Show comments instead of "related" section on 9gag.com
// @namespace    chillin77
// @author       chillin77
// @license      MIT
// @match        https://9gag.com/gag/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464239/9gag%20show%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/464239/9gag%20show%20comments.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var url   = document.URL;
  if(!url.endsWith("#comment")){
    location.href = url+"#comment";
  }
})();