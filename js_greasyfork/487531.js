// ==UserScript==
// @name		Hide Reposts on Twitter
// @description	Hides reposts (retweets) when scrolling
// @namespace	Hide_Reposts_on_Twitter
// @compatible	Chrome
// @compatible	Firefox
// @version		1.21
// @author		Owyn
// @match		https://x.com/*
// @match		https://twitter.com/*
// @grant		GM_registerMenuCommand
// @noframes
// @run-at		document-end
// @sandbox		JavaScript
// @license		MIT
// @downloadURL https://update.greasyfork.org/scripts/487531/Hide%20Reposts%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/487531/Hide%20Reposts%20on%20Twitter.meta.js
// ==/UserScript==
'use strict';

const tweetCSS = '[data-testid="cellInnerDiv"]';
const repostCSS = '[data-testid="socialContext"]';
const alreadyHiddenCSS = '[style*="display: none;"]';

function hideReposts()
{
	var n = document.querySelectorAll(tweetCSS+':has('+repostCSS+'):not('+alreadyHiddenCSS+')');
	for (let i = 0; i < n.length; i++)
	{
		n[i].style.display = "none";
		console.debug("hid a repost");
	}
	setTimeout(hideReposts, 500);
}

window.addEventListener("scroll", hideReposts);

if (typeof GM_registerMenuCommand !== "undefined")
{
	GM_registerMenuCommand("Disable (this once for this page)", () => window.removeEventListener("scroll", hideReposts), "h");
}
