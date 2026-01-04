// ==UserScript==
// @name        Kinja fixer-upper
// @namespace   V@no
// @description Fix annoyances
// @include     http://*deadspin.com/*
// @include     http://*gawker.com/*
// @include     http://*gizmodo.com/*
// @include     http://*io9.com/*
// @include     http://*jalopnik.com/*
// @include     http://*jezebel.com/*
// @include     http://*kotaku.com/*
// @include     http://*lifehacker.com/*
// @include     https://*deadspin.com/*
// @include     https://*gawker.com/*
// @include     https://*gizmodo.com/*
// @include     https://*io9.com/*
// @include     https://*jalopnik.com/*
// @include     https://*jezebel.com/*
// @include     https://*kotaku.com/*
// @include     https://*lifehacker.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40010/Kinja%20fixer-upper.user.js
// @updateURL https://update.greasyfork.org/scripts/40010/Kinja%20fixer-upper.meta.js
// ==/UserScript==


var log = console.log;
document.addEventListener("DOMContentLoaded", function()
{
	(function loop()
	{
		if (typeof($) == "undefined")
			return setTimeout(loop, 0);

		var div = $(".item__content,.js_item-content,.post-wrapper,.js_post-wrapper,.streamshare,.postlist__item,.js_post_item,.status-published,.post-item-frontpage"),
				off = (function off()
				{
					div.off("click");
					return off;
				})();

		setTimeout(off, 0);
	})();
}, false);

