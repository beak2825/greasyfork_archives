// ==UserScript==
// @name         移除知乎热门(remove zhihu top story)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       rainyleo
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41102/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%83%AD%E9%97%A8%28remove%20zhihu%20top%20story%29.user.js
// @updateURL https://update.greasyfork.org/scripts/41102/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%83%AD%E9%97%A8%28remove%20zhihu%20top%20story%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function remove() {
        const items = [...document.querySelectorAll('.TopstoryItem')];
        if (items.length) {
            for (const item of items) {
                const title = item.querySelector('.FeedSource-firstline');
                if (title && title.textContent.includes('热门内容')) {
                    item.remove();
                }
            }
        }
    }
    remove();

    const container = document.querySelector(".TopstoryMain >div");
    const ob = new MutationObserver(remove);
    const config = { childList: true };
    ob.observe(container, config);

})();