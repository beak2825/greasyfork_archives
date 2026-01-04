// ==UserScript==
// @name         remove rizzitgo pop-up limit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically remove the pop-up limit on RizzitGo by detecting and closing the "Unsellable items" modal.
// @author       Horjer
// @match        https://rizzitgo.com/*
// @match        https://www.rizzitgo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540940/remove%20rizzitgo%20pop-up%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/540940/remove%20rizzitgo%20pop-up%20limit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function bypassPurchaseLimit() {
        const unsellableTag = document.querySelector('span.ant-tag-error');
        if (unsellableTag && unsellableTag.textContent.includes('Unsellable items')) {
            const modalDiv = unsellableTag.closest('div.ant-modal-root').parentElement;
            if (modalDiv) {
                modalDiv.remove();
                console.log('RizzitBuy purchase limit bypassed. Unsellable items prompt removed.');
            }
        }
    }

    function modifyPageStyles() {
        const style = document.createElement('style');
        style.textContent = `
            html, body {
                overflow-y: auto !important;
                width: calc(100% - 4px) !important;
            }
        `;

        document.head.appendChild(style);
        console.log('Page styles modified: overflow-y set to auto.');
    }


    const observer = new MutationObserver(() => {
        bypassPurchaseLimit();
        modifyPageStyles();
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    bypassPurchaseLimit();
    modifyPageStyles();
})();