// ==UserScript==
// @name            Quora Unblocker
// @description     Removes the Quora login requirement and any nagging about it
// @namespace       http://sindresorhus.com
// @version         1.1.0
// @author          Sindre Sorhus
// @license         MIT
// @released        2013-02-17
// @updated         2019-03-11
// @icon            https://github.com/sindresorhus/quora-unblocker-userscript/raw/master/icon.png
// @grant           GM_addStyle
// @match           *://quora.com/*
// @match           *://www.quora.com/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/5224/Quora%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/5224/Quora%20Unblocker.meta.js
// ==/UserScript==
(function () {
	'use strict';
	var queryString = {};

	queryString.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#)/, '');

		if (!str) {
			return {};
		}

		return str.trim().split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			var key = parts[0];
			var val = parts[1];

			key = decodeURIComponent(key);
			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	queryString.stringify = function (obj) {
		return obj ? Object.keys(obj).map(function (key) {
			var val = obj[key];

			if (Array.isArray(val)) {
				return val.map(function (val2) {
					return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
				}).join('&');
			}

			return encodeURIComponent(key) + '=' + encodeURIComponent(val);
		}).join('&') : '';
	};

	if (typeof define === 'function' && define.amd) {
		define(function() { return queryString; });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = queryString;
	} else {
		window.queryString = queryString;
	}
})();

(function () {
	'use strict';

	var query = queryString.parse(location.search);

	if (!query.share) {
		query.share = 1;
		location.search = queryString.stringify(query);
		return;
	}

	document.addEventListener('DOMContentLoaded', function () {
		// silently fails in Firefox if placed outside when `document-start`
		GM_addStyle('.LoggedOutSiteHeader, .narrow_signup_form, .signup_bubble, .signup_column, .logged_out .follow_button, .logged_out .ActionBar, .logged_out .AskToAnswerSectionToggle, .logged_out .answer_voters, .logged_out .Footer, .inline_answer_logged_out { display: none !important }');
	});
})();
