// ==UserScript==
// @name         Block all ads (Undetectable)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks all ads on the current webpage in an undetectable way
// @author       JXJ
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459694/Block%20all%20ads%20%28Undetectable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459694/Block%20all%20ads%20%28Undetectable%29.meta.js
// ==/UserScript==

(function() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.nodeType === 1 && node.nodeName === "IFRAME") {
                        node.style.display = "none";
                        node.style.visibility = "hidden";
                    }
                }
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
