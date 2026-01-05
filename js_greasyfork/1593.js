// ==UserScript==
// @name       Hack Forums Auto-Tagger
// @version    0.1
// @description This userscript allows you to automatically set the font, size, and color.
// @include      *hackforums.net*
// @namespace https://greasyfork.org/users/2155
// @downloadURL https://update.greasyfork.org/scripts/1593/Hack%20Forums%20Auto-Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/1593/Hack%20Forums%20Auto-Tagger.meta.js
// ==/UserScript==

var font = "Century Gothic"; //Change the variables on line 10, 11, and 12 to your desired font, size, and color. If you do not wish to have one of the following...
var size = "0"; //Then simply leave the string values empty (e.g. var size = "";)
var color = "#FFFFFF"; 
var closingTags = "[/font][/size][/color]"; //Don't forget to add and/or remove closing tags.

//Full reply box and PM box
try {
if (document.getElementById("message_new").value.length === 0) {
     document.getElementById("message_new").value = "[font=" + font + "]" + "[size=" + size + "]" + "[color=" + color + "]" + "\n" + "\n"+ closingTags
}}
catch(e) {}

//Quick reply box
try {
if (document.getElementById("message").value.length === 0) {
     document.getElementById("message").value = "[font=" + font + "]" + "[size=" + size + "]" + "[color=" + color + "]" + "\n" + "\n"+ closingTags
}}
catch(e) {}