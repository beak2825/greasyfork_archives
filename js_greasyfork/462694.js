// ==UserScript==
// @name         Cityline - 1 - Enter queue
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try
// @author       You
// @match        https://shows.cityline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cityline.com
// @grant        none
// @license      YES
// @downloadURL https://update.greasyfork.org/scripts/462694/Cityline%20-%201%20-%20Enter%20queue.user.js
// @updateURL https://update.greasyfork.org/scripts/462694/Cityline%20-%201%20-%20Enter%20queue.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

            waitForElm('.btn_cta').then((elm) => {
            console.log('Element is ready');
            //alert("2221221!!");
            document.querySelector('.btn_cta').click();
            //document.getElementById("btn-retry-en-1").click();
        });


    // Your code here...
})();