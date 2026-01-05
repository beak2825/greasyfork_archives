// ==UserScript==
// @name         UnURLencode
// @namespace    lainscripts_unurlencode
// @version      0.2
// @description  Decode percent-encoded text on visited web pages
// @author       lainverse
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27980/UnURLencode.user.js
// @updateURL https://update.greasyfork.org/scripts/27980/UnURLencode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pctdetect = /%[0-9A-F][0-9A-F]/,
        pctmatch = /(%[0-9A-F][0-9A-F])+/g;
    function crawler(node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                for (let child of node.childNodes) {
                    if (pctdetect.test(child.textContent)) {
                        crawler(child);
                    }
                }
                break;
            case Node.TEXT_NODE:
                node.nodeValue = node.nodeValue.replace(pctmatch, function(match){
                    try {
                        return decodeURIComponent(match);
                    } catch(ignore) {
                        return match;
                    }
                });
        }
    }
    crawler(document.documentElement);

    let o = new MutationObserver(function(mutations) {
        let mutation, node;
        for (mutation of mutations) {
            for (node of mutation.addedNodes) {
                crawler(node);
            }
        }
    });
    o.observe(document.documentElement, {
        childList: true,
        characterData: true,
        subtree: true
    });
})();