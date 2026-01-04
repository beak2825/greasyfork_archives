// ==UserScript==
// @name Google Smart Verbatim Switch
// @namespace https://github.com/sonofevil
// @description Switches Google search to verbatim, but allows you to turn it off later.
// @include http://www.google.*/webhp*
// @include https://www.google.*
// @include https://www.google.*/webhp*
// @include https://www.google.*
// @include https://encrypted.google.*/webhp*
// @include https://www.google.com/?gws_rd=ssl
// @version 0.1
// @run-at document-start
// 
// @downloadURL https://update.greasyfork.org/scripts/432658/Google%20Smart%20Verbatim%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/432658/Google%20Smart%20Verbatim%20Switch.meta.js
// ==/UserScript==

(function () {
  // Only enable when Google.com is freshly loaded through normal means.
 if (window.location.href.indexOf("tbs=li:1") == -1){
   if (window.location.href.indexOf("source=") == -1){
     if (window.location.href.indexOf("sclient=") == -1){
       //use verbatim
       if (window.location.href.indexOf("q=") == -1){
         window.location+="?tbs=li:1";
       } else {
         window.location+="&tbs=li:1";
       };
     };
   };
 };
    
})();