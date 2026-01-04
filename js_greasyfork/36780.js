// ==UserScript==
// @namespace Sergey schmidt 2nd type
// @name       sergey schmidt 2nd Type
// @version      1.0
// @description  autoselect
// @author       dARKGIFTS
// @include     https://www.google.com/*
// @grant        none
// @require     https://code.jquery.com/jquery-3.1.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/36780/sergey%20schmidt%202nd%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/36780/sergey%20schmidt%202nd%20Type.meta.js
// ==/UserScript==

setTimeout(function(){

$('input[value="/m/02jjt"]').click();
$('input[value="/m/0bzvm2"]').click();
$('input[value="/m/0sy9b"]').click();
$('input[value="/m/0j7n6j0"]').click();

window.onkeydown = function (event) {

if(event.which == 13){ //numpad enter hotkey
$('input[id="submit"]').click();
}
};

}, 1000);