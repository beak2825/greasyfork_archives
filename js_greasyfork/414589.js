// ==UserScript==
// @name        Copy enabler
// @namespace   Violentmonkey Scripts
// @match       https://www.fragrantica.com/*
// @grant       none
// @version     1.0
// @author      xXXX<MIKE>XXXx
// @description Enable copy on fragrantica. Say no to opressive JS
// @downloadURL https://update.greasyfork.org/scripts/414589/Copy%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/414589/Copy%20enabler.meta.js
// ==/UserScript==

var body = document.getElementsByTagName("BODY")[0]; 

function restorePaste(event){
  return true;
}
body.oncopy = restorePaste;