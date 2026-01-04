// ==UserScript==
// @name         YT-no-shorts-no-posts
// @namespace    http://tampermonkey.net/
// @version      2025-04-21
// @description  Removes shorts and community posts from the YouTube homepage
// @author       You
// @include      *://*.youtube.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533553/YT-no-shorts-no-posts.user.js
// @updateURL https://update.greasyfork.org/scripts/533553/YT-no-shorts-no-posts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function removeElementsByXpath(path) {
        let element = getElementByXpath(path); // Select elements by class
        element.remove(); // Remove each element
    }
    const observer = new MutationObserver(() => removeElementsByXpath('//ytd-rich-shelf-renderer[@is-shorts=""]/../..'));
    observer.observe(document.body, { childList: true, subtree: true });

    const observer2 = new MutationObserver(() => removeElementsByXpath('//span[.="Latest YouTube posts"]/../../../../../../../../..'));
    observer2.observe(document.body, { childList: true, subtree: true });
})();