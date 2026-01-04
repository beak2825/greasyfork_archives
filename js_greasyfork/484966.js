// ==UserScript==
// @name        Mealmates E-Mail Fill
// @namespace   Violentmonkey Scripts
// @match       https://get.mealmates.de/
// @grant       GM_registerMenuCommand
// @version     1.2.0
// @author      Der_Floh
// @description Automatically enters your E-Mail
// @license     MIT
// @icon        https://get.mealmates.de/media/img/logo.png
// @homepageURL https://greasyfork.org/de/scripts/484966-mealmates-e-mail-fill
// @supportURL	https://greasyfork.org/de/scripts/484966-mealmates-e-mail-fill/feedback
// @downloadURL https://update.greasyfork.org/scripts/484966/Mealmates%20E-Mail%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/484966/Mealmates%20E-Mail%20Fill.meta.js
// ==/UserScript==

let email = localStorage.getItem("mealmatesemail");
if (email == null || email == undefined || email == "")
	email = enterEmail();

GM_registerMenuCommand('Change E-Mail', () => enterEmail(email));

window.addEventListener("load", () => {
	const emailElem = document.getElementById("email");
	emailElem.value = email;

	const password = document.getElementById("password");
	const disabled = password.hasAttribute("disabled");
	if (disabled)
		document.body.querySelector('button[type="submit"]').click();
});

function enterEmail(currEmail) {
	if (currEmail == null || currEmail == undefined || currEmail == "")
		currEmail = "name@example.com";
	const emailNew = prompt("Please enter your email:", currEmail);
	if (emailNew)
		localStorage.setItem("mealmatesemail", emailNew);
	return emailNew;
}
