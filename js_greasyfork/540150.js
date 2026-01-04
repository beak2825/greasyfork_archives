// ==UserScript==
// @name         ITDog广告拦截器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  还你一个干净的ITDog.cn!
// @author       MashiroShinna
// @license      MIT
// @match        *://*.itdog.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540150/ITDog%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540150/ITDog%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function addStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .lantern_left, 
            .lantern_right, 
            .rounded-lg, 
            .top_pic_ad, 
            .gg_link, 
            div[style="padding: 18px 0 0 18px;"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    if (document.head) {
        addStyle();
    } else {
        document.addEventListener('DOMContentLoaded', addStyle);
    }
    
    function observeDOM() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.classList) {
                                if (node.classList.contains('lantern_left') || 
                                    node.classList.contains('lantern_right') || 
                                    node.classList.contains('rounded-lg') || 
                                    node.classList.contains('top_pic_ad') || 
                                    node.classList.contains('gg_link')) {
                                    node.style.display = 'none';
                                }
                            }
                            
                            if (node.tagName === 'DIV' && node.style && node.style.padding === '18px 0 0 18px') {
                                node.style.display = 'none';
                            }
                        }
                    }
                }
            });
        });
        
        const config = { childList: true, subtree: true };
        
        observer.observe(document.body, config);
    }
    
    if (document.body) {
        observeDOM();
    } else {
        document.addEventListener('DOMContentLoaded', observeDOM);
    }
    
    function removeAds() {
        const adSelectors = [
            '.lantern_left', 
            '.lantern_right', 
            '.rounded-lg', 
            '.top_pic_ad', 
            '.gg_link', 
            'div[style="padding: 18px 0 0 18px;"]'
        ];
        
        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });
    }
    
    window.addEventListener('load', removeAds);
    document.addEventListener('DOMContentLoaded', removeAds);
})();
