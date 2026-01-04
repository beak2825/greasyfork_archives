// ==UserScript==
// @version         1.0
// @name            Google Logo 4 (1999-2010) | Keine Doodles!
// @name:en         Google Logo 4 (1999-2010) | No Doodles!
// @namespace       https://www.youtube.com/user/InvisibleQuantum/
// @description     Ersetzt das Google Logo und die Doodles durch das 4. Google Logo (1999-2010)!
// @description:en  Replace the Google logo and Doodles with the 4th Google logo (1999-2010)!
// @icon            http://www.google.com/favicon.ico
// @match           http*://*.google.*/*
// @include         http*://*.google.*/*
// @homepageURL     https://www.youtube.com/user/InvisibleQuantum/
// @supportURL      https://www.youtube.com/user/InvisibleQuantum/discussion
// @contributionURL https://www.youtube.com/user/InvisibleQuantum?sub_confirmation=1
// @copyright   	2017-07-04 // InvisibleQuantum
// @license         CC BY-SA
// @license         https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/31129/Google%20Logo%204%20%281999-2010%29%20%7C%20Keine%20Doodles%21.user.js
// @updateURL https://update.greasyfork.org/scripts/31129/Google%20Logo%204%20%281999-2010%29%20%7C%20Keine%20Doodles%21.meta.js
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
				GoogleLogo.innerHTML = '<img id="hplogo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google.png/800px-Google.png" style="width:320px;height:116px;margin-top:95px;margin-left:-5px" alt="" />';
			}
		}
		window.addEventListener("hashchange", changeLogo, false);
		if (window.location.hash != "") {
			loadingInstant = true;
			instantInterval = setInterval(changeLogo, 100);
		}
		changeLogo();