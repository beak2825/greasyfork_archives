// ==UserScript==
// @name        JWPlayer Force HTML5
// @namespace   DoomTay
// @description Makes JWPlayer think that you don't have the Flash plugin, thus forcing HTML5 mode
// @version     1.0.1
// @grant       none
// @include     *
// @exclude     http://roosterteeth.com/*
// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/22143/JWPlayer%20Force%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/22143/JWPlayer%20Force%20HTML5.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		for(var i = 0; i < mutation.addedNodes.length; i++)
		{
			findJWPScript(mutation.addedNodes[i]);
			if(typeof window.jwplayer !== 'undefined') break;
		}
	});
});

for(var i = 0; i < document.scripts.length; i++)
{
	findJWPScript(document.scripts[i]);
	if(typeof window.jwplayer !== 'undefined') break;
}

function findJWPScript(start)
{
	if(start.nodeName == "SCRIPT" && start.src && typeof window.jwplayer === 'undefined')
	{
		start.addEventListener("load",function()
		{
			if(typeof window.jwplayer !== 'undefined')
			{
				observer.disconnect();

				if(window.jwplayer.utils.hasFlash) window.jwplayer.utils.hasFlash = function (){return!1};
				if(window.jwplayer.utils.isFlashSupported) window.jwplayer.utils.isFlashSupported = function (){return!1};
				if(window.jwplayer.utils.flashVersion) window.jwplayer.utils.flashVersion = function (){return 0};
			}
		});
	}
	else if(typeof window.jwplayer === 'undefined')
	{
		for(var i = 0; i < start.childNodes.length; i++)
		{
			findJWPScript(start.childNodes[i]);
		}
	}
}

var config = { childList: true, subtree: true };
if(typeof window.jwplayer == 'undefined') observer.observe(document, config);