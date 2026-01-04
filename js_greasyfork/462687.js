// ==UserScript==
// @name              TikTok解除复制限制
// @name:en           TikTok Relief Copy Limit
// @namespace    https://greasyfork.org/zh-CN/scripts/462687-tiktok%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6
// @version      0.1.1
// @description  用网页浏览TikTok时不允许复制评论内容，现已解除，请随意复制。
// @description:en  Relief the copy limit of the comments when playing TikTok webside in browser, Now, Arbitrary copy!
// @author       Alan636
// @match       *.tiktok.com/*
// @icon         https://www.tiktok.com/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/462687/TikTok%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/462687/TikTok%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sleep = time => new Promise(rs => setTimeout(rs, time))
    const main = async () => {
        while(true) {
            await sleep(1500)
            const ctag = document.querySelector('[data-e2e="comment-level-1"]')
            if (!ctag) continue
            var eles = document.getElementsByTagName('*');
            for (var i = 0; i < eles.length; i++) {
                eles[i].style.userSelect = 'text';
            }
        }
    }
    main();
})();