// ==UserScript==
// @name         WME - New Avatar
// @version      0.0.1
// @namespace    bauzer714
// @description  Get a new avatar
// @author       bauzer714
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34529/WME%20-%20New%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/34529/WME%20-%20New%20Avatar.meta.js
// ==/UserScript==

(function(){
    "use strict";
    var FAIL_COUNT = 0;
    var i_want_to_be_a = '6';

function BecomeSomethingYouAreNot() {
    var selector = '.level-icon';
    var current_level = document.querySelectorAll(selector);
    if (current_level.length === 0) {
     FAIL_COUNT++;
     return false;
    }
    document.querySelectorAll(selector)[0].className= current_level[0].className.replace(/\d/,i_want_to_be_a);
    return true;
}
    var keep_going = setInterval(function() {
      if (!BecomeSomethingYouAreNot() && FAIL_COUNT < 10) {
          return;
      }
      else if (FAIL_COUNT >= 10){
          console.log('WME - New Avatar FAILED');
      }
      clearInterval(keep_going);
      console.log("WME - NEW Avatar - logo replaced");
   }, 250); // check every 250ms
})();