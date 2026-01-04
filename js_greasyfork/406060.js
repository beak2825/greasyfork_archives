// ==UserScript==
// @name             GeoGuessr Ultimate Script
// @version          0.4.5
// @description      GeoGuessr Ultimate Script - One Script to rule them all - Work In Progress - Adding features over time - Removes Bottom, Right and Top Bar (Options) - Pimps Data - Makes for a cleaner experience - Removes Author (Optional - For an extra challenge) - Changes flags with numbered flags - Adjust GeoGuessr Logo position - Adjusts Data position
// @author           MrAmericanMike
// @include          /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @grant            none
// @run-at           document-start
// @namespace        https://greasyfork.org/en/scripts/406060-geoguessr-ultimate-script
// @downloadURL https://update.greasyfork.org/scripts/406060/GeoGuessr%20Ultimate%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/406060/GeoGuessr%20Ultimate%20Script.meta.js
// ==/UserScript==

(function () {
	"use strict";
	console.log("GeoGuessrUltimateScript");

	// MODULES // Set from 'true' to 'false' any module that you don't need. Example: removeTopBar = false;

	// REMOVE BOTTOM WHITE BAR WHILE PLAYING A MAP
	let removeBottomBar = true;

	// REMOVE RIGHT WHITE BAR ON ROUND RESULTS SCREEN
	let removeRightBar = true;

	// MAKE A CLEANER STREETVIEW BY REMOVING TOP BAR
	let removeTopBar = true;

	// MAKE FLAGS AND PINS TRANSPARENT ON MOUSE OVER
	let transparentPins = true;

	// PIMP MY DATA
	let pimpData = true;

	let floatData = "RIGHT"; // Where to place the logo on screen (Valid options "LEFT" "RIGHT")

	let dataMargin = "0.5rem"; // Horizontal margin from the side of the window [default value is "2.0rem"] (https://www.w3schools.com/cssref/css_units.asp)
	let topMargin = "0.5rem"; // Vertical margin from top of the window [default value is "1.0rem"] (https://www.w3schools.com/cssref/css_units.asp)

	let bgColor = "rgba(255, 255, 255, 0.55)"; // RGBA COLOR (https://www.hexcolortool.com/)
	let titlesColor = "#000033"; // Titles color on the data panel in HEX
	let dataColor = "#660000"; // Data color on the data panel in HEX

	// GEOGUESSR LOGO
	let adjustLogo = true;

	let floatLogo = "LEFT"; // Where to place the logo on screen (Valid options "LEFT" "CENTER" "RIGHT")
	let logoTopMargin = "0.25rem"; // Margin from top of the window (https://www.w3schools.com/cssref/css_units.asp)
	let logoOpacity = "0.5"; // Value going from 0.0 to 1.0 (0.0 represents fully transparent)

	// HIDE FOOTPRINT - (This is where photospheres author would show)
	let hideFootprint = true;

	// HIDE COMPASS - (For an extra challenge)
	let hideCompass = true;

	// HIDE FLAG - (Hide the "Back to start flag" - For an extra challenge)
	let hideFlag = false;

	// HIDE FULLSCREEN - (For those that don't need this button)
	let hideFullscreen = true;

	// HIDE ZOOM - (Hide the zoom controls)
	let hideZoom = true;

	// HIDE TOOLTIPS - (Hide the tooltips for flag, fullscreen and zoom controls)
	// Hiding an element does not hide the tooltip, so recommended leave this true
	let hideTooltips = true;

	// *******************************
	// NO NEED TO EDIT BELOW THIS LINE
	// *******************************

	window.addEventListener("load", () => {
		executeRealTime();
	});

	function executeRealTime() {
		if (removeBottomBar) {
			doRemoveBottomBar();
		}
		if (removeRightBar) {
			doRemoveRightBar();
		}
		if (removeTopBar) {
			doRemoveTopBar();
		}
		if (adjustLogo) {
			doAdjustLogo();
		}

		if (pimpData) {
			doPimpData();
		}
		if (hideFootprint) {
			doHideFootprint();
		}
		if (hideCompass) {
			doHideCompass();
		}
		if (hideFlag) {
			doHideFlag();
		}
		if (hideFullscreen) {
			doHideFullscreen();
		}
		if (hideZoom) {
			doHideZoom();
		}
		if (hideTooltips) {
			doHideTooltips();
		}

		if (transparentPins) {
			addGlobalStyle(`
			.map-pin:hover{
				opacity: 0.25;
			}
		`);
		}
	}

	// BOTTOM BAR
	function doRemoveBottomBar() {
		addGlobalStyle(`
		[class^="ad_inGameAd"]{
			display: none;
		}
	`);
	}

	// RIGHT BAR
	function doRemoveRightBar() {
		addGlobalStyle(`
		[class^="ad_resultsAd"]{
			display: none;
		}
	`);
	}

	// TOP BAR
	function doRemoveTopBar() {
		if (window.location.pathname.includes("game") || window.location.pathname.includes("challenge")) {
			addGlobalStyle(`
			.layout {
				--layout-header-height: 0rem;
			}
			.header__right{
				display: none;
			}
			.game-layout__panorama-canvas{
				height: 100%;
			}
		`);
		} else {
			addGlobalStyle(`
			.layout {
				--layout-header-height: 3rem;
			}
			.header__right{
				display: block;
			}
		`);
		}
	}

	// DATA
	function doPimpData() {
		switch (floatData) {
			case "LEFT":
				addGlobalStyle(`
				.game-layout__status{
					top: ${topMargin};
					left: ${dataMargin};
					right: auto;
				}
			`);
				break;

			case "RIGHT":
				addGlobalStyle(`
				.game-layout__status{
					top: ${topMargin};
					right: ${dataMargin};
					left: auto;
				}
			`);
				break;

			default:
				break;
		}

		addGlobalStyle(`
		.game-statuses {
			background: ${bgColor};
		}
		.game-status__heading{
			color: ${titlesColor};
		}
		.game-status__body{
			color: ${dataColor};
		}
	`);
	}

	// FOOTPRINT
	function doHideFootprint() {
		addGlobalStyle(`
		.gmnoprint, .gm-style-cc{
			display: none;
		}
	`);
	}

	// COMPASS
	function doHideCompass() {
		addGlobalStyle(`
		.compass{
			display: none;
		}
	`);
	}

	// FLAG
	function doHideFlag() {
		addGlobalStyle(`
		[data-qa="return-to-start"]{
			display: none;
		}
	`);
	}

	// FULLSCREEN
	function doHideFullscreen() {
		addGlobalStyle(`
		[data-qa="enter-fullscreen"]{
			display: none;
		}
	`);
	}

	// ZOOM
	function doHideZoom() {
		addGlobalStyle(`
		[data-qa="pano-zoom-in"]{
			display: none;
		}
		[data-qa="pano-zoom-out"]{
			display: none;
		}
	`);
	}

	// HIDE TOOLTIPS
	function doHideTooltips() {
		addGlobalStyle(`
		.tooltip__label{
			display: none;
		}
	`);
	}

	// GEOGUESSR LOGO
	function doAdjustLogo() {
		if (window.location.pathname.includes("game") || window.location.pathname.includes("challenge")) {
			switch (floatLogo) {
				case "LEFT":
					addGlobalStyle(`
			.header__left{
				margin-left: 0;
			}
		`);
					break;

				case "CENTER":
					addGlobalStyle(`
			.header__left{
				margin-left: auto;
			}
		`);
					break;

				case "RIGHT":
					addGlobalStyle(`
			.header__left{
				margin-left: auto;
				margin-right: 0;
			}
		`);
					break;
			}

			addGlobalStyle(`
		.header__logo{
			margin-top: ${logoTopMargin};
			opacity: ${logoOpacity};
		}
	`);
		} else {
			addGlobalStyle(`
		.header__left{
			margin-left: 0;
		}
		.header__logo{
			margin-top: auto;
			opacity: 1;
		}
		`);
		}
	}

	// GLOBAL STYLES INJECTOR
	function addGlobalStyle(css) {
		let head;
		let style;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = css.replace(/;/g, " !important;");
		head.appendChild(style);
	}

	// LISTEN FOR PAGE CHANGES
	let currentTab = "";
	let oldTab = "";

	window.addEventListener("click", (event) => {
		for (let x = 0; x < 1250; x += 250) {
			setTimeout(() => {
				lookForURLChange(event);
			}, x);
		}
	});

	function lookForURLChange(event) {
		if (event.explicitOriginalTarget) {
			currentTab = event.explicitOriginalTarget.baseURI;
		} else if (event.path) {
			event.path.forEach((element) => {
				if (element.hasOwnProperty("URL") && element.hasOwnProperty("location")) {
					currentTab = element.location.pathname;
				}
			});
		}

		if (oldTab != currentTab) {
			oldTab = currentTab;
			setTimeout(executeRealTime, 0);
		}
	}
})();
