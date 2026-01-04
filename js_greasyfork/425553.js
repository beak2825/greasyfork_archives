// ==UserScript==
// @name         Add BazQux's proxy for Instagram images
// @namespace    https://github.com/gslin/add-proxy-to-instagram-images-in-bazqux-userscript
// @version      0.20210825.0
// @description  Use BazQux's proxy for preventing from cdninstagram.com's same-origin issue
// @author       Gea-Suan Lin <gslin@gslin.org>
// @match        https://bazqux.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425553/Add%20BazQux%27s%20proxy%20for%20Instagram%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/425553/Add%20BazQux%27s%20proxy%20for%20Instagram%20images.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const r = /^https:\/\/[^\.]+\.cdninstagram\.com\//;
    const proxy_url = 'https://img.bazqux.com/image_proxy/1920x1920/';

    let ob = new window.MutationObserver(events => {
        events.forEach(ev => {
            ev.addedNodes.forEach(node => {
                let imgs = document.getElementsByTagName('img');
                for (let img of imgs) {
                    if (img.src.match(r)) {
                        img.src = proxy_url + img.src;
                    }
                }
            });
        });
    });

    ob.observe(document, {
        childList: true,
        subtree: true,
    });
})();
