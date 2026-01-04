// ==UserScript==
// @name        Hide Mouse Idle
// @namespace   iFantz7E.HideMouseIdle
// @version     0.3
// @description Auto hide mouse pointer when idle
// @icon        https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @run-at      document-start
// @include     http*
// @grant       none
// @license     GPLv3
// @copyright   2020, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/394783/Hide%20Mouse%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/394783/Hide%20Mouse%20Idle.meta.js
// ==/UserScript==

// License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.txt

// Since 8 Jan 2020

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

var isVisible = (function()
{
	var stateKey;
	var eventKey;
	var keys =
	{
		hidden: "visibilitychange",
		webkitHidden: "webkitvisibilitychange",
		mozHidden: "mozvisibilitychange",
		msHidden: "msvisibilitychange"
	};
	for (stateKey in keys)
	{
		if (stateKey in document)
		{
			eventKey = keys[stateKey];
			break;
		}
	}
	return function(c)
	{
		if (c)
		{
			document.addEventListener(eventKey, c);
		}
		return !document[stateKey];
	}
})();

function main()
{
	var timingHideCursor = 5000; // 5 seconds
	var tmMouseMove = 0;
	
	document.body.addEventListener("mousemove", function(ev)
	{
		document.body.style.removeProperty("cursor");

		clearTimeout(tmMouseMove);

		tmMouseMove = setTimeout(function()
		{
			if (isVisible)
			{
				document.body.style.setProperty("cursor", "none");
			}
		}, timingHideCursor);
	});
}

attachOnReady(main);

})();

// End
