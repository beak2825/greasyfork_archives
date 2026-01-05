// ==UserScript==
// @name        WhiteBG
// @namespace   iFantz7E.WhiteBG
// @version     1.12
// @description White background for pages that not set background color
// @include     *
// @run-at		document-start
// @grant       none
// @copyright   2016, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/24711/WhiteBG.user.js
// @updateURL https://update.greasyfork.org/scripts/24711/WhiteBG.meta.js
// ==/UserScript==

function attachOnLoad(callback)
{
	window.addEventListener("load", function (e) 
	{
		callback();
	});
}

function attachOnReady(callback) 
{
	document.addEventListener("DOMContentLoaded", function (e) 
	{
		callback();
	});
}

function main() 
{
	if (window.parent === window && document.documentElement && document.body)
	{
		var bgHead = window.getComputedStyle(document.documentElement).backgroundColor;
		if (bgHead === "transparent" || bgHead === "rgba(0, 0, 0, 0)")
		{
			var bgBody = window.getComputedStyle(document.body).backgroundColor;
			if (bgBody === "transparent" || bgBody === "rgba(0, 0, 0, 0)")
			{
				document.documentElement.style.setProperty("background-color", "white", "important");
				document.body.style.setProperty("background-color", "white", "important");
			}
		}
	}
}

attachOnReady(main);
