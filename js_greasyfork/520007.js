// ==UserScript==
// @name     disableredditbysub
// @match    *://*.reddit.com/*
// @version  1
// @grant    none
// @license MIT
// @description blocks you from visiting particular subreddits
// @author   chicken
// @namespace https://greasyfork.org/users/1156613
// @downloadURL https://update.greasyfork.org/scripts/520007/disableredditbysub.user.js
// @updateURL https://update.greasyfork.org/scripts/520007/disableredditbysub.meta.js
// ==/UserScript==
const blockedSubreddits = ['politics', 'news', 'comics']; // List of subreddits to block
if (blockedSubreddits.some(sub =>window.location.pathname.includes(`/r/${sub}/`))) {
  document.body.style.display = 'none';
}

