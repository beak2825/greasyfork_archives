// ==UserScript==
// @name SoundCloud Hide Reposts (OBSOLETE)
// @namespace http://axelsparkster.gg
// @version 1.0
// @author Axel Sparkster
// @description Remove reposts from your SoundCloud stream. Loosely based off of ABS's "SoundCloud Hide Reposts" script (v1.2), modified to work with Chrome > v127.0.
// @match *://soundcloud.com/feed
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501872/SoundCloud%20Hide%20Reposts%20%28OBSOLETE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501872/SoundCloud%20Hide%20Reposts%20%28OBSOLETE%29.meta.js
// ==/UserScript==

console.log("Starting SoundCloud repost hide tool.");

function startMain() {
    // Observe #content for any changes.
    var target = document.querySelector("#content")

    // Observe it for the direct children and all descendants of the node.
    var config = { childList: true, subtree: true };

    // Upon a change, check to see if the item is a repost, and remove it from the tree if so.
    var observer = new MutationObserver(mutations => {
        for(const mutation of mutations) {
            for(const addedNode of mutation.addedNodes) {
                if(addedNode.className === "soundList__item") {
                    if (addedNode.getElementsByClassName("sc-ministats-reposts").length > 0)
                    {
                        addedNode.remove();
                        console.log(addedNode);
                    }
                }
            }
        }
    });

    // Start observing #content.
    observer.observe(target, config);
}
startMain();