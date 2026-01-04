// ==UserScript==
// @name         Remove Google Click-tracking
// @namespace    muvsado
// @version      0.1.6
// @description  Removes Google's click-tracking from result links
// @match        *://www.google.tld/search?*
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/479382/Remove%20Google%20Click-tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/479382/Remove%20Google%20Click-tracking.meta.js
// ==/UserScript==

let results = document.querySelectorAll('a[href^="/url"]');
for (let i = 0; i < results.length; i++) {
    let url = new URL(results[i].href);
    results[i].href = url.searchParams.get('q');
}