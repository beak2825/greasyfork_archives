// ==UserScript==
// @name         Redeem Microsoft Store Freebie
// @namespace    https://greasyfork.org/users/34380
// @version      20101011
// @description  微软商店购买免费品
// @match        https://www.microsoft.com/*/p/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412893/Redeem%20Microsoft%20Store%20Freebie.user.js
// @updateURL https://update.greasyfork.org/scripts/412893/Redeem%20Microsoft%20Store%20Freebie.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const $des = document.querySelector('.caption.text-muted');
    if ($des && $des.innerText.match(/100%/)) {
        const mClick = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        document.querySelector('#buttonPanel_AppIdentityBuyButton').dispatchEvent(mClick);
        setInterval(() => {
            if (document.querySelector('.pi-pti')) {
                window.close();
            }
        }, 5000);
    }
})();