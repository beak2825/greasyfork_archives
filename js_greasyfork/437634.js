//* eslint-env browser, es6, greasemonkey */
// ==UserScript==
// @name         Twitter Show Sensitive Content
// @namespace    kTu*Kzukf&5p#85%xas!fBH4#GT@FQ7@
// @version      0.3.6
// @description  No more extra click to show stupid tweets!
// @author       _SUDO
// @match        *://*.twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @license      GPL
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/437634/Twitter%20Show%20Sensitive%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/437634/Twitter%20Show%20Sensitive%20Content.meta.js
// ==/UserScript==

(function () {
	'use strict';

	//* Bypass NSFW warnings
	// Thanks to TURTLE: https://stackoverflow.com/a/43144531

	//! IF IS NOT WORKING OR GENERATES SOME KIND OF PROBLEM, COMMENT FROM HERE:
	const open_prototype = XMLHttpRequest.prototype.open;
	const intercept_response = function (urlpattern, callback) {
		XMLHttpRequest.prototype.open = function () {
			arguments['1'].match(urlpattern) &&
				this.addEventListener('readystatechange', function (event) {
					if (this.readyState === 4) {
						var response = callback(
							event.target.responseText,
							event.target.responseURL
						);
						Object.defineProperty(this, 'response', { writable: true });
						Object.defineProperty(this, 'responseText', { writable: true });
						this.response = this.responseText = response;
					}
				});
			return open_prototype.apply(this, arguments);
		};
	};

    // Creates and caches a random string to replace later the possibly_sensitive object key
	const ranString = (() => Array(5).fill().map(() => 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.random() * 62)).join(''))();
	intercept_response(
		/\/User|TweetDetail|Adaptive/gi, // 179 steps, 0.01ms
		function (response, responseURL) {
			// console.log('[API] FOUND RESPONSE!', responseURL, response);

			const new_response = response
				.replace(/sensitive_media/gim, '')
				.replace(/possibly_sensitive/gim, ranString)
				.replace(/offensive_profile_content/gim, '');
			return new_response;
		}
	);
	// TO HERE

	//! DOM DEPENDENT, USE IF THE ABOVE METHOD DO NOT WORK
  /*
	const maxCheckDeepness = 30;
	let observer = null;

	function findParent(elem) {
		let tries = maxCheckDeepness;
		let currentNode = elem;
		let parent = currentNode.parentElement;

		while (parent.childElementCount === 1) {
			if (tries <= 0) break;
			tries--;
			currentNode = parent;
			parent = parent.parentElement;
		}

		return parent;
	}

	function findChild(elem) {
		let tries = maxCheckDeepness;
		let currentNode = elem;
		let child = currentNode.children;

		while (child.length === 1) {
			if (tries <= 0) break;
			tries--;
			currentNode = child;
			child = child[0].children;
		}

		return child;
	}

	function unHideTweet(tweetElement) {
		const hidden = tweetElement;

		console.log('[M] Hidden container found!', hidden);
		// Now filter until we end up without singles divs and two elements
		let tweet = findChild(hidden); // second element
		console.log('[M] CHILDS:', tweet);
		if (tweet.length === 1) {
			console.log('[M] Only one child found!', tweet[0]);
			tweet = tweet[0];
		} else {
			let running = true;
			while (running) {
				console.log(
					'[M] Multiple childs found, filtering one more time...',
					tweet
				);
				if (tweet.length === 2 && tweet[0].childElementCount === 0)
					tweet = findChild(tweet[1]);
				else {
					tweet = tweet[1];
					running = false;
				}
			}
		}

		try {
			// This should click the button instead of the actual container
			// if the container is clicked, the page will be redirected
			tweet.children[0].click();
		} catch (err) {
			// No page interaction
			console.error('[M] NO PAGE INTERACTION!', err);
		}
	}

	function watcher(disconnect = false) {
		if (disconnect && observer) {
			observer.disconnect();
			return;
		}

		// Twitter uses articles for every tweet.
		// To use the observer we need to find all tweets parent element
		const target = findParent(document.querySelector('article'));
		const sensitiveContentElement = `div[role="presentation"] > div`;

		console.log('Target:', target);

		// Show all elements loaded before the observer registration
		const staticTweets = document.querySelectorAll(sensitiveContentElement);
		if (staticTweets) staticTweets.forEach((e) => unHideTweet(e));

		observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// Well now we can filter elements
				if (mutation.type === 'childList' && mutation.addedNodes.length) {
					// console.log('[M]', mutation, mutation.type, mutation.type.attributes)
					// console.log('[M]', mutation.addedNodes[0])

					const hidden = mutation.addedNodes[0].querySelector(
						sensitiveContentElement
					);
					if (hidden) {
						unHideTweet(hidden);
					}
				}
			});
		});

		observer.observe(target, {
			childList: true,
			subtree: false,
			characterData: false
		});
	}

	function runOnURLChange() {
		if (window.onurlchange === null) {
			window.addEventListener('urlchange', (info) => {
				init();
			});
		} else {
			console.error('window.onurlchange not supported');
		}
	}

	let executed = false;
	async function init() {
		let tries = 30;
		while (!document.querySelector('article')) {
			if (tries <= 0) {
				console.error('Max tries exceeded, perhaps the element have changed?');

				// Maybe the user let the page in the button to show the profile
				// Add an click event listener to re-execute when technically clicking the button to show the profile
				if (!executed) {
					executed = true;
					console.log(
						'Re-checking tweets container in the next click event...'
					);
					document.body.addEventListener('click', init, { once: true });
				}
				return;
			}
			tries--;
			await new Promise((r) => setTimeout(r, 500));
		}
		watcher();
	}

	if (document.readyState === 'complete') init()
	else {
		document.addEventListener('readystatechange', (evt) => {
				if (document.readyState === 'complete') init()
			}
		)
	}
	runOnURLChange();
  */
})();
