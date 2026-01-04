// ==UserScript==
// @name        Wikipedia mobile remover
// @namespace   Wikipedia
// @match       https://*.m.wikipedia.org/*
// @run-at      document-start
// @grant       none
// @icon        https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg
// @version     1.0
// @author      ccuser44
// @license     CC0
// @description Redirects all Wikipedia mobile pages to their desktop counterpart
// @downloadURL https://update.greasyfork.org/scripts/478783/Wikipedia%20mobile%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/478783/Wikipedia%20mobile%20remover.meta.js
// ==/UserScript==

/*
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.
You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

var matches = document.location.href.match(/^https?:\/\/(\w+)\.m\.wikipedia\.org\/(.+)/);

if (matches[1]) {
	window.stop();
	window.location.replace("https://" + matches[1] + ".wikipedia.org/" + matches[2]);
};