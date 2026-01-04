// ==UserScript==
// @name         john doe
// @version      1.0
// @description  autoselect
// @author       SarahAshlee90
// @include     https://www.google.com/*
// @grant        none
// @require     https://code.jquery.com/jquery-3.1.1.min.js

// @namespace https://greasyfork.org/users/154494
// @downloadURL https://update.greasyfork.org/scripts/34976/john%20doe.user.js
// @updateURL https://update.greasyfork.org/scripts/34976/john%20doe.meta.js
// ==/UserScript==

setTimeout(function(){

$('div[id="video-placeholder"]').click();

$('input[value="PLAYABLE"]').eq(0).click();
$('input[value="ENGLISH"]').eq(0).click();
$('input[value="ENGLISH"]').eq(1).click();
$('input[value="NOT_SENSITIVE"]').click();

window.onkeydown = function (event) {

if(event.which == 13){ //numpad enter hotkey
$('input[id="submit"]').click();
}
};

}, 1000);