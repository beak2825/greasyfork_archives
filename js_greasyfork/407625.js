// ==UserScript==
// @name         Remove Twitch Unfollow Button
// @namespace    https://greasyfork.org/de/users/669631
// @version      0.1
// @license      MIT
// @description  Ever unfollowed on accident and ruined your !followage? No more!
// @author       xiasou_
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407625/Remove%20Twitch%20Unfollow%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/407625/Remove%20Twitch%20Unfollow%20Button.meta.js
// ==/UserScript==

(function() {
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    function allDescendants (node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            allDescendants(child);
            child.parentNode.removeChild(child);
        }
    }

    let observer = new MutationObserver(e => {
        let unfollow_button = document.querySelector('[data-a-target="unfollow-button"]');
        if(unfollow_button) {
            Array.from(unfollow_button.children).forEach(element => allDescendants(element));
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});
})();
