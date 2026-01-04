// ==UserScript==
// @name               QOAL/discord/dontPingReplies
// @namespace          QOAL/discord/dontPingReplies
// @description        Sets ping to OFF initially when using the Reply feature
// @author             QOAL
// @version            1.15
// @grant              none
// @match              https://discord.com/*
// @run-at             document-end
// @license            GPLv3
// @downloadURL https://update.greasyfork.org/scripts/423531/QOALdiscorddontPingReplies.user.js
// @updateURL https://update.greasyfork.org/scripts/423531/QOALdiscorddontPingReplies.meta.js
// ==/UserScript==


	/*

	The Reply feature sends a ping by default, this script will initially toggle this off for you.

	We first need to find its parent element,
		and watch for page changes so we can start looking for it again.

	Then we just watch for DOM mutations, if we spot that the first child is now one with the class "container-2fRDfG",
		then we can go to work toggling the ping state.

	*/

(function(){
	'use strict';

	const textAreaContClass = '[class*="channelTextArea"]';

	const clickEvent = document.createEvent('Events');
	clickEvent.initEvent("click", true, false);


	// Discord has an connecting screen should you or it have network issues
	// The url and page title doesn't change during this
	// I think it's a good idea to listen for browser events, and start mutation observers
		const networkStatusChange = (e) => {
		endPingObserver();
		findTac();
	}
	window.addEventListener('online', networkStatusChange);
	//window.addEventListener('offline', networkStatusChange);


	const pageChange = () => {
		// Recheck if we have textAreaCont, if not start the mutation handler for it
		endPingObserver();
		findTac();
	}
	new MutationObserver(pageChange).observe(
		document.head.querySelector("title"),
		{ subtree: true, characterData: true, childList: true }
	);


	let textAreaCont;
	let findTacObserver;
	let findTacTimer;
	const findTac = () => {
		stopTacObserver();

		const tmpCont = document.querySelector(textAreaContClass);
		if (tmpCont) {
			textAreaCont = tmpCont;
			startPingObserver();
			return;
		}

		findTacObserver = new MutationObserver(checkForTac);
    findTacObserver.observe(
			document.body/*getElementById("app-mount")*/,
			{ subtree: true, childList: true }
		);

		findTacTimer = setTimeout(function() {
			// Give up waiting
			findTacObserver.disconnect();
		}, 10 * 1000);
	}

	const stopTacObserver = () => {
		if (findTacObserver) {
			findTacObserver.disconnect();
			findTacObserver = null;
		}
	}

	const checkForTac = () => {
		const tmpCont = document.querySelector(textAreaContClass);
		if (!tmpCont) { return; }

		textAreaCont = tmpCont;

		stopTacObserver();

		startPingObserver();
	}


	let pingObserver;
	const startPingObserver = () => {
		if (!textAreaCont) { return; } // We shouldn't hit this, but should be wary

		// Stop an existing observer
		endPingObserver();

		pingObserver = new MutationObserver(checkForPing).observe(
			textAreaCont,
			{ subtree: true, childList: true }
		);
	}

	const endPingObserver = () => {
		if (pingObserver) {
			pingObserver.disconnect();
			pingObserver = null;
		}
	}


	const checkForPing = () => {
		// Try and find a checked switch, and toggle it
		let tmpPing = textAreaCont.querySelector('div[role="switch"][aria-checked="true"]');
		if (tmpPing) {
			tmpPing.click();
		}
	}


	findTac();


})()