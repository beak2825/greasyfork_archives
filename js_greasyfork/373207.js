// ==UserScript==
// @name           TweetDeck Clear Buttons
// @description    Adds "Clear" button to each column.
// @include        https://tweetdeck.twitter.com/*
// @match          https://tweetdeck.twitter.com/*
// @version        1.0
// @source         https://github.com/gregorb/TweetDeckClearButtons
// @namespace https://greasyfork.org/users/219214
// @downloadURL https://update.greasyfork.org/scripts/373207/TweetDeck%20Clear%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/373207/TweetDeck%20Clear%20Buttons.meta.js
// ==/UserScript==

// Chrome installation instructions: open settings/extensions page, drag&drop this file into it.

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

			a.addEventListener("click", function(){
				value.click();   // open settings panel
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

					clrButton.click();   // click on original "clear" button
					value.click();  // close settings panel

				}, 1000);

			});

		});

	}

}, 3000 );

