// ==UserScript==
// @name        Twitch PiP button
// @namespace   https://github.com/valery-kirichenko
// @description Add picture in picture button to twitch.tv player.
// @author      Valery Kirichenko, Konopielko
// @license     This script uses Material Symbols which are available under the Apache License Version 2.0.
// @homepage    https://github.com/valery-kirichenko/twitch-pip-button
// @match       *://www.twitch.tv/*
// @match       *://player.twitch.tv/*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24538/Twitch%20PiP%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/24538/Twitch%20PiP%20button.meta.js
// ==/UserScript==

var playerReady = setInterval(function () {
	if (
		document.getElementsByClassName("player-controls__right-control-group")[1]
	) {
		clearInterval(playerReady);
		var btn = document.createElement("button");
		btn.innerHTML =
			'<div aria-describedby="241f74d967eb4cf412d5ddd29ff2a456" class="Layout-sc-nxg1ff-0 ScAttachedTooltipWrapper-sc-v8mg6d-0 hOVSHb"><button class="ScCoreButton-sc-1qn4ixc-0 cgCHoV ScButtonIcon-sc-o7ndmn-0 dKvQD" aria-label="Picture in Picture" data-a-target="player-theatre-mode-button"><div class="ButtonIconFigure-sc-1ttmz5m-0 fbCCvx"><div class="ScIconLayout-sc-1bgeryd-0 cXxJjc"><div class="ScAspectRatio-sc-1sw3lwy-1 kPofwJ tw-aspect"><div class="ScAspectSpacer-sc-1sw3lwy-0 dsswUS"></div><svg width="100%" height="100%" version="1.1" viewBox="0 0 48 48" x="0px" y="0px" class="ScIconSVG-sc-1bgeryd-1 ifdSJl"><g><path fill-rule="evenodd" d="m21.85 34.3h16.75v-12.85h-16.75zm-14.4 6.95q-1.95 0-3.325-1.375-1.375-1.375-1.375-3.325v-25.1q0-1.95 1.375-3.35 1.375-1.4 3.325-1.4h33.1q2 0 3.375 1.4 1.375 1.4 1.375 3.35v25.1q0 1.95-1.375 3.325-1.375 1.375-3.375 1.375zm0-4.7q0 0 0 0v-25.1q0 0 0 0v25.1q0 0 0 0zm0 0h33.1q0 0 0 0v-25.1q0 0 0 0h-33.1q0 0 0 0v25.1q0 0 0 0zm17.4-5.25v-6.85h10.75v6.85z" clip-rule="evenodd"></path></g></svg></div></div></div></button><div class="ScAttachedTooltip-sc-v8mg6d-1 kqEiJv tw-tooltip" data-a-target="tw-tooltip-label" role="tooltip" id="241f74d967eb4cf412d5ddd29ff2a456" direction="top">Picture in Picture</div></div>';
		var btn2 = document.createElement("button");
		btn2.innerHTML = btn.innerHTML;
		document
			.getElementsByClassName("player-controls__right-control-group")[0]
			.insertBefore(
				btn2,
				document.getElementsByClassName(
					"player-controls__right-control-group"
				)[0].lastElementChild
			);
		document
			.getElementsByClassName("player-controls__right-control-group")[1]
			.insertBefore(
				btn,
				document.getElementsByClassName(
					"player-controls__right-control-group"
				)[1].lastElementChild
			);
		btn.addEventListener("click", function () {
			document.querySelector("video").requestPictureInPicture();
		});
	}
}, 100);
