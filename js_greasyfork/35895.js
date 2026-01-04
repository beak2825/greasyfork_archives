// ==UserScript==
// @name        rabbit flush
// @namespace   hebiohime
// @description goal of this script make fullscreen possible again
// @include     *://www.rabb.it/*
// @version     1.1
// @grant       none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/35895/rabbit%20flush.user.js
// @updateURL https://update.greasyfork.org/scripts/35895/rabbit%20flush.meta.js
// ==/UserScript==

document.onkeydown = function(evt) {

    if (evt.keyCode == 72) {
        var pickle = document.getElementsByClassName("controls")[0];
if(pickle.style.display == "block"){
    pickle.style.display="none";
} else {
    pickle.style.display="block";
}}
    if (evt.keyCode == 72) {
        var elem = document.getElementsByClassName("tray")[0];
if(elem.style.display == "block"){
    elem.style.display="none";
} else {
elem.style.display="block";
}}

};