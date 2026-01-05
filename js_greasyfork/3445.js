// ==UserScript==
// @name        Go to hell, Steam Link Filter
// @namespace   /u/harmonictimecube
// @description Redirects all links sent through the Steam Link Filter to their original destination
// @include     https://steamcommunity.com/linkfilter/*
// @run-at document-start
// @icon http://i.imgur.com/u0DvTg8.png
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/3445/Go%20to%20hell%2C%20Steam%20Link%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/3445/Go%20to%20hell%2C%20Steam%20Link%20Filter.meta.js
// ==/UserScript==

var url = window.location.href;
var new_url = url.replace("https://steamcommunity.com/linkfilter/?url=", "");

window.location.replace(new_url);