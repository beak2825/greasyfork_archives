// ==UserScript==
// @version         1.0
// @name            Google Logo 3 (1998-1999) | Keine Doodles!
// @name:en         Google Logo 3 (1998-1999) | No Doodles!
// @namespace       https://www.youtube.com/user/InvisibleQuantum/
// @description     Ersetzt das Google Logo und die Doodles durch das 3. Google Logo (1998-1999)!
// @description:en  Replace the Google logo and Doodles with the 3rd Google logo (1998-1999)!
// @icon            http://www.google.com/favicon.ico
// @match           http*://*.google.*/*
// @include         http*://*.google.*/*
// @homepageURL     https://www.youtube.com/user/InvisibleQuantum/
// @supportURL      https://www.youtube.com/user/InvisibleQuantum/discussion
// @contributionURL https://www.youtube.com/user/InvisibleQuantum?sub_confirmation=1
// @copyright   	2017-07-04 // InvisibleQuantum
// @license         CC BY-SA
// @license         https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/31130/Google%20Logo%203%20%281998-1999%29%20%7C%20Keine%20Doodles%21.user.js
// @updateURL https://update.greasyfork.org/scripts/31130/Google%20Logo%203%20%281998-1999%29%20%7C%20Keine%20Doodles%21.meta.js
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
				GoogleLogo.innerHTML = '<img id="hplogo" src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Googlelogo1997.jpg" style="width:351px;height:113px;margin-top:95px;margin-left:-5px" alt="" />';
			}
		}
		window.addEventListener("hashchange", changeLogo, false);
		if (window.location.hash != "") {
			loadingInstant = true;
			instantInterval = setInterval(changeLogo, 100);
		}
		changeLogo();