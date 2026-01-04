// ==UserScript==
// @name         Hide YouTube Video Views
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Removes all divs on YouTube that contain view counts.
// @author       http://twitter.com/griffinbeels
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451494/Hide%20YouTube%20Video%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/451494/Hide%20YouTube%20Video%20Views.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Every time the page loads new elements, executes the `removeViews` function
    (new MutationObserver(removeViews)).observe(document, {childList: true, subtree: true}); // https://stackoverflow.com/a/47406751
})();

/**
 * Removes views + publish date on the following tested pages (all include scrolling):
 *     - Channel Home
 *     - Channel Videos
 *     - YouTube Home
 *     - YouTube Search
 *     - Explore
 *     - Videos
 *     - Suggested Videos
 */
function removeViews(changes, observer) {
    // https://www.designcise.com/web/tutorial/how-to-remove-all-elements-returned-by-javascripts-queryselectorall-method
    // `metadata-line` is the div that contains views on most pages
    const metadataCollection = document.querySelectorAll('[id=metadata-line]');
    metadataCollection.forEach((elem) => elem.remove());

    // `info-text` is the div that contains views on an actual video page
    document.querySelector("#info-text").remove();

    // Since YouTube lazy loads content, don't disconnect from the observer
}