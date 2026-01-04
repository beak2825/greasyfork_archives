// ==UserScript==
// @name         Cookie and website data cleaner
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Clears cookies and other website data when you go to websites if it isn't allowed to store website data. Edit the code to include websites that can store data.
// @author       https://greasyfork.org/en/users/85040-d-a-n
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503652/Cookie%20and%20website%20data%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/503652/Cookie%20and%20website%20data%20cleaner.meta.js
// ==/UserScript==

// MIT License

// Copyright(c) 2024-2025 Dan

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
// 	in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// 	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function() {
	// clearing website storage may prevent certain features from working correctly
	// such as remembering which websites you are logged into, which items are in your basket when shopping etc.

	// start config

	// clearWebsiteDataEveryXMilliseconds takes any number
	var clearWebsiteDataEveryXMilliseconds = 200;

	// runs on websites unless listed here
	// made using regular expressions - flags are ignored
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
	// https://regex101.com

	var websitesToNotRunOn = [
		// cookies required for websites to work


		// anything requiring google account:
		// /^https:\/\/accounts\.google\.com/,
		// google docs:
		// /^https:\/\/docs\.google\.com/,
		// /^https:\/\/contacts\.google\.com/,
		// stay signed into youtube:
		// /^https:\/\/accounts\.youtube\.com/,
		// /^https:\/\/(www|m)\.youtube\.com/,

		// stay signed into soundcloud account
		// /^https:\/\/secure\.soundcloud\.com/,
		// /^https:\/\/soundcloud\.com/,

		// reddit requires cookies to work even without account
		// /^https:\/\/www\.reddit\.com/,


		// cookies that are needed to remember preferences
		// /^https:\/\/search\.brave\.com/,
		// /^https:\/\/([a-z]+\.)?wikipedia\.org/
	];

	// end config

	var websitesToNotRunOnStr = '';

	websitesToNotRunOn.forEach(function(re, index, arr) {
		websitesToNotRunOnStr += '(' + re.source + ')';

		if ((index + 1 ) < arr.length) {
			websitesToNotRunOnStr += '|';
		}
	});

	if (location.origin.match(websitesToNotRunOnStr)) {
		return;
	}

	function joinArray(array, seperator, start, end) {
		var joined = '';

		for (var i = start; i < end; i++) {
			joined += array[i] + seperator;
		}

		return joined;
	}

	function clearCookie(cookieName) {
		// https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
		// https://stackoverflow.com/questions/5688491/unable-to-delete-cookie-from-javascript
		// can only delete cookie if same domain and path are used as what's already been set

		var pathParts = location.pathname.split(/\//g);
		var expires = new Date(0).toUTCString();

		[location.hostname, location.host].forEach(function(domain) {
			while (domain) {
				for (var i = 0; i < pathParts.length; i++) {
					var path = joinArray(pathParts, '/', 0, i);
					var cookie = cookieName + '=; expires=' + expires + '; domain=' + domain + '; path=' + path + ';';

					if (location.protocol == 'https:') {
						cookie += ' SameSite=strict; Secure';
					}

					document.cookie = cookie;
				}

				domain = domain.replace(/^\.?[^.]+/, '');

				if (!domain.match(/[^.]+\.[^.]+$/)) {
					// prevent cookie rejection warning based on invalid domain
					break;
				}
			}
		});
	}

	function clearCookies() {
		var cookieRe = /([^=]+)=[^;]*(?:;\s+|$)/;

		document.cookie.match(new RegExp(cookieRe, 'g') || []).forEach(function(cookie) {
			var cookieName = cookie.match(cookieRe)[1];

			clearCookie(cookieName);
		});
	}

	function resetWebsiteData() {
		try {
			clearCookies();

			['localStorage', 'sessionStorage'].forEach(function(storage) {
				window[storage].clear();
			});
		}
		catch(err) {
			// page may not have loaded yet or browser doesnt support localStorage or sessionStorage
		}
	}

	setInterval(resetWebsiteData, clearWebsiteDataEveryXMilliseconds);
	resetWebsiteData();
})();