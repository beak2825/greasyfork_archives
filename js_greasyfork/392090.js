// ==UserScript==
// @name         移除知乎网页版首页广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  移除知乎首页广告
// @author       chaochaogege
// @match        https://www.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/392090/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/392090/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E7%89%88%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = document.querySelector('.TopstoryItem').parentElement;

    // Options for the observer (which mutations to observe)
    const config = {childList: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for (let i = 0 ; i < mutationsList.length ; i ++) {
            const mutation = mutationsList[i]
            const target = mutation.target
            const length = target.children.length
            const addedNodes = mutation.addedNodes
            if (addedNodes.length === 0 ) continue
            const c = addedNodes[0]
            const cls = c.classList[2]
            if ( cls === "TopstoryItem--advertCard") {
                c.remove()
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config)
    for (const n of targetNode.children){
        if (n.classList[2] === "TopstoryItem--advertCard" ) {
            n.remove()
        }
    }
})();