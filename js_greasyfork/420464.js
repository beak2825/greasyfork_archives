// ==UserScript==
// @name        Foodpanda original price tag
// @namespace   https://github.com/gslin/foodpanda-original-price-tag
// @match       https://www.foodpanda.com.tw/*
// @grant       none
// @version     0.20210527.0
// @author      Gea-Suan Lin <gslin@gslin.org>
// @description Highlight original price tag for Foodpanda.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/420464/Foodpanda%20original%20price%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/420464/Foodpanda%20original%20price%20tag.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let style = 'background: yellow;';

    let ob = new window.MutationObserver(events => {
        events.forEach(ev => {
            ev.addedNodes.forEach(() => {
                document.querySelectorAll('li.vendor-characteristic > span').forEach(el => {
                    if (el.innerText == '<店內價>') {
                        el.closest('figcaption').setAttribute('style', style);
                    }
                });
            });
        });
    });

    ob.observe(document, {
        childList: true,
        subtree: true,
    });
})();
