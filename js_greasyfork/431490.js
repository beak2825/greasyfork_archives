/* eslint-disable no-multi-spaces */
// ==UserScript==
// @name         GreasyForkScriptUpdate
// @namespace    GreasyForkScriptUpdate
// @version      0.4.2
// @description  Check update for Greasyfork userscript
// @author       PY-DNG
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==
(function () {
	'use strict';

	// Accessable in Global_Scope
	typeof(unsafeWindow) !== 'object' && (window.unsafeWindow = window);
	unsafeWindow.GreasyForkUpdater = GreasyForkUpdater;

	// Use 'new' keyword
	function GreasyForkUpdater(metarule=null) {
		const GFU = this;
		const singles = metarule ? metarule.singles : [];
		const multiples = metarule ? metarule.multiples : [];

		// Parse '// ==UserScript==\n...\n// ==/UserScript==' to {name: '', namespace: '', version: '', ...}
		// Returns metaData object directly
		GFU.parseMetaData = function(metaText) {
			const metaData = {};
			const lines = metaText.split('\n');
			const edgeMatcher     = /==\/?UserScript==/i;
			const keyValueMatcher = /^\/\/ *@([^@ ]+) +(.+) *$/;
			const keyOnlyMatcher  = /^\/\/ *@([^@ ]+) *$/;
			for (let line of lines) {
				// Get & validate line
				line = line.trim();
				if (line.match(edgeMatcher)) {continue;};
				if (!line.match(keyValueMatcher) && !line.match(keyOnlyMatcher)) {continue;};

				// Get key-value
				const match = line.match(keyValueMatcher) ? line.match(keyValueMatcher) : line.match(keyOnlyMatcher);
				const key = match[1];
				const value = match[2] ? match[2] : true;

				// Attach to metaData object
				if (singles.includes(key)) {
					// Single value metaitem: stores only the first value
					if (!metaData.hasOwnProperty(key)) {
						metaData[key] = value;
					}
				} else if (multiples.includes(key)) {
					// Multiple value metaitem: always stores all values in an array whether provided value are multiple or not
					if (!metaData.hasOwnProperty(key)) {
						metaData[key] = [value];
					} else {
						metaData[key].push(value);
					}
				} else {
					// Unspecificed metaitem: stores single-provided values directly and multiple-provided values in arrays
					if (!metaData.hasOwnProperty(key)) {
						metaData[key] = value;
					} else {
						if (Array.isArray(metaData[key])) {
							metaData[key].push(value);
						} else {
							metaData[key] = [metaData[key], value];
						}
					}
				}
			}
			return metaData;
		}

		// Request latest script meta text from greasyfork
		// You'll get metaText string as the first argument in your callback function
		GFU.requestMetaText = function(scriptID, callback, args=[]) {
			if (!scriptID) {return false;};
			const url = 'https://greasyfork.org/scripts/{SID}/code/script.meta.js'.replace('{SID}', String(scriptID));
			GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				responseType: 'text',
				onload: function(e) {
					callback && callback.apply(null, [e.responseText].concat(args));
				}
			})
		}

		// Request & parse latest script meta data from greasyfork
		// You'll get metaData object as the first argument in your callback function
		GFU.getMetaData = function(scriptID, callback, args=[]) {
			if (!scriptID) {return false;};
			GFU.requestMetaText(scriptID, function(metaText) {
				const metaData = GFU.parseMetaData(metaText);
				callback && callback.apply(null, [metaData].concat(args));
			})
		}

		// Compare two version texts(v1, v2), returns true if v1 > v2
		// Returns null while version text contains Non-demical text period(s)
		GFU.versionNewer = function(v1, v2) {
			v1 = v1.trim().split('.');
			v2 = v2.trim().split('.');

			for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
				v1[i] = Number(v1[i]);
				v2[i] = Number(v2[i]);
				if (!v1[i] || !v2[i]) {return null;};
				if (v1[i] !== v2[i]) {return v1[i] > v2[i];};
			}

			return v1.length > v2.length;
		}

		// Check if there's new version of the script on GreasyFork using scriptID, current version text
		// You'll get update(bool), updateurl(string), metaData(object) as the first, second and third argument in your callback function
		GFU.checkUpdate = function(scriptID, curver, callback, args=[]) {
			if (!scriptID) {return false;};
			GFU.getMetaData(scriptID, function(metaData) {
				const update = GFU.versionNewer(metaData.version, curver);
				const updateurl = 'https://greasyfork.org/scripts/{SID}/code/script.user.js'.replace('{SID}', String(scriptID));
				callback && callback.apply(null, [update, updateurl, metaData].concat(args));
			})
		}

		// Check & Install update automatically
		GFU.update = function(scriptID, curver) {
			GFU.checkUpdate(scriptID, curver, function() {
				const url = 'https://greasyfork.org/scripts/{SID}/code/script.user.js'.replace('{SID}', String(scriptID));
				location.href = url;
			})
		}
	}
})();