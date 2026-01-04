// ==UserScript==
// @name          Twitter Always Night Mode
// @description   Enables Night Mode on Twitter Forever.
// @author        Mr_Dawdi
// @version       0.1
// @grant         none
// @match         *://twitter.com/*
// @run-at        document-start
// @icon          https://about.twitter.com/etc/designs/about-twitter/public/img/favicon-32x32.png
// @namespace https://greasyfork.org/users/318995
// @downloadURL https://update.greasyfork.org/scripts/387647/Twitter%20Always%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/387647/Twitter%20Always%20Night%20Mode.meta.js
// ==/UserScript==

function createCookie(name,value,days) {
   if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
   }
   else var expires = "";
   document.cookie = name+"="+value+expires+"; path=/";
}
createCookie(name, "",-1);
createCookie('night_mode', 1, 100);
if (window.location.hash) {
   setTimeout(function (){  
   var str = document.URL;
   var res = str.replace("#loaded", "");
   var rel = window.open(res, "_self");
   }, 500);
   rel.reload();
}