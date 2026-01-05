// ==UserScript==
// @name         Netflix play next episode
// @namespace    https://greasyfork.org/en/users/90514
// @version      0.2
// @description  Automatically play the next Netflix episode.
// @author       Tharaka De Silva
// @match        *://www.netflix.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26108/Netflix%20play%20next%20episode.user.js
// @updateURL https://update.greasyfork.org/scripts/26108/Netflix%20play%20next%20episode.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className && mutation.addedNodes[0].className.toString().match(/ptrack-container/)) {
                var button = $(".WatchNext-still-hover-container").find(".PlayIcon");
                button.click();
            }
        });
    });
    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
})();