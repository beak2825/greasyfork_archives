// ==UserScript==
// @name     IRCTC expand
// @version  1
// @grant    none
// @include https://www.irctc.co.in/*
// @description:en IRCTC train list expander
// @namespace https://greasyfork.org/users/442434
// @description IRCTC train list expander
// @downloadURL https://update.greasyfork.org/scripts/396164/IRCTC%20expand.user.js
// @updateURL https://update.greasyfork.org/scripts/396164/IRCTC%20expand.meta.js
// ==/UserScript==

setInterval(expand,100);

function expand(){
  
var evt = document.createEvent ("HTMLEvents");
evt.initEvent ("click", true, true);
var elements = document.getElementsByClassName("form-control btn btn-primary");
var names = '';
for(var i=0; i<elements.length; i++) {
    elements[i].dispatchEvent(evt);
}
}