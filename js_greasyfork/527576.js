// ==UserScript==
// @name         Bluesky Search External Link Filter
// @description  Hides Bluesky Search posts containing external links.
// @match        https://bsky.app/*
// @version 0.0.1.20250601041223
// @namespace https://bsky.app/
// @downloadURL https://update.greasyfork.org/scripts/527576/Bluesky%20Search%20External%20Link%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/527576/Bluesky%20Search%20External%20Link%20Filter.meta.js
// ==/UserScript==
 
(function () {
    function getElementsByXPath(xpath, context = document) {
        let nodes = document.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return Array.from({ length: nodes.snapshotLength }, (_, i) => nodes.snapshotItem(i));
    }
 
    function isExternalLink(link) {
        return link && !link.href.includes("bsky.app");
    }
 
    function checkAndHidePosts() {
        getElementsByXPath("//div[@id='root']/div/div/div/div/main/div/div/div/div/div/div[2]/div[3]/div/div/div/div/div[2]/div/div")
            .forEach(post => {
                if ([...post.getElementsByTagName("a")].some(isExternalLink)) {
                    if (post.parentElement) post.style.display = "none"; // Hide instead of removing
                }
            });
    }
 
    function observeContainer() {
        let container = document.querySelector("main div div div div div div:nth-child(3)");
        if (container) {
            new MutationObserver(checkAndHidePosts).observe(container, { childList: true, subtree: true });
            checkAndHidePosts();
        }
    }
 
    new MutationObserver(observeContainer).observe(document.body, { childList: true, subtree: true });
    observeContainer();
})();