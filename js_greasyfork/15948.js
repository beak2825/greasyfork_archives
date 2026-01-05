// ==UserScript==
// @name         mturk request rate reloader
// @version      2.0
// @include      https://worker.mturk.com/*
// @author       mordea
// @namespace    mordea
// @description  Automatically reloads pages which hit the refresh rate wall.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15948/mturk%20request%20rate%20reloader.user.js
// @updateURL https://update.greasyfork.org/scripts/15948/mturk%20request%20rate%20reloader.meta.js
// ==/UserScript==

var content = document.body.textContent || document.body.innerText;
var hasText = content.indexOf("You have exceeded the allowable page request rate")!==-1;
if(hasText){
   setTimeout(function(){
       window.location.reload()
   },4000);
}