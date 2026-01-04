// ==UserScript==
// @version         1.0
// @name            Google: Doodles deaktivieren
// @name:en         Google: disable Doodles
// @namespace       https://www.youtube.com/user/InvisibleQuantum/
// @description     Ersetzt alle nervigen Google Doodles mit dem aktuellen Google Logo!
// @description:en  Replace Google Doodles with the current Google Logo!
// @icon            http://www.google.com/favicon.ico
// @match           http*://*.google.*/*
// @include         http*://*.google.*/*
// @homepageURL     https://www.youtube.com/user/InvisibleQuantum/
// @supportURL      https://www.youtube.com/user/InvisibleQuantum/discussion
// @contributionURL https://www.youtube.com/user/InvisibleQuantum?sub_confirmation=1
// @copyright   	2017-07-03 // InvisibleQuantum
// @license         CC BY-SA
// @license         https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/31124/Google%3A%20Doodles%20deaktivieren.user.js
// @updateURL https://update.greasyfork.org/scripts/31124/Google%3A%20Doodles%20deaktivieren.meta.js
// ==/UserScript==
		var loadingInstant = false;
		var instantInterval = null;
		function changeLogo() {
			var GoogleLogo = document.getElementById("lga");
			var searchLogo = document.getElementById("gbqlw");
			if (loadingInstant) {
				if (document.getElementById("sfcnt") == null) {
					return;
				}
				clearInterval(instantInterval);
				loadingInstant = false;
			}
			if (GoogleLogo != null) {
				GoogleLogo.innerHTML = '<img id="hplogo" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" style="width:380px;height:110px;margin-top:95px;margin-left:-5px" alt="" />';
			}
		}
		window.addEventListener("hashchange", changeLogo, false);
		if (window.location.hash != "") {
			loadingInstant = true;
			instantInterval = setInterval(changeLogo, 100);
		}
		changeLogo();