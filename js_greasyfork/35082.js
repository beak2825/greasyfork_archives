// ==UserScript==
// @name         sergey schmidt
// @namespace    sergey schmidt
// @version      1.0
// @description  autoselect
// @author       DARKGIFTS
// @include     https://www.google.com/*
// @grant        none
// @require     https://code.jquery.com/jquery-3.1.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/35082/sergey%20schmidt.user.js
// @updateURL https://update.greasyfork.org/scripts/35082/sergey%20schmidt.meta.js
// ==/UserScript==

setTimeout(function(){

$('input[value="ABOUT_TOPIC"]').click();
$('input[value="CENTRAL"]').click();

window.onkeydown = function (event) {

if(event.which == 13){ //numpad enter hotkey
$('input[id="submit"]').click();
}
};

}, 1000);