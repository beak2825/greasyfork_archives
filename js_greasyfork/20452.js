// ==UserScript==
// @name         b1
// @version      1.0
// @include      https://www.mturk.com/mturk/*
// @author       hjkhjk
// @namespace    jjkjkh
// @description  reload
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20452/b1.user.js
// @updateURL https://update.greasyfork.org/scripts/20452/b1.meta.js
// ==/UserScript==


//got from https://greasyfork.org/en/scripts/15948-mturk-request-rate-reloader/code

var content = document.body.textContent || document.body.innerText;
var hasText = content.indexOf("You have exceeded the maximum allowed page request rate for this website.")!==-1;
if(hasText){
   setTimeout(function(){
       window.location.reload()
   },4000);
}