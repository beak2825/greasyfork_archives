// ==UserScript==
// @name         ZhihuPostCreatedAt
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  在知乎首页帖子标题下方展示发帖时间
// @author       You
// @match        https://www.zhihu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519507/ZhihuPostCreatedAt.user.js
// @updateURL https://update.greasyfork.org/scripts/519507/ZhihuPostCreatedAt.meta.js
// ==/UserScript==

function debounce(wait, func) {
    let timeoutId = null;
    return function debounced(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, wait);
    };
}
function formatDate(date) {
    if (!(date instanceof Date)) {
        throw new Error("Invalid input: Please provide a Date object.");
    }

    const pad = (num) => (num < 10 ? '0' + num : num);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}


(function() {
    'use strict';

    function main() {
        let offset = 0;
        /**
         * 获取页面卡片列表，并插入时间显示
         */
        const insertCreatedAndUpdateTimeForCards = debounce(800, () => {
            const cards = Array.from(document.getElementsByClassName("TopstoryItem"));
            for (let i = offset; i < cards.length; i += 1) {
                insertCreatedAndUpdatedTime(cards[i]);
            }
            offset = cards.length;
        });
        const cache = {};
        function insertCreatedAndUpdatedTime(card) {
            let $created = card.querySelector('meta[itemprop="dateCreated"]');
            if (!$created) {
                $created = card.querySelector('meta[itemprop="datePublished"]');
            }
            const $url = card.querySelector('meta[itemprop="url"]');
            if (!$url || !$created) {
                return;
            }
            const url = $url.getAttribute('content');
            const created = $created.getAttribute("content");
            if (cache[url]) {
                return;
            }
            const $title = card.querySelector(".ContentItem-title");
            const title = $title.innerText;
            if (!$title) {
                return;
            }
            const $created2 = document.createElement("div");
            $created2.style.cssText = "margin: 8px 0; font-size: 14px; color: var(--GBL05A)";
            $created2.textContent = "发布于 " + formatDate(new Date(created));
            $title.parentNode.insertBefore($created2, $title.nextSibling);
            cache[url] = true;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    //
                    insertCreatedAndUpdateTimeForCards();
                }
            }
        });
        observer.observe(document.getElementById("TopstoryContent"), {
            childList: true,
            subtree: true,
        });
    }
    main();
})();