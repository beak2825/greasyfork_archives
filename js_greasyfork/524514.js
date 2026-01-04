// ==UserScript==
// @name         MissAv去广告
// @license      GPL-3.0 License
// @namespace    etai2019
// @version      0.1.1
// @description  MissAv增强
// @author       etai2019
// @match        https://missav.ai/*
// @match        https://91short.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524514/MissAv%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/524514/MissAv%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.open = () => {};

    // selector for nodes to remove
    const selectorsForNodeToRemove = [
        'div[class*="root--"]',
        'div[class="adm"]',
        'div[class="highlight-box"]',
        '.player-info:nth-of-type(n+3)'
    ]
    for(let selector of selectorsForNodeToRemove) {
        const nodes = Array.from(document.querySelectorAll(selector))
        for(let node of nodes) {
            node.remove();
        }
    }

    const a$List = Array.from(document.querySelectorAll('a[href*="bit.ly"]'))
    for(let a$ of a$List){
        a$.parentNode.remove();
    }

    // 监听DOM变化
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const callback = function(mutationsList) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if(document.querySelector('.adm') != null) {
                        node.parentNode.removeChild(node);
                    };

                });
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);


})();
