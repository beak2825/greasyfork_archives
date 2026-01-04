// ==UserScript==
// @name         Google Search YouTube button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a YouTube button to Google Search
// @author       You
// @match        https://www.google.com/search?q=*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426367/Google%20Search%20YouTube%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/426367/Google%20Search%20YouTube%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#top_nav > div > div > div > div > div").innerHTML += `<div class="hdtb-mitem"><a class="hide-focus-ring" href="https://youtube.com/search?q=${document.querySelector("input").value}" data-hveid="CAEQBA"><span class="bmaJhd iJddsb" style="height:16px;width:16px"><svg focusable="false" viewBox="0 0 24 24"><path d="M10 16.5l6-4.5-6-4.5v9zM5 20h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1zm14.5 2H5a3 3 0 0 1-3-3V4.4A2.4 2.4 0 0 1 4.4 2h15.2A2.4 2.4 0 0 1 22 4.4v15.1a2.5 2.5 0 0 1-2.5 2.5"></path></svg></span>YouTube</a></div>`;
})();