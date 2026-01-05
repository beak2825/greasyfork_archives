// ==UserScript==
// @name        RSS Feed Finder
// @namespace   DoomTay
// @description Looks for RSS links on the page when there isn't a subscribe button set in the header
// @version     1.0.1
// @include     *
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22369/RSS%20Feed%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/22369/RSS%20Feed%20Finder.meta.js
// ==/UserScript==

var links = document.links;
var foundLinks = [];

if(!document.querySelector("link[type='application/rss+xml']") && !document.querySelector("link[type='application/atom+xml']"))
{
	for(var i = 0; i < links.length; i++)
	{
		if(foundLinks.includes(links[i].href)) continue;
		if(links[i].href.includes("/feed") && links[i].href.includes("atom")) makeFeedLink(links[i],"application/atom+xml");
		else if(links[i].href.includes("/rss") || links[i].href.includes(".rss") || links[i].href.includes("/feed") || links[i].href.includes(".xml")) makeFeedLink(links[i],"application/rss+xml");
	}
}

function makeFeedLink(link,type)
{
	var newRSSButton = document.createElement("link");
	newRSSButton.rel = "alternate";
	newRSSButton.type = type;
	newRSSButton.href = link.href;
	newRSSButton.title = link.textContent.trim() != "" ? link.textContent.trim() : "RSS Feed";
	document.head.appendChild(newRSSButton);
	foundLinks.push(link.href);
}