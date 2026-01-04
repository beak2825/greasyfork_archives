// ==UserScript==
// @name         Remove Reddit Sidebar and Trending
// @namespace    https://lawrenzo.com/p/remove-reddit-sidebar
// @description  Removes the sidebar and trending bar on the front page of Reddit.
// @version      0.2.6
// @author       Lawrence Sim
// @license      WTFPL (http://www.wtfpl.net)
// @grant        unsafeWindow
// @match        *://*.reddit.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/441164/Remove%20Reddit%20Sidebar%20and%20Trending.user.js
// @updateURL https://update.greasyfork.org/scripts/441164/Remove%20Reddit%20Sidebar%20and%20Trending.meta.js
// ==/UserScript==
let allowSidebar = false;
(function() {
    function removeStuff(listing) {
        if(!listing) return;
        let left = Array.from(listing.children)
                        .find(el => !el.classList.contains("ListingLayout-backgroundContainer"));
        if(!left) return;
        let watch = new MutationObserver((mutated, observer) => {
            let trending = listing.querySelector("#TrendingPostsContainer");
            if(trending) trending.remove() && observer.disconnect();
        });
        watch.observe(left, {childList:true, subtree:true});
        let feed = Array.from(left.children)
                        .find(el => el.className);
        if(!feed || feed.children.length != 2) return;
        if(!allowSidebar) {
            feed.children[1].remove();
            feed.children[0].style['margin-right'] = "0";
        }
    }
    let redditWatcher = window.redditWatcher || (unsafeWindow && unsafeWindow.redditWatcher);
    if(redditWatcher) {
        redditWatcher.listing.onUpdate((listing, mutated) => removeStuff(listing));
    } else {
        let listing = document.querySelector(".ListingLayout-outerContainer");
        (new MutationObserver(() => { removeStuff(listing); }))
            .observe(listing, {childList:true, subtree:true});
    }
})();