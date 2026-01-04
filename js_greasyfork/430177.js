// ==UserScript==
// @name Hide Podcast Recommendations
// @author Ajay Ramachandran
// @description Hide podcasts from homepage
// @license MIT
// @esversion 6
// @version 1.0.1
// @namespace app.ajay.spotify.podcast
// @include https://open.spotify.com/*
// @downloadURL https://update.greasyfork.org/scripts/430177/Hide%20Podcast%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/430177/Hide%20Podcast%20Recommendations.meta.js
// ==/UserScript==

/// <reference path="../globals.d.ts" />

(function HidePodcasts() {
    setTimeout(() => {
        const mainView = document.getElementsByClassName("Root__main-view")[0];
    
        const observer = new MutationObserver(() => {
            const elements = document.querySelectorAll(`a[href*="/episode/"], a[href*="/show/"]`);
        
            for (const element of elements) {
                let parent = element.parentElement;
                while (!parent || parent.tagName !== "SECTION") {
                    parent = parent.parentElement;
                }
                
                parent.style.display = "none";
            }
        });
        
        observer.observe(mainView, { attributes: true, childList: true, subtree: true });
    }, 7000);
})();
