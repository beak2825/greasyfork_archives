// ==UserScript==
// @name         YouTube aspect ratio switcher
// @namespace    https://greasyfork.org/en/users/27283-mutationobserver
// @version      2023.02.01v5
// @description  Adds an aspect ratio switcher to the player, for videos that have the wrong aspect ratio.
// @author       MutationObserver
// @match        https://*.youtube.com/watch*v=*
// @match        https://*.youtube.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370586/YouTube%20aspect%20ratio%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/370586/YouTube%20aspect%20ratio%20switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

var currentRatio = null;
var aspectRatiosIndex = 0;
var videoElemAttr = "data-aspectRatio-userscript";
var buttonhtml = `<button id="aspectratioSwitcher" class="ytp-button" title="Aspect ratio">↔</button>`;
var csshtml = `
	<style>
	#aspectratioSwitcher {
		top: -13px;
		position: relative;
		text-align: center;
		font-size: 25px;
	}
	.ytp-big-mode #aspectratioSwitcher {
		font-size: 182%;
		top: -19px;
	}
	
	#movie_player[data-aspectRatio-userscript="16:9"] #aspectratioSwitcher,
	#movie_player[data-aspectRatio-userscript="9:16"] #aspectratioSwitcher,
	#movie_player[data-aspectRatio-userscript="4:3"] #aspectratioSwitcher {
		font-size: unset;
	}
	
	.html5-main-video { transition: .2s; }
	
	#movie_player[data-aspectRatio-userscript="16:9"] .html5-main-video { transform: scale(1.335,1)!important; }
	#movie_player[data-aspectRatio-userscript="4:3"] .html5-main-video { transform: scale(.75,1)!important; }
	#movie_player[data-aspectRatio-userscript="9:16"] .html5-main-video { transform: scale(1.77,1)!important; }
	</style>
`;
		
	
if (!document.querySelector(".ytp-subtitles-button.ytp-button")) var anchorElem = document.querySelector(".ytp-button.ytp-settings-button");
else var anchorElem = document.querySelector(".ytp-subtitles-button.ytp-button");

anchorElem.insertAdjacentHTML("beforebegin", buttonhtml + csshtml);

var buttonElem = document.querySelector("#aspectratioSwitcher");

buttonElem.addEventListener("click", aspectRatioSwitch);

function aspectRatioSwitch() {
	var videoElem = document.querySelector("#movie_player");
	
	aspectRatiosIndex++;
	if (aspectRatiosIndex > 3) aspectRatiosIndex = 0;
	
	switch(aspectRatiosIndex) {
	  case 1:
		currentRatio = "4:3";
		videoElem.setAttribute(videoElemAttr, currentRatio);
		buttonElem.innerHTML = currentRatio;
		return;
		break;
	  case 2:
		currentRatio = "16:9";
		videoElem.setAttribute(videoElemAttr, currentRatio);
		buttonElem.innerHTML = currentRatio;
		return;
		break;
	  case 3:
		currentRatio = "9:16";
		videoElem.setAttribute(videoElemAttr, currentRatio);
		buttonElem.innerHTML = currentRatio;
		return;
		break;
	  default:
		videoElem.setAttribute(videoElemAttr, "");
		currentRatio = null;
		buttonElem.innerHTML = "↔";
		return;
	}
}

})();