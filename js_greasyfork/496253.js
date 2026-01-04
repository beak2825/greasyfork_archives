// ==UserScript==
// @name        twitter.com/x.com start videos unmuted
// @namespace   https://greasyfork.org/en/users/13300-littlepluto
// @match       https://twitter.com/*
// @match       https://x.com/*
// @grant       none
// @noframes
// @version     1.0
// @author      -
// @description 4/22/2024, 6:21:58 PM
// @downloadURL https://update.greasyfork.org/scripts/496253/twittercomxcom%20start%20videos%20unmuted.user.js
// @updateURL https://update.greasyfork.org/scripts/496253/twittercomxcom%20start%20videos%20unmuted.meta.js
// ==/UserScript==






document.addEventListener("play", handleEvent,
{
	capture: true,
	passive: true
});


function handleEvent(e)
{
	
	video = e.target;
	isMuted = video.muted;
	hasPlayed = video.played.length != 0;
	

	
	
	
	if (isMuted && !hasPlayed)
	{
		let sibling = video.parentElement.parentElement.nextElementSibling;
		let grandchild = sibling.firstElementChild.firstElementChild;
		if (overlay = grandchild.firstElementChild)
		{
			
			executeMouseDown(overlay);
		}
		else
		{
			
			
			sibling.querySelector("button").click();
			
		}

	}
}


function executeMouseDown(mouseTarget)
{

	
	mouseTarget.dispatchEvent(new MouseEvent("mousedown",
	{
		bubbles: true
	}));
	
	
	mouseTarget.dispatchEvent(new MouseEvent("mouseup",
	{
		bubbles: true
	}));

}