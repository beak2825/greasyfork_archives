// ==UserScript==
// @name         Show BGMer's Sign on Profile Page
// @namespace    https://jirehlov.com
// @version      0.1.2
// @description  Extracts sign field from BGM.tv user API
// @author       Jirehlov
// @match        https://bgm.tv/user/*
// @exclude      https://bgm.tv/user/*/*
// @match        https://chii.in/user/*
// @exclude      https://chii.in/user/*/*
// @match        https://bangumi.tv/user/*
// @exclude      https://bangumi.tv/user/*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492407/Show%20BGMer%27s%20Sign%20on%20Profile%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/492407/Show%20BGMer%27s%20Sign%20on%20Profile%20Page.meta.js
// ==/UserScript==
 
(function () {
	"use strict";
	const username = window.location.pathname.split("/").pop();
	const apiUrl = `https://api.bgm.tv/v0/users/${ username }`;
	fetch(apiUrl).then(response => response.json()).then(userData => {
		if (userData && userData.sign) {
			const nameElement = document.querySelector(".name");
			if (nameElement) {
				const signElement = document.createElement("small");
				signElement.textContent = `(${ userData.sign })`;
				signElement.classList.add("grey");
				nameElement.appendChild(signElement);
			}
		}
	});
}());