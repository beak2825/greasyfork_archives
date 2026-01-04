// ==UserScript==
// @name            Project DGA Helper
// @namespace       iFantz7E.ProjectDgaHelper
// @description     For project.dga
// @version         1.03
// @match           *://project.dga.or.th/issues/*
// @icon            https://project.dga.or.th/favicon.ico
// @grant           GM_addStyle
// @license         GPL-3.0-only
// @copyright       2019, 7-elephant
// @supportURL      https://steamcommunity.com/id/7-elephant/
// @contributionURL https://www.paypal.me/iFantz7E
// @downloadURL https://update.greasyfork.org/scripts/383111/Project%20DGA%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/383111/Project%20DGA%20Helper.meta.js
// ==/UserScript==

// License: GPL-3.0-only - https://spdx.org/licenses/GPL-3.0-only.html

// Since 16 May 2019


(function ()
{
	"use strict";
	// jshint multistr:true
function initStyle()
{
	GM_addStyle
	(" \
		div.thumbnails div { vertical-align: top; margin-right: 10px !important; margin-bottom: 20px; } \
		img[src*='/attachments/download/'] { max-width: 280px !important; max-height: 280px !important; } \
		#history img[src*='/attachments/download/'] { max-width: 420px !important; max-height: 420px !important; } \
	");
}

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

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

function main()
{
	setTimeout(function()
	{
		var elesImg = document.querySelectorAll("img[src^='/attachments/thumbnail/']");
		for (var i = 0; i < elesImg.length; i++)
		{
			var href = elesImg[i].parentElement.getAttribute("href");
			if (href)
			{
				var src = elesImg[i].getAttribute("src");
				if (src.indexOf("/attachments/") === 0 && href.indexOf("/attachments/") === 0)
				{
					elesImg[i].setAttribute("src", href.splice(13, 0, "download/"));
				}
				var srcset = elesImg[i].getAttribute("srcset");
				if (srcset)
				{
					elesImg[i].setAttribute("srcset_", srcset);
					elesImg[i].removeAttribute("srcset");
				}
			}
		}
		
		var elesA = document.querySelectorAll("a[href^='/attachments/'");
		for (var i = 0; i < elesA.length; i++)
		{
			elesA[i].target = "_blank";
		}
		
	}, 500);
}

attachOnReady(initStyle);
attachOnLoad(main);

})();

// End
