// ==UserScript==
// @name         Remove Reddit's promoted posts and other noise
// @namespace    https://lyler.xyz
// @version      0.4
// @description  Get rid of Reddit's "promoted" posts and other noise
// @author       Lyle Hanson
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390690/Remove%20Reddit%27s%20promoted%20posts%20and%20other%20noise.user.js
// @updateURL https://update.greasyfork.org/scripts/390690/Remove%20Reddit%27s%20promoted%20posts%20and%20other%20noise.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function kill_ads() {
        let spans = Array.filter(document.getElementsByTagName("span"), (span) => span.textContent == "promoted")
        spans.forEach((span) => span.parentElement.parentElement.parentElement.parentElement.style = "display: none")
    }

    kill_ads()
    // Hide the chat button
    document.getElementById("HeaderUserActions--Chat").remove();
    // Also rerun the code each time document change (i.e new posts are added when user scroll down)
    document.addEventListener("DOMNodeInserted", kill_ads)
})();