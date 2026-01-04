// ==UserScript==
// @name        	Steam Screenshot Scroll
// @namespace   	iFantz7E.SteamScreenshotScroll
// @description 	Use mouse wheel to scroll screenshots in Steam
// @version     	0.03
// @run-at      	document-start
// @match       	*://store.steampowered.com/app/*
// @match       	*://steamcommunity.com/sharedfiles/filedetails/*
// @icon      		https://store.steampowered.com/favicon.ico
// @grant       	none
// @license			GPL-3.0-only
// @copyright		2018, 7-elephant
// @supportURL		https://steamcommunity.com/id/7-elephant/
// @contributionURL	https://www.paypal.me/iFantz7E
// @downloadURL https://update.greasyfork.org/scripts/368462/Steam%20Screenshot%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/368462/Steam%20Screenshot%20Scroll.meta.js
// ==/UserScript==

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html

// Since 26 May 2018
// https://greasyfork.org/scripts/368462-steam-screenshot-scroll

// Modify from:
//   https://greasyfork.org/en/scripts/759-steam-scroll/
//   https://steamstore-a.akamaihd.net/public/javascript/gamehighlightplayer.js

// External variable:
//   jQuery, g_player, HighlightPlayer

// Sample:
//   https://store.steampowered.com/app/227300/Euro_Truck_Simulator_2/
//   https://steamcommunity.com/sharedfiles/filedetails/?id=729791016

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

function main()
{
	setTimeout(function() 
	{
		var ssPlayer = null;
		
		if (typeof g_player !== "undefined")
		{
			ssPlayer = g_player;
		}
		else if (typeof HighlightPlayer !== "undefined")
		{
			HighlightPlayer.prototype.HighlightItem = function(elem, bUserAction)
			{
				// Modify
				if (!ssPlayer)
				{
					ssPlayer = this;
				}
				
				// Original
				{
					var $Elem = $JFromIDOrElement(elem);
					if (this.BIsMovie($Elem))
						this.HighlightMovie(this.GetMovieId($Elem), bUserAction);
					else
						this.HighlightScreenshot(this.GetScreenshotId($Elem));

					var nextItem = this.m_activeItem.next('.highlight_player_item');
					if (nextItem && this.BIsScreenshot(nextItem))
						this.LoadScreenshot(this.GetScreenshotId(nextItem));
				}
			}
			
			// Force set ssPlayer
			jQuery(".highlight_strip_item.focus").click();
		}
			
		var lastScroll = Date.now();
		
		function ssScroll(ev) {
			ev.preventDefault();
			
			if (Date.now() - lastScroll < 250)
			{
				// Prevent too fast scrolling
				return;
			}
			else
			{
				lastScroll = Date.now();
			}
			
			var isScrollDown = (ev.deltaY > 0);
			var siblingProp = isScrollDown ? "next" : "prev";
			
			var eleExpect = jQuery(".highlight_strip_screenshot.focus")
				[siblingProp](".highlight_strip_screenshot")[0];
				
			if (!eleExpect) {
				var elesSs = jQuery(".highlight_strip_screenshot");
				eleExpect = elesSs[isScrollDown ? 0 : elesSs.length - 1];
			}
			
			if (ssPlayer)
			{
				ssPlayer.HighlightItem(eleExpect);
				ssPlayer.ClearInterval();
			}
		}
		
		var eleHolder = jQuery("#highlight_strip")[0];
		if (eleHolder)
		{
			eleHolder.addEventListener("wheel", ssScroll);
		}
		
		if (ssPlayer)
		{
			ssPlayer.ClearInterval();
		}
	}, 1000);
}

attachOnReady(main);

})();

// End
