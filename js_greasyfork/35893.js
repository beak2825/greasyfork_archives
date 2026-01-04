"use strict";

// ==UserScript==
// @name Google Search Neutralizer
// @namespace yossarian-gsearch-neutralizer
// @description Removes URL rewrites in Google Search results
// @locate en
// @version 1.0.0
// @include *.google.*/search*
// @downloadURL https://update.greasyfork.org/scripts/35893/Google%20Search%20Neutralizer.user.js
// @updateURL https://update.greasyfork.org/scripts/35893/Google%20Search%20Neutralizer.meta.js
// ==/UserScript==

var links = document.getElementsByTagName("a");

for (var i = 0; i < links.length; i++) {
    /*
        Google's URL rewriting function is triggered by an "onmousedown" event.
        I can't conceive of anything legitimate using this event on a search result page,
        so just nuke it entirely.
    */
    links[i].removeAttribute("onmousedown");
}
