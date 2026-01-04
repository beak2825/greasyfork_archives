// ==UserScript==
// @name         GitHub: copy commit reference
// @namespace    https://andrybak.dev
// @license      AGPL-3.0-only
// @version      10
// @description  Adds a "Copy commit reference" button to every commit page on GitHub.
// @homepageURL  https://greasyfork.org/en/scripts/472870-github-copy-commit-reference
// @supportURL   https://greasyfork.org/en/scripts/472870-github-copy-commit-reference/feedback
// @author       Andrei Rybak
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon-dark.png
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@4f71749bc0d302d4ff4a414b0f4a6eddcc6a56ad/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472870/GitHub%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/472870/GitHub%3A%20copy%20commit%20reference.meta.js
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

	const LOG_PREFIX = '[GitHub: copy commit reference]:';

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
	 * Implementation for GitHub.
	 * This was tested on https://github.com, but wasn't tested in GitHub Enterprise.
	 *
	 * Example URL for testing:
	 *   - Regular commit
	 *     https://github.com/git/git/commit/1f0fc1db8599f87520494ca4f0e3c1b6fabdf997
	 *   - Merge commit with PR mention:
	 *     https://github.com/rybak/atlassian-tweaks/commit/fbeb0e54b64c894d9ba516db3a35c10bf409bfa6
	 *   - Empty commit (no diff, i.e. no changes committed)
	 *     https://github.com/rybak/copy-commit-reference-user-js/commit/234804fac57b39dd0017bc6f63aae1c1ce503d52
	 */
	class GitHub extends GitHosting {
		/*
		 * Mandatory overrides.
		 */

		/*
		 * CSS selector to use to find the element, to which the button
		 * will be added.
		 */
		getTargetSelector() {
			const commitHeaderSelector = `#repo-content-turbo-frame > .repository-content > .loaded header > div > div > div > div > div:nth-child(2) > div:first-child`;
			const commitPageSelector = commitHeaderSelector + ' > span:first-child';
			const prCommitPageSelector = '.commit.full-commit div:first-child';
			return `${commitPageSelector}, ${prCommitPageSelector}`;
		}

		getFullHash() {
			if (GitHub.#isAPullRequestPage()) {
				// commit pages in PRs have full SHA hashes
				return document.querySelector(this.#getPrPageCommitHashTextSelector()).childNodes[0].textContent;
			}
			/*
			 * path example: "/rybak/copy-commit-reference-userscript/tree/81d63267d33ce22449b80e51e2ec13c20613ea29"
			 */
			const path = document.querySelector(this.#getBrowseFilesButtonSelector()).getAttribute('href');
			const parts = path.split('/');
			if (parts.length < 5) {
				throw new Error("Cannot find commit hash in the URL");
			}
			return parts[4];
		}

		async getDateIso(hash) {
			info(`getDateIso: started for '${hash}'...`);
			const commitJson = await this.#downloadJson(hash);
			info(`getDateIso: done for '${hash}'.`);
			return commitJson.commit.author.date.slice(0, 'YYYY-MM-DD'.length);
		}

		async getCommitMessage() {
			const commitJson = await this.#downloadJson();
			return commitJson.commit.message;
		}

		/*
		 * Optional overrides.
		 */

		#getBrowseFilesButtonSelector() {
			return '#repo-content-turbo-frame > .repository-content > .loaded header > div > div > div > div > span > a[type="button"]';
		}

		#getPrPageCommitHashTextSelector() {
			return '.commit.full-commit.prh-commit .commit-meta .sha.user-select-contain';
		}

		getLoadedSelector() {
			// "Browse files" button for `getFullHash`
			// and second half for PRs
			return this.#getBrowseFilesButtonSelector() + ', ' + this.#getPrPageCommitHashTextSelector();
		}

		getButtonTagName() {
			return 'span';
		}

		wrapButtonContainer(container) {
			container.style = 'display: flex; justify-content: right;';
			return container;
		}

		/**
		 * @param {HTMLElement} target
		 * @param {HTMLElement} buttonContainer
		 */
		addButtonContainerToTarget(target, buttonContainer) {
			// top-right corner
			if (GitHub.#isAPullRequestPage()) {
				// to the left of "< Prev | Next >" buttons (if present)
				target.insertBefore(buttonContainer, target.childNodes[1]);
			} else {
				super.addButtonContainerToTarget(target, buttonContainer);
			}
		}

		/**
		 * Styles adapted from GitHub's native CSS classes ".tooltipped::before"
		 * and ".tooltipped-s::before".
		 *
		 * @returns {HTMLElement}
		 */
		#createTooltipTriangle() {
			const triangle = document.createElement('div');
			triangle.style.position = 'absolute';
			triangle.style.zIndex = '1000001';
			triangle.style.top = 'calc(-100% + 15px)';
			// aligns the base of triangle with the button's emoji
			triangle.style.left = '0.45rem';

			triangle.style.height = '0';
			triangle.style.width = '0';
			/*
			 * borders connect at 45° angle => when only bottom border is colored, it's a trapezoid
			 * but with width=0, the top edge of trapezoid has length 0, so it's a triangle
			 */
			triangle.style.border = '7px solid transparent';
			triangle.style.borderBottomColor = 'var(--bgColor-emphasis, var(--color-neutral-emphasis-plus))';
			return triangle;
		}

		createCheckmark() {
			const checkmark = super.createCheckmark();
			checkmark.style.zIndex = '1000000';
			checkmark.style.left = '';
			if (GitHub.#isAPullRequestPage()) {
				checkmark.style.top = '2.5rem';
				checkmark.style.right = '2rem';
			} else {
				checkmark.style.top = '1rem';
				checkmark.style.right = '5rem';
			}
			checkmark.style.font = 'normal normal 11px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"';
			checkmark.style.color = 'var(--fgColor-onEmphasis, var(--color-fg-on-emphasis))';
			checkmark.style.background = 'var(--bgColor-emphasis, var(--color-neutral-emphasis-plus))';
			checkmark.style.borderRadius = '6px';
			checkmark.style.padding = '.5em .75em';
			const triangle = this.#createTooltipTriangle();
			checkmark.appendChild(triangle);
			return checkmark;
		}

		async convertPlainSubjectToHtml(plainTextSubject, commitHash) {
			const escapedHtml = await super.convertPlainSubjectToHtml(plainTextSubject, commitHash);
			return await GitHub.#insertIssuePrLinks(escapedHtml);
		}

		/*
		 * Adds CSS classes and a nice icon to mimic other buttons in GitHub UI.
		 */
		wrapButton(button) {
			button.classList.add(
				'Button--secondary', // for border and background-color
				'Button', // for inner positioning of the icon
				'btn' // for outer positioning like the button "Browse files"
			);
			button.style.position = 'absolute';
			if (GitHub.#isAPullRequestPage()) {
				button.classList.add('Button--small'); // like buttons "< Prev | Next >"
			} else {
				button.style.top = '-1.2rem';
			}
			try {
				// GitHub's .octicon-copy is present on all pages, even if commit is empty
				const icon = document.querySelector('.octicon-copy').cloneNode(true);
				button.append(icon);
				const buttonText = this.getButtonText();
				button.replaceChildren(icon, document.createTextNode(` ${buttonText}`));
			} catch (e) {
				warn('Github: cannot find .octicon-copy');
			}
			return button;
		}

		static #isAGitHubCommitPage() {
			const p = document.location.pathname;
			/*
			 * Note that `pathname` doesn't include slashes from
			 * repository's directory structure.
			 */
			const slashIndex = p.lastIndexOf('/');
			if (slashIndex <= 7) {
				info('GitHub: not enough characters to be a commit page');
				return false;
			}
			const beforeLastSlash = p.slice(slashIndex - 7, slashIndex);
			/*
			 * '/commit' for regular commit pages:
			 *     https://github.com/junit-team/junit5/commit/977c85fc31ad6825b4c68f6c6c972a93356ffe74
			 * 'commits' for commits in PRs:
			 *     https://github.com/junit-team/junit5/pull/3416/commits/3fad8c6c2a3829e2e329b334cd49b19f179d5f1f
			 */
			if (beforeLastSlash != '/commit' && beforeLastSlash != 'commits' /* on PR pages */) {
				info('GitHub: missing "/commit" in the URL. Got: ' + beforeLastSlash);
				return false;
			}
			// https://stackoverflow.com/a/10671743/1083697
			const numberOfSlashes = (p.match(/\//g) || []).length;
			if (numberOfSlashes < 4) {
				info('GitHub: This URL does not look like a commit page: not enough slashes');
				return false;
			}
			info('GitHub: this URL needs a copy button');
			return true;
		}

		static #isAPullRequestPage() {
			return document.location.pathname.includes('/pull/');
		}

		#maybeEnsureButton(eventName, ensureButtonFn) {
			info('GitHub: triggered', eventName);
			this.#onPageChange();
			if (GitHub.#isAGitHubCommitPage()) {
				ensureButtonFn();
			}
		}

		/*
		 * Handling of on-the-fly page loading.
		 *
		 * I found 'soft-nav:progress-bar:start' in a call stack in GitHub's
		 * own JS, and just tried replacing "start" with "end".  So far, seems
		 * to work fine.
		 */
		setUpReadder(ensureButtonFn) {
			/*
			 * When user clicks on another commit, e.g. on the parent commit.
			 */
			document.addEventListener('soft-nav:progress-bar:end', (event) => {
				this.#maybeEnsureButton('progress-bar:end', ensureButtonFn);
			});
			/*
			 * When user goes back or forward in browser's history.
			 */
			window.addEventListener('popstate', (event) => {
				/*
				 * Delay is needed, because 'popstate' seems to be
				 * triggered with old DOM.
				 */
				setTimeout(() => {
					debug('After timeout:');
					this.#maybeEnsureButton('popstate', ensureButtonFn);
				}, 100);
			});
			info('GitHub: added re-adder listeners');
		}

		/*
		 * Cache of JSON loaded from REST API.
		 * Caching is needed to avoid multiple REST API requests
		 * for various methods that need access to the JSON.
		 */
		#commitJson = null;

		#onPageChange() {
			this.#commitJson = null;
		}

		/*
		 * Downloads JSON object corresponding to the commit via REST API
		 * of GitHub.  Reference documentation:
		 * https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#get-a-commit
		 */
		async #downloadJson(hash) {
			if (this.#commitJson != null) {
				return this.#commitJson;
			}
			try {
				const commitRestUrl = GitHub.#getCommitRestApiUrl(hash);
				info(`GitHub: Fetching "${commitRestUrl}"...`);
				const commitResponse = await fetch(commitRestUrl, GitHub.#getRestApiOptions());
				this.#commitJson = await commitResponse.json();
				return this.#commitJson;
			} catch (e) {
				error("GitHub: cannot fetch commit JSON from REST API", e);
				return null;
			}
		}

		static #getApiHostUrl() {
			const host = document.location.host;
			return `https://api.${host}`;
		}

		static #getCommitRestApiUrl(hash) {
			/*
			 * Format: /repos/{owner}/{repo}/commits/{ref}
			 *   - NOTE: plural "commits" in the URL!!!
			 * Examples:
			 *   - https://api.github.com/repos/git/git/commits/1f0fc1db8599f87520494ca4f0e3c1b6fabdf997
			 *   - https://api.github.com/repos/rybak/atlassian-tweaks/commits/a76a9a6e993a7a0e48efabdd36f4c893317f1387
			 */
			const apiHostUrl = GitHub.#getApiHostUrl();
			const ownerSlashRepo = document.querySelector('[data-current-repository]').getAttribute('data-current-repository');
			return `${apiHostUrl}/repos/${ownerSlashRepo}/commits/${hash}`;
		}

		static #getRestApiOptions() {
			const myHeaders = new Headers();
			myHeaders.append("Accept", "application/vnd.github+json");
			const myInit = {
				headers: myHeaders,
			};
			return myInit;
		}

		/*
		 * Inserts an HTML anchor to link to issues and pull requests, which are
		 * mentioned in the provided `text` in the `#<number>` format.
		 */
		static #insertIssuePrLinks(text) {
			if (!text.toLowerCase().includes('#')) {
				return text;
			}
			try {
				// a hack: just get the existing HTML from the GUI
				// the hack probably doesn't work very well with overly long subject lines
				// TODO: proper conversion of `text`
				//       though a shorter version (with ellipsis) might be better for HTML version
				return document.querySelector('.CommitHeader-module__commit-message-container--nl1pf > span > div').innerHTML.trim();
			} catch (e) {
				error("GitHub: cannot insert issue or pull request links", e);
				return text;
			}
		}
	}

	CopyCommitReference.runForGitHostings(new GitHub());
})();
