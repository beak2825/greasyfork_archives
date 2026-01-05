// ==UserScript==
// @name        Narrow Browser
// @namespace   http://boris.joff3.com
// @description Remove horizontal scrolling by setting max-width on scripts
// @include     *
//
// @exclude     *.pdf
// @exclude     https://www.youtube.com/*
// @exclude     https://mail.google.com/*
// @exclude     https://docs.google.com/spreadsheets/*
// @exclude     https://calendar.google.com/*
// @exclude     https://hangouts.google.com/*
// @exclude     https://*.newegg.com/*
// @exclude     http://*.newegg.com/*
// @exclude     https://*.wunderground.com/*
// @exclude     https://www.rottentomatoes.com/*
// @exclude     https://www.ticktick.com/*
// @exclude     https://join.me/*
// @exclude     http://www.cryptocoincharts.info/*
// @exclude     http://caniuse.com/*
// @exclude     http://phantomjs.org/*
//
// @version     1.1.6
// @author      borisjoffe
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17115/Narrow%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/17115/Narrow%20Browser.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2016 Boris Joffe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


(function() {
	'use strict';

	var DBG = false;

	function log() {
	 if (DBG)
		console.log.apply(console, arguments);
	 return arguments[0];
	}

	var changeMinWidth = true;

	var MAXWIDTH = {
		log: log,
		DBG: DBG,
		changeMinWidth: changeMinWidth,
		elements: [
			'p',
			'span',
			'h1, h2, h3, h4, h5, h6',
			'div',
			'nav',
			'a',
			'pre',
			'li',
			'input',
			'body'
		].join(','),

		screenWidth: function () {
			return log(window.innerWidth, '- innerWidth');
		}
	};

	MAXWIDTH.width = function () {
		return log(MAXWIDTH.screenWidth() - 10, ' - width');
	};

	MAXWIDTH.css = function () {
		return log(
			MAXWIDTH.elements + ' { max-width: ' + MAXWIDTH.width() + 'px !important;' +
			// TODO: change minWidth better - only if it's set
			(changeMinWidth ? 'min-width: 0px !important; ' : '') +
			' }',
			' - css'
		);
	};

	if (DBG)
		window.MAXWIDTH = MAXWIDTH;

	function addCss() {
		var css = MAXWIDTH.css();

		if (typeof GM_addStyle != "undefined") {
			GM_addStyle(css);
		} else if (typeof PRO_addStyle != "undefined") {
			PRO_addStyle(css);
		} else if (typeof addStyle != "undefined") {
			addStyle(css);
		} else {
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(css));
			var heads = document.getElementsByTagName("head");
			if (heads.length > 0) {
				heads[0].appendChild(node);
			} else {
				// no head yet, stick it whereever
				document.documentElement.appendChild(node);
			}
		}
	}

	addCss();

	// TODO: adjust previous css instead of adding more css
	// to avoid bloat
	window.onresize = addCss;

})();
