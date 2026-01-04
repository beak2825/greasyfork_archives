// ==UserScript==
// @name         Highlight Joined Subs differently in search results on New Reddit
// @namespace    http://tampermonkey.net/
// @version      2024-05-29
// @description  Using New Reddit Search is handy, but doesn't show already joined subs as any differently to non-joined subs, which I want to more easily distinguish, hence this script.
// @author       You
// @match        https://new.reddit.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488660/Highlight%20Joined%20Subs%20differently%20in%20search%20results%20on%20New%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/488660/Highlight%20Joined%20Subs%20differently%20in%20search%20results%20on%20New%20Reddit.meta.js
// ==/UserScript==

function applyHighlighting() {
    var entries = document.querySelectorAll('div[data-testid*="communities-list"]>div>div:not([style*="maroon"])');

    for(var entry of entries) {
        if(entry.querySelector('button')?.innerHTML.includes("Joined")) {
            entry.style.backgroundColor="maroon";
        }
    }
}

(function() {
    'use strict';

    setInterval(applyHighlighting,1000);
})();