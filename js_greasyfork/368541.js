// ==UserScript==
// @name			Mello Auto Fullscreen
// @author			7-elephant
// @namespace   	iFantz7E.MelloAutoFullscreen
// @description 	Auto click fullscreen when autoplay on Mello (need manual fullscreen window F11)
// @version	 		0.05
// @match	  		*://mello.me/video/*
// @icon	  		https://mello.me/favicon.ico
// @run-at			document-start
// @grant	   		none
// @license			GPL-3.0-only
// @copyright		2018, 7-elephant
// @supportURL		https://steamcommunity.com/id/7-elephant/
// @contributionURL	https://www.paypal.me/iFantz7E
// @downloadURL https://update.greasyfork.org/scripts/368541/Mello%20Auto%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/368541/Mello%20Auto%20Fullscreen.meta.js
// ==/UserScript==

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html

// Since 27 May 2018
// https://greasyfork.org/scripts/368541/

// External variable:
//   jwplayer

// Sample:
//   https://mello.me/video/60553?autoplay=true

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

function getQueryByName(name, url)
{
	if (!url)
	{
		url = (!window.location) ? "" : window.location.search;
	}
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	var results = regex.exec(url);
	var retVal = "";
	if (results)
	{
		retVal = results[1].replace(/\+/g, " ");
		try
		{
			retVal = decodeURIComponent(retVal);
		}
		catch (ex)
		{
			console.error("getQueryByName", ex.message);
		}
	}
	return retVal;
}

function triggerMouseEvent(ele, eventType)
{
	// Using:
	//   triggerMouseEvent(ele, "mouseover");
	//   triggerMouseEvent(ele, "mousedown");
	//   triggerMouseEvent(ele, "mouseup");
	//   triggerMouseEvent(ele, "click");
	
	if (ele)
	{
		var mouseEvent = document.createEvent("MouseEvents");
		mouseEvent.initEvent(eventType, true, true);
		ele.dispatchEvent(mouseEvent);
	}
}

function main()
{
	var url = document.documentURI;
	
	//if (getQueryByName("autoplay", url) === "true")
	{
		setTimeout(function()
		{		
			if (typeof jwplayer !== "undefined")
			{
				jwplayer().setFullscreen(true);
			}
			else
			{
				var eleFull = document.querySelector(".jw-icon-fullscreen");
				if (eleFull)
				{
					triggerMouseEvent(eleFull, "mousedown");
					triggerMouseEvent(eleFull, "mouseup");
				}
			}
		}, 3000);
	}
}

attachOnReady(main);

})();

// End
