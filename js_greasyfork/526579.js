// ==UserScript==
// @name         Makeshift Theme Switch
// @namespace    https://mkps.app/
// @version      1.0.4
// @description  Very simple temporary theme switcher for any page
// @tag          utilities
// @author       MK
// @license      MIT
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJRSURBVHgB1Ve9etMwFD0BBjbCxob6BMDWrWZjwysT7hMkI1vsJ6CMmUjeoB2ZUJ+g6Rto7NZ265aeW0upoji25KRfv57vu5Ed3Z8j6Uq6Bp4Zg1jFsiyHbHLKJ0pGUZSh7b6hLCiGckbdU0Sik4AEHgwGo+VyOfYCdsHQZkabOe1Nm+Lrts6qqkZsZDTfKG8RDyGaUfIsy2611gukEiDzv2x+dQQWx1eUD9hOREgMSeJfNAEGv0A96jZU1PtBx1MGeM/3wxbdQ+oo6p6FHa8agv9m8xnd8BPtJEK/sL63E7BrPkYclPecIQ7jyWSy5n+1C8hOsfkfONaUc8rP4H+HGeotWGBzh2yzFf0DxpMWb7yOSaBoqPT1kd9DXoRLU6AZbbZCVGahlBd/CXJsjmDNKeKhO2xH9mCrCfAlx+YU5nZZ3PLEJGas7dD955bge4MTUbqgg4VVjj0FY21l0NoRUC2OMvRDl+2R/LgcSJnefUH5BFKmd194TMIGyDErZ8QX1Pv2KXDjE/CDaNm48mCTaI6nwalPwHgdKlB8h/3DUCp5cLtAjkyXiMpexXMWFUcsKgqkw6D54JKZvqSchEexTMfIUyxEGBw9Ah/TuY418C+ja+y+Gw66SrAQ/i74g92gU4OHBKSoMOiPc/TAioBNimP0x0f0wFpNyJrNsHaTvMiQDkXbKX3cpRg11YQl+h0+qyt2JwKWRAF7UCRCIRHb7gI3E5ITBvFYIBGtX0byRcN1lVpe6v6u6Z2R8xSJSPk4VaiTU6on5REylLm7wF4c7gGJsMHpGS98EgAAAABJRU5ErkJggg==
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526579/Makeshift%20Theme%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/526579/Makeshift%20Theme%20Switch.meta.js
// ==/UserScript==

(() => {
	"use strict";

	const SESSION_STORAGE_KEY = "MK_userscript_makeshiftThemeSwitch_status";

	const STYLE = `
		html, img, canvas, embed, video, object, iframe {
			filter: invert(1) hue-rotate(180deg);
		}
	`;

	let styleElement = null;

	function main() {
		setState(getStoredIsOn());
		GM_registerMenuCommand("Switch theme", switchTheme);
	}

	function switchTheme() {
		setState(styleElement == null);
	}

	function setState(on) {
		if (styleElement) {
			if (!on) {
				styleElement.remove();
				styleElement = null;
				setStoredIsOn(false);
			}
		} else if (on) {
			styleElement = GM_addStyle(STYLE);
			setStoredIsOn(true);
		}
	}

	function getStoredIsOn() {
		return sessionStorage.getItem(SESSION_STORAGE_KEY) == "true";
	}

	function setStoredIsOn(value) {
		sessionStorage.setItem(SESSION_STORAGE_KEY, value);
	}

	main();
})();
