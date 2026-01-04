// ==UserScript==
// @name            Skip domru ad pages
// @version         0.1.20200516.1
// @description	    skips domru ad pages
// @match           *://info.ertelecom.ru/*
// @grant           none
// @copyright       2017, StSav012
// @author          StSav012
// @namespace       http://info.ertelecom.ru/
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/35669/Skip%20domru%20ad%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/35669/Skip%20domru%20ad%20pages.meta.js
// ==/UserScript==

"use strict";

var actualCode = '(' + function() {
	"use strict";
	var x = document.querySelectorAll("a.js-close, a.close, a.links_skip, table.es-content:first-child > tbody:first-child > tr:first-child > td:first-child > table:first-child > tbody:first-child > tr:first-child > td:first-child > table:first-child > tbody:first-child > tr:first-child > td:first-child > table:first-child > tbody:first-child > tr:first-child > td.es-m-txt-c:first-child > a:first-child");
	if (x.length == 1) {
		window.location = x[0].href;
	}
	return;
} + ')();';
var script = document.createElement('script');
script.textContent = actualCode;
(document.body||document.documentElement).appendChild(script);
