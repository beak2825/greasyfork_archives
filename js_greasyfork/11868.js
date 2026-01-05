// ==UserScript==
// @name        Disqus Downvote Exposer
// @namespace   MadeByXorok
// @include     *://*.disqus.com/*
// @include     *://disqus.com/*
// @version     1
// @grant       none
//
// @description This is a port of the "Disqus Downvote Exposer"-addon for Chrome.
// It can be found here: https://chrome.google.com/webstore/detail/disqus-downvote-exposer/onccocebmmmcfgipaappfpolojndnkce
//
// I ported it to ensure cross-browser-compatibility (in my case Firefox). The original code belongs to Yunku Daniel Kang.
// @downloadURL https://update.greasyfork.org/scripts/11868/Disqus%20Downvote%20Exposer.user.js
// @updateURL https://update.greasyfork.org/scripts/11868/Disqus%20Downvote%20Exposer.meta.js
// ==/UserScript==

setInterval(ShowDownvotes, 3000);

function ShowDownvotes()
{
	var downvotes = document.getElementsByClassName("vote-down");

	for (var i = 0; i < downvotes.length; i++)
	{
		var downvoteCount = downvotes[i].getElementsByClassName("downvote-count");

		if (downvoteCount.length == 0)
		{
			downvoteCount = document.createElement("span");
			downvoteCount.className = "downvote-count";
			downvoteCount.style.position = "relative";
			downvoteCount.style.top = "-3px";
			downvotes[i].insertBefore(downvoteCount, downvotes[i].firstChild);
		}
		else
			downvoteCount = downvoteCount[0];

		downvoteCount.innerHTML = downvotes[i].className.split(" ")[2].substring(6);

		if (downvoteCount.innerHTML == "0")
			downvoteCount.style.display = "none";
		else
			downvoteCount.style.display = "";
	}
}