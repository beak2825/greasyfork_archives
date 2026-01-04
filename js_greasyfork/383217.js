// ==UserScript==
// @name         roblox games filter unhider
// @namespace    yrewuryukhfadasdasfadasdasf
// @version      0.1
// @description  brings back the games filter
// @author       me
// @match        https://www.roblox.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383217/roblox%20games%20filter%20unhider.user.js
// @updateURL https://update.greasyfork.org/scripts/383217/roblox%20games%20filter%20unhider.meta.js
// ==/UserScript==

new MutationObserver(function(mutations) {
    if (document.getElementsByClassName('filter-hidden')[0]) {
        Array.from(document.getElementsByClassName('filter-hidden')).forEach(function(filt){
            filt.style.visibility = "unset";
            filt.style.height = "unset";
        });
    }
}).observe(document, {childList:true, subtree:true});