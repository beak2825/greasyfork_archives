// ==UserScript==
// @name                Zhihu.com Dark Mode
// @name:zh-CN          知乎黑暗模式-改
// @name:zh-TW          知乎黑暗模式-改
// @namespace           https://www.zhihu.com/
// @version             0.2
// @description         Enable Zhihu.com Dark Mode Mod
// @description:zh-CN   开启知乎黑暗模式
// @description:zh-TW   开启知乎黑暗模式
// @author              kaka
// @match               *://*.zhihu.com/*
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/542764/Zhihucom%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/542764/Zhihucom%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
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
 
    if (checkURL(location.href) && !document.cookie.includes('theme=dark')) {
        document.cookie = "theme=dark; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure; samesite=Lax";
        location.reload();
    }
    
})();
