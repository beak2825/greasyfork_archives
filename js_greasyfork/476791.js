// ==UserScript==
// @name         Gogs: copy commit reference
// @namespace    https://andrybak.dev
// @license      AGPL-3.0-only
// @version      6
// @description  Adds a "Copy commit reference" button to every commit page on Gogs websites.
// @homepageURL  https://try.gogs.io/andrybak/copy-commit-reference-userscript
// @supportURL   https://try.gogs.io/andrybak/copy-commit-reference-userscript/issues
// @author       Andrei Rybak
// @match        https://*.gogs.io/*/commit/*
// @icon         https://try.gogs.io/img/favicon.png
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@4f71749bc0d302d4ff4a414b0f4a6eddcc6a56ad/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476791/Gogs%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/476791/Gogs%3A%20copy%20commit%20reference.meta.js
// ==/UserScript==

/*
 * Copyright (C) 2023-2025 Andrei Rybak
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

	/**
	 * Implementation for Gogs.
	 *
	 * Example URLs for testing:
	 *   - Regular commit: https://try.gogs.io/gogs/gogs/commit/1112a71ea5279a29666d54f07ef101480519fd16
	 *   - Commit message without a body (only subject): https://try.gogs.io/gogs/gogs/commit/3be3ae500b4b4792db94f4a8d46943b783400681
	 */
	class Gogs extends GitHosting {
		getTargetSelector() {
			return '.ui.top.attached.info.clearing.segment';
		}

		wrapButtonContainer(innerContainer) {
			const container = document.createElement('div');
			container.classList.add('ui', 'floated', 'right');
			container.appendChild(innerContainer);
			return container;
		}

		wrapButton(button) {
			/*
			 * Mimicking Gogs's "Browse Source" button, but without class 'primary',
			 * because there shouldn't be too many primary buttons.
			 */
			button.classList.add('ui', 'tiny', 'button');
			const icon = document.createElement('i');
			// CSS classes from Gogs' "Clone this repository" button.
			icon.classList.add('octicon', 'octicon-clippy');
			// It takes up too much height, so hack the line-height to fix.
			icon.style.lineHeight = '0';
			button.insertBefore(document.createTextNode(" "), button.childNodes[0]);
			button.insertBefore(icon, button.childNodes[0]);
			return button;
		}

		addButtonContainerToTarget(target, buttonContainer) {
			target.insertBefore(buttonContainer, target.querySelector('.commit-message'));
		}

		/**
		 * Mimicking Gogs' tooltip for author/committer time.
		 *
		 * @returns {HTMLElement}
		 */
		createCheckmark() {
			const checkmark = super.createCheckmark();
			// Classes from time tooltip
			checkmark.classList.add('ui', 'popup', 'inverted', 'tiny', 'top', 'left');

			// custom CSS for positioning & width
			checkmark.style.left = '0.5rem'; // to put the little triangle right above the button's icon
			checkmark.style.right = 'unset'; // to avoid width stretching to the right
			checkmark.style.top = 'calc(-100% - 1rem)'; // to mimic native tooltips shown above the buttons
			return checkmark;
		}

		getFullHash() {
			const browseButton = document.querySelector(`${this.getTargetSelector()} .ui.floated.right.blue.tiny.button`);
			const lastSlashIndex = browseButton.href.lastIndexOf('/');
			return browseButton.href.slice(lastSlashIndex + 1);
		}

		getDateIso(hash) {
			const s = document.getElementById('authored-time').childNodes[0].getAttribute('data-content');
			debug("Date string from Gogs authored-time data-content", s);
			// 16 is the cut off point for the year, which is all we need
			return new Date(s.slice(0, 16)).toISOString().slice(0, 'YYYY-MM-DD'.length);
		}

		getCommitMessage(hash) {
			const newUiCommitMessage = document.querySelector('.commit-message');
			if (newUiCommitMessage) {
				return newUiCommitMessage.innerText;
			}
			return document.querySelector('.ui.top.attached.info.clearing.segment h3').innerText;
		}

		static #getIssuesUrl() {
			return document.querySelector('.tabular.menu.navbar a[href$="/issues"]')?.href;
		}

		async convertPlainSubjectToHtml(plainTextSubject, commitHash) {
			const escapedHtml = await super.convertPlainSubjectToHtml(plainTextSubject, commitHash);
			if (!escapedHtml.includes('#')) {
				return escapedHtml;
			}
			const issuesUrl = Gogs.#getIssuesUrl();
			if (!issuesUrl) {
				return escapedHtml;
			}
			return escapedHtml.replaceAll(/(?<!&)#([0-9]+)/g, `<a href="${issuesUrl}/\$1">#\$1</a>`);
		}
	}

	CopyCommitReference.runForGitHostings(new Gogs());
})();
