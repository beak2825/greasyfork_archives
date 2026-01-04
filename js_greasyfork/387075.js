// ==UserScript==
// @name         Moon3D Multiplier in Title
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A simple script that shows you the multiplier in title.
// @author       Can Yüce
// @match        *://moon3d.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387075/Moon3D%20Multiplier%20in%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/387075/Moon3D%20Multiplier%20in%20Title.meta.js
// ==/UserScript==

setInterval(function() {
var za= document.getElementsByClassName("jss653 jss665 jss686 jss679")[0];
if (za) {
	document.title = za.innerText;
} else {
	document.title = document.getElementsByClassName("jss944")[0].innerText;
};

}, 1);