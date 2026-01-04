// ==UserScript==
// @name         Wiktionary↔️Emojipedia
// @namespace    https://github.com/rybak
// @version      11
// @description  Adds links from every Emojipedia page to Wiktionary and vice versa.
// @icon         https://emojipedia.org/images/android-chrome-192x192.png
// @author       Andrei Rybak
// @license      MIT
// @match        https://emojipedia.org/*
// @exclude      https://emojipedia.org/_next/*
// @match        https://beta.emojipedia.org/*
// @match        https://en.wiktionary.org/wiki/*
// @match        https://en.wiktionary.org/w/index.php?title=*
// @match        https://en.m.wiktionary.org/wiki/*
// @match        https://en.m.wiktionary.org/w/index.php?title=*
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471598/Wiktionary%E2%86%94%EF%B8%8FEmojipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/471598/Wiktionary%E2%86%94%EF%B8%8FEmojipedia.meta.js
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
/* globals waitForElement */

(function() {
	'use strict';

	const LOG_PREFIX = '[Wiktionary↔️Emojipedia]';

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

	/**
	 * Testing going to an emoji article from:
	 * - full load/reload
	 * - one emoji via "Goes Great With" section
	 * - list article, like https://emojipedia.org/objects to an emoji
	 * - search results
	 */
	function emojipedia() {
		const EMOJI_ELEMENT_SELECTOR = "main section .Emoji_emoji__vbZHi";
		const WIKTIONARY_LINK_ID = 'WIKTIONARY_LINK';
		const TABS_ELEMENT_SELECTOR = '.Tabs_tab-list__lr5yK';
		const EMOJI_ATTRIBUTE_NAME = 'WIKT_EMOJI';
		let attemptCount = 0;

		function createWiktionaryLink(emoji) {
			const wiktionaryLink = document.createElement('a');
			wiktionaryLink.id = WIKTIONARY_LINK_ID;
			wiktionaryLink.href = 'https://en.wiktionary.org/wiki/' + emoji;
			wiktionaryLink.text = "Wiktionary";
			wiktionaryLink.title = `Article about ${emoji} on English Wiktionary`;
			wiktionaryLink.classList.add('Tabs_tab__CZNPx');
			/*wiktionaryLink.style = `
  display: block;
  border-bottom-width: 2px;
  border-color: transparent;
  padding: 6px .5rem .25rem;
  font-size: .875rem;
  line-height: 1.25rem;
  color: hsla(0,0%,100%,.6);
  text-decoration-line: none;
			`;*/
			wiktionaryLink.setAttribute(EMOJI_ATTRIBUTE_NAME, emoji);
			return wiktionaryLink;
		}

		let observer;

		function setUpObserver() {
			if (observer != null) {
				info("Disconnected previous observer");
				observer.disconnect();
			}
			observer = new MutationObserver(mutations => {
				debug("Mutation");
				if (document.location.pathname == '/search') {
					info('Not needed on a search results page. Aborting.');
					return;
				}
				if (!document.title.includes(' Emoji |')) {
					info('Does not look like an article page about an emoji (document.title). Aborting.');
					return;
				}
				if (!isCurrentEmojiLinkPresent(null)) {
					info(`No link with id=${WIKTIONARY_LINK_ID}. Adding...`);
					ensureWiktionaryLink();
				}
			});
			const observed = getObserverTarget();
			observer.observe(observed, {
				childList: true,
				subtree: true,
				characterData: true
			});
			info("Added observer to", observed, observed.isConnected);
		}

		function getEmoji() {
			return document.querySelector(EMOJI_ELEMENT_SELECTOR)?.innerText;
		}

		function isCurrentEmojiLinkPresent(emoji) {
			if (!emoji) {
				emoji = getEmoji();
			}
			const maybe = document.getElementById(WIKTIONARY_LINK_ID);
			if (maybe != null && maybe.isConnected && maybe.getAttribute(EMOJI_ATTRIBUTE_NAME) == emoji) {
				info(`Link with id=${WIKTIONARY_LINK_ID} for the emoji '${emoji}' is already in the document.`);
				return true;
			}
			return false;
		}

		function getMainSection() {
			return document.querySelector('.MainSection_main-section__waXVp');
		}

		function getObserverTarget() {
			return document.body;
		}

		function removePrevious() {
			const maybe = document.getElementById(WIKTIONARY_LINK_ID);
			if (maybe) {
				maybe.parentNode.removeChild(maybe);
			}
		}

		function ensureWiktionaryLink() {
			attemptCount++;
			info("Attempt #", attemptCount);

			if (isCurrentEmojiLinkPresent(null)) {
				debug("Adding observer...");
				setUpObserver();
				return;
			}
			debug("Waiting for tabs to load...");

			waitForElement(TABS_ELEMENT_SELECTOR).then(tabsElement => {
				debug("Waiting for main emoji display to load...");
				waitForElement(EMOJI_ELEMENT_SELECTOR).then(emojiElement => {
					const emoji = emojiElement.innerText;
					info("Found emoji:", emoji);

					if (isCurrentEmojiLinkPresent(emoji)) {
						return;
					}

					info("Adding Wiktionary link to the tabs...");
					removePrevious();
					const wiktionaryLink = createWiktionaryLink(emoji);
					// re-query to ensure its fresh
					tabsElement = document.querySelector(TABS_ELEMENT_SELECTOR);
					tabsElement.append(wiktionaryLink);
					if (!isCurrentEmojiLinkPresent(emoji)) {
						warn("Did not add the link.");
					} else {
						info("Seems to have been added", emojiElement);
					}
					setUpObserver();
				});
			});
		}
		// the Emojipedia website is weird -- the added elements don't stick
		// is this some React-or-similar trickery?
		try {
			setTimeout(ensureWiktionaryLink, 1000);
		} catch (e) {
			error("Could not add Wiktionary link. Got error:", e);
		}
	}

	function wiktionary() {
		waitForElement('.character-sample-primary').then(characterSample => {
			try {
				const emoji = characterSample.innerText;
				debug("Found emoji:", emoji);
				/*
				 * Container with links to https://util.unicode.org and
				 * https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
				 */
				const linkContainer = characterSample.parentElement.parentElement.querySelector('td:nth-child(2)');
				const sampleName = linkContainer.querySelector('.character-sample-name');
				const ourContainer = document.createElement('span');
				ourContainer.append(", "); // to separate our link from previous two links
				const emojipediaLink = document.createElement('a');
				emojipediaLink.href = 'https://emojipedia.org/' + emoji;
				emojipediaLink.text = `📙/${emoji}`;
				emojipediaLink.title = `Page about ${emoji} on Emojipedia`;
				ourContainer.append(emojipediaLink);
				// the layout of linkContainer is: "<link1><comma><link2><whitespace><sampleName>";
				linkContainer.insertBefore(ourContainer, sampleName);
				info("Added Emojipedia link. URL:", emojipediaLink.href);
			} catch (e) {
				error("Could not add Emojipedia link. Got error:", e);
			}
		});
	}

	switch (document.location.host) {
		case 'en.wiktionary.org':
		case 'en.m.wiktionary.org':
			info("Detected Wiktionary", document.location);
			wiktionary();
			break;
		case 'beta.emojipedia.org':
		case 'emojipedia.org':
			info("Detected Emojipedia", document.location);
			emojipedia();
			break;
		default:
			error("Unrecognized domain:", document.location.host);
			break;
	}
})();