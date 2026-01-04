// ==UserScript==
// @name         Remove Banner Ad
// @namespace    
// @version      2025-04-19
// @description  Automatically removes banner "Turn off ad blocker" and "Easter egg"
// @author       Beginner[2023]
// @match        https://xhamster.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xhamster.com
// @grant        none
// @license MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/533358/Remove%20Banner%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/533358/Remove%20Banner%20Ad.meta.js
// ==/UserScript==

(function() {

    // window.addEventListener('load', function() {
    //     let target = document.getElementById('draggableElement');
    //     if (target) {
    //         target.remove();
    //         console.log('[✔] Removed popup with ID draggableElement');
    //     } else {
    //         console.log('[ℹ] ไม่เจอ element ที่มี id = draggableElement');
    //     }
    // });

     var target_queryS = [
        'body > div.main-wrap > div.c88156fa',
        'body > div.main-wrap > div.footer-wrapper',
        'body > div.main-wrap > div[data-role="promo-messages-unpin"]'
    ];

    function check_target() {
        var data = [];

        console.groupCollapsed('REMOVE BANNER AD');

        for (let i = 0; i < target_queryS.length; i++) {
            const query = target_queryS[i];
            const element = document.querySelector(query);

            if (element) {
                console.log('Target:', query);
                console.log('Removed:', false);

                data.push({
                    query_name: query,
                    element: element,
                    removed: false
                });
            } else {
                console.log('Target:', query);
                console.log('Removed:', true);

                data.push({
                    query_name: query,
                    element: null,
                    removed: true
                });
            }
        }

        console.groupEnd();
        return data;
    }

    function remove_element(element, selector) {
        if (element) {
            element.remove();
            console.log(`[✔] Removed: ${selector}`);
        } else {
            console.log(`[ℹ] Not found element has "${selector}"`);
        }
    }

    // Loop until all targets are removed
    let running = setInterval(function () {
        let status = check_target();

        let hasRemaining = false;

        for (const item of status) {
            if (item.element) {
                remove_element(item.element, item.query_name);
                hasRemaining = true;
            }
        }

        if (!hasRemaining) {
            clearInterval(running);
            console.log('[✔] All target elements removed. Stopped interval.');
        }
    }, 300);


})();