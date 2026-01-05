// ==UserScript==
// @name        Reload GitHub Pull Request Diff page to ignore whitespace
// @namespace   https://bitbucket.org/deadlydog/greasemonkeyscripts
// @description Reloads the GitHub Pull Request Diff page, adjusting the URL to have the diffs ignore whitespace.
// @include     https://github.com/*/pull/*/files
// @exclude     https://github.com/*/pull/*/files?w=1
// @grant       none
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/1712/Reload%20GitHub%20Pull%20Request%20Diff%20page%20to%20ignore%20whitespace.user.js
// @updateURL https://update.greasyfork.org/scripts/1712/Reload%20GitHub%20Pull%20Request%20Diff%20page%20to%20ignore%20whitespace.meta.js
// ==/UserScript==

// Wipe out the head and body contents so that we don't wait for them to load before doing the redirect.
document.head.innerHTML='';
document.body.innerHTML='';

// Redirect to the URL we are at, with the special modifier attached that signals to ignore whitespace in the diffs.
window.location.href=window.location.href + '?w=1';