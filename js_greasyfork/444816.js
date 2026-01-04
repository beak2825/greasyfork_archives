// ==UserScript==
// @name         Wayfarer Copy Name Location
// @version      1.0
// @description  Copy Name in Clipboard to share
// @match        https://wayfarer.nianticlabs.com/*
// @grant        GM_setClipboard
// @namespace https://github.com/AN0NIM07/plugin
// @downloadURL https://update.greasyfork.org/scripts/444816/Wayfarer%20Copy%20Name%20Location.user.js
// @updateURL https://update.greasyfork.org/scripts/444816/Wayfarer%20Copy%20Name%20Location.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */

function init() {
	let tryNumber = 15;

	let translateButton;
	let candidate;

	const SPACING = '\r\n\r\n';

	/**
	 * Overwrite the open method of the XMLHttpRequest.prototype to intercept the server calls
	 */
	(function (open) {
		XMLHttpRequest.prototype.open = function (method, url) {
			if (url == '/api/v1/vault/review') {
				if (method == 'GET') {
					this.addEventListener('load', parseCandidate, false);
				}
				
			}
			open.apply(this, arguments);
		};
	})(XMLHttpRequest.prototype.open);

	function parseCandidate(e) {
		try {
			const response = this.response;
			const json = JSON.parse(response);
            //GM_setClipboard(response);
			if (!json) {
				console.log(response);
				//alert('Failed to parse response from Wayfarer');
				return;
			}
			// ignore if it's related to captchas
			if (json.captcha)
				return;

			if (json.code != 'OK')
				return;

			candidate = json.result;
			if (!candidate) {
				console.log(json);
				alert('Wayfarer\'s response didn\'t include a candidate.');
				return;
			}
			let text = '';
        let subtitle = '';
        let titleandlocation = '';
        let locationcord = '';
		if (candidate.type == 'NEW') {
			text = candidate.title + SPACING + candidate.description + SPACING + candidate.statement;
            subtitle = candidate.title;
            locationcord = candidate.lat.toString() + ',' + candidate.lng.toString()
            titleandlocation = subtitle + ' ' + locationcord;
            GM_setClipboard(titleandlocation);
		}

		if (candidate.type == 'EDIT') {
			const title = candidate.title || candidate.titleEdits.map(d=>d.value).join(SPACING);
			const description = candidate.description || candidate.descriptionEdits.map(d=>d.value).join(SPACING);
			text = title + SPACING + SPACING + description;
			GM_setClipboard(title);
		}
		if (candidate.type == 'PHOTO') {
			text = candidate.title;
			GM_setClipboard(text);
		}
			
		} catch (e)	{
			console.log(e); // eslint-disable-line no-console
		}

	}

}

init();

