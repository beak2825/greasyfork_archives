// ==UserScript==
// @name         Jira copy summary
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      5.1
// @license      MIT
// @description  Adds a "Copy summary" button for issue pages on Jira.
// @author       Sergey Lukashevich, Andrei Rybak, Dmitry Trubin
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @include      https://*jira*/browse/*
// @match        https://jira.example.com/browse/*
// @match        https://jira.example.com/browse/*
// @icon         https://jira.atlassian.com/favicon.ico
//
// @require      https://cdn.jsdelivr.net/gh/odyniec/MonkeyConfig@0eaeb525733a36d9e721ec4d9cf3b744b527bfcf/monkeyconfig.js
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
//
// @downloadURL https://update.greasyfork.org/scripts/475815/Jira%20copy%20summary.user.js
// @updateURL https://update.greasyfork.org/scripts/475815/Jira%20copy%20summary.meta.js
// ==/UserScript==

/*
 * Copyright 2017-2023 Sergey Lukashevich
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
version 5.1
	- handling of ticket summaries with angle brackets "<>" has been fixed
version 5.0
	- Jira 9 is now supported in addition to versions 7 and 8.
version 4.6
	- More precise reference to monkeyconfig.js library.
version 4.5
	- Migrated to jsDelivr as CDN for library code
version 4.4
	- UX of copy-pasting the summary formatted with italics into a rich
	  text editor has been improved.  Now the text that you type after
	  pasting will not be formatted in italics automatically.
version 4.2
	- Styling of the button has been updated to be compatible with Jira
	  version 8.20.*
version 4.0
	- Resurrection of the button has been made more robust by relying on
	  Jira's own events about edits on the issue pages.
version 3.8
	- Italic formatting is now configurable via extension menu, and the
	  configuration persists across script updates.
version 3.7
	- User script now supports automatic updates via @updateURL.
version 3.6
	- User script now has @icon, which can be rendered by the browser
	  extension in the list of user scripts, dashboard, etc.
version 3.5
	- Adding italics to format the summary text is now "configurable" via a
	  constant in code.
version 3.4.1
	- Fixed the button not working in Jira 8
version 3.4
	- dependency on jQuery has been removed to improve compatibility with
	  different versions of Jira, which may use different versions of
	  jQuery themselves.
version 3.3
	- Compatibility with Jira 8 has been improved.
version 3.2
	- "Copy Summary" button will now work in "Detail View" of JQL search
	  results.
version 3.1
	- jQuery version has been downgraded to 1.7.2 to avoid clashing with
	  Jira's version of jQuery
version 3.0
	- Resurrection of the button has been made more aggressive to handle
	  more use-cases.
	- User script used to incorrectly use link or summary of a previously
	  opened ticket, which has been corrected.
version 2.2
	- Code clean up
version 2.1
	- Summary text (after ticket id) is italicized, to make it easier to see
	  where the summary ends
version 2.0
	- Jira 8 is now supported in addition to Jira 7
version 1.2
	- Button "Copy summary" no longer breaks after editing a Jira ticket
*/

(function () {
	'use strict';

	/*
	 * User configuration
	 */
	var cfg = new MonkeyConfig({
		title: 'Jira copy summary configuration',
		menuCommand: true,
		params: {
			italic_summary: {
				type: 'checkbox',
				default: true
			}
		}
	});

	function getMeta(metaName) {
		const metas = document.getElementsByTagName('meta');

		for (let i = 0; i < metas.length; i++) {
			if (metas[i].getAttribute('name') === metaName) {
				return metas[i].getAttribute('content');
			}
		}

		return '';
	}

	var textResult = '';
	var htmlResult = '';

	function handleCopyEvent(e) {
		var clipboardData;

		// Stop event propogation
		e.stopPropagation();
		e.preventDefault();

		clipboardData = e.clipboardData || window.clipboardData;
		clipboardData.setData('text/plain', textResult);
		clipboardData.setData('text/html', htmlResult);
	}

	var COPY_BUTTON_ID = "copycopy";
	var copyButton;

	function getJiraMajorVersion() {
		return document.querySelector('meta[name="application-name"]').attributes.getNamedItem("data-version").value.split(".")[0];
	}

	function createButtonForJira7() {
		var ul = document.createElement("ul");
		ul.classList.add("toolbar-group");
		ul.classList.add("pluggable-ops");

		var li = document.createElement("li");
		li.classList.add("toolbar-item");

		copyButton = document.createElement("a");
		copyButton.id = COPY_BUTTON_ID;
		copyButton.classList.add("toolbar-trigger");
		copyButton.classList.add("zeroclipboard-is-hover");
		copyButton.textContent = "Copy summary*";

		ul.appendChild(li);
		li.appendChild(copyButton);

		return ul;
	}

	function createButtonForJira8and9() {
		var div = document.createElement("div");
		div.id = "opsbar-copycopy_container"
		div.classList.add("aui-buttons");
		div.classList.add("pluggable-ops");

		copyButton = document.createElement("a");
		copyButton.id = COPY_BUTTON_ID;
		copyButton.classList.add("aui-button");
		copyButton.classList.add("toolbar-trigger");
		copyButton.textContent = "Copy summary*";

		div.appendChild(copyButton);

		return div;
	}

	function htmlEncode(s) {
		const tmp = document.createElement("div");
		tmp.appendChild(document.createTextNode(s));
		return tmp.innerHTML;
	}

	function getTextResult(ticketId, summaryText) {
		return '[' + ticketId + '] ' + summaryText;
	}

	function getHtmlResult(ticketId, summaryText) {
		const jiraUrl = getMeta("ajs-jira-base-url");
		const fullLink = jiraUrl + "/browse/" + ticketId;
		let htmlSummary = htmlEncode(summaryText);
		if (cfg.get('italic_summary')) {
			htmlSummary = '<i>' + htmlSummary + '</i> &#x200b;';
		}
		return '[<a href="' + fullLink + '">' + ticketId + '</a>] ' + htmlSummary;
	}

	function copyClickAction() {
		const summaryText = document.getElementById("summary-val").textContent;
		var ticketIdSource = document.querySelector("#dx-issuekey-val-h1 a");
		if (!ticketIdSource) {
			ticketIdSource = document.querySelector(".aui-page-header-main .issue-link");
		}
		const ticketId = ticketIdSource.dataset.issueKey;
		textResult = getTextResult(ticketId, summaryText);
		htmlResult = getHtmlResult(ticketId, summaryText);
		document.addEventListener('copy', handleCopyEvent);
		document.execCommand('copy');
		document.removeEventListener('copy', handleCopyEvent);
		return false;
	};

	function createButton() {
		try {
			copyButton = document.getElementById(COPY_BUTTON_ID);
			// if for some reason it doesn't exist - create one
			if (!copyButton) {
				const jiraMajorVersion = getJiraMajorVersion();
				var container;
				var button;
				switch (jiraMajorVersion) {
					case "7":
						container = document.getElementById("stalker").getElementsByClassName("toolbar-split toolbar-split-left")[0];
						button = createButtonForJira7();
						break;
					case "8":
					case "9":
						container = document.getElementById("stalker").getElementsByClassName("aui-toolbar2-primary")[0];
						button = createButtonForJira8and9();
						break;
					default:
						console.log("Jira v" + jiraMajorVersion + " is not supported");
						return;
				}
				container.appendChild(button);
				console.log("Created the button");
			} else {
				console.log("Using existing button");
			}
			copyButton.onclick = copyClickAction;
		} catch (e) {
			console.warn("Could not create 'Copy summary' button ", e);
		}
	}

	createButton();

	JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, () => {
		console.log("Something changed, recreating button...");
		createButton();
	});
})();
