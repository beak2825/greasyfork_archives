// ==UserScript==
// @name        Reddit - Auto Load More Comments
// @description Automatically load more comments at the bottom of a Reddit comment page
// @namespace   valacar.reddit.auto-load-more-comments
// @include     /^https?://www\.reddit\.com/r/[^/]+/comments//
// @version     0.1.1
// @grant       none
// @compatible  firefox Firefox with GreaseMonkey
// @compatible  chrome Chrome with TamperMonkey
// @author      valacar
// @downloadURL https://update.greasyfork.org/scripts/10387/Reddit%20-%20Auto%20Load%20More%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/10387/Reddit%20-%20Auto%20Load%20More%20Comments.meta.js
// ==/UserScript==

// Note: most of this code is adapted from StackOverflow...
// http://stackoverflow.com/a/7557433
// http://stackoverflow.com/a/19343058

function TriggerMouseEvent(node, eventType) {
	var clickEvent = document.createEvent('MouseEvents');
	clickEvent.initEvent (eventType, true, true);
	//console.log('clicking');
	node.dispatchEvent (clickEvent);
}

function MoreCommentsLinkHandler() {
	var el = document.querySelector('.nestedlisting > div:nth-last-of-type(2) .morecomments a');

	if (el) {
		var rect = el.getBoundingClientRect();

		if (rect.top >= 0 && rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		   )
		{
			//console.log('visible');

			if (MoreCommentsLinkHandler.lastTime == undefined)
			{
				MoreCommentsLinkHandler.lastTime = new Date();
				MoreCommentsLinkHandler.firstTime = true;
			}
			else
			{
				var now = new Date();
				MoreCommentsLinkHandler.firstTime = false;
				var elapsedTime = now - MoreCommentsLinkHandler.lastTime;
				//console.log('elapsed: ' + elapsedTime);
				MoreCommentsLinkHandler.lastTime = now;
			}

			/* only click if one second has passed since the last time the link was visible */
			if (MoreCommentsLinkHandler.firstTime || elapsedTime > 1000) {
				TriggerMouseEvent(el, "click");
			}
		}
	}

}

document.addEventListener('DOMContentLoaded', MoreCommentsLinkHandler, false);
document.addEventListener('load', MoreCommentsLinkHandler, false);
document.addEventListener('scroll', MoreCommentsLinkHandler, false);
document.addEventListener('resize', MoreCommentsLinkHandler, false);
