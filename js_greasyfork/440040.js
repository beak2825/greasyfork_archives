// ==UserScript==
// @name Learn-X-In-Y-Minutes-Always-Dark-Mode
// @description Simple script to automatically enable the dark theme for the Learn X In Y Minutes website on page load.
// @version 1.1
// @author yonderbread
// @license Unlicense
// @match *://learnxinyminutes.com/*
// @include *://learnxinyminutes.com/*
// @run-at document-end
// @grant none
// @namespace https://greasyfork.org/users/876617
// @downloadURL https://update.greasyfork.org/scripts/440040/Learn-X-In-Y-Minutes-Always-Dark-Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/440040/Learn-X-In-Y-Minutes-Always-Dark-Mode.meta.js
// ==/UserScript==

(() => {
	if (!(localStorage.hasOwnProperty("lxiym_theme"))) {
  	localStorage["lxiym_theme"] = "dark";
    console.log("[LXIYM Dark Mode] No value was set in localStorage for dark mode. Enabled dark mode.");
  }
  if (!(localStorage["lxiym_theme"] === "dark")) {
    localStorage["lxiym_theme_old"] = localStorage["lxiym_theme"];
  	localStorage["lxiym_theme"] = "dark";
    console.log("[LXIYM Dark Mode] Changed to dark mode and backed up old value in localStorage.")
  }
})();