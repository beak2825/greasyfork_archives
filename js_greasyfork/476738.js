// ==UserScript==
// @name         GitLab: copy commit reference
// @namespace    https://andrybak.dev
// @license      AGPL-3.0-only
// @version      10
// @description  Adds a "Copy commit reference" button to every commit page on GitLab.
// @homepageURL  https://gitlab.com/andrybak/copy-commit-reference-userscript
// @supportURL   https://gitlab.com/andrybak/copy-commit-reference-userscript/-/issues
// @author       Andrei Rybak
// @match        https://gitlab.com/*/-/commit/*
// @match        https://invent.kde.org/*/-/commit/*
// @match        https://gitlab.gnome.org/*/-/commit/*
// @match        https://code.europa.eu/*/-/commit/*
// @icon         https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@4f71749bc0d302d4ff4a414b0f4a6eddcc6a56ad/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476738/GitLab%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/476738/GitLab%3A%20copy%20commit%20reference.meta.js
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

	/*
	 * Implementation for GitLab.
	 *
	 * Example URLs for testing:
	 *   - https://gitlab.com/andrybak/resoday/-/commit/b82824ec6dc3f14c3711104bf0ffd792c86d19ba
	 *   - https://invent.kde.org/education/kturtle/-/commit/8beecff6f76a4afc74879c46517d00657d8426f9
	 */
	class GitLab extends GitHosting {
		static #HEADER_SELECTOR = 'main#content-body .page-content-header > .header-main-content';

		getTargetSelector() {
			return GitLab.#HEADER_SELECTOR;
		}

		getButtonTagName() {
			return 'button'; // like GitLab's "Copy commit SHA"
		}

		wrapButton(button) {
			const copyShaButtonIcon = document.querySelector(`${GitLab.#HEADER_SELECTOR} > button > svg[data-testid="copy-to-clipboard-icon"]`);
			const icon = copyShaButtonIcon.cloneNode(true);
			button.replaceChildren(icon); // is just icon enough?
			button.classList.add('btn-sm', 'btn-default', 'btn-default-tertiary', 'btn-icon', 'btn', 'btn-clipboard', 'gl-button');
			button.setAttribute('data-toggle', 'tooltip'); // this is needed to have a fancy tooltip in style of other UI
			button.setAttribute('data-placement', 'bottom'); // this is needed so that the fancy tooltip appears below the button
			button.style = 'border: 1px solid darkgray;';
			button.title = this.getButtonText() + " to clipboard";
			return button;
		}

		getFullHash() {
			const copyShaButton = document.querySelector(`${GitLab.#HEADER_SELECTOR} > button`);
			return copyShaButton.getAttribute('data-clipboard-text');
		}

		getDateIso(hash) {
			// careful not to select <time> tag for "Committed by"
			const authorTimeTag = document.querySelector(`${GitLab.#HEADER_SELECTOR} > span + time`);
			return authorTimeTag.getAttribute('datetime').slice(0, 'YYYY-MM-DD'.length);
		}

		getCommitMessage(hash) {
			/*
			 * Even though vast majority will only need `subj`, gather everything and
			 * let downstream code handle paragraph splitting.
			 */
			const subj = document.querySelector('.commit-box .commit-title').innerText;
			const maybeBody = document.querySelector('.commit-box .commit-description');
			if (maybeBody == null) { // some commits have only a single-line message
				return subj;
			}
			const body = maybeBody.innerText;
			return subj + '\n\n' + body;
		}

		addButtonContainerToTarget(target, buttonContainer) {
			const authoredSpanTag = target.querySelector('& > span');
			target.insertBefore(buttonContainer, authoredSpanTag);
			// add spacer to make text "authored" not stick to the button
			target.insertBefore(document.createTextNode(" "), authoredSpanTag);
		}

		/*
		 * GitLab has a complex interaction with library ClipboardJS:
		 *
		 *   - https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/helpers/button_helper.rb#L31-68
		 *   - https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/behaviors/copy_to_clipboard.js#L63-94
		 *
		 *  and the native tooltips are even more complicated.
		 */
		createCheckmark() {
			const checkmark = super.createCheckmark();
			checkmark.style.left = 'calc(100% + 0.3rem)';
			checkmark.style.lineHeight = '1.5';
			checkmark.style.padding = '0.5rem 1.5rem';
			checkmark.style.textAlign = 'center';
			checkmark.style.width = 'auto';
			checkmark.style.borderRadius = '3px';
			checkmark.style.fontSize = '0.75rem';
			checkmark.style.fontFamily = '"Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
			if (document.body.classList.contains('gl-dark')) {
				checkmark.style.backgroundColor = '#dcdcde';
				checkmark.style.color = '#1f1e24';
			} else {
				checkmark.style.backgroundColor = '#000';
				checkmark.style.color = '#fff';
			}
			return checkmark;
		}

		/**
		 * @returns {string}
		 */
		static #getIssuesUrl() {
			const newUiIssuesLink = document.querySelector('nav a[href$="/issues"]');
			if (newUiIssuesLink) {
				return newUiIssuesLink.href;
			}
			const oldUiIssuesLink = document.querySelector('aside a[href$="/issues"]');
			return oldUiIssuesLink.href;
		}

		async convertPlainSubjectToHtml(plainTextSubject, commitHash) {
			const escapedHtml = await super.convertPlainSubjectToHtml(plainTextSubject, commitHash);
			if (!escapedHtml.includes('#')) {
				return escapedHtml;
			}
			const issuesUrl = GitLab.#getIssuesUrl();
			return escapedHtml.replaceAll(/(?<!&)#([0-9]+)/g, `<a href="${issuesUrl}/\$1">#\$1</a>`);
		}
	}

	CopyCommitReference.runForGitHostings(new GitLab());
})();
