// ==UserScript==
// @name         Expand all Reddit posts on mouse scolling
// @namespace    nothing
// @version      1.0
// @description  Expand all Reddit on mouse scolling
// @author       drive dd
// @license      MIT
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474850/Expand%20all%20Reddit%20posts%20on%20mouse%20scolling.user.js
// @updateURL https://update.greasyfork.org/scripts/474850/Expand%20all%20Reddit%20posts%20on%20mouse%20scolling.meta.js
// ==/UserScript==

(function() {
  'use strict';
document.addEventListener('wheel', expandall);

  function expandall() {

   [...document.getElementsByClassName("qt_read_more")].map( e => e.click() );
      [...document.getElementsByClassName("_3NPaMDmW2g_XhEdxfn6inI")].map( e => e.click() );
      [...document.getElementsByClassName("_35d97uauE52jtrUNWw8B4i lQv8U3Ne_-BQ6fbAfxKIS")].map( e => e.click() );
  }

})();