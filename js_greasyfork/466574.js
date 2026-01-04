// ==UserScript==
// @name         Google Drive Column Hiding
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hiding some columns
// @author       You
// @license MIT
// @match        https://drive.google.com/*
// @icon         https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png
// @grant        none
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/466574/Google%20Drive%20Column%20Hiding.user.js
// @updateURL https://update.greasyfork.org/scripts/466574/Google%20Drive%20Column%20Hiding.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('trigger in main-window:', window.location === window.parent.location);
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            function trigger(handler, delay) {
                setTimeout(() => {
                    const result = handler();
                    console.log('handle result: ', result);
                    if (result) return;
                    else trigger(handler, delay);
                }, delay);
            }

            trigger(() => {
                const items = document.querySelectorAll('[data-column-field="8"]');
                items.forEach(item => {
                    item.style.display = 'none';
                });
                return items.length > 0;
            }, 1000);
        }
    };

})();