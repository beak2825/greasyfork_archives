// ==UserScript==
// @name         Gitea: copy commit reference
// @namespace    https://andrybak.dev
// @version      12
// @license      AGPL-3.0-only
// @author       Andrei Rybak
// @description  Adds a "Copy commit reference" button to every commit page on Gitea and Forgejo websites.
// @icon         https://about.gitea.com/favicon.ico
// @homepageURL  https://github.com/rybak/copy-commit-reference-userscript
// @supportURL   https://github.com/rybak/copy-commit-reference-userscript/issues
// @match        https://gitea.com/*/commit/*
// @match        https://git.plastiras.org/*/commit/*
// @match        https://projects.blender.org/*/commit/*
// @match        https://codeberg.org/*/commit/*
// @match        https://next.forgejo.org/*/commit/*
// @match        https://code.forgejo.org/*/commit/*
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@4f71749bc0d302d4ff4a414b0f4a6eddcc6a56ad/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476736/Gitea%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/476736/Gitea%3A%20copy%20commit%20reference.meta.js
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
	 * Implementation for Gitea and its fork Forgejo.
	 *
	 * Example URLs for testing:
	 *   - https://git.plastiras.org/Tha_14/Antidote/commit/f84a08f1ac5312acc9ccedff25e6957e575f03ff
	 *   - https://codeberg.org/forgejo/forgejo/commit/e35d92de1f37bea0a593093678f093845955e3fc
	 *   - https://codeberg.org/forgejo/forgejo/commit/a4369782e1cfbbc6f588c0cda5776ee823b0e493
	 */
	class Gitea extends GitHosting {
		getTargetSelector() {
			return '.commit-header h3 + div';
		}

		wrapButtonContainer(container) {
			container.style.marginRight = '0.5rem';
			return container;
		}

		wrapButton(button) {
			/*
			 * Mimicking Gitea's "Browse Source" button, but without class 'primary',
			 * because there shouldn't be too many primary buttons. Class 'basic' is
			 * for styling like most of the buttons on the commit pages.
			 */
			button.classList.add('ui', 'tiny', 'button', 'basic');
			const maybeNativeIcon = document.querySelector('.svg.octicon-copy');
			if (maybeNativeIcon) {
				/*
				 * Some instances of Gitea don't have the copy icons,
				 * e.g. https://projects.blender.org
				 */
				const icon = maybeNativeIcon.cloneNode(true);
				icon.style.verticalAlign = 'middle';
				icon.style.marginTop = '-4px';
				button.insertBefore(document.createTextNode(" "), button.childNodes[0]);
				button.insertBefore(icon, button.childNodes[0]);
			}
			return button;
		}

		addButtonContainerToTarget(target, buttonContainer) {
			// to the left of Gitea's "Browse Source" button
			target.insertBefore(buttonContainer, target.querySelector('.ui.primary.tiny.button'));
		}

		/**
		 * Styles adapted from GitHub's CSS classes ".tooltipped::before"
		 * and ".tooltipped-s::before".
		 *
		 * @returns {HTMLElement}
		 */
		#createTooltipTriangle() {
			const triangle = document.createElement('div');
			triangle.style.position = 'absolute';
			triangle.style.zIndex = '1000001';
			triangle.style.bottom = '-15px'; // not -16px to look better at different zoom levels
			triangle.style.left = '14px'; // to align with .left of `checkmark`
			triangle.style.height = '0';
			triangle.style.width = '0';
			/*
			 * Borders connect at 45° angle => when only top border is colored,
			 * it's a trapezoid.  But with width=0, the bottom edge of trapezoid
			 * has length 0, so it's a downwards triangle.
			 *
			 * bgColor from Gitea CSS classes
			 */
			triangle.style.border = '8px solid transparent';
			triangle.style.borderTopColor = 'var(--color-tooltip-bg)';
			return triangle;
		}

		createCheckmark() {
			const checkmark = super.createCheckmark();
			checkmark.style.left = '0.2rem'; // to put emoji right above the button's icon
			checkmark.style.bottom = 'calc(100% + 1.2rem)'; // to mimic native tooltips shown above the buttons
			/*
			 * Look and feel from CSS classes of Tippy -- a library (?)
			 * used by Gitea.
			 */
			checkmark.style.zIndex = '9999';
			checkmark.style.backgroundColor = 'var(--color-tooltip-bg)';
			checkmark.style.color = 'var(--color-tooltip-text)';
			checkmark.style.borderRadius = 'var(--border-radius)';
			checkmark.style.fontSize = '1rem';
			checkmark.style.padding = '.5rem 1rem';
			checkmark.appendChild(this.#createTooltipTriangle());
			return checkmark;
		}

		getFullHash() {
			const browseButton = document.querySelector('.commit-header h3 + div > a');
			const lastSlashIndex = browseButton.href.lastIndexOf('/');
			return browseButton.href.slice(lastSlashIndex + 1);
		}

		getDateIso(hash) {
			// Gitea: .commit-header + div
			// Forgejo: #authored-time
			const timeTag = document.querySelector('#authored-time relative-time, .commit-header + div relative-time');
			return timeTag.getAttribute('datetime').slice(0, 'YYYY-MM-DD'.length);
		}

		getCommitMessage(hash) {
			const subj = document.querySelector('.commit-summary').innerText;
			const bodyElement = document.querySelector('.commit-body');
			if (!bodyElement) {
				return subj;
			}
			const body = bodyElement.childNodes[0].innerText;
			return subj + '\n\n' + body;
		}

		static #getIssuesUrl() {
			const oldUiElement = document.querySelector('.header-wrapper > .ui.tabs.container > .tabular.menu.navbar a[href$="/issues"]');
			if (oldUiElement) {
				return oldUiElement.href;
			}
			return document.querySelector('.header-wrapper .navbar a[href$="/issues"], .secondary-nav .overflow-menu-items a[href$="/issues"]').href;
		}

		async convertPlainSubjectToHtml(plainTextSubject, hash) {
			const escapedHtml = await super.convertPlainSubjectToHtml(plainTextSubject, hash);
			if (!escapedHtml.includes('#')) {
				return escapedHtml;
			}
			const issuesUrl = Gitea.#getIssuesUrl();
			return escapedHtml.replaceAll(/(?<!&)#([0-9]+)/g, `<a href="${issuesUrl}/\$1">#\$1</a>`);
		}
	}

	CopyCommitReference.runForGitHostings(new Gitea());
})();
