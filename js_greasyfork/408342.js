"use strict";

// ==UserScript==
// @name         Simplify Udemy Quiz
// @namespace    licn
// @version      0.9
// @description  Simplify Udemy to show quiz results and make it to copy options and to print all questions
// @author       Chen Li
// @match        https://*.udemy.com/course/*/learn/quiz/*
// @homepageURL  https://github.com/LikeMario/browser-user-script/tree/master/com.udemy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408342/Simplify%20Udemy%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/408342/Simplify%20Udemy%20Quiz.meta.js
// ==/UserScript==

/* Make the option text copyable */
const styleSheet = `

.toggle-control-label {
    cursor: auto;
    -webkit-touch-callout: initial;
    -webkit-user-select: initial;
    -khtml-user-select: initial;
    -moz-user-select: initial;
    -ms-user-select: initial;
    user-select: initial;
}

`;

(function () {
	const goSimpleText = "GO SIMPLE";
	const restoreText = "RESTORE";

	function goSimple() {
		var appContentColumn = document.querySelectorAll(
			'[class*="app--content-column"]'
		)[0];
		appContentColumn.style.width = "100%";

		var appSidebarColumn = document.querySelectorAll(
			'[class*="app--sidebar-column"]'
		)[0];
		appSidebarColumn.style.display = "none";

		var appBodyContainer = document.querySelectorAll(
			'[class*="app--body-container"]'
		)[0];
		appBodyContainer.style.backgroundColor = "white";

		var curriculumItemViewAspectRatioContainer = document.querySelectorAll(
			'[class*="curriculum-item-view--aspect-ratio-container"]'
		)[0];
		curriculumItemViewAspectRatioContainer.style.paddingTop = "0px";

		var curriculumItemViewContentContainer = document.querySelectorAll(
			'[class*="curriculum-item-view--content-container"]'
		)[0];
		curriculumItemViewContentContainer.style.position = "static";

		var curriculumItemViewScaledHeightLimiters = document.querySelectorAll(
			'[class*="curriculum-item-view--scaled-height-limiter"]'
		);
		curriculumItemViewScaledHeightLimiters.forEach((element) => {
			element.style.position = "static";
			element.style.height = "auto";
			element.style.overflow = "visible";
			element.style.maxHeight = "none";
		});

		var curriculumItemFooterFooter = document.querySelectorAll(
			'[class*="curriculum-item-footer--footer"]'
		)[0];
		curriculumItemFooterFooter.style.position = "static";

		var appDashboard = document.querySelectorAll(
			'[class*="app--dashboard"]'
		)[0];
		appDashboard.style.display = "none";

		var footerV6 = document.querySelectorAll('[class*="footer-v6"]')[0];
		footerV6.style.display = "none";
		footerV6.style.width = "100%";
	}

	function restore() {
		var appContentColumn = document.querySelectorAll(
			'[class*="app--content-column"]'
		)[0];
		appContentColumn.style.width = "75%";

		var appSidebarColumn = document.querySelectorAll(
			'[class*="app--sidebar-column"]'
		)[0];
		appSidebarColumn.style.display = "block";

		var appBodyContainer = document.querySelectorAll(
			'[class*="app--body-container"]'
		)[0];
		appBodyContainer.style.backgroundColor = "#29303b";

		var curriculumItemViewAspectRatioContainer = document.querySelectorAll(
			'[class*="curriculum-item-view--aspect-ratio-container"]'
		)[0];
		curriculumItemViewAspectRatioContainer.style.paddingTop = "65%";

		var curriculumItemViewContentContainer = document.querySelectorAll(
			'[class*="curriculum-item-view--content-container"]'
		)[0];
		curriculumItemViewContentContainer.style.position = "absolute";

		var curriculumItemViewScaledHeightLimiters = document.querySelectorAll(
			'[class*="curriculum-item-view--scaled-height-limiter"]'
		);
		curriculumItemViewScaledHeightLimiters.forEach((element) => {
			element.style.position = "relative";
			element.style.height = "100%";
			element.style.overflow = "hidden";
			element.style.maxHeight = "calc(100vh - 290px)";
		});

		var curriculumItemFooterFooter = document.querySelectorAll(
			'[class*="curriculum-item-footer--footer"]'
		)[0];
		curriculumItemFooterFooter.style.position = "absolute";

		var appDashboard = document.querySelectorAll(
			'[class*="app--dashboard"]'
		)[0];
		appDashboard.style.display = "flex";

		var footerV6 = document.querySelectorAll('[class*="footer-v6"]')[0];
		footerV6.style.display = "block";
		footerV6.style.width = "75%";
	}

	function switchSimpleMode() {
		var button = document.getElementById("simple-mode-button");
		if (button.innerHTML === goSimpleText) {
			button.innerHTML = restoreText;
			goSimple();
		} else {
			button.innerHTML = goSimpleText;
			restore();
		}
	}

	function addSimpleModeButton() {
		var button = document.createElement("button");
		button.setAttribute("id", "simple-mode-button");
		button.innerHTML = goSimpleText;
		button.onclick = switchSimpleMode;
		button.style.backgroundColor = "#29303b";
		button.style.color = "#f5c647";
		button.style.borderWidth = "1px";
		button.style.borderStyle = "solid";
		button.style.borderColor = "#f5c647";
		button.style.padding = "6px 10px";
		button.style.alignSelf = "center";

		var headerVerticalDivider = document.querySelectorAll(
			'[class^="header--vertical-divider"]'
		)[0];
		headerVerticalDivider.appendChild(button);
		headerVerticalDivider.style.height = "auto";
    }
    
    const s = document.createElement('style');
    s.type = "text/css";
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);

	setTimeout(function () {
		addSimpleModeButton();
	}, 2000);
})();
