// ==UserScript==
// @name        WME CloseW
// @namespace   https://greasyfork.org/ru/scripts/16940-wme-closew
// @description Auto close Welcome dialog
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @include     https://editor-beta.waze.com/editor/*
// @include     https://editor-beta.waze.com/*/editor/*
// @version     1.1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16940/WME%20CloseW.user.js
// @updateURL https://update.greasyfork.org/scripts/16940/WME%20CloseW.meta.js
// ==/UserScript==

var wmecw_version = "1.1.0.0";

function bootstrapCloseW()
{
	setTimeout(initialiseCloseW, 100);
}

function initialiseCloseW()
{
	console.log("WME CloseW = "+$(".close").length)
	if(!$(".close").length)
	{
		setTimeout(initialiseCloseW, 100);
		return;
	}
	$(".close").click();

	var sidepanel_feed=document.getElementById("sidepanel-feed")
	if (!sidepanel_feed)
	{
		setTimeout(initialiseCloseW, 100);
		return;
	}
	sidepanel_feed.setAttribute('style','display: none;');
}

bootstrapCloseW();
