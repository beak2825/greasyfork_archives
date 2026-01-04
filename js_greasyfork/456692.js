// ==UserScript==
// @name         Jira: Pull Request Link Improver
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      13
// @license      MIT
// @description  Adds more convenient pull request links to Jira tickets.
// @author       Andrei Rybak
// @match        https://jira.example.com/browse/*
// @include      https://*jira*/browse/*
// @icon         https://jira.atlassian.com/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456692/Jira%3A%20Pull%20Request%20Link%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/456692/Jira%3A%20Pull%20Request%20Link%20Improver.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2022-2025 Andrei Rybak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
	'use strict';

	const LOG_PREFIX = '[PR Link Improver]';
	const PANEL_ID = 'PrLinksImproverPanel';
	const LIST_ID = 'PrLinksImproverList';
	const COPY_BUTTONS_CLASS = 'PrLinksImproverCopyButton';
	var loadInProgress = false;
	const PARSE_PATH = /[/](projects|users)[/]([^/]*)[/]repos[/]([^/]*)[/].*/;

	function log(...toLog) {
		console.log(LOG_PREFIX, ...toLog);
	}

	function info(...toLog) {
		console.info(LOG_PREFIX, ...toLog);
	}

	function warn(...toLog) {
		console.warn(LOG_PREFIX, ...toLog);
	}

	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}

	function getJiraMajorVersion() {
		return document.querySelector('meta[name="application-name"]').attributes.getNamedItem("data-version").value.split(".")[0];
	}

	function createPanel() {
		var header;
		const jiraMajorVersion = getJiraMajorVersion();
		switch (jiraMajorVersion) {
			case "7":
				header = '<div class="mod-header"><h2 class="toggle-title">Pull requests</h2></div>';
				break;
			case "8":
			case "9":
				header = '<div class="mod-header"><h4 class="toggle-title">Pull requests</h4></div>';
				break;
			default:
				warn("Jira v" + jiraMajorVersion + " is not supported");
				header = '<div class="mod-header"><h4 class="toggle-title">Pull requests</h4></div>';
				break;
		}
		$('#viewissue-devstatus-panel')
			.prepend($(header +
				`<div class="mod-content" id="${PANEL_ID}" style="margin-bottom:1rem;"></div>`));
	}

	function addError(errors) {
		for (const e of errors) {
			error("Error: " + e);
		}
		$(`#${PANEL_ID}`).append($(`<p>Could not load from Bitbucket. Got: ${errors}</p>`));
	}

	function extractProjectRepoSlugsFromPr(pr) {
		const url = pr.url;
		const path = new URL(url).pathname;
		const matching = path.match(PARSE_PATH);
		const project = matching[2];
		const repository = matching[3];
		return project + '/' + repository;
	}

	function extractRepoSlugFromPr(pr) {
		const url = pr.url;
		const path = new URL(url).pathname;
		const matching = path.match(PARSE_PATH);
		const repository = matching[3];
		return repository;
	}

	function createCopyLink(linkTextAdder, title, textSupplier) {
		const link = document.createElement('a');
		link.classList.add('aui-button');
		link.style.padding = '2px 4px';
		link.style.height = '1.8em';
		link.href = '#';
		link.title = title;
		linkTextAdder(link);
		link.onclick = e => {
			e.preventDefault();
			try {
				navigator.clipboard.writeText(textSupplier());
			} catch (e) {
				error('navigator.clipboard is not supported:', e)
			}
		};
		return link;
	}

	function createCopyLinkText(linkText, title, textSupplier) {
		return createCopyLink(
			link => link.appendChild(document.createTextNode(linkText)),
			title,
			textSupplier
		);
	}

	function formatMarkdownLink(pr) {
		const repository = extractRepoSlugFromPr(pr);
		return `[pull request ${pr.id} in ${repository}](${pr.url})`;
	}

	function formatJiraSyntaxLink(pr) {
		const repository = extractRepoSlugFromPr(pr);
		return `[pull request ${pr.id} in ${repository}|${pr.url}]`;
	}

	function createCopyLinks(pr) {
		const container = document.createElement('span');
		container.classList.add(COPY_BUTTONS_CLASS);

		container.append(
			createCopyLinkText('#', 'Copy PR number', () => pr.id),
			createCopyLinkText('/#', 'Copy PR number with project/repo slugs', () => extractProjectRepoSlugsFromPr(pr) + pr.id),
			createCopyLinkText('[]()', 'Copy Markdown link to the PR', () => formatMarkdownLink(pr)),
			createCopyLinkText('[|]', 'Copy Jira link to the PR', () => formatJiraSyntaxLink(pr)),
			createCopyLink(
				link => {
					const span = document.createElement('span');
					span.classList.add('aui-icon', 'aui-icon-small', 'aui-iconfont-devtools-branch-small');
					link.appendChild(span);
				},
				"Copy pull request's source branch's name",
				() => pr.source.branch
			)
		);

		return container;
	}

	function addPrLinks(pullRequests) {
		$(`#${PANEL_ID}`).append($(`<ul id="${LIST_ID}" class="item-details status-panels devstatus-entry"></ul>`));
		const list = $(`#${LIST_ID}`);
		for (const pr of pullRequests) {
			const url = pr.url;
			const prId = pr.id;
			const li = $('<li/>').appendTo(list);
			const slugsPrefix = extractProjectRepoSlugsFromPr(pr);
			const link = document.createElement('a');
			link.href = url;
			link.appendChild(document.createTextNode(`${prId}: ${pr.name}`));
			info("NAME='" + pr.name + "' issue='" + JIRA.Issue.getIssueKey() + "'");
			if (pr.name.includes(JIRA.Issue.getIssueKey())) {
				link.style.fontWeight = 'bold';
			}
			if (pr.status == "DECLINED") {
				link.style.textDecoration = 'line-through';
			}
			const copyLinks = createCopyLinks(pr);
			$(li).append(slugsPrefix).append(link).append(" ").append(copyLinks);
		}
	}

	function addStyles() {
		GM_addStyle(`.${COPY_BUTTONS_CLASS} {
	opacity: 0;
}
#${LIST_ID} li:hover .${COPY_BUTTONS_CLASS} {
	opacity: 1;
}
@keyframes fadeOut {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}`);
	}

	function addPrLinksPanel() {
		if ($(`#${PANEL_ID}`).length) {
			// the PR links panel has already been created
			loadInProgress = false;
			return;
		}
		addStyles();
		const issueId = JIRA.Issue.getIssueId();
		// https://community.atlassian.com/t5/Jira-questions/JIRA-REST-API-to-get-list-of-branches-related-to-a-issue/qaq-p/800389
		const pullRequestsUrl = `/rest/dev-status/1.0/issue/detail?issueId=${issueId}&applicationType=stash&dataType=pullrequest`;
		log("Loading: " + pullRequestsUrl);
		$.getJSON(pullRequestsUrl, data => {
			if ($(`#${PANEL_ID}`).length) {
				// the PR links panel has been created while we were getting the PR data
				loadInProgress = false;
				return;
			}
			createPanel();
			if (data.detail.length == 0) {
				addError(data.errors);
				loadInProgress = false;
				return;
			}
			const pullRequests = data.detail[0].pullRequests;
			addPrLinks(pullRequests);
			loadInProgress = false;
		});
	}

	function startPrLoading() {
		if (!loadInProgress) {
			loadInProgress = true;
			addPrLinksPanel();
		} else {
			log("Already loading. Skipping...");
		}
	}

	$(document).ready(startPrLoading);
	JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, startPrLoading);
})();
