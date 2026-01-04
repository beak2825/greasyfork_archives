// ==UserScript==
// @name         Forum Ban
// @namespace    bzzt
// @version      20210124.2
// @description  Forum Ban -- you can read, but not post
// @author       bzzt [2465413]
// @match        *.torn.com/forums.php*
// @downloadURL https://update.greasyfork.org/scripts/420567/Forum%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/420567/Forum%20Ban.meta.js
// ==/UserScript==

'use strict';

function removeReplyBox(elem) {
    if (elem.id == 'main-input') {
        const replybox = elem.parentNode.parentNode.parentNode.parentNode.parentNode;
        replybox.parentNode.removeChild(replybox);
    } else {
        //recurse with all children
        if (elem.hasChildNodes()) {
            elem.childNodes.forEach(removeReplyBox);
        }
    }
}

function react(mutation) {
    mutation.addedNodes.forEach(removeReplyBox);
}

function reactAll(mutations) {
    mutations.forEach(react);
}

(function() {
    const target = document.querySelector('#forums-page-wrap');
    const observer = new MutationObserver(reactAll);
    observer.observe(target, { childList: true, subtree: true });
    //observer.disconnect();
})();
