// ==UserScript==
// @name         Berry Blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove cloudberry from the Nespresso site
// @author       h@lfto.me
// @match        *://www.nespresso.com/*/order/capsules/original
// @match        *://www.nespresso.com/*/home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393052/Berry%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/393052/Berry%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let handle;
    let tries = 20;

    const removeCloudBerry = () => {
        let success = false;
        tries--;
        if (tries <= 0) {
            clearInterval(handle);
            console.log("I can't find any cloudberries here...");
        }

        let berries = [
            { selector: 'article[data-product-code="7550.40"]', up: 1 },
            { selector: 'img[alt="Nordic Cloudberry Variation"]', up: 5 },
        ];

        berries.forEach(({ selector, up = 0 }) => {
            let ele = document.querySelector(selector);
            if (ele) {
                for (let i=0; i<up; i++) {
                    if (ele.parentNode) {
                        ele = ele.parentNode;
                    } else {
                        break;
                    }
                }

                ele.style.display = 'none'; // hide that nasty element
                console.log("I've hidden one of those nasty cloudberries");
                success = true;
            }
        });

        if (success) {
            console.log("I've gotten rid of the cloudberries, my job here is done.");
            clearInterval(handle);
        }
    };

    handle = setInterval(removeCloudBerry, 500);
})();