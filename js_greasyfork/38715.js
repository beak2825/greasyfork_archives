// ==UserScript==
// @name    		Disable Diamond Jingle Autoplay
// @namespace		http://habs.sdf.org/
// @description     Sets the beloved Diamond League theme autoplay on diamondleague.com to off by default
// @include 		https://*.diamondleague.com/*
// @include 		https://diamondleague.com/*
// @version  		1
// @grant    		none
// @downloadURL https://update.greasyfork.org/scripts/38715/Disable%20Diamond%20Jingle%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/38715/Disable%20Diamond%20Jingle%20Autoplay.meta.js
// ==/UserScript==

var v = document.getElementsByClassName('btn_soundcontrol fa fa-volume-up');
v.classList.remove('fa-volume-up');
v.classList.add('fa-volume-off');