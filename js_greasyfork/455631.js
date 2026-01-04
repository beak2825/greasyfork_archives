// ==UserScript==
// @name Twitch Channel Point Claimer
// @description Simple 5min timer to claim points
// @match https://www.twitch.tv/*
// @icon https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Twitch_logo.svg/2560px-Twitch_logo.svg.png
// @version 1
// @license MIT
// @namespace https://greasyfork.org/users/803889
// @downloadURL https://update.greasyfork.org/scripts/455631/Twitch%20Channel%20Point%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/455631/Twitch%20Channel%20Point%20Claimer.meta.js
// ==/UserScript==

while(true) {
	setTimeout(ButtonClicker, 300000)
}


function ButtonClicker() {
  bonus = document.querySelector('.claimable-bonus__icon');
  bonus.click();
}