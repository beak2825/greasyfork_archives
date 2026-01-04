// ==UserScript==
// @name         Reddit - Redirect to old.reddit.com
// @namespace    amekusa.reddit-redirect
// @author       amekusa
// @version      1.0.0
// @description  Automatically redirects you to old.reddit.com. Doesn't break browser history.
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @exclude      https://www.reddit.com/media?*
// @exclude      https://www.reddit.com/gallery/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepage     https://github.com/amekusa/monkeyscripts
// @downloadURL https://update.greasyfork.org/scripts/507468/Reddit%20-%20Redirect%20to%20oldredditcom.user.js
// @updateURL https://update.greasyfork.org/scripts/507468/Reddit%20-%20Redirect%20to%20oldredditcom.meta.js
// ==/UserScript==

window.location.replace(window.location.href.replace(/^https:\/\/(?:www\.)?reddit\.com\//, 'https://old.reddit.com/'));

