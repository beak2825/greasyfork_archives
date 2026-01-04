// ==UserScript==
// @name         Confluence: copy link buttons
// @namespace    https://github.com/rybak
// @version      8
// @description  Adds buttons to copy a link to the current page directly into clipboard. Two buttons are supported: Markdown and Jira syntax. Both buttons support HTML for rich text editors.
// @author       Andrei Rybak
// @license      MIT
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @include      https://confluence*
// @match        https://confluence.example.com/*
// @icon         https://seeklogo.com/images/C/confluence-logo-D9B07137C2-seeklogo.com.png
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470384/Confluence%3A%20copy%20link%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/470384/Confluence%3A%20copy%20link%20buttons.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2023-2025 Andrei Rybak
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

/* jshint esversion: 6 */
/* globals waitForElement AJS */

(function() {
	'use strict';

	const LOG_PREFIX = '[Confluence copy link buttons]:';
	const PRIVATE_BUTTON_CLASS = 'atlassianTweaksCopyLinkButton';

	function debug(...toLog) {
		console.debug(LOG_PREFIX, ...toLog);
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

	function cloudCopyIcon() {
		// from "Duplicate" menu item
		return '<svg fill="none" viewBox="0 0 16 16" role="presentation" class="_1reo15vq _18m915vq _syaz1r31 _lcxvglyw _s7n4yfq0 _vc881r31 _1bsbpxbi _4t3ipxbi"><path fill="currentcolor" fill-rule="evenodd" d="M1 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM16 6v6.75A3.25 3.25 0 0 1 12.75 16H6v-1.5h6.75a1.75 1.75 0 0 0 1.75-1.75V6z" clip-rule="evenodd"></path></svg>';
	}

	/*
	 * Calls one of the parameters, based on the version of Confluence running.
	 * This is needed to account for the differences in HTML and CSS.
	 *
	 * Tested on versions:
	 * - Confluence Server 7.13.*
	 * - Confluence Server 7.19.*
	 * - Confluence Cloud 1000.0.0-22300355ddad (a free version on https://atlassian.net as of 2023-06-19)
	 */
	function onVersion(selfHostedFn, cloudFn) {
		if (document.querySelector('meta[name=ajs-cloud-id]')) {
			// It would seem that all Cloud instances of Confluece have this <meta> tag.
			return cloudFn();
		}
		/*
		 * Try to parse version number hidden in the <meta> tags.
		 * Assume Confluence Cloud, if can't parse.
		 */
		const maybeVersionElem = document.querySelector('meta[name=ajs-version-number]');
		if (maybeVersionElem) {
			const majorVersion = parseInt(maybeVersionElem.content);
			if (isNaN(majorVersion)) {
				warn("Cannot parse major version", maybeVersionElem.content);
				return cloudFn();
			}
			if (majorVersion >= 1000) {
				return cloudFn();
			} else {
				return selfHostedFn();
			}
		} else {
			warn("Couldn't find meta tag with version");
			return cloudFn();
		}
	}

	function addLinkToClipboard(event, plainText, html) {
		event.stopPropagation();
		event.preventDefault();

		let clipboardData = event.clipboardData || window.clipboardData;
		clipboardData.setData('text/plain', plainText);
		clipboardData.setData('text/html', html);
	}

	function getPageTitle() {
		try {
			return document.querySelector('meta[name="ajs-page-title"]').content;
		} catch (metaException) {
			warn('Could not access page title through meta tags:', metaException.message);
		}
		try {
			// `AJS` is defined in Confluence's own JS
			return AJS.Data.get('page-title');
		} catch (ajsException) {
			warn('Could not access page title through AJS:', ajsException.message);
		}
		try {
			const h1 = document.querySelector('[data-testid="title-wrapper"] #heading-title-text');
			return h1.innerText;
		} catch (h1Exception) {
			warn('Could not access page title through h1 tag:', h1Exception.message);
			return null;
		}
	}

	function copyClickAction(event, plainTextFn) {
		event.preventDefault();
		try {
			const pageTitle = getPageTitle();
			if (pageTitle === null) {
				error('Could not get the page title. Aborting.');
				return;
			}
			const url = document.location.href;
			if (document.location.hash.length !== 0) {
				/*
				 * cannot use `.querySelector(document.location.hash)` here,
				 * because IDs can be really weird
				 */
				const sectionName = document.getElementById(document.location.hash.slice(1)).innerText;
				pageTitle = `${pageTitle} § ${sectionName}`;
			}
			/*
			 * Using both plain text and HTML ("rich text") means that the copied links
			 * can be inserted both in plain text inputs (Jira syntax – for Jira, Markdown
			 * syntax – for Bitbucket, GitHub, etc) and in rich text inputs, such as
			 * Microsoft Word, Slack, etc.
			 */
			const plainText = plainTextFn(url, pageTitle);
			const html = htmlSyntaxLink(url, pageTitle);

			const handleCopyEvent = e => {
				addLinkToClipboard(e, plainText, html);
			};
			document.addEventListener('copy', handleCopyEvent);
			document.execCommand('copy');
			document.removeEventListener('copy', handleCopyEvent);
		} catch (e) {
			error('Could not do the copying', e);
		}
	}

	// adapted from https://stackoverflow.com/a/35385518/1083697 by Mark Amery
	function htmlToElement(html) {
		const template = document.createElement('template');
		template.innerHTML = html.trim();
		return template.content.firstChild;
	}

	function selfHostedButtonHtml(text, title) {
		const icon = '<span class="aui-icon aui-icon-small aui-iconfont-copy"></span>';
		return `<a href="#" class="aui-button aui-button-subtle" title="${title}"><span>${icon}${text}</span></a>`;
	}

	function cloudButtonHtml(text, title) {
		const hoverCss = `.${PRIVATE_BUTTON_CLASS}:hover {  background-color: var(--ds-background-neutral-subtle-hovered,#0515240f); }`; // copied from classes of "Share" button
		GM_addStyle(hoverCss);
		const icon = cloudCopyIcon();
		// HTML & CSS classes from the "Edit" button
		const editThisPageButton = document.querySelector('#editPageLink');
		const buttonClasses = editThisPageButton.className;
		const iconSpanClasses = editThisPageButton.children[0].className;
		const copyPastedCss = 'opacity: 1; transition: opacity 0.3s; margin: 0 2px;';
		// const textInnerSpanClasses = editThisPageButton.children[1].children[0].className;
		return htmlToElement(
			`<button class="${buttonClasses} ${PRIVATE_BUTTON_CLASS}" type="button" title="${title}">
			  <span class="${iconSpanClasses}" role="img" style="--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF);">${icon}</span>
			  <span style="${copyPastedCss}"><span>${text}</span></span>
			</button>`
		);
	}

	function copyButton(text, title, plainTextFn) {
		const onclick = (event) => copyClickAction(event, plainTextFn);

		return onVersion(
			() => {
				const copyButtonAnchor = htmlToElement(selfHostedButtonHtml(text, title));
				copyButtonAnchor.onclick = onclick;
				const copyButtonListItem = htmlToElement('<li class="ajs-button normal"></li>');
				copyButtonListItem.appendChild(copyButtonAnchor);
				return copyButtonListItem;
			},
			() => {
				const button = cloudButtonHtml(text, title);
				button.onclick = onclick;
				return button;
			}
		);
	}

	function htmlSyntaxLink(url, pageTitle) {
		const html = `<a href="${url}">${pageTitle}</a>`;
		return html;
	}

	function markdownSyntaxLink(url, pageTitle) {
		return `[${pageTitle}](${url})`;
	}

	function jiraSyntaxLink(url, pageTitle) {
		return `[${pageTitle}|${url}]`;
	}

	function insertBefore(newElem, oldElem) {
		oldElem.parentNode.insertBefore(newElem, oldElem);
	}

	function observeAndRecreate(container) {
		const observer = new MutationObserver(mutations => {
			info('Observer triggered...');
			observer.disconnect(); // must disconnect first to avoid infinite recursion
			document.querySelectorAll(`.${PRIVATE_BUTTON_CLASS}`).forEach(button => {
				button.remove();
			});
			createButtons();
		});
		observer.observe(container, {
			childList: true,
			subtree: true
		});
		info('Observer created');
	}

	function createButtons() {
		info('Creating buttons...');
		onVersion(
			() => waitForElement('#action-menu-link'),
			() => waitForElement('div[data-testid="share-action-container-without-separator"]')
		).then(target => {
			/*
			 * Buttons are added to the left of the `target` element.
			 */
			info('target', target);
			const markdownListItem = copyButton("[]()", "Copy Markdown link", markdownSyntaxLink);
			const jiraListItem = copyButton("[&#124;]", "Copy Jira syntax link", jiraSyntaxLink);
			insertBefore(markdownListItem, target);
			insertBefore(jiraListItem, target);
			info('Created buttons');
			onVersion(
				() => {
					// do nothing in self-hosted version
				},
				() => {
					// cloud needs extra step -- buttons get recreated on every "hover" event
					const container = document.getElementById('object-header-container-id').parentElement.parentElement.parentElement;
					debug(container);
					observeAndRecreate(container);
				}
			);
		});
	}
	// unsafeWindow.TWEAKS_PRIVATE_CREATE = createButtons;

	try {
		createButtons();
	} catch (e) {
		error('Could not create buttons', e);
	}
})();
