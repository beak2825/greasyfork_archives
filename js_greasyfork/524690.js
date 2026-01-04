// ==UserScript==
// @name          e621 Keyboard Navigation
// @namespace     https://greasyfork.org/en/users/1426686
// @version       1.0-beta
// @description   Provides basic keyboard navigation on e621 posts.
// @license       GNU GPLv3
// @match         *://e621.net/posts/*
// @grant         none
// @icon          https://e621.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/524690/e621%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/524690/e621%20Keyboard%20Navigation.meta.js
// ==/UserScript==

/**
 * Navigation elements for post search results.
 * @constant {Element | undefined}
 */
const searchNav = document.querySelector('div.search-seq-nav');
  searchNavBack = searchNav?.querySelector("a.prev");
  searchNavNext = searchNav?.querySelector("a.next");

/**
 * Navigation elements for pool results.
 * @constant {Element | undefined}
 */
const poolNav = document.querySelector('div.pool-nav'),
  poolNavBack = poolNav?.querySelector("a.prev"),
  poolNavNext = poolNav?.querySelector("a.next");

/**
 * Determines if the page actionable events.
 * @constant {boolean}
 */
const hasNav = searchNavBack != null || searchNavNext != null || poolNavBack != null || poolNavNext != null;

// If we've got hasNav add an event listener to {@link navigatePage}
if (hasNav) document.addEventListener("keydown", navigatePage);

/**
 * Captures the keyboard event and executes the desired action if available
 * @param {KeyboardEvent} event
 */
function navigatePage(event) {
  switch (event.key) {
    // Previous search result
    case "a":
    case "A":
    case "ArrowLeft":
      searchNavBack?.click();
      break;

    // Next search result
    case "d":
    case "D":
    case "ArrowRight":
      searchNavNext?.click();
      break;

    // Previous pool result
    case "q":
    case "Q":
    case "[":
      poolNavBack?.click();
      break;

    // Next pool result
    case "e":
    case "E":
    case "]":
      poolNavNext?.click();
      break;
  }
}
