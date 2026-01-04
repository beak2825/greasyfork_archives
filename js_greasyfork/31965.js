// ==UserScript==
// @name        reddit-auto-click
// @description auto clicks reddit links to move past the comments page
// @namespace   ziffusion.com
// @include     http*://*.reddit.com/r/*/comments/*
// @version     10.9
// @downloadURL https://update.greasyfork.org/scripts/9813/reddit-auto-click.user.js
// @updateURL https://update.greasyfork.org/scripts/9813/reddit-auto-click.meta.js
// ==/UserScript==
var ignore = [
	"www.theskepticsguide.org",
	"www.youtube.com",
	"discord.gg",
	"radar.cloudflare.com",
	"www.rebusle.com"
];
function isIgnored(url) {
	console.log('reddit-auto-click: check:', url.hostname);
	for (const ign of ignore) {
		if (ign == url.hostname) return true;
	}
	return false;
}
var results = document.evaluate('//shreddit-post//a', document, null, XPathResult.ANY_TYPE, null);
var node;
while (node = results.iterateNext()) {
	var url = new URL(node.href);
	if (isIgnored(url)) continue;
  if (url.hostname.toLowerCase().indexOf("reddit") >= 0) continue;
	console.log('reddit-auto-click: click:', url);
	window.open(url.href);
	break;
}