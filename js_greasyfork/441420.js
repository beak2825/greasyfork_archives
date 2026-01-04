// ==UserScript==
// @name         Reddit to Libreddit
// @namespace    -
// @version      0.1
// @description  Redirects Reddit links to Libreddit
// @author       punpun
// @include      *reddit.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441420/Reddit%20to%20Libreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/441420/Reddit%20to%20Libreddit.meta.js
// ==/UserScript==

const libreddit = 'libredd.it'; // Or change to any alternative you prefer

window.location.replace('https://' + libreddit + window.location.pathname + window.location.search);