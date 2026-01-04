// ==UserScript==
// @name         Google Bangs
// @namespace    https://bblok.tech/
// @version      1.0
// @description  Use DuckDuckGo !bangs in Google!
// @author       Theblockbuster1
// @run-at       document-start
// @icon         https://duckduckgo.com/favicon.ico
// @include      *://*.google*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424160/Google%20Bangs.user.js
// @updateURL https://update.greasyfork.org/scripts/424160/Google%20Bangs.meta.js
// ==/UserScript==

fetch(`https://api.duckduckgo.com/?q=${new URLSearchParams(window.location.search).get('q')}&format=json&no_redirect=1`)
    .then(res => res.json())
    .then(data => {
        if (data.Redirect) window.location = data.Redirect;
    });