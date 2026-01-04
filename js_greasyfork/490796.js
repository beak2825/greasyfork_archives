// ==UserScript==
// @name         Remove ios Reddit Promoted
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hide annoying promoted posts by reddit
// @author       ficapy
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490796/Remove%20ios%20Reddit%20Promoted.user.js
// @updateURL https://update.greasyfork.org/scripts/490796/Remove%20ios%20Reddit%20Promoted.meta.js
// ==/UserScript==

(() => {
    'use strict';
    function findAndClickButtonInShadowDom(shadowRoot, titleSelector, buttonSelector) {
        const targetTitle = shadowRoot.querySelector(titleSelector);
        if (targetTitle && targetTitle.textContent.includes('See Reddit in...')) {
            const continueButton = shadowRoot.querySelector(buttonSelector);
            if (continueButton) {
                continueButton.click();
                console.log('Continue按钮已点击');
            }
        }
    }

    const targetNode = document.body;
    const config = { childList: true, subtree: true, attributes: true };

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                let nodesToCheck = mutation.addedNodes.length > 0 ? mutation.addedNodes : [mutation.target];
                nodesToCheck.forEach(node => {
                    if (node.nodeType === 1) {
                        const ads = node.querySelectorAll('shreddit-ad-post, shreddit-comments-page-ad');
                        ads.forEach(ad => ad.style.display = 'none');
                    }
                });

                // 自动选择使用Safari
                let app_selector = document.querySelector('shreddit-experience-tree')?.shadowRoot.querySelector('shreddit-async-loader')?.shadowRoot.querySelector('xpromo-app-selector');
                if (app_selector){
                    findAndClickButtonInShadowDom(app_selector.shadowRoot, 'span[slot="title"]', 'button#secondary-button');
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    document.querySelectorAll('shreddit-ad-post, shreddit-comments-page-ad').forEach(ad => ad.style.display = 'none');
    let app_selector = document.querySelector('shreddit-experience-tree')?.shadowRoot.querySelector('shreddit-async-loader')?.shadowRoot.querySelector('xpromo-app-selector');
    if (app_selector){
        findAndClickButtonInShadowDom(app_selector.shadowRoot, 'span[slot="title"]', 'button#secondary-button');
    }
})();