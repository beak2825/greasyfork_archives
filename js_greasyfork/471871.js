// ==UserScript==
// @name           Twitter: bring back old name and logo
// @name:de        Twitter: alten Namen und Logo zurückbringen
// @name:nl        Twitter: oude naam en logo terugbrengen
// @name:es        Twitter: recupera el nombre y el logotipo antiguos
// @namespace      https://github.com/rybak
// @version        30.13
// @description    Changes the logo, tab name, and naming of "tweets" on Twitter
// @description:de Ändert das Logo, den Tab-Namen und die Benennung von „Tweets“ auf Twitter
// @description:nl Wijzigt het logo, de tabbladnaam en de naamgeving van "tweets" op Twitter
// @description:es Cambia el logo, nombre de la pestaña y denominación de los "tweets" en Twitter
// @author         Andrei Rybak
// @license        MIT
// @match          https://twitter.com/*
// @match          https://x.com/*
// @icon           https://abs.twimg.com/favicons/twitter.2.ico
// @grant          GM_addStyle
// @run-at         document-body
// @downloadURL https://update.greasyfork.org/scripts/471871/Twitter%3A%20bring%20back%20old%20name%20and%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/471871/Twitter%3A%20bring%20back%20old%20name%20and%20logo.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2023-2026 Andrei Rybak
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

/*
 * Things which surprisingly don't need replacing/renaming as of 2023-08-26:
 *
 *   1. "Scheduled Tweets" are still called "Tweets"
 *   2. "Based on your Retweets" in the "For you" tab. (not sure, needs rechecking)
 *
 * Things deliberately left with the new name:
 *
 *   1. "Post" in "Post Analytics" -- a rarely used feature, don't care.
 *   2. "X Corp." in the copyright line of the "footer" (it's in the right sidebar on the web version)
 *   3. Anything on subdomains: about.twitter.com, developer.twitter.com, etc.
 *   4. Tweets counters in "What's happening". It's algorithmic trash, hide it with https://userstyles.world/style/10864/twitter-hide-trends-and-who-to-follow
 */

(function() {
	'use strict';
	/*
	 * This is needed to replace the very first "X" in <title>, because
	 * proper renaming and the MutationObserver for <title> are going
	 * to be too late to fix it.
	 */
	document.title = "Twitter";

	const TWITTER_2012_ICON_URL = 'https://abs.twimg.com/favicons/twitter.2.ico';

	const LOG_PREFIX = "[old school Twitter]";
	const FAVICON_SELECTOR = 'link[rel="icon"], link[rel="shortcut icon"]';
	const DIALOG_TWEET_BUTTON_SELECTOR = 'button[data-testid="tweetButton"] > div > span > span';
	const RETWEETED_SELECTOR = '[data-testid="socialContext"]';
	const SHOW_N_TWEETS_SELECTOR = 'main div div section > div > div > div > div button[role="button"] > div > div > span';

	const DEBUG = false;

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
		if (DEBUG) {
			console.debug(LOG_PREFIX, ...toLog);
		}
	}

	const waitingObservers = new Map();

	class Ignorer {
		#selector;

		constructor(selector) {
			this.#selector = selector;
		}

		then() {
			// warn("Ignoring " + this.#selector);
		}
	}

	function uniqueWaitForElement(selector, needReplacing) {
		const oldObserver = waitingObservers.get(selector);
		if (oldObserver) {
			if (!needReplacing) {
				return new Ignorer(selector);
			} else {
				warn("Replaced waiting observer for ", selector);
				oldObserver.disconnect();
				waitingObservers.delete(selector);
			}
		}
		return new Promise(resolve => {
			const queryResult = document.querySelector(selector);
			if (queryResult) {
				return resolve(queryResult);
			}
			const observer = new MutationObserver(mutations => {
				const queryResult = document.querySelector(selector);
				if (queryResult) {
					/*
					 * Disconnect first, just in case the listeners
					 * on the returned Promise trigger the observer
					 * again.
					 */
					observer.disconnect();
					waitingObservers.delete(selector);
					resolve(queryResult);
				}
			});
			waitingObservers.set(selector, observer);
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	function replaceLogoOnLoadingScreen() {
		/*
		 * Fill is only for the light mode.
		 */
		GM_addStyle(`
			#placeholder > svg path {
				d: path("M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z");
			}
			#placeholder svg.r-18jsvk2 path {
				fill: #1DA1F2;
			}
		`);
	}

	/*
	 * Replace soul-less regular house icon with a birdhouse icon.
	 */
	function replaceBirdhouseHomeIcon() {
		const svgPathDark = 'M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z';
		// const svgPathLight = 'M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z';
		const linkSelector = 'nav > a[href="/home"]';
		GM_addStyle(`
			${linkSelector} svg path {
				d: path("${svgPathDark}");
			}
		`);
	}

	/*
	 * Adapted from https://userstyles.world/style/11077/old-twitter-logo
	 * by sapondanaisriwan. License: MIT.
	 */
	function replaceLogoInHeader() {
		GM_addStyle(`
			h1 svg path,
			[data-testid="TopNavBar"] div > div > div > div > div > div > div > svg path {
				d: path("M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z");
			}
			h1 svg.r-18jsvk2 path,
			div.r-6026j[data-testid="TopNavBar"] div > div > div > div > div > div > svg path {
				fill: #1DA1F2;
			}
		`);
	}

	function replaceLogo() {
		replaceLogoOnLoadingScreen();
		replaceLogoInHeader();
		replaceBirdhouseHomeIcon();
	}

	/*
	 * Replaces all tab icons, shortcut icons, and favicons
	 * with given `newUrl`.
	 */
	function setFavicon(newUrl) {
		const faviconNodes = document.querySelectorAll(FAVICON_SELECTOR);
		if (!faviconNodes || faviconNodes.length == 0) {
			error("Cannot find favicon elements.");
			return;
		}
		info("New URL", newUrl);
		faviconNodes.forEach(node => {
			info("Replacing old URL =", node.href);
			node.href = newUrl;
		});
	}

	function renameTwitterInTabName() {
		let t = document.title;
		if (t == "X") {
			t = "Twitter";
		}
		if (t.endsWith("/ X")) {
			t = t.replace("/ X", "/ Twitter");
		}
		if (t.includes(" on X: ")) {
			t = t.replace(" on X: ", " on Twitter: ");
		}
		if (t.startsWith("Compose new post")) {
			t = t.replace("Compose new post", "Compose new tweet");
		}
		if (t.startsWith("Posts with ")) {
			t = t.replace("Post", "Tweet");
		}
		if (t.startsWith("Quotes of this post ")) {
			t = t.replace("Quotes of this post ", "Quotes of this tweet ");
		}
		if (t != document.title) {
			document.title = t;
		}
	}

	/*
	 * Replaces text "123 posts" with "123 tweets" on user profile pages.
	 */
	function renameProfileTweetsCounter() {
		// Debug code for figuring out CSS selectors for mobile version
		/*
		const allDivs = document.querySelectorAll('div');
		for (const div of allDivs) {
			if (div.innerHTML.endsWith('posts')) {
				prompt('Classes ', div.classList);
				return;
			}
		}
		return;
		*/
		/*
		 * Tweets/Posts counters in user profiles are weird.  Their nesting/wrapping
		 * depends on the theme and on mobile vs desktop.
		 * By "theme" I mean "More > Settings and Support > Display > Background".
		 */
		// <h2> tag = user's name in the header, right above the tweet counter
		const commonDesktopSelector = 'h2 + div:not(#layers)';
		// mobile selector wasn't updated in v27.3 and in v29.4
		const commonMobileSelector = '.css-901oao.css-1hf3ou5.r-37j5jr.r-1b43r93.r-16dba41.r-14yzgew.r-bcqeeo.r-qvutc0';
		const POSTS_SELECTOR = `${commonDesktopSelector}, ${commonMobileSelector}`;
		uniqueWaitForElement(POSTS_SELECTOR).then(postsElement => {
			try {
				const s = postsElement.innerText;
				if (s.includes('tweets')) {
					return;
				}
				const m = s.match('([0-9.,KMB]+) posts');
				if (m == null) {
					warn("Cannot match posts string", s);
					return;
				}
				if (m.length < 2) {
					error("Cannot match posts string", s, ". Got " + m.length + " elements in the match");
					return;
				}
				postsElement.innerHTML = m[1] + " tweets";
			} catch (e) {
				error("Cannot rename posts to tweets", e);
			}
		});
	}

	function renameNavTabTweets() {
		uniqueWaitForElement('main nav [data-testid="ScrollSnap-List"] > div:first-child span').then(tweetsTabName => {
			if (tweetsTabName.innerText == "Posts") {
				tweetsTabName.innerHTML = "Tweets";
			}
		});
	}

	/*
	 * Renames existing "Tweet" buttons in popup dialogs on desktop.
	 */
	function doRenameDialogTweetButton() {
		const newTweetButton = document.querySelector(DIALOG_TWEET_BUTTON_SELECTOR);
		if (newTweetButton == null) {
			return;
		}
		if (newTweetButton.innerText == "Post all") {
			newTweetButton.innerText = "Tweet all";
		} else if (newTweetButton.innerText == "Post") {
			newTweetButton.innerText = "Tweet";
		}
		debug("DIALOG_TWEET_BUTTON_SELECTOR", newTweetButton);
	}

	/*
	 * Button "Tweet" needs to change dynamically into "Tweet all" when
	 * more than two tweets are added to the "draft".
	 *
	 * This observer detects changes in its text, because the button
	 * actually gets recreated inside the popup dialog.
	 */
	let tweetButtonObserver = null;

	/*
	 * Renames various oval blue buttons used to send a tweet, i.e. "to tweet".
	 */
	function renameTweetButton() {
		uniqueWaitForElement('a[data-testid="SideNav_NewTweet_Button"] > div > span > div > div > span > span').then(tweetButton => {
			if (tweetButton.innerText == "Post") { // avoid renaming "Reply"
				tweetButton.innerHTML = "Tweet";
				debug("SideNav", tweetButton);
			}
		});
		uniqueWaitForElement(DIALOG_TWEET_BUTTON_SELECTOR).then(tweetButton => {
			tweetButton.innerHTML = "Tweet";
			if (tweetButtonObserver != null) {
				return;
			}
			tweetButtonObserver = new MutationObserver(mutations => {
				doRenameDialogTweetButton();
			});
			/*
			 * Separate observer is needed to avoid leaking `tweetButtonObserver`
			 * and to reconnect `tweetButtonObserver` onto new buttons, when
			 * they appear.
			 */
			const dialogObserver = new MutationObserver(mutations => {
				if (document.querySelector('[role="dialog"]') == null) {
					tweetButtonObserver.disconnect();
					tweetButtonObserver = null;
					info("Disconnected tweetButtonObserver");
					dialogObserver.disconnect();
				}
			});
			tweetButtonObserver.observe(document.querySelector('[role="dialog"]'), { childList: true, subtree: true });
			info("Connected tweetButtonObserver");
			dialogObserver.observe(document.body, { childList: true, subtree: true });
		});

		// button near the text input at the top of the home page
		uniqueWaitForElement('button[data-testid="tweetButtonInline"] > div > span > span').then(tweetButton => {
			// sometimes this button has the correct text "Reply"
			if (tweetButton.innerText == "Post") {
				debug("tweetButtonInline", tweetButton);
				tweetButton.innerHTML = "Tweet";
			}
		});
	}

	/*
	 * Renames tabs "Retweets" and "Quote Tweets" on an individual tweet's "Tweet engagements" subpage.
	 * E.g. on https://twitter.com/andrybak0/status/1711154194835554336/retweets
	 */
	function renameTweetEngagementsSubpageTabs() {
		const pathParts = document.location.pathname.split('/');
		if (pathParts.length < 5) {
			return;
		}
		if (pathParts[2] !== 'status') {
			return;
		}
		if (!['quotes', 'retweets', 'likes'].includes(pathParts[4])) {
			return;
		}
		uniqueWaitForElement('a[href$="/retweets"] span').then(retweetsTabHeader => {
			retweetsTabHeader.replaceChildren(document.createTextNode("Retweets"));
		});
		/*
		 * Renames tab "Quotes" → "Quote Tweets"
		 * A bunch of old screenshots for confirmation:
		 *     https://danieljmitchell.wordpress.com/2020/12/29/2020s-tweet-of-the-year/
		 */
		uniqueWaitForElement('a[href$="/quotes"] span').then(quotesTabHeader => {
			quotesTabHeader.replaceChildren(document.createTextNode("Quote Tweets"));
		});
	}

	/*
	 * Renames "Add another tweet" button (for continuing your own existing thread).
	 */
	function renameAddAnotherTweetButton() {
		uniqueWaitForElement('main section > div > div > div > div > div > a[href="/compose/post"] span > span').then(addAnotherTweetButton => {
			if (addAnotherTweetButton.innerText == "Add another post") {
				addAnotherTweetButton.innerHTML = "Add another tweet";
			}
		});
	}

	/*
	 * Renames the header on a page for a singular tweet.
	 */
	function renameTweetHeader() {
		uniqueWaitForElement('h2[role="heading"] > span').then(tweetHeader => {
			if (tweetHeader.innerText == "Post") {
				tweetHeader.innerHTML = "Tweet";
			} else if (tweetHeader.innerText == "Reposted by") {
				tweetHeader.innerHTML = "Retweeted by";
			} else if (tweetHeader.innerText == "Quotes") {
				/*
				 * Source, confirming that they were indeed called that:
				 * https://www.macrumors.com/2020/08/31/twitter-quote-tweets-feature/
				 */
				tweetHeader.innerHTML = "Quote Tweets";
			} else if (tweetHeader.innerText == "Post engagements") {
				tweetHeader.innerHTML = "Tweet engagements";
			}
		});
	}

	/*
	 * Note: works only for desktop.
	 */
	function renameDraftEditorPlaceholder(argss) {
		uniqueWaitForElement('.public-DraftEditorPlaceholder-inner').then(placeholder => {
			for (const args of argss) {
				const targetText = args[0], replacementText = args[1], debugMessage = args[2];
				if (placeholder.innerText == targetText) {
					placeholder.replaceChildren(document.createTextNode(replacementText));
					debug("Renamed placeholder in", debugMessage);
					break;
				}
			}
		});
	}

	/*
	 * Note: works only for mobile.
	 */
	function renameTextAreaAttributePlaceholder(argss) {
		for (const args of argss) {
			const targetText = args[0], replacementText = args[1];
			uniqueWaitForElement(`textarea[placeholder="${targetText}"]`).then(textarea => {
				textarea.setAttribute('placeholder', replacementText);
			});
		}
	}

	function renameTweetPlaceholders() {
		const argss = [
			["Post your reply!", "Tweet your reply!", "renameTweetYourReplyPlaceholder 1"],
			["Post your reply", "Tweet your reply", "renameTweetYourReplyPlaceholder 2"],
			["Add another post!", "Add another tweet!", "renameAddAnotherTweetPlaceholder 1"],
			["Add another post", "Add another tweet", "renameAddAnotherTweetPlaceholder 2"]
		];
		renameDraftEditorPlaceholder(argss);
		renameTextAreaAttributePlaceholder(argss);
		/*
		 * TODO: is there some way to detect desktop vs mobile?
		 */
	}

	function doRenameRetweeted() {
		const allRetweeted = document.querySelectorAll(RETWEETED_SELECTOR);
		debug(`doRenameRetweeted: renaming ${allRetweeted.length} of "... reposted" to "... retweeted"`);
		let counter = 0;
		for (const retweeted of allRetweeted) {
			if (retweeted.childNodes.length === 1 && retweeted.childNodes[0].textContent === "You reposted") {
				retweeted.childNodes[0].remove();
				retweeted.append("You retweeted");
				counter++;
				continue;
			}
			// debug(retweeted.childNodes);
			if (retweeted.childNodes.length < 2) {
				continue;
			}
			const retweetedText = retweeted.childNodes[1];
			if (retweetedText.textContent === " reposted") {
				retweetedText.remove();
				retweeted.append(" retweeted");
				counter++;
			}
		}
		if (counter > 0) {
			debug(`Renamed fresh ${counter} retweeted text nodes.`);
		}
	}

	/*
	 * Whenever timeline gets recreated/replaced on-the-fly,
	 * we need to wait a bit, until the retweets actually
	 * appear in the document.
	 */
	function renameRetweetedGently() {
		uniqueWaitForElement(RETWEETED_SELECTOR).then(ignored => {
			doRenameRetweeted();
		});
	}

	let showTweetsObserver;

	/*
	 * Clickable link at the top of the timeline.
	 * "Show 42 tweets"
	 */
	function renameShowTweets() {
		const showTweetsArray = document.querySelectorAll(SHOW_N_TWEETS_SELECTOR);
		for (const showTweets of showTweetsArray) {
			let t = showTweets.childNodes[0].textContent;
			if (t.includes('posts')) {
				if (showTweetsObserver != null) {
					showTweetsObserver.disconnect();
					showTweetsObserver = null;
				}
				t = t.replace('posts', 'tweets');
				showTweets.childNodes[0].textContent = t;
				info("doRenameShowTweets: replaced", t);
				showTweetsObserver = new MutationObserver(ignored => {
					renameShowTweets();
				});
				showTweetsObserver.observe(showTweets, { characterData: true });
				return;
			}
		}
	}

	let timelineObserver = null;

	/*
	 * Reconnects the observer to the timeline node.
	 * This is needed when the page changes completely and a new timeline
	 * node appears in the DOM.
	 */
	function renewTimelineObserver() {
		/*
		 * Renaming "Jane Doe retweeted" when you know where these nodes are is easy.
		 * That's the function `doRenameRetweeted()` above.  But keeping track of them
		 * appearing in the timeline is difficult, if you also don't want to waste
		 * CPU unnecessarily.
		 *
		 * The code below kinda works, but the user still sees "reposted" from time
		 * to time.  Any suggestions for improvements are welcome.
		 *
		 * We wait for the <section> that the user sees to appear.
		 */
		uniqueWaitForElement('main [data-testid="primaryColumn"] section.css-175oi2r').then(timeline => {
			if (timelineObserver !== null) {
				timelineObserver.disconnect();
				timelineObserver = null;
				info("Disconnected timeline observer");
			}
			if (document.querySelector('main [data-testid="primaryColumn"] nav') == null) {
				info('renewTimelineObserver: Not on a timeline view. Aborting.');
				return;
			}
			renameRetweetedGently();
			renameShowTweets();
			timelineObserver = new MutationObserver(mutationsList => {
				doRenameRetweeted();
				renameShowTweets();
			});
			/*
			 * And we observe all <section> tags:
			 */
			const allSections = document.querySelectorAll('main section.css-175oi2r');
			info("Renewing timeline observer for", allSections.length, "tags");
			if (allSections.length == 0) {
				error("Cannot find the timeline <section> tag");
			}
			for (const section of allSections) {
				timelineObserver.observe(section, { subtree: true, childList: true, characterData: true });
				info("Added timeline observer", section);
			}
		});
		doRenameRetweeted();
	}

	function renameRetweetLink() {
		uniqueWaitForElement('[data-testid="retweetConfirm"] span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0').then(retweetLink => {
			/*
			 * TODO: on desktop, this gets called twice, unfortunately.
			 */
			if (retweetLink.innerText == "Repost") {
				retweetLink.innerHTML = "Retweet";
				debug("Renamed 'Retweet' in renameRetweetLink");
			}
		});
	}

	function renameRetweetTooltip() {
		uniqueWaitForElement('[data-testid="HoverLabel"] span').then(retweetTooltip => {
			if (retweetTooltip.innerText == "Repost") {
				retweetTooltip.innerText = "Retweet";
				debug("Renamed 'Retweet' in renameRetweetTooltip");
			} else if (retweetTooltip.innerText == "Undo repost") {
				retweetTooltip.innerText = "Undo retweet";
				debug("Renamed 'Undo retweet' in renameRetweetTooltip");
			}
		});
	}

	/*
	 * There are at least two affected dropdowns:
	 *   1. "More" under the three dots button in the top right of a tweet
	 *   2. "Share" under the button with "Send" icon (desktop) or
	 *      "Share" icon (mobile) in the bottom right of a tweet.
	 */
	function renameDropdownItems() {
		// Desktop: [data-testid="Dropdown"]
		// Mobile : [data-testid="sheetDialog"]
		uniqueWaitForElement('#layers [role="menu"]').then(dropdown => {
			/*
			 * TODO: on desktop, this gets called twice, unfortunately.
			 */
			dropdown.querySelectorAll('[role="menuitem"] span').forEach(span => {
				if (span.innerText.includes("post")) {
					span.innerHTML = span.innerText.replace("post", "tweet");
					debug("Renamed 'tweet' in renameDropdownItems");
				}
			});
		});
	}

	function renameRetweetedByPopupHeader() {
		uniqueWaitForElement('#layers h2 > .css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0').then(tweetHeader => {
			if (tweetHeader.innerText == "Reposted by") {
				tweetHeader.innerHTML = "Retweeted by";
			}
		});
	}

	function doRenameYourTweetWasSent() {
		const maybeToast = document.querySelector('#layers [data-testid="toast"] > div > span');
		if (maybeToast) {
			const t = maybeToast.innerText;
			if (t.includes(' post ')) {
				maybeToast.innerHTML = t.replace(' post ', ' tweet ');
				debug("doRenameYourTweetWasSent", t);
			}
		}
	}

	function doRenameDeletePostQuestion() {
		const maybeHeader = document.querySelector('#layers [data-testid="confirmationSheetDialog"] > h1');
		if (maybeHeader) {
			if (maybeHeader.innerText == "Delete post?") {
				maybeHeader.innerHTML = "Delete tweet?";
				debug("doRenameDeletePostQuestion");
			}
		}
	}

	let layersObserver;

	/*
	 * #layers is the element where tooltips, dropdown menues, and
	 * popup replies (as opposed to inline replies) are shown.
	 */
	function renewLayersObserver() {
		uniqueWaitForElement('#layers').then(retweetDropdownContainer => {
			if (layersObserver != null) {
				layersObserver.disconnect();
				layersObserver = null;
				info("Disconnected layersObserver");
			}
			layersObserver = new MutationObserver(mutationsList => {
				renameRetweetLink();
				renameRetweetTooltip();
				renameDropdownItems();
				/*
				 * There are both inline and popup "Reply" fields with placeholders.
				 */
				renameTweetPlaceholders();
				doRenameDialogTweetButton();
				renameRetweetedByPopupHeader();
				doRenameYourTweetWasSent();
				doRenameDeletePostQuestion();
			});
			layersObserver.observe(retweetDropdownContainer, { subtree: true, childList: true });
			info("Added layersObserver");
		});
	}

	let pillObserver;

	function renameSeeTweetsPill() {
		/*
		 * Several types of "pills":
		 *   - "X, Y, Z tweeted"
		 *   - "See new tweets"
		 */
		uniqueWaitForElement('[data-testid="pillLabel"] span span span').then(pill => {
			if (pill.innerText == "posted") {
				if (pillObserver != null) {
					pillObserver.disconnect();
					pillObserver = null;
				}
				pill.innerHTML = "tweeted";
				debug('Renamed "tweeted" pill');
			} else if (pill.innerText == "See new posts") {
				pill.innerHTML = "See new tweets";
				debug('Renamed "See new tweets" pill');
				/*
				 * FIXME: A dirty hack to sync the pill with the clickable link
				 *        can't figure out how to make `renewTimelineObserver()`
				 *        detect the clickable link properly.
				 */
				renameShowTweets();
				/*
				 * If a user keeps the timeline open long enough, pill "See new tweets"
				 * turns into "X, Y, Z posted".  This observer will make sure to rename
				 * it to "X, Y, Z tweeted".
				 */
				pillObserver = new MutationObserver(() => {
					renameSeeTweetsPill();
				});
				pillObserver.observe(pill, { characterData: true });
			}
		});
	}

	function renameTweetInNotifications() {
		/*
		 * This mess of a selector tries to minimize the amount of `spanNodes` that match.
		 */
		const spanNodes = document.querySelectorAll('article div > div > div > span > span');
		debug(`renameTweetInNotifications: renaming ${spanNodes.length} nodes (shouldn't be too high!)`);
		spanNodes.forEach(spanNode => {
			if (spanNode.innerText.includes("post") || spanNode.innerText.includes("Post")) {
				let s = spanNode.innerText;
				s = s.replaceAll(" repost", " retweet");
				s = s.replaceAll(" post", " tweet");
				s = s.replaceAll(" Post", " Tweet");
				s = s.replaceAll(" Repost", " Retweet");
				spanNode.innerText = s;
			}
		});
	}

	let notificationsObserver;

	function renewNotificationsObserver() {
		if (document.location.pathname != '/notifications') {
			if (notificationsObserver != null) {
				notificationsObserver.disconnect();
				info("Disconnected notificationsObserver");
			}
			return;
		}
		uniqueWaitForElement('[aria-label="Timeline: Notifications"]').then(notificationsContainer => {
			notificationsObserver = new MutationObserver(mutationsList => {
				renameTweetInNotifications();
			});
			notificationsObserver.observe(notificationsContainer, { subtree: true, childList: true });
			info("Added notificationsObserver");
		});
	}

	/*
	 * "This Tweet is from an account you muted."
	 * "This Tweet is from an account you blocked."
	 * "You’re unable to view this Tweet because this account owner limits who can view their Tweets."
	 * "This Tweet was deleted by the Tweet author."
	 * "This Tweet is from an account that no longer exists."
	 */
	function doRenameHiddenTweets() {
		const spanNodes = document.querySelectorAll('section article > div > div > div > div > div > div > div > span > span > span');
		spanNodes.forEach(spanNode => {
			if (spanNode.innerText.includes("post") || spanNode.innerText.includes("Post")) {
				let s = spanNode.innerText;
				s = s.replaceAll(" repost", " retweet");
				s = s.replaceAll(" post", " tweet");
				s = s.replaceAll(" Post", " Tweet");
				s = s.replaceAll(" Repost", " Retweet");
				spanNode.innerText = s;
			}
		});
	}

	function renameHiddenTweets() {
		uniqueWaitForElement('main section article > div > div > div > div > div > div > div > span > span > span').then(() => {
			doRenameHiddenTweets();
		});
	}

	function renameTranslateTweet() {
		const translateButtonSelector = 'section > div > div > div[data-testid="cellInnerDiv"] div[role="button"] span.css-1qaijid.r-bcqeeo.r-qvutc0.r-poiln3';
		uniqueWaitForElement(translateButtonSelector).then(button => {
			const spanNodes = document.querySelectorAll(translateButtonSelector);
			spanNodes.forEach(spanNode => {
				if (spanNode.innerText.includes("post")) {
					spanNode.innerText = spanNode.innerText.replaceAll(" post", " tweet");
				}
			});
		});
	}

	function renameSourcedFromAcrossTwitter() {
		const selector = 'section > div > div > div[data-testid="cellInnerDiv"] > div > div > div > div > span';
		uniqueWaitForElement(selector).then(subheading => {
			info("renameSourcedFromAcrossTwitter", subheading, subheading.innerText);
			if (subheading.innerText == "Sourced from across X") {
				subheading.replaceChildren(document.createTextNode("Sourced from across Twitter"));
			}
		});
	}

	function isAProfilePage() {
		const pathParts = document.location.pathname.split('/');
		if (pathParts.length < 2) {
			return false;
		}
		return document.title.includes("(@" + pathParts[1] + ")");
	}

	/*
	 * There are four layers to the userscript:
	 *
	 * 1. Big rename in `rename()`, i.e. this function. It gets called
	 *    whenever we suspect that an on-the-fly change of the whole
	 *    page happened.  It calls functions from layers 2 and 3.
	 *    See function `setUpRenamer()` for details.
	 * 2. `MutationObserver`s for stuff that gets updated on-the-fly.
	 *    These observers are set up by various `renew...Observer()`
	 *    functions. These observers call functions from layers 3 and 4.
	 * 3. Various `rename<this and that>()` functions, that wait for their
	 *    target element.
	 * 4. Various `doRename<this and that>()` functions, that assume that
	 *    their target element already exists in the document.
	 */
	function rename() {
		// "Tweet" button and tab's <title> are ubiquitous
		renameTweetButton();
		renameTwitterInTabName();

		// targets for renaming on a singular tweet page
		renameTweetHeader();
		renameTweetEngagementsSubpageTabs();
		renameTweetPlaceholders();
		renameTranslateTweet();

		// targets for renaming on a user's profile
		if (isAProfilePage()) {
			renameProfileTweetsCounter();
			renameNavTabTweets();
		}

		// adding to your own thread
		renameAddAnotherTweetButton();

		// timeline + tweets on a timeline
		renewLayersObserver();
		renameSeeTweetsPill();
		renameHiddenTweets();
		renameSourcedFromAcrossTwitter();

		renewNotificationsObserver();
	}

	function setUpRenamer() {
		let title = document.title;
		const titleObserver = new MutationObserver(mutationsList => {
			const maybeNewTitle = document.title;
			if (maybeNewTitle != title) {
				info('Title changed:', maybeNewTitle);
				title = maybeNewTitle;
				if (!title.includes("Twitter") || title.endsWith("/ X")) {
					info("Big renaming: starting...");
					rename();
					renewTimelineObserver();
					info("Big renaming: done ✅");
				}
			}
		});
		uniqueWaitForElement('title').then(elem => {
			titleObserver.observe(elem, { subtree: true, characterData: true, childList: true });
		});
		rename();
	}

	replaceLogo();
	rename();
	uniqueWaitForElement(FAVICON_SELECTOR).then(ignored => {
		setFavicon(TWITTER_2012_ICON_URL);
		setUpRenamer();
	});
})();
