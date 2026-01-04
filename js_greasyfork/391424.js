// Alerts you when you have an opened chat window and that person is typing 
// might be usefull to stalk who's stalking you
//
// ==UserScript==
// @name    Facebook Typing Detector
// @description Alerts you when you have an opened chat window and that person is typing. Might be usefull to stalk who's stalking you
// @date    2019-10-20
// @version  1.1
// @grant    none
// @include	https://facebook.com/*
// @include	https://www.facebook.com/*
// @namespace https://greasyfork.org/users/389185
// @downloadURL https://update.greasyfork.org/scripts/391424/Facebook%20Typing%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/391424/Facebook%20Typing%20Detector.meta.js
// ==/UserScript==


 setInterval(function(){ 
  if(document.getElementsByClassName("_31o4 _3njy").length > 0)
  {
     alert("Yo, someone's typing"); 
  } 
 }, 1000);