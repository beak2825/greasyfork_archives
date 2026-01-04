// ==UserScript==
// @name         Sourcehut: copy commit reference
// @namespace    https://andrybak.dev
// @license      AGPL-3.0-only
// @version      2
// @description  Adds a "Copy commit reference" button to every commit page on Sourcehut websites.
// @homepageURL  https://github.com/rybak/copy-commit-reference-userscript
// @supportURL   https://github.com/rybak/copy-commit-reference-userscript/issues
// @author       Andrei Rybak
// @match        https://git.sr.ht/*/commit/*
// @icon         https://sourcehut.org/logo.png
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@dc32d5897dcfa40a01c371c8ee0e211162dfd24c/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@1306877cef88bb8792c0851e31454d9b7a82b262/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493396/Sourcehut%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/493396/Sourcehut%3A%20copy%20commit%20reference.meta.js
// ==/UserScript==

/*
 * Copyright (C) 2024 Andrei Rybak
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

(function () {
	'use strict';

	const LOG_PREFIX = '[Sourcehut: copy commit reference]:';

	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}

	function warn(...toLog) {
		console.warn(LOG_PREFIX, ...toLog);
	}

	function info(...toLog) {
		console.info(LOG_PREFIX, ...toLog);
	}

	function debug(...toLog) {
		console.debug(LOG_PREFIX, ...toLog);
	}

	/*
	 * Implementation for sourcehut.org, sr.ht, etc.
	 */
	class Sourcehut extends GitHosting {
		// mandatory:

		getTargetSelector() {
			return 'html body div.container div.row div.col-md-2 div.mb-3';
		}

		getFullHash() {
			const commitSelfLink = document.querySelector('a[id^="log-"]');
			return commitSelfLink.id.slice(4);
			// also in document.querySelector('html body div.container div.row div.col-md-10 div.event-list div.event div').childNodes[0].textContent.trimStart().slice(0, 40);
		}

		async getDateIso(hash) {
			const commitSelfLinkTimestamp = document.querySelector('a[id^="log-"] span');
			return commitSelfLinkTimestamp.title.slice(0, 10);
		}

		async getCommitMessage(hash) {
			return document.querySelector('.commit').innerText;
		}

		// optional:

		getButtonText() {
			return 'copy reference';
		}

		wrapButtonContainer(innerContainer) {
			innerContainer.classList.add('btn', 'btn-default', 'btn-block');
			innerContainer.style.padding = 0;
			return innerContainer;
		}

		wrapButton(button) {
			button.classList.add('btn', 'btn-default');
			button.style.borderStyle = 'none';
			button.style.width = '100%';
			return button;
		}
	}

	CopyCommitReference.runForGitHostings(new Sourcehut());
})();
