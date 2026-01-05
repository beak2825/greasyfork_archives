// ==UserScript==
// @name            BetterTTV
// @namespace       BTTV
// @description     Enhances Twitch with new features, bug fixes, and reduced clutter.
// @copyright       NightDev
// @icon            http://cdn.betterttv.net/icon.png
//
// @grant           none
//
// @include         *://*.twitch.tv/*
//
// @version         0.0.1
// @downloadURL https://update.greasyfork.org/scripts/23260/BetterTTV.user.js
// @updateURL https://update.greasyfork.org/scripts/23260/BetterTTV.meta.js
// ==/UserScript==

function betterttv_init()
{
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "https://cdn.betterttv.net/betterttv.js?"+Math.random();
	var head = document.getElementsByTagName('head')[0];
	if(head) head.appendChild(script);
}

betterttv_init();
