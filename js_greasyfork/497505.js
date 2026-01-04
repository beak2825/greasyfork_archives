// ==UserScript==
// @name           TweetDeck Clear and Remove Buttons
// @namespace    guebosch
// @author       guebosch, https://github.com/gregorb/TweetDeckClearButtons
// @description    Adds "Clear" button to each column.
// @match          https://tweetdeck.twitter.com/*
// @match          https://x.com/*
// @version        2025-01-19
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497505/TweetDeck%20Clear%20and%20Remove%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/497505/TweetDeck%20Clear%20and%20Remove%20Buttons.meta.js
// ==/UserScript==

const debug = false;

const timer = window.setInterval( function() {
	// keep checking for new/updated columns every few seconds

	if (debug) console.log("GB's TweetDeck Helper: Checking.");

	// list all columns that don't have our "Clear" button yet
	const columnsToUpdate = document.querySelectorAll("div.column-header-links > a:not(.gb)");
	if (columnsToUpdate && columnsToUpdate.length) {

		if (debug) console.log("GB's TweetDeck Helper: " + columnsToUpdate.length );

		columnsToUpdate.forEach(function(value) {
			// value = options button

            // tag it, so we know we've already been here
			value.className += " gb";

            // an extra button may cause the original one to word-wrap out of view; this prevents that from happening
            value.parentNode.style.whiteSpace = 'nowrap';

			const a = document.createElement("a");
			a.className = "js-action-header-button column-header-link gb";
			a.href = "#";
			a.innerHTML = '<i class="icon icon-clear-timeline"></i>';
			a.setAttribute("data-action", "clear");
			a.style.left = "200px";
			value.parentNode.insertBefore(a, value);

			const b = document.createElement("a");
			b.className = "js-action-header-button column-header-link gb";
			b.href = "#";
			b.innerHTML = '<i class="icon icon-close"></i>';
			b.setAttribute("data-action", "remove");
			b.style.left = "200px";
			value.parentNode.insertBefore(b, value);

			a.addEventListener("click", function(){
				value.click(); // open settings panel
				window.setTimeout(function(){

                    // find the root element of our column
					let clrButton = value;
                    while ( clrButton && !clrButton.classList.contains('column-holder') )
                        clrButton = clrButton.parentNode;
                    if (!clrButton) {
                        console.log("GB's TweetDeck Helper: column't root element not recognised; class-name changed?");
                        return;
                    }

                    // now find our column's "clear" button
                    clrButton = clrButton.querySelector("button[data-action='clear']");
                    if (!clrButton) {
                        console.log("GB's TweetDeck Helper: column't 'Clear' button not found; class-name changed?");
                        return;
                    }

					clrButton.click(); // click on original "clear" button
					value.click(); // close settings panel

				}, 1000);

			});

			b.addEventListener("click", function(){
				value.click(); // open settings panel
				window.setTimeout(function(){

					// find the root element of our column
					let clrButton = value;
					while ( clrButton && !clrButton.classList.contains('column-holder') )
						clrButton = clrButton.parentNode;
					if (!clrButton) {
						console.log("GB's TweetDeck Helper: column't root element not recognised; class-name changed?");
						return;
					}

					// now find our column's "remove" button
					clrButton = clrButton.querySelector("button[data-action='remove']");
					if (!clrButton) {
						console.log("GB's TweetDeck Helper: column't 'Remove' button not found; class-name changed?");
						return;
					}

					clrButton.click(); // click on original "remove" button
					value.click(); // close settings panel

				}, 1000);

			});

		});

	}

}, 3000 );

