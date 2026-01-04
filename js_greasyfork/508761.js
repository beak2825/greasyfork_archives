// ==UserScript==
// @name         Phorge: copy commit reference
// @namespace    https://andrybak.dev
// @author       Andrei Rybak
// @license      AGPL-3.0-only
// @version      1
// @description  Adds a "Copy commit reference" button to every commit page on Phorge.
// @homepageURL  https://github.com/rybak/copy-commit-reference-userscript
// @supportURL   https://github.com/rybak/copy-commit-reference-userscript/issues
// @match        https://we.phorge.it/r*
// @match        https://we.phorge.it/R*
// @match        https://phabricator.wikimedia.org/r*
// @match        https://phabricator.wikimedia.org/R*
// @icon         https://we.phorge.it/file/data/qsmnldcb3vzxgaes3zge/PHID-FILE-jjurena7gu3ouojuoot7/favicon
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@dc32d5897dcfa40a01c371c8ee0e211162dfd24c/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@4df8332283727fd2650d5178e8b958b406fdd115/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508761/Phorge%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/508761/Phorge%3A%20copy%20commit%20reference.meta.js
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

	const LOG_PREFIX = '[Phorge: copy commit reference]:';

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
	 * Implementation for Phorge.
	 */
	class Phorge extends GitHosting {
		/*
		 * See PhabricatorDiffusionApplication.php for details.
		 */
		#hashRegex = new RegExp('[/](r(?<repoCallSign>[A-Z]+)|R(?<repoId>[0-9]+):)(?<hash>[a-z0-9]+)$');
		#unknownDate = 'unknown date';

		/*
		 * The `@match` entries cover a lot of URLs, so have to filter where the
		 * userscript is active with overridden `isRecognized()`.
		 */
		isRecognized() {
			return document.location.pathname.match(this.#hashRegex) !== null;
		}

		getTargetSelector() {
			// sidebar on the right with "Download Raw Diff"
			return '.phabricator-action-list-view';
		}

		getFullHash() {
			const matchPathname = document.location.pathname.match(this.#hashRegex);
			if (matchPathname === null) {
				error(`Cannot parse pathname: ${document.location.pathname}`);
				return null;
			}
			const selectorLetter = matchPathname.groups.repoCallSign ? 'r' : 'R';
			const url = document.querySelector(`.phui-header-view .phui-header-subheader .phui-tag-view .phui-tag-core a[href^="/${selectorLetter}"]`)?.href;
			if (url === null) {
				error('Cannot find the self-linking URL');
				return null;
			}
			const matchSelfLink = url.match(this.#hashRegex);
			if (matchSelfLink === null) {
				error(`Cannot parse URL: ${url}`);
				return null;
			}
			return matchSelfLink.groups.hash;
		}

		#monthNameToIso = {
			'Jan': '01',
			'Feb': '02',
			'Mar': '03',
			'Apr': '04',
			'May': '05',
			'Jun': '06',
			'Jul': '07',
			'Aug': '08',
			'Sep': '09',
			'Oct': '10',
			'Nov': '11',
			'Dec': '12'
		};

		#convertMonthNameToIso(s) {
			return this.#monthNameToIso[s];
		}

		/*
		 * It is hard to get a date out of Phorge/Phabricator commit view pages,
		 * which don't have a timeline.
		 * Example problematic pages:
		 *   - No timeline
		 *     https://phabricator.wikimedia.org/rMW34c64601bc37106cadfe7ea2f2d614da1deec48f
		 *   - Provenance "Authored on" without date
		 *     https://phabricator.wikimedia.org/rSVN105123
		 *     - See also https://we.phorge.it/rPb02615bd5027ee51ac68d48a0a64306b75285789
		 *     https://phabricator.wikimedia.org/rMWb1dea1d957833d1965999c350a05d365ba56adba
		 */
		getDateIso(hash) {
			const maybeTimelineDate = document.querySelector(`a[href$="${hash}"] ~ .phui-timeline-extra .print-only`)?.innerText?.slice(0, 'YYYY-MM-DD'.length);
			if (maybeTimelineDate) {
				// the good path, with machine-readable timestamp
				return maybeTimelineDate;
			}
			// oh no
			const provenanceDts = Array.from(document.querySelectorAll('.phui-property-list-key')).filter(dt => dt.innerText.includes('Provenance'));
			if (provenanceDts.length === 0) {
				return this.#unknownDate;
			}
			const provenanceAuthoredText = provenanceDts[0].nextSibling.querySelector('.phui-status-item-note')?.innerText
			if (provenanceAuthoredText === null) {
				return this.#unknownDate;
			}
			info('"Provenance" text:', provenanceAuthoredText);
			// Examples
			// Authored on Tue, Aug 27, 03:50
			// Authored on Sep 30 2021, 16:41
			const dateRegex = new RegExp(/Authored on ([A-Za-z]{3}, (?<shortMonth>\w{3}) (?<shortDay>\d{1,2}).*|(?<longMonth>\w{3}) (?<longDay>\d{1,2}) (?<longYear>\d{4})), \d{2}:\d{2}/);
			const m = provenanceAuthoredText.match(dateRegex);
			if (m === null) {
				error('Cannot parse "Provenance":', provenanceAuthoredText);
				return this.#unknownDate;
			}
			if (m.groups.shortDay && m.groups.shortMonth) {
				const year = new Date().getFullYear();
				const month = this.#convertMonthNameToIso(m.groups.shortMonth);
				return `${year}-${month}-${m.groups.shortDay}`;
			} else {
				const month = this.#convertMonthNameToIso(m.groups.longMonth);
				return `${m.groups.longYear}-${month}-${m.groups.longDay}`;
			}
		}

		getCommitMessage(hash) {
			return document.querySelector('.diffusion-commit-message').innerText;
		}

		wrapButtonContainer(innerContainer) {
			const li = document.createElement('li');
			li.classList.add('phabricator-action-view', 'phabricator-action-view-submenu', 'phabricator-action-view-href', 'action-has-icon');
			li.appendChild(innerContainer);
			return li;
		}

		wrapButton(button) {
			const actionItem = document.createElement('span');
			actionItem.classList.add('phabricator-action-view-item');
			const icon = document.createElement('span');
			icon.classList.add('visual-only', 'phui-icon-view', 'phui-font-fa', 'fa-copy', 'phabricator-action-view-icon');
			button.style.textDecoration = 'none';
			button.style.color = '#464C5C';
			button.style.padding = '4px 8px 6px 0';
			actionItem.replaceChildren(icon, button);
			return actionItem;
		}

		createCheckmark() {
			const checkmark = super.createCheckmark();
			checkmark.style.left = 'unset';
			checkmark.style.right = 'calc(100% + 1.5rem)';
			checkmark.style.zIndex = '100';
			checkmark.style.top = '0.3rem';
			return checkmark;
		}
	}

	CopyCommitReference.runForGitHostings(new Phorge());
})();
