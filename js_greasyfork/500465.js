// ==UserScript==
// @name         Block lemmy instances/comments
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  Remove posts and comments from specified instances.
// @author       Shawn Z
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500465/Block%20lemmy%20instancescomments.user.js
// @updateURL https://update.greasyfork.org/scripts/500465/Block%20lemmy%20instancescomments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const target = document.querySelector("#app.lemmy-site");
    const config = { attributes: false, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
        const blockedInstances = ["lemmy.ml", "hexbear.net"]; // EDIT THIS LINE
        for (const instance of blockedInstances) {
            // Updated selectors for posts and comments
            const postSelector = `article.post-container a[href*="@${instance}"]`;
            const commentSelector = `article.comment-node a[href*="@${instance}"]`;

            // Remove posts
            document.querySelectorAll(postSelector).forEach(link => {
                const post = link.closest("article.post-container");
                const divider = post.nextElementSibling;
                console.log(`Removing ${instance} post.`);
                post.remove();
                if (divider?.nodeName === "HR") {
                    divider.remove();
                }
            });

            // Remove comments and their subcomments
            document.querySelectorAll(commentSelector).forEach(link => {
                const comment = link.closest("article.comment-node");
                const commentContainer = comment.closest("li.comment");
                console.log(`Removing ${instance} comment and its subcomments.`);
                commentContainer.remove();
            });
        }
    }
    const observer = new MutationObserver(callback);
    if (target) {
        observer.observe(target, config);
        callback();
    }
})();