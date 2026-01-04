// ==UserScript==
// @name         *: accesskeys for search
// @namespace    https://github.com/rybak
// @version      0.19
// @description  Quick navigation to the search fields everywhere
// @homepageURL  https://greasyfork.org/en/scripts/542062-accesskeys-for-search
// @author       Andrei Rybak
// @license      MIT
// @match        https://letterboxd.com/*
// @match        https://myanimelist.net/*
// @match        https://myshows.me/*
// @match        https://youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://nyaa.si/*
// @match        https://*.fandom.com/*
// @match        https://forums.mangadex.org/*
// @match        https://mangadex.org/*
// @match        https://anilist.co/*
// @match        https://userstyles.world/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://boardgamegeek.com/*
// @match        https://greasyfork.org/*
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://developer.mozilla.org/*
// @match        https://news.ycombinator.com/
// @match        https://bsky.app/*
// @match        https://www.livechart.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542062/%2A%3A%20accesskeys%20for%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/542062/%2A%3A%20accesskeys%20for%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const LOG_PREFIX = '[accesskeys for search]';
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

	let timeout = 500;
	const MAX_TIMEOUT = 60000;

    function setUpAccesskey(key, selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute("accesskey", key);
			info(`Done for selector '${selector}'.`);
        } else {
			if (timeout >= MAX_TIMEOUT) {
				warn(`Assuming this page does not have the search field for selector '${selector}'. Aborting.`);
				return;
			}
			setTimeout(() => {
				setUpAccesskey(key, selector);
				timeout = Math.min(timeout * 2, MAX_TIMEOUT);
			}, timeout);
		}
    }

	function setUpSearchAccesskey(selector) {
		debug(`Using selector '${selector}'`);
		// using the key 'F' to mimic Wikipedia -- https://en.wikipedia.org/wiki/Help:Keyboard_shortcuts
		return setUpAccesskey('f', selector);
	}

	const SELECTORS = {
		'letterboxd.com': '.js-nav-search-toggle a.replace',
		'myanimelist.net': '#topSearchText',
		'myshows.me': '.Search-toggler',
		'youtube.com': '.ytSearchboxComponentInput.yt-searchbox-input',
		'music.youtube.com': 'input.ytmusic-search-box',
		'nyaa.si': 'nav input.search-bar',
		'fandom.com': 'input.search-app__input',
		'forums.mangadex.org': '.p-nav-row a.p-navgroup-link--search',
		'mangadex.org': 'input#header-search-input',
		'anilist.co': '#nav .search',
		'userstyles.world': 'nav .menu form.search input[type=search]',
		'x.com': 'input[aria-label="Search query"], input[data-testid="SearchBox_Search_Input"]',
		'twitter.com': 'input[aria-label="Search query"], input[data-testid="SearchBox_Search_Input"]',
		'boardgamegeek.com' : '#site-search, nav gg-search input',
		'greasyfork.org' : 'input[type="search"]',
		'reddit.com' : '#search > input[type="text"]', // works only on old reddit
		// 'plugins.jetbrains.com': '.header-search-form__search-icon', // doesn't work, because <svg> cannot be "clicked" from an accesskey
		'developer.mozilla.org': '#top-nav-search-input',
		// 'addons.mozilla.org': 'AutoSearchInput-q', // extensions aren't allowed on websites related to browser settings
		'news.ycombinator.com': '#hnmain tr#bigbox + tr form > input',
		'bsky.app': 'main + nav + div > div > div > div input[role="search"]',
		'livechart.me': 'header a.nav-link[href="/search"]',
		// '': '',
	};

	/*
	 * TODO: add a MutationObserver to restore the accesskey when the element gets recreated
	 */

	function getSelector() {
		const maybeByFullHostname = SELECTORS[document.location.hostname];
		if (maybeByFullHostname) {
			return maybeByFullHostname;
		}
		const domain = document.location.hostname.match(/[a-z-]*[.][a-z]*$/)[0];
		return SELECTORS[domain];
	}

    // Toggle search text field input
	setUpSearchAccesskey(getSelector());
})();