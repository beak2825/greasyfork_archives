// ==UserScript==
// @name                Zhihu.com Dark Mode
// @name:zh-CN          知乎黑暗模式
// @name:zh-TW          知乎黑暗模式
// @namespace           https://www.zhihu.com/
// @version             0.7
// @description         Enable Zhihu.com Dark Mode
// @description:zh-CN   开启知乎黑暗模式
// @description:zh-TW   开启知乎黑暗模式
// @author              老蛤
// @match               *://*.zhihu.com/*
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/404391/Zhihucom%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/404391/Zhihucom%20Dark%20Mode.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const ignoreList = [
        'link.zhihu.com',
        'video.zhihu.com',
        'www.zhihu.com/pub/book',
        'www.zhihu.com/tardis',
    ];

    const checkURL = (url) => {
        for (const u of ignoreList) {
            if (url.indexOf(u) !== -1) {
                return false
            }
        }
        return true;
    };

    if (checkURL(location.href) && document.querySelector('html').getAttribute('data-theme') !== 'dark') {
        const url = new URL(location.href);
        const params = new URLSearchParams(url.search);
        params.set('theme', 'dark');
        url.search = params.toLocaleString();
        location.href = url.href;
    }
})();
