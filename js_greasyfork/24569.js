// ==UserScript==
// @name        Refresh Unavailable
// @namespace   iFantz7E.RefreshUnavailable
// @description Auto refresh when pages are unavailable
// @include     *
// @version     1.05
// @grant       none
// @run-at      document-start
// @copyright   2016, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/24569/Refresh%20Unavailable.user.js
// @updateURL https://update.greasyfork.org/scripts/24569/Refresh%20Unavailable.meta.js
// ==/UserScript==

(function ()
{	
	"use strict";
	// jshint multistr:true
	
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

function reload()
{
	window.location.reload();
}

function ready()
{
	var isAvailable = true;
	var reloadTime = 3000;
	
	if (document.body)
	{
		var child = document.body.firstChild;
		if (child && child.nodeType === 3 && child.textContent === "Service unavailable")
		{
			isAvailable = false;
		}
	}
	
	if (isAvailable)
	{
		if (document.title === "503 Service Temporarily Unavailable")
		{
			isAvailable = false;
			reloadTime = 30000;
		}
	}
	
	if (isAvailable)
	{
		if (document.title === "Network Error")
		{
			var eleBig = document.querySelector("body > blockquote:nth-child(2) > table:nth-child(1) "
				+ " > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) "
				+ " > font:nth-child(1) > big:nth-child(1)");
				
			if (eleBig && eleBig.textContent.trim() === "Network Error (tcp_error)")
			{
				isAvailable = false;
			}
		}
	}
	
	if (isAvailable)
	{
		var eleErr = document.querySelector("body > center:nth-child(1) > h1:nth-child(1)");
		if (eleErr && eleErr.textContent.trim() === "502 Bad Gateway")
		{
			isAvailable = false;
		}
	}
	
	if (isAvailable)
	{
		// Cloudflare
		var eleErr = document.querySelector(".cf-error-header-desc > h4");
		if (eleErr && eleErr.textContent.trim() === "Website is offline")
		{
			isAvailable = false;
			reloadTime = 10000;
		}
		
		if (isAvailable)
		{
			eleErr = document.querySelector(".cf-error-type");
			if (eleErr && eleErr.textContent.trim() === "Error")
			{
				isAvailable = false;
				reloadTime = 10000;
			}
		}
	}
	
	if (!isAvailable)
	{
		console.log("Autorefresh: Service unavailable in " + (reloadTime / 1000) + "s");
		setTimeout(reload, reloadTime);
	}
}

attachOnReady(function()
{
	ready();
});

})();

// End
