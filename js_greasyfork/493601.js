// ==UserScript==
// @name         Visited Links Highlighter
// @namespace    https://jirehlov.com
// @version      0.1.2
// @description  let you know if the link is clicked before
// @author       Jirehlov
// @match        https://bgm.tv/*
// @match        https://chii.in/*
// @match        https://bangumi.tv/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493601/Visited%20Links%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/493601/Visited%20Links%20Highlighter.meta.js
// ==/UserScript==
 
(() => {
	"use strict";
	const visitedLinks = JSON.parse(localStorage.getItem("JvCSS")) || {};
	const links = document.getElementsByTagName("a");
	for (let link of links) {
		const href = link.href;
		const linkColor = window.getComputedStyle(link).color;
		if ((linkColor === "rgb(46, 166, 255)" || linkColor === "rgb(0, 132, 180)") && !link.querySelector("span") && href !== "javascript:void(0);") {
			if (visitedLinks[href]) {
				link.style.color = "#c58af9";
			} else {
				link.addEventListener("click", function (event) {
					visitedLinks[this.href] = true;
					localStorage.setItem("JvCSS", JSON.stringify(visitedLinks));
				});
			}
		}
	}
})();