// ==UserScript==
// @name        Soundgasm Ripper
// @namespace   rus0
// @description Download m4a audio files from soundgasm.net 
// @include     https://*soundgasm.net/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12374/Soundgasm%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/12374/Soundgasm%20Ripper.meta.js
// ==/UserScript==

//set styles
$("head").append('<style type="text/css"> #getgasm a { font-size:20px;color:green;text-decoration:none;font-weight:bold;margin-left:200px; } li:last-child { list-style-type: none; }  </style>');
//find link                 
var gwa = $("html").html();
var gasm = gwa.split('m4a: "')[1].split('"')[0];
//insert download link
var gasmLink = '<li><span id="getgasm" title="Right-Click for Save Link"><a href="' + gasm + '" download="' + gasm + '" style="" target="_blank">Download<img src="http://i.imgur.com/BXHgoMy.gif" style="width:25px;"></a></span></li>';
$("nav").append(gasmLink);