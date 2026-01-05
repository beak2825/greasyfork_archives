// ==UserScript==
// @name	Twitter Tweet Auto Open
// @namespace	flowconsult.at
// @version	0.1
// @description	Auto-open tweets if scrolled to top of page
// @match	https://twitter.com/*
// @copyright	Rafael Gattringer
// @license	GPL version 3 or any later version; www.gnu.org/copyleft/gpl.htm
// @downloadURL https://update.greasyfork.org/scripts/13643/Twitter%20Tweet%20Auto%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/13643/Twitter%20Tweet%20Auto%20Open.meta.js
// ==/UserScript==

var timeoutID;

timer();

window.onscroll = function ()
{
	checkPosition();
}

function checkPosition()
{
	if(window.pageYOffset <= 140)
	{
		openTweet();
	}
}

function openTweet()
{
	var newtweetsbar = document.querySelector(".new-tweets-bar");
	if (newtweetsbar) { newtweetsbar.click(); }
}

function timer()
{
	checkPosition();
	timeoutID = window.setTimeout(timer, 1000);
}
