// ==UserScript==
// @name         Remove Twitter Tracking Garbage
// @namespace    https://greasyfork.org
// @version      1.0.1
// @description  Removes the tracking arguments from the end of Twitter URLs.
// @author       ScocksBox
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @include      https://twitter.com/*
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440617/Remove%20Twitter%20Tracking%20Garbage.user.js
// @updateURL https://update.greasyfork.org/scripts/440617/Remove%20Twitter%20Tracking%20Garbage.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

let loc = window.location.href;

if (loc.match(/\?.+$/)) {
  	window.history.replaceState(history.state, null, loc.replace(/\?.+$/, ''));
}
