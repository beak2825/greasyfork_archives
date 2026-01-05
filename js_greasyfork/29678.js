// ==UserScript==
// @name        Replace Missing Favicon
// @namespace   iFantz7E.ReplaceMissingFavicon
// @description Add default favicon for any sites that don't have a favicon
// @version     0.14
// @icon        https://i.imgur.com/AI5VsOE.png
// @include     *
// @run-at      document-start
// @grant       GM_xmlhttpRequest
// @connect     *
// @copyright   2017, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/29678/Replace%20Missing%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/29678/Replace%20Missing%20Favicon.meta.js
// ==/UserScript==

// Connect: connect to any icons in link tags

(function ()
{
	"use strict";
	// jshint multistr:true

function attachOnReady(callback) 
{
	document.addEventListener("DOMContentLoaded", function (e) 
	{
		callback();
	});
}

function getFavicon()
{
	var rgxIcon = /icon/i;
    var elesLink = document.querySelectorAll("link");
    for (var i = 0; i < elesLink.length; i++)
    {
		var attrRel = elesLink[i].getAttribute("rel");
        if(rgxIcon.test(attrRel))
        {
			return elesLink[i].getAttribute("href") || "";
        }
    }
    return "";        
}

function addFavicon()
{
	// Default icon from https://s2.googleusercontent.com/s2/favicons?domain=sample
	var iconDefault = "data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABs0lEQVR4AWL4//8/RRjO8Iucx+noO0O2qmlbUEnt5r3Juas+\
hsQD6KaG7dqCKPgx72Pe9GIY27btZBrbtm3btm0nO12D7tVXe63jqtqqU/iDw9K58sEruKkngH0DBljOE+T/qqx/Ln718RZO\
Fasxyd3XRbWzlFMxRbgOTx9QWFzHtZlD+aqLb108sOAIAai6+NbHW7lUHaZkDFJt+wp1DG7R1d0b7Z88EOL08oXwjokcOvvU\
xYMjBFCamWP5KjKBjKOpZx2HEPj+Ieod26U+dpg6lK2CIwTQH0oECGT5eHj+IgSueJ5fPaPg6PZrz6DGHiGAISE7QPrIvIKV\
rSvCe2DNHSsehIDatOBna/+OEOgTQE6WAy1AAFiVcf6PhgCGxEvlA9QngLlAQCkLsNWhBZIDz/zg4ggmjHfYxoPGEMPZECW+\
zjwmFk6Ih194y7VHYGOPvEYlTAJlQwI4MEhgTOzZGiNalRpGgsOYFw5lEfTKybgfBtmuTNdI3MrOTAQmYf/DNcAwDeycVjRO\
gZFt18gMso6V5Z8JpcEk2LPKpOAH0/4bKMCAYnuqm7cHOGHJTBRhAEJN9d/t5zCxAAAAAElFTkSuQmCC";
	
	var ele = document.createElement("link");
	ele.setAttribute("rel", "icon");
	ele.setAttribute("type", "image/png");
	ele.setAttribute("href", iconDefault);
	
	document.head.appendChild(ele);
}

function main() 
{
	if (window !== window.parent)
	{
		//console.log("iframe");
		return;
	}
	
	var onloadFavIcon = function(response, b)
	{
		if (response.status !== 200)
		{
			console.log("Favicon: Not found - " + (response.finalUrl || "Request error"));
			addFavicon();
		}
		else
		{
			//console.log("Favicon: Found 200 - " + response.finalUrl);
		}
	}
	
	var favIcon = getFavicon();
	if (!favIcon)
	{
		GM_xmlhttpRequest(
		{
			url: "/favicon.ico",
			method: "HEAD",
			onload: onloadFavIcon,
			onerror: onloadFavIcon
		});
	}
	else
	{
		//console.log(favIcon);
		/*
		GM_xmlhttpRequest(
		{
			url: favIcon,
			method: "HEAD",
			onload: onloadFavIcon,
			onerror: onloadFavIcon
		});
		*/
	}
}

attachOnReady(main);
	
})();

// End
