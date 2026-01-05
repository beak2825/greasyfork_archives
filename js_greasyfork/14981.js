// ==UserScript==
// @name googleverbatimsearch
// @namespace http://dividtechnology.com/
// @description Switches the google search start page to verbatim. Because you really meant what you typed.
// @include http://www.google.*/webhp*
// @include https://www.google.*
// @include https://www.google.*/webhp*
// @include https://www.google.*
// @include https://encrypted.google.*/webhp*
// @include https://www.google.com/?gws_rd=ssl
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/14981/googleverbatimsearch.user.js
// @updateURL https://update.greasyfork.org/scripts/14981/googleverbatimsearch.meta.js
// ==/UserScript==
(function () {
  // Only enable for the "Start" or google.com results page.
 if (window.location.href.indexOf("tbs=li:1") == -1){
     //use verbatim
     window.location+="&tbs=li:1";
 };
    
})();
