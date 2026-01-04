// ==UserScript==
// @name         Reddit dedupe
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Dedupe reddit
// @author       JC
// @license      MIT
// @match        http*://www.reddit.com/user/*/submitted/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461377/Reddit%20dedupe.user.js
// @updateURL https://update.greasyfork.org/scripts/461377/Reddit%20dedupe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let count = 1;
    function cleanUp() {

        let posts = document.querySelectorAll('[data-scroller-first]')[0].parentElement.childNodes;
        let seen = new Set();

        for (let post of posts) {
            let link = post.getElementsByTagName('a')[0];
            if (seen.has(link.href)) {
                post.remove();
            }
            else {
                seen.add(link.href)
            }
        }

        seen.clear();
        count += 1;

        if (count % 10 == 0) {
            window.scrollBy(0, 1);
            window.scrollBy(0, -1);
        }
};

setInterval(cleanUp, 1);
})();