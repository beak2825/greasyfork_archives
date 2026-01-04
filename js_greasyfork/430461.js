// ==UserScript==
// @name         12h to 24h time
// @namespace    http://twitter.com/
// @version      0.2.0
// @description  Convert time from 12-hour format into 24-hour format
// @author       Bogudan
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430461/12h%20to%2024h%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/430461/12h%20to%2024h%20time.meta.js
// ==/UserScript==

(function () {
    'use strict';
	function update (xpath, regex, match) {
		const ee = document.evaluate (xpath, document, null, 0, null);
		const aa = [];
		for (;;) {
			const e = ee.iterateNext ();
			if (!e)
				break;
			aa.push (e);
			}
		for (const e of aa)
			e.nodeValue = e.nodeValue.replace (regex, function (m, ph, pm, pt) {
				ph = parseInt (ph) % 12;
				if (pt === match)
					ph += 12;
				return ('0' + ph).slice (-2) + pm;
				});
		}
	setInterval (function () {
		update ('//text()[contains(.,":")][contains(.," AM") or contains(.," PM")]', /(\d{1,2})(:\d\d) ([AP]M)/g, 'PM');	// english
		update ('//text()[contains(.,":")][contains(.," am") or contains(.," pm")]', /(\d{1,2})(:\d\d) ([ap]m)/g, 'pm');	// british english
		update ('//text()[contains(.,":")][contains(.," a. m.") or contains(.," p. m.")]', /(\d{1,2})(:\d\d) ([ap]\. m\.)/g, 'p. m.');	// spanish
		}, 1000);
	}) ();
