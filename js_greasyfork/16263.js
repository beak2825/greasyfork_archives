// ==UserScript==
// @name		ExHentai - Preload next page
// @version	1.1
// @namespace	exhentai-preload-page
// @author	BlindJoker
// @homepage	https://github.com/BlindJoker
// @description	Loosely inspired by "Handy ExHentai" script. Now loads more pages by nesting iFrames.
// @match		http://exhentai.org/s/*
// @match		http://g.e-hentai.org/s/*
// @run-at		document-end
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/16263/ExHentai%20-%20Preload%20next%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/16263/ExHentai%20-%20Preload%20next%20page.meta.js
// ==/UserScript==
/*
* Let the user scripts or content scripts running in an annoymous function.
*/
(function (window) {
	"use strict";

	var pnext = document.getElementById("next").href;

	// Prevents possible infinite loadings
	if(window.self !== window.top && window.location.href == pnext) {
		console.log("finished loading everything");
		return;
	}

	var nframe = document.createElement("iframe");
	nframe.src = pnext;
	nframe.id = "nframe";
	nframe.style.width = "1px";
	nframe.style.height = "1px";
	nframe.style.border = "none";

	document.getElementById("img").addEventListener('load', function() {
		document.body.appendChild(nframe);
	});

	var script = document.createElement('script');

	script.type = "text/javascript";
	script.innerHTML =  	"var uweo = update_window_extents;" +
			"update_window_extents = function() {" +
			"	uweo();" +
			"	document.getElementById('img').addEventListener('load', function() {" +
			"		document.getElementById('nframe').src = document.getElementById('next').href;" +
			"	});" +
			"}";

	document.head.appendChild(script);
}) (window);