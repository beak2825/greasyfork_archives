// ==UserScript==
// @name     Honk Button
// @namespace https://davidblue.wtf
// @license Unlicensed
// @version 1.1
// @description Adds a small, unstyled button labeled "Honk!" to the upper right of any webpage which causes loud honking sounds to play.
// @author	David Blue
// @source  https://github.com/extratone
// @grant    none
// @include  *
// @supportURL https://davidblue.wtf/contact
// @downloadURL https://update.greasyfork.org/scripts/464149/Honk%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/464149/Honk%20Button.meta.js
// ==/UserScript==

var honkButton = document.createElement("BUTTON");
honkButton.innerHTML = "Honk!";
document.body.appendChild(honkButton);
document.body.style.position = "relative";
honkButton.style.position = "absolute";
honkButton.style.top = "0px";
honkButton.style.right = "0px";

var honkSound = new Audio("https://davidblue.wtf/audio/specialhonk.mp3");

honkButton.onclick = function () {
	honkSound.play();
};
