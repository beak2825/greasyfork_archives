// ==UserScript==
// @name         Remove v2ex.com ad
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove v2ex.com ads
// @author       ficapy
// @match        https://www.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490899/Remove%20v2excom%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/490899/Remove%20v2excom%20ad.meta.js
// ==/UserScript==
 
(() => {
    'use strict';
 
    const targetNode = document.body;
    const config = { childList: true, subtree: true, attributes: true };
 
    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                let nodesToCheck = mutation.addedNodes.length > 0 ? mutation.addedNodes : [mutation.target];
                nodesToCheck.forEach(node => {
                    if (node.nodeType === 1) {
                        const ads = node.querySelectorAll('.wwads-cn,.adsbygoogle');
                        ads.forEach(ad => ad.style.display = 'none');
                    }
                });
                let ad = document.querySelector('div.box > div > a[href="/advertise"]');
                if (ad){
                    ad.parentNode.parentNode.style.display = 'none'
                }
            }
        }
    };
 
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
 
    document.querySelectorAll('.wwads-cn,.adsbygoogle').forEach(ad => ad.style.display = 'none');
    let ad = document.querySelector('div.box > div > a[href="/advertise"]');
    if (ad){
        ad.parentNode.parentNode.style.display = 'none'
    }
})();