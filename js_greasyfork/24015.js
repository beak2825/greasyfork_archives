// ==UserScript==
// @name        No Grayscale
// @namespace   iFantz7E.NoGrayscale
// @description No grayscale for all sites.
// @include     *
// @version     1.04
// @grant       none
// @run-at      document-start
// @copyright	2016, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/24015/No%20Grayscale.user.js
// @updateURL https://update.greasyfork.org/scripts/24015/No%20Grayscale.meta.js
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

function setNoGrayscale()
{
	if (document.querySelector(".noGrayscale"))
		return;
	
	var isGray = false;
	
	if (document.documentElement)
	{
		var styleComputed = window.getComputedStyle(document.documentElement);
		if (styleComputed && styleComputed.filter.indexOf("grayscale") > -1)
		{
			isGray = true;
		}
	}
	
	if (!isGray && document.body)
	{
		var styleComputed = window.getComputedStyle(document.body);
		if (styleComputed && styleComputed.filter.indexOf("grayscale") > -1)
		{
			isGray = true;
		}
	}
	
	if (isGray)
	{		
		var isAll = false;
		
		if (document.body)
		{
			var styleComputed = window.getComputedStyle(document.body.firstElementChild);
			if (styleComputed && styleComputed.filter.indexOf("grayscale") > -1)
			{
				isAll = true;
			}
		}
		
		var style = document.createElement("style"); 
		style.classList.add("noGrayscale");
		
		if (isAll)
		{
			style.textContent = " * { filter: none !important; } "; 
		}
		else
		{
			style.textContent = " html, body, img { filter: none !important; } "; 
		}
		
		document.head.appendChild(style);
	}
}

attachOnReady(function()
{
	setNoGrayscale();
});

attachOnLoad(function()
{
	setNoGrayscale();
	setTimeout(setNoGrayscale, 3000);
});

