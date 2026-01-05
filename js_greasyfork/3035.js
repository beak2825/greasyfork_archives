// ==UserScript==
// @name        PP mail remove autocomplete
// @namespace   armeagle.nl
// @include     https://mail.piratenpartij.nl/*
// @version     1
// @description remove autocomplete in Piratenpartij.nl mail
// @downloadURL https://update.greasyfork.org/scripts/3035/PP%20mail%20remove%20autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/3035/PP%20mail%20remove%20autocomplete.meta.js
// ==/UserScript==

var password = document.getElementById('rcmloginpwd');
if (password) {
	password.removeAttribute('autocomplete');
}