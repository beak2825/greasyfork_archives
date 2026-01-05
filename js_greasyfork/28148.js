// ==UserScript==
// @name        CSC Autoscroll
// @description Automatically scroll on cocksizecontest main page
// @namespace   cocksizecontest.com
// @include     https://www.cocksizecontest.com/
// @include     https://www.cocksizecontest.com/#*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28148/CSC%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/28148/CSC%20Autoscroll.meta.js
// ==/UserScript==

var autoscrollTimeout = null;

window.addEventListener('scroll', function() {
  if (autoscrollTimeout) {
    clearTimeout(autoscrollTimeout);
  }
  autoscrollTimeout = window.setTimeout(function() {

    // window.scrollTop + window.innerHeight == lowest pixel viewable
    // subtract document.height to get how much is left below the page
    //console.log("scrollTop: " + window.scrollY);
    //console.log("innerHeight: " + window.innerHeight);
    //console.log("height: " + document.body.scrollHeight);
    if (document.body.scrollHeight < 500) {
      return;
    }
    var remaining = document.body.scrollHeight - (window.scrollY + window.innerHeight);
    if (remaining < 500) {
      var link = document.querySelector('.cscMoreFeedLink > a[href]');
      if (link) {
        link.click();
      }
    }
    
  }, 300);
});