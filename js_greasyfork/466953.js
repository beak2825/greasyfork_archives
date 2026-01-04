// ==UserScript==
// @name         Wish Large Images
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      0.2
// @description  Enlarge the product images on Wish.com
// @author       JRem
// @match        https://www.wish.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wish.com
// @require      https://cdn.jsdelivr.net/gh/mlcheng/js-toast@ebd3c889a1abaad615712485ce864d92aab4c7c0/toast.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466953/Wish%20Large%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/466953/Wish%20Large%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Sets the size percent of images vs screen space, I would say 25 would be close to max
    const size="20";

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForElm('div[class*="ProductGrid__FeedTileWidthWrapper-"]').then((elm) => {
        console.log('Element Found, Starting Fullscreen');

        var cssClass = document.querySelector('div[class*="ProductGrid__FeedTileWidthWrapper-"]').className.split(" ")
        var css = "."+cssClass[0]+", ."+cssClass[1]+" { width: calc("+size+"vw) !important; }";
        GM_addStyle(css);

    });
    
})();