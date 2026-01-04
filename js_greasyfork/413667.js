// ==UserScript==
// @name        Change font for YouTube
// @namespace   fds
// @description %description%
// @include     https://www.youtube.com/*
// @include     https://studio.youtube.com/*
// @include     https://googleusercontent.com/*
// @exclude     %exclude%
// @version     1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/413667/Change%20font%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/413667/Change%20font%20for%20YouTube.meta.js
// ==/UserScript==

// jshint esversion: 8

function changeFontOfIFrameCtnts(iframeToChange)
{
	for(let elementCur of $("*", iframeToChange.contentDocument.body))
		if(elementCur.nodeName == "iframe")
			changeFontOfIFrameCtnts(elementCur);
		else if(elementCur.style.fontFamily != "" && elementCur.style.fontFamily != undefined && elementCur.style.fontFamily != null)
			elementCur.style.fontFamily = "Times New Roman";
}

if($("#google-feedback-wizard").length == 0)
{
	var timer = setInterval(
		function()
		{
			if($("#google-feedback-wizard").length > 0 && $("#snapshot", $("#google-feedback-wizard")[0].contentDocument).length > 0)
			{
				clearInterval(timer);

				changeFontOfIFrameCtnts($("#google-feedback-wizard")[0]);
			}
		}, 5000);
}