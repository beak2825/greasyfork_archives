// ==UserScript==
// @name             VideoLayerRemover
// @version          0.3
// @author           _leBluem_
// @description      kill layer video ads, maybe you have to unpause manually 2 or 3 times, use carfully!
// @namespace        https://greasyfork.org/de/users/83368-lebluem
// @include http://*/*
// @include https://*/*
// @include-jquery   true
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/25554/VideoLayerRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/25554/VideoLayerRemover.meta.js
// ==/UserScript==

//Kill Html5 video layer ads.
//this helps a lot:
//https://addons.mozilla.org/en-US/firefox/addon/no-flash/
//The page is checked every 750ms for elements with a z-index > 200000000.
//Maybe you have to UN-pause manually 2 or 3 times.
//Does not help against inline-video-ads or inline-flash-ads.
//Use carfully, it may break things... 
//did work for
// @match        http://*.golem.de/*
// @match        https://*.golem.de/*
// @match        http://*.pcgames.de/*
// @match        https://*.pcgames.de/*
// @match        http://*.pcgameshardware.de/*
// @match        http://*.sueddeutsche.de/*
// @match        https://*.sueddeutsche.de/*
// @match        http://*.n-tv.de/*
// @match        https://*.n-tv.de/*
// @match        http://*.pcgames.de/*
// @match        https://*.pcgames.de/*

(function() {
	var sleep = 750;
	function runner() {
		$('*').each(function () {
			if ($(this).css('z-index') > 200000000) { this.parentNode.removeChild(this); }
		});
		setTimeout( runner, sleep );
	}
	runner();
})();
