// ==UserScript==
// @name            HackForums Left Aligner
// @namespace       xerotic/imagechanger
// @description     Removes HF right-aligned text.
// @include         http://hackforums.net/*
// @include         http://www.hackforums.net/*
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/2953/HackForums%20Left%20Aligner.user.js
// @updateURL https://update.greasyfork.org/scripts/2953/HackForums%20Left%20Aligner.meta.js
// ==/UserScript==



var divs = document.getElementsByTagName('div');
var e;
for(var i=0;i<divs.length;i++) {
	e = divs[i];
	if(e.style.textAlign == "right"){
		e.style.textAlign = "left";
	}
}