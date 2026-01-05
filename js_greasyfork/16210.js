// ==UserScript==
// @name Block Popup MOD
// @namespace Block Popup
// @include *
// @version 1
// @grant none
// @run-at document-start
// @description This script will block all popup.
// @exclude         http://*.identi.li/*
// @exclude         http://127.0.0.1:9666*
// @downloadURL https://update.greasyfork.org/scripts/16210/Block%20Popup%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/16210/Block%20Popup%20MOD.meta.js
// ==/UserScript==

function NoOpen(e){return 1}
parent.open=NoOpen;
this.open=NoOpen;
window.open=NoOpen;
open=NoOpen;

window.open = function(){
return;
}

open = function(){
return;
}


this.open = function(){
return;
}


parent.open = function(){
return;
} 