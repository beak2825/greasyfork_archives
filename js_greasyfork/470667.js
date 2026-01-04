// ==UserScript==
// @name         Bitbucket: copy commit reference
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      18
// @description  Adds a "Copy commit reference" link to every commit page on Bitbucket Cloud and Bitbucket Server.
// @license      AGPL-3.0-only
// @author       Andrei Rybak
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @include      https://*bitbucket*/*/commits/*
// @match        https://bitbucket.example.com/*/commits/*
// @match        https://bitbucket.org/*/commits/*
// @icon         https://bitbucket.org/favicon.ico
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @require      https://cdn.jsdelivr.net/gh/rybak/copy-commit-reference-userscript@4f71749bc0d302d4ff4a414b0f4a6eddcc6a56ad/copy-commit-reference-lib.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470667/Bitbucket%3A%20copy%20commit%20reference.user.js
// @updateURL https://update.greasyfork.org/scripts/470667/Bitbucket%3A%20copy%20commit%20reference.meta.js
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

/*
 * Public commits to test Bitbucket Cloud:
 * - Regular commit with Jira issue
 *   https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/1e7277348eb3f7b1dc07b4cc035a6d82943a410f
 * - Merge commit with PR mention
 *   https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/7dbe5402633c593021de6bf203278e2c6599c953
 * - Merge commit with mentions of Jira issue and PR
 *   https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/19ca4f537e454e15f4e3bf1f88ebc43c0e9c559a
 */

(function () {
	'use strict';

	const LOG_PREFIX = '[Bitbucket: copy commit reference]:';
	const CONTAINER_ID = "BBCCR_container";

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
	 * Implementation for Bitbucket Cloud.
	 *
	 * Example URLs for testing:
	 *   - Regular commit with Jira issue
	 *     https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/1e7277348eb3f7b1dc07b4cc035a6d82943a410f
	 *   - Merge commit with PR mention
	 *     https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/7dbe5402633c593021de6bf203278e2c6599c953
	 *   - Merge commit with mentions of Jira issue and PR
	 *     https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/19ca4f537e454e15f4e3bf1f88ebc43c0e9c559a
	 *
	 * Unfortunately, some of the minified/mangled selectors are prone to bit rot.
	 */
	class BitbucketCloud extends GitHosting {
		getLoadedSelector() {
			return '[data-aui-version]';
		}

		isRecognized() {
			// can add more selectors to distinguish from Bitbucket Server, if needed
			return document.querySelector('meta[name="bb-view-name"]') != null;
		}

		getTargetSelector() {
			/*
			 * Box with "Jane Doe authored and John Doe committed deadbeef"
			 *          "YYYY-MM-DD"
			 */
			return '[data-testid="profileCardTrigger"] + div';
		}

		getFullHash() {
			/*
			 * "View source" button on the right.
			 */
			const a = document.querySelector('#root [data-testid="settingsButton"]')?.parentNode.querySelector('a');
			const href = a.getAttribute('href');
			debug("BitbucketCloud:", href);
			return href.slice(-41, -1);
		}

		async getDateIso(hash) {
			const json = await this.#downloadJson();
			return json.date.slice(0, 'YYYY-MM-DD'.length);
		}

		getCommitMessage() {
			const commitMsgContainer = document.getElementById('main').querySelector('div > div > div > div > div > div:has(> p)');
			return commitMsgContainer.innerText;
		}

		async convertPlainSubjectToHtml(plainTextSubject) {
			/*
			 * The argument `plainTextSubject` is ignored, because
			 * we just use JSON from REST API.
			 */
			const json = await this.#downloadJson();
			return BitbucketCloud.#firstHtmlParagraph(json.summary.html);
		}

		wrapButtonContainer(container) {
			container.style = 'margin-left: 1em;';
			return container;
		}

		getButtonTagName() {
			return 'button'; // like Bitbucket's buttons "Approve" and "Settings" on a commit's page
		}

		wrapButton(button) {
			try {
				const icon = document.querySelector('[aria-label="copy commit hash"] svg').cloneNode(true);
				icon.classList.add('css-bwxjrz', 'css-snhnyn'); // same classes as <span>s inside "Approve" button
				const buttonText = this.getButtonText();
				button.replaceChildren(icon, document.createTextNode(` ${buttonText}`));
				const settingsButton = document.querySelector('#root [data-testid="settingsButton"]');
				button.classList.add(settingsButton.classList);
			} catch (e) {
				warn('BitbucketCloud: cannot find icon of "copy commit hash"');
			}
			button.title = "Copy commit reference to clipboard";
			return button;
		}

		/*
		 * Adapted from native CSS class `.bqjuWQ`, as of 2023-09-02.
		 */
		createCheckmark() {
			const checkmark = super.createCheckmark();
			checkmark.style.backgroundColor = 'rgb(23, 43, 77)';
			checkmark.style.borderRadius = '3px';
			checkmark.style.boxSizing = 'border-box';
			checkmark.style.color = 'rgb(255, 255, 255)';
			checkmark.style.fontSize = '12px';
			checkmark.style.lineHeight = '1.3';
			checkmark.style.padding = '2px 6px';
			checkmark.style.top = '0'; // this puts the checkmark ~centered w.r.t. the button
			return checkmark;
		}

		static #isABitbucketCommitPage() {
			const p = document.location.pathname;
			if (p.endsWith("commits") || p.endsWith("commits/")) {
				info('BitbucketCloud: MutationObserver <title>: this URL does not need the copy button');
				return false;
			}
			if (p.lastIndexOf('/') < 10) {
				return false;
			}
			if (!p.includes('/commits/')) {
				return false;
			}
			// https://stackoverflow.com/a/10671743/1083697
			const numberOfSlashes = (p.match(/\//g) || []).length;
			if (numberOfSlashes < 4) {
				info('BitbucketCloud: This URL does not look like a commit page: not enough slashes');
				return false;
			}
			info('BitbucketCloud: this URL needs a copy button');
			return true;
		}

		#currentUrl = document.location.href;

		#maybePageChanged(eventName, ensureButtonFn) {
			info("BitbucketCloud: triggered", eventName);
			const maybeNewUrl = document.location.href;
			if (maybeNewUrl != this.#currentUrl) {
				this.#currentUrl = maybeNewUrl;
				info(`BitbucketCloud: ${eventName}: URL has changed:`, this.#currentUrl);
				this.#onPageChange();
				if (BitbucketCloud.#isABitbucketCommitPage()) {
					ensureButtonFn();
				}
			} else {
				info(`BitbucketCloud: ${eventName}: Same URL. Skipping...`);
			}
		}

		setUpReadder(ensureButtonFn) {
			const observer = new MutationObserver((mutationsList) => {
				this.#maybePageChanged('MutationObserver <title>', ensureButtonFn);
			});
			info('BitbucketCloud: MutationObserver <title>: added');
			observer.observe(document.querySelector('head'), { subtree: true, characterData: true, childList: true });
			/*
			 * When user goes back or forward in browser's history.
			 */
			/*
			 * It seems that there is a bug on bitbucket.org
			 * with history navigation, so this listener is
			 * disabled
			 */
			/*
			window.addEventListener('popstate', (event) => {
				setTimeout(() => {
					this.#maybePageChanged('popstate', ensureButtonFn);
				}, 100);
			});
			*/
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
		 * of Bitbucket Cloud.
		 */
		async #downloadJson() {
			if (this.#commitJson != null) {
				return this.#commitJson;
			}
			try {
				// TODO better way of getting projectKey and repositorySlug
				const mainSelfLink = document.querySelector('nav[aria-label="Breadcrumbs"] > ol > li:nth-child(3) > a');
				// slice(1, -3) is needed to cut off `/src`
				const projectKeyRepoSlug = mainSelfLink.getAttribute('href').slice(1, -3);
				debug('#downloadJson:', 'projectKeyRepoSlug =', projectKeyRepoSlug);

				const commitHash = this.getFullHash();
				/*
				 * REST API reference documentation:
				 * https://developer.atlassian.com/cloud/bitbucket/rest/api-group-commits/#api-repositories-workspace-repo-slug-commit-commit-get
				 */
				const commitRestUrl = `/!api/2.0/repositories/${projectKeyRepoSlug}/commit/${commitHash}?fields=%2B%2A.rendered.%2A`;
				info(`BitbucketCloud: Fetching "${commitRestUrl}"...`);
				const commitResponse = await fetch(commitRestUrl);
				this.#commitJson = await commitResponse.json();
				return this.#commitJson;
			} catch (e) {
				error("BitbucketCloud: cannot fetch commit JSON from REST API", e);
			}
		}

		/*
		 * Extracts first <p> tag out of the provided `html`.
		 */
		static #firstHtmlParagraph(html) {
			const OPEN_P_TAG = '<p>';
			const CLOSE_P_TAG = '</p>';
			const startP = html.indexOf(OPEN_P_TAG);
			const endP = html.indexOf(CLOSE_P_TAG);
			if (startP < 0 || endP < 0) {
				return html;
			}
			return html.slice(startP + OPEN_P_TAG.length, endP);
		}
	}

	/*
	 * Implementation for Bitbucket Server.
	 */
	class BitbucketServer extends GitHosting {
		/**
		 * This selector is used for {@link isRecognized}.  It is fine to
		 * use a selector specific to commit pages for recognition of
		 * BitbucketServer, because it does full page reloads when
		 * clicking to a commit page.
		 */
		static #SHA_LINK_SELECTOR = '.commit-badge-oneline .commit-details .commitid';
		static #BITBUCKET_SERVER_8_COMMIT_HASH = '#commit-details-container .commit-hash a';

		getLoadedSelector() {
			/*
			 * Same as in BitbucketCloud, but that's fine.  Their
			 * implementations of `isRecognized` are different and
			 * that will allow the script to distinguish them.
			 */
			return '[data-aui-version]';
		}

		isRecognized() {
			return document.querySelector(BitbucketServer.#SHA_LINK_SELECTOR) != null ||
				document.querySelector(BitbucketServer.#BITBUCKET_SERVER_8_COMMIT_HASH != null) ||
				document.querySelector('html.cm-s-stash-default') != null;
		}

		getTargetSelector() {
			return '.plugin-section-secondary, .commit-details-summary-panel';
		}

		wrapButtonContainer(container) {
			container.classList.add('plugin-item');
			return container;
		}

		wrapButton(button) {
			// take CSS classes from a similar button
			const downloadSourceButton = document.querySelector('.commit-details a[data-testid="download-commit"]');
			const downloadSourceIcon = downloadSourceButton.querySelector('span:nth-child(1)');
			const downloadSourceText = downloadSourceButton.querySelector('span:nth-child(2)');

			const icon = document.createElement('span');
			icon.classList.add('aui-icon', 'aui-icon-small', 'aui-iconfont-copy',
				downloadSourceIcon.classList[0]);
			icon.style.width = '24px';
			const buttonText = this.getButtonText();
			const buttonTextSpan = document.createElement('span');
			buttonTextSpan.classList.add(downloadSourceText.classList[0]);
			buttonTextSpan.appendChild(document.createTextNode(` ${buttonText}`));
			button.classList.add(downloadSourceButton.classList[0]);
			button.replaceChildren(icon, buttonTextSpan);
			button.title = "Copy commit reference to clipboard";
			return button;
		}

		createCheckmark() {
			const checkmark = super.createCheckmark();
			// positioning
			checkmark.style.left = 'unset';
			checkmark.style.right = 'calc(100% + 24px + 0.5rem)';
			/*
			 * Layout for CSS selectors for classes .typsy and .tipsy-inner
			 * are too annoying to replicate here, so just copy-paste the
			 * look and feel bits.
			 */
			checkmark.style.fontSize = '12px'; // taken from class .tipsy
			// the rest -- from .tipsy-inner
			checkmark.style.backgroundColor = "#172B4D";
			checkmark.style.color = "#FFFFFF";
			checkmark.style.padding = "5px 8px 4px 8px";
			checkmark.style.borderRadius = "3px";
			return checkmark;
		}

		getFullHash() {
			return this.onAuiVersion(
				() => {
					const commitAnchor = document.querySelector(BitbucketServer.#SHA_LINK_SELECTOR);
					const commitHash = commitAnchor.getAttribute('data-commitid');
					return commitHash;
				}, () => {
					const commitAnchor = document.querySelector(BitbucketServer.#BITBUCKET_SERVER_8_COMMIT_HASH);
					return commitAnchor.href.slice(-40, -1);
				}
			);
		}

		async getDateIso(commitHash) {
			return this.#getApiDateIso(commitHash);
		}

		getCommitMessage(hash) {
			return this.onAuiVersion(
				() => {
					const commitAnchor = document.querySelector(BitbucketServer.#SHA_LINK_SELECTOR);
					const commitMessage = commitAnchor.getAttribute('data-commit-message');
					return commitMessage;
				},
				() => {
					return document.querySelector('#commit-details-container .commit-message').innerText;
				}
			);
		}

		async convertPlainSubjectToHtml(plainTextSubject, commitHash) {
			const escapedHtml = await super.convertPlainSubjectToHtml(plainTextSubject, commitHash);
			return await this.#insertPrLinks(await this.#insertJiraLinks(escapedHtml), commitHash);
		}

		/*
		 * Extracts Jira issue keys from the Bitbucket UI.
		 * Works only in Bitbucket Server so far.
		 * Not needed for Bitbucket Cloud, which uses a separate REST API
		 * request to provide the HTML content for the clipboard.
		 */
		#getIssueKeys() {
			const issuesElem = document.querySelector('.plugin-section-primary .commit-issues-trigger');
			if (!issuesElem) {
				if (!issuesElem) {
					info("Newer version of Bitbucket Server with mangled CSS classes. Hold onto your butt.");
					const keys = new Set();
					document.querySelectorAll('[data-issuekey]').forEach(a => keys.add(a.dataset.issuekey));
					const array = Array.from(keys);
					if (array.length === 0) {
						warn("Cannot find issues elements for Jira integration.");
					}
					return array;
				}
				return [];
			}
			const issueKeys = issuesElem.getAttribute('data-issue-keys').split(',');
			return issueKeys;
		}

		/*
		 * Returns the URL to a Jira issue for given key of the Jira issue.
		 * Uses Bitbucket's REST API for Jira integration (not Jira API).
		 * A Bitbucket instance may be connected to several Jira instances
		 * and Bitbucket doesn't know for which Jira instance a particular
		 * issue mentioned in the commit belongs.
		 */
		async #getIssueUrl(issueKey) {
			const projectKey = document.querySelector('[data-projectkey]').getAttribute('data-projectkey');
			/*
			 * This URL for REST API doesn't seem to be documented.
			 * For example, `jira-integration` isn't mentioned in
			 * https://docs.atlassian.com/bitbucket-server/rest/7.21.0/bitbucket-jira-rest.html
			 *
			 * I've found out about it by checking what Bitbucket
			 * Server's web UI does when clicking on the Jira
			 * integration link on a commit's page.
			 */
			const response = await fetch(`${document.location.origin}/rest/jira-integration/latest/issues?issueKey=${issueKey}&entityKey=${projectKey}&fields=url&minimum=10`);
			const data = await response.json();
			return data[0].url;
		}

		async #insertJiraLinks(text) {
			const issueKeys = this.#getIssueKeys();
			if (issueKeys.length == 0) {
				debug("Found zero issue keys.");
				return text;
			}
			debug("issueKeys:", issueKeys);
			for (const issueKey of issueKeys) {
				if (text.includes(issueKey)) {
					try {
						const issueUrl = await this.#getIssueUrl(issueKey);
						text = text.replace(issueKey, `<a href="${issueUrl}">${issueKey}</a>`);
					} catch (e) {
						warn(`Cannot load Jira URL from REST API for issue ${issueKey}`, e);
					}
				}
			}
			return text;
		}

		#getProjectKey() {
			return document.querySelector('[data-project-key]').getAttribute('data-project-key');
		}

		#getRepositorySlug() {
			return document.querySelector('[data-repository-slug]').getAttribute('data-repository-slug');
		}

		/*
		 * Loads from REST API the pull requests, which involve the given commit.
		 *
		 * Tested only on Bitbucket Server.
		 * Shouldn't be used on Bitbucket Cloud, because of the extra request
		 * for HTML of the commit message.
		 */
		async #getPullRequests(commitHash) {
			const projectKey = this.#getProjectKey();
			const repoSlug = this.#getRepositorySlug();
			const url = `/rest/api/latest/projects/${projectKey}/repos/${repoSlug}/commits/${commitHash}/pull-requests?start=0&limit=25`;
			try {
				const response = await fetch(url);
				const obj = await response.json();
				return obj.values;
			} catch (e) {
				error(`Cannot getPullRequests url="${url}"`, e);
				return [];
			}
		}

		/*
		 * Inserts an HTML anchor to link to the pull requests, which are
		 * mentioned in the provided `text` in the format that is used by
		 * Bitbucket's default automatic merge commit messages.
		 *
		 * Tested only on Bitbucket Server.
		 * Shouldn't be used on Bitbucket Cloud, because of the extra request
		 * for HTML of the commit message.
		 */
		async #insertPrLinks(text, commitHash) {
			if (!text.toLowerCase().includes('pull request')) {
				return text;
			}
			try {
				const prs = await this.#getPullRequests(commitHash);
				/*
				 * Find the PR ID in the text.
				 * Assume that there should be only one.
				 */
				const m = new RegExp('pull request [#](\\d+)', 'gmi').exec(text);
				if (m.length != 2) {
					return text;
				}
				const linkText = m[0];
				const id = parseInt(m[1]);
				for (const pr of prs) {
					if (pr.id == id) {
						const prUrl = pr.links.self[0].href;
						text = text.replace(linkText, `<a href="${prUrl}">${linkText}</a>`);
						break;
					}
				}
				return text;
			} catch (e) {
				error("Cannot insert pull request links", e);
				return text;
			}
		}

		async #getApiDateIso(commitHash) {
			const t = await this.#getApiTimestamp(commitHash);
			const d = new Date(t);
			return d.toISOString().slice(0, 'YYYY-MM-DD'.length);
		}

		async #getApiTimestamp(commitHash) {
			const projectKey = this.#getProjectKey();
			const repoSlug = this.#getRepositorySlug();
			const url = `/rest/api/latest/projects/${projectKey}/repos/${repoSlug}/commits/${commitHash}`;
			try {
				const response = await fetch(url);
				const obj = await response.json();
				return obj.authorTimestamp;
			} catch (e) {
				error(`Cannot getApiTimestamp url="${url}"`, e);
				return NaN;
			}
		}

		onAuiVersion(eight, nine) {
			if (parseInt(document.body.dataset.auiVersion.split('.')[0]) > 8) {
				return nine();
			} else {
				return eight();
			}
		}
	}

	CopyCommitReference.runForGitHostings(new BitbucketCloud(), new BitbucketServer());
})();
