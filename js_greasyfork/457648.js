// ==UserScript==
// @name         OMDB Button Adder
// @namespace    omdbButtonAdder
// @version      1.06
// @author       cyndifusic
// @run-at       document-start
// @description  Adds "Rate on OMDB" button on osu! beatmap pages
// @include   http://osu.ppy.sh*
// @include   https://osu.ppy.sh*
// @downloadURL https://update.greasyfork.org/scripts/457648/OMDB%20Button%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/457648/OMDB%20Button%20Adder.meta.js
// ==/UserScript==

var currentURL = window.location.href;

var extractMapsetID = function (url) {
	var startIndex = url.indexOf("beatmapsets") + 12;
	var go = true;
	var i = startIndex;
	var setID = "";
	while (go) {
		if (url.charAt(i) == "#") {
			go = false;
		} else {
			setID += url.charAt(i);
			i++;
		}
	}
	return setID;
}

var addButton = function () {
	if (currentURL.includes("beatmapsets") && currentURL.includes("#")) {
		var omdbAddress = "https://omdb.nyahh.net/mapset/" + extractMapsetID(currentURL);
		var buttonsDiv = document.getElementsByClassName("beatmapset-header__buttons")[0];
		buttonsDiv.insertAdjacentHTML('beforeend', '<a class="btn-osu-big btn-osu-big--beatmapset-header" href="' + omdbAddress + '" data-turbolinks="false" target="_blank"><span class="btn-osu-big__content"><span class="btn-osu-big__left"><span class="btn-osu-big__text-top">Rate on OMDB</span></span><span class="btn-osu-big__icon"><span class="fa fa-fw"><span class="fas fa-link"></span></span></span></span></a>');
	}
}

var checkURL = function () {
	var doubleCheck = function () {
		if (window.location.href != currentURL) {
			var currentURLIsBeatmap = window.location.href.includes("beatmapsets") && window.location.href.includes("#");
			var previousURLIsBeatmap = currentURL.includes("beatmapsets") && currentURL.includes("#");

			if (currentURLIsBeatmap && previousURLIsBeatmap) {
				if (extractMapsetID(window.location.href) != extractMapsetID(currentURL)) {
					currentURL = window.location.href;
					addButton();
				}
			}

			if (currentURLIsBeatmap && !previousURLIsBeatmap) {
				currentURL = window.location.href;
				addButton();
			}
		}
	}

	setTimeout(doubleCheck, 2000);
}

setTimeout(addButton, 1000);
document.addEventListener("click", checkURL);