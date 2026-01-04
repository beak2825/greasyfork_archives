// ==UserScript==
// @name            Experimental 2
// @namespace       Experimental 2
// @description     Cycles between the attack pages
// @include https://eggcave.com/archives/*
// @version         2.4.6
// @require        http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/416018/Experimental%202.user.js
// @updateURL https://update.greasyfork.org/scripts/416018/Experimental%202.meta.js
// ==/UserScript==

// Update the following array with your own urls, these should match the @include lines above
var cycleUrls = new Array('https://eggcave.com/archives/zuria/show','https://eggcave.com/archives/zyphoone/show');
var cycleDuration = 500;  // 4 seconds, change to suit your needs
var redirectUrl;

for (var i = 0; i < cycleUrls.length; i++)
{
	if (location.href == cycleUrls[i])
	{
		redirectUrl = (i + 1 < cycleUrls.length) ? cycleUrls[i + 1] : redirectUrl = cycleUrls[0];
		setTimeout(urlCycle,cycleDuration);
	}
}
var link = document.getElementById('https://eggcave.com/gobblers/find?code=*');


function urlCycle()
{
	location.href = redirectUrl;
}