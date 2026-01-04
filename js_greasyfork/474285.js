// ==UserScript==
// @name         cheatsheets header footer removal
// @namespace    https://cheatsheets.zip
// @version      0.1
// @description  remove header and footer for https://cheatsheets.zip
// @author       Derek
// @match        https://cheatsheets.zip/*
// @icon         https://cheatsheets.zip/images/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474285/cheatsheets%20header%20footer%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/474285/cheatsheets%20header%20footer%20removal.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const array = [
		"body > header",
		"body > div.mx-auto.flex.flex-wrap.md\\:py-5.flex-col.md\\:flex-row.items-center > div.flex.flex-col.w-full.mx-auto.text-center.my-8",
		"body > footer"
	].map((x) => document.querySelector(x)).forEach((e)=> e.style.display = "none")


})();
