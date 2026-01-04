// ==UserScript==
// @name          GeoGuessr Bigger Map on Map-Maker
// @namespace     MrMike/GeoGuessr/GeoGuessrBiggerMapOnMapMaker
// @version       0.7.0
// @description   Enables the user to have a bigger map when using the map-maker. It also hides top bar and sidebar.
// @author        MrAmericanMike
// @include       /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @grant         GM_addStyle
// @require       https://cdn.jsdelivr.net/npm/arrive@2.4.1/src/arrive.min.js
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/388469/GeoGuessr%20Bigger%20Map%20on%20Map-Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/388469/GeoGuessr%20Bigger%20Map%20on%20Map-Maker.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const DEFAULT = {
		deleteKey: true,
		preventLeave: true
	}

	if (!localStorage.getItem("bmomm")) {
		localStorage.setItem("bmomm", JSON.stringify(DEFAULT));
	}

	const CONFIG = { ...DEFAULT, ...JSON.parse(localStorage.getItem("bmomm")) };

	localStorage.setItem("bmomm", JSON.stringify(CONFIG));

	document.arrive(".map-maker-map", () => {
		if (!document.querySelector("#settings-button")) {
			addListeners();
			doStyles();
			addSettings();
		}
	});

	document.leave(".map-maker-map", () => {
		if (!window.location.pathname.includes("map-maker")) {
			if (CONFIG.deleteKey) {
				document.removeEventListener("keydown", keyDown, true);
			}
			if (CONFIG.preventLeave) {
				window.removeEventListener("beforeunload", tryPreventLeave);
			}
			resetStyles();
			removeSettings();
		}
	});

	function addSettings() {
		const SETTINGS_BUTTON = document.createElement("div");
		SETTINGS_BUTTON.setAttribute("id", "settings-button");
		SETTINGS_BUTTON.setAttribute("title", "Bigger Map on Map-Maker Settings");
		SETTINGS_BUTTON.innerHTML = "<div style='font-size: 0.85vw;'>&#10020;</div>";
		SETTINGS_BUTTON.style.display = "flex";
		SETTINGS_BUTTON.style.justifyContent = "center";
		SETTINGS_BUTTON.style.alignItems = "center";
		SETTINGS_BUTTON.style.position = "fixed";
		SETTINGS_BUTTON.style.top = "1vh";
		SETTINGS_BUTTON.style.right = "0.1vw";
		SETTINGS_BUTTON.style.width = "0.8vw";
		SETTINGS_BUTTON.style.height = "0.8vw";
		SETTINGS_BUTTON.style.backgroundColor = "dodgerblue";
		SETTINGS_BUTTON.style.borderRadius = "1vw";
		SETTINGS_BUTTON.style.cursor = "pointer";
		SETTINGS_BUTTON.style.zIndex = 9999;

		const SETTINGS = document.createElement("div");
		SETTINGS.setAttribute("id", "settings-content");
		SETTINGS.style.position = "fixed";
		SETTINGS.style.padding = "8px 16px";
		SETTINGS.style.textAlign = "center";
		SETTINGS.style.color = "aliceblue";
		SETTINGS.style.top = "1vh";
		SETTINGS.style.right = "1%";
		SETTINGS.style.width = "210px";
		SETTINGS.style.height = "auto";
		SETTINGS.style.backgroundColor = "#20203099";
		SETTINGS.style.borderRadius = "8px";
		SETTINGS.style.zIndex = 9999;
		SETTINGS.style.display = "none";
		SETTINGS.innerHTML = `
		<div style="display: flex; margin: 0 auto; margin-bottom: 12px; justify-content: space-between; align-items: center;">
			<h3 title='When enabled, pressing Delete on Keyboard will delete the selected location'>Enable Delete Key</h3>
			<input id="delete-key" type="checkbox" title='When enabled, pressing Delete on Keyboard will delete the selected location'/>
		</div>
		<div style="display: flex; margin: 0 auto; margin-bottom: 12px; justify-content: space-between; align-items: center;">
			<h3 title='Attempts to prevent the user leaving the page by mistake'>Attempt to prevent leaving page</h3>
			<input id="prevent-leave" type="checkbox" title='Attempts to prevent the user leaving the page by mistake'/>
		</div>
		`;

		document.body.append(SETTINGS_BUTTON);
		document.body.append(SETTINGS);

		const deleteKey = document.querySelector("#delete-key");
		const preventLeave = document.querySelector("#prevent-leave");
		deleteKey.checked = CONFIG.deleteKey;
		preventLeave.checked = CONFIG.preventLeave;

		deleteKey.addEventListener("click", (event) => {
			if (deleteKey.checked) {
				document.addEventListener("keydown", keyDown, true);
			}
			else {
				document.removeEventListener("keydown", keyDown, true);
			}
			CONFIG.deleteKey = deleteKey.checked;
			localStorage.setItem("bmomm", JSON.stringify(CONFIG));
		});

		preventLeave.addEventListener("click", (event) => {
			if (preventLeave.checked) {
				window.addEventListener("beforeunload", tryPreventLeave);
			}
			else {
				window.removeEventListener("beforeunload", tryPreventLeave);
			}
			CONFIG.preventLeave = preventLeave.checked;
			localStorage.setItem("bmomm", JSON.stringify(CONFIG));
		});

		SETTINGS_BUTTON.addEventListener("click", () => {
			if (SETTINGS.style.display == "none") {
				SETTINGS.style.display = "block";
			}
			else {
				SETTINGS.style.display = "none";
			}
		})

	}

	function removeSettings() {
		document.querySelector("#settings-button").remove();
		document.querySelector("#settings-content").remove();
	}

	function doStyles() {
		GM_addStyle(`
		div[class^='classic_header__']{
			display: none !important;
		}
		aside{
			display: none !important;
		}
		.container{
			margin-bottom: 64px !important;
		}
		.title{
			display: none !important;
		}
		.map-type__description{
			display: none !important;
		}
		.margin--bottom-large {
			margin-top: 0.5rem !important;
			margin-bottom: 0.5rem !important;
		}
		div[class^='classic_layout__']{
			grid-template-columns: 0rem 1fr !important;
			grid-template-rows: 1vh 1fr auto !important;
		}
		main[class^='classic_main__']{
			padding: 0px !important;
			grid-column: 2 !important;
			grid-row: 2 !important;
		}
		.container--large {
			--width: 98% !important;
		}
		.streetview-panel {
			max-height: 100% !important;
			width: 50vw !important;
		}
		.map-maker-map__search {
			width: 60vw !important;
		}
		@media only screen and (max-width: 1200px) {
			div[class^='classic_layout__']{
				grid-template-columns: 1fr !important;
			}
			main[class^='classic_main__']{
				grid-column: 1 !important;
			}
		}
		`);
	}

	function resetStyles() {
		GM_addStyle(`
		div[class^='classic_header__']{
			display: grid !important;
		}
		aside{
			display: block !important;
		}
		.container{
			margin-bottom: 0px !important;
		}
		.title{
			display: block !important;
		}
		.map-type__description{
			display: block !important;
		}
		.margin--bottom-large {
			margin-top: 0rem !important;
			margin-bottom: 2.5rem !important;
		}
		div[class^='classic_layout__']{
			grid-template-columns: 18rem 1fr !important;
			grid-template-rows: var(--layout-header-height) 1fr auto !important;
		}
		main[class^='classic_main__']{
			padding: var(--layout-content-padding-top) var(--layout-content-horizontal-padding) var(--layout-content-padding-bottom) !important;
			grid-row: 2 !important;
		}
		.container--large {
			--width: 87.5rem !important;
		}
		.streetview-panel {
			max-height: 30rem !important;
			width: 35rem !important;
		}
		.map-maker-map__search {
			width: 20rem !important;
		}
		`);
	}

	function keyDown(event) {
		if (event.key == "Delete") {
			let buttons = document.getElementsByClassName("button--danger");
			for (let x = 0; x < buttons.length; x++) {
				if (buttons[x].textContent == "Delete") {
					buttons[x].click();
				}
			}
		}
	}

	function tryPreventLeave(event) {
		if (event.path[0].location.pathname.includes("map-maker")) {
			event.preventDefault();
			return event.returnValue = "Are you sure you want to exit?";
		}
	}

	function addListeners() {
		if (CONFIG.deleteKey) {
			document.addEventListener("keydown", keyDown, true);
		}
		if (CONFIG.preventLeave) {
			window.addEventListener("beforeunload", tryPreventLeave);
		}
	}

	if (window.location.pathname.includes("map-maker")) {
		if (!document.querySelector("#settings-button")) {
			addListeners();
			doStyles();
			addSettings();
		}
	}
})();
