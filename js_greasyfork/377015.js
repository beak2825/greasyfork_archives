// ==UserScript==
// @name         👏👏 *** review 👏👏
// @version      1
// @description  This userscript replaces most references of <word> review with 👏👏 <word> review 👏👏
// @author       someRandomGuy
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/117222
// @downloadURL https://update.greasyfork.org/scripts/377015/%F0%9F%91%8F%F0%9F%91%8F%20%2A%2A%2A%20review%20%F0%9F%91%8F%F0%9F%91%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/377015/%F0%9F%91%8F%F0%9F%91%8F%20%2A%2A%2A%20review%20%F0%9F%91%8F%F0%9F%91%8F.meta.js
// ==/UserScript==

(function() {
    const body = document.body;

    function reviewTextNode(textNode) {
        textNode.nodeValue = textNode.nodeValue.replace(/(?!\uD83D\uDC4F)(..)(\s|^)([^\s]+?)\s(reviews?)/gi, "$1$2\uD83D\uDC4F\uD83D\uDC4F $3 $4 \uD83D\uDC4F\uD83D\uDC4F");
    }

    function recursiveReview(elm) {
        for (let child of elm.childNodes) {
            if (child instanceof Text) {
                reviewTextNode(child);
            } else if (child.children && child.childNodes.length > 0) {
                recursiveReview(child);
            }
        }
    }

    const observer = new MutationObserver(function(mutations) {
        disconnect();
        for (let mutation of mutations) {
            recursiveReview(mutation.target);
        }
        observe();
    });

    function observe() {
        observer.observe(body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    function disconnect() {
        observer.disconnect();
    }

    function flush() {
        observer.takeRecords();
    }

    recursiveReview(body);
    observe();
})();