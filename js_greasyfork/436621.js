// ==UserScript==
// @name               Zhihu Link Replacer
// @name:zh-CN         禁用知乎外链跳转提示
// @version            0.3
// @description        Remove 'leaving zhihu' prompt when accessing external link
// @description:zh-CN  移除网页版知乎的 "即将离开知乎" 外链跳转提示
// @author             ReekyStive
// @match              *://*.zhihu.com/*
// @icon               https://static.zhihu.com/heifetz/favicon.ico
// @grant              none
// @license            MIT
// @namespace http://reeky.org/
// @downloadURL https://update.greasyfork.org/scripts/436621/Zhihu%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/436621/Zhihu%20Link%20Replacer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const replace = function () {
        console.log('[Zhihu Link Replacer] Replacing...');
        const links = document.querySelectorAll('.external, .LinkCard');
        let count = 0;
        for (let item of links) {
            const link = item.getAttribute('href');
            const matcher = /.*?link\.zhihu\.com\/\?target=/i;
            const originalLink = decodeURIComponent(link.replace(matcher, ''));
            if (link !== originalLink) {
                console.log('[Zhihu Link Replacer] Replaced ' + originalLink);
                count += 1;
            }
            item.setAttribute('href', originalLink);
        }
        console.log(`[Zhihu Link Replacer] Replaced ${count} links`);
    };

    const intervalId = setInterval(() => { replace(); }, 3000);
    setTimeout(() => {
        clearInterval(intervalId);
        console.log(`[Zhihu Link Replacer] Stopped replace task`);
    }, 60000);
})();
