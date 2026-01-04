// ==UserScript==
// @name         Alicia Weinstock
// @version      1.0
// @description  autoselect
// @author       dARKGIFTS
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @include     *.mturkcontent.com/*
// @include     https://s3.amazonaws.com/*
// @include     https://www.google.com/*
// @grant        none
// @require     https://code.jquery.com/jquery-3.1.1.min.js

// @namespace https://greasyfork.org/users/154494
// @downloadURL https://update.greasyfork.org/scripts/372769/Alicia%20Weinstock.user.js
// @updateURL https://update.greasyfork.org/scripts/372769/Alicia%20Weinstock.meta.js
// ==/UserScript==

$('input[value="No"]').click();

$('input[value="Yes, logos were visible at shopping cart"]').click();

$('input[value="Yes"]').click();

$('input[value="No"]').click();

$('input[value="No"]').click();

window.onkeydown = function (event) {

if(event.which == 13){ //numpad enter hotkey
$('input[id="submit"]').click();
}
};