// ==UserScript==
// @name        Fuck Reddit Karma (For New Reddit)
// @namespace   https://greasyfork.org/en/users/14470-sewil
// @description Hides anything related to karma on Reddit.
// @include     https://*.reddit.com/*
// @version     1.0.0
// @grant       none
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://gitcdn.xyz/cdn/uzairfarooq/arrive/cfabddbd2633a866742e98c88ba5e4b75cb5257b/minified/arrive.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441777/Fuck%20Reddit%20Karma%20%28For%20New%20Reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441777/Fuck%20Reddit%20Karma%20%28For%20New%20Reddit%29.meta.js
// ==/UserScript==

const selectors = [
  '[id^=vote-arrows-] > div', // Comment/post karma
  '.Rz5N3cHNgTGZsIQJqBfgk, ._2fN55zgax6VM7DyEl9pOmM', // User profile karma
  '._2ETuFsVzMBxiHia6HfJCTQ._3_GZIIN1xcMEC5AVuv4kfa' // User profile comment karma
].join(',');

$(selectors).remove(); // Remove on page load
$(document).arrive(selectors, function (element) { // Remove any elements appearing after page load
  $(this).remove();
});
