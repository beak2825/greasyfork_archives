// ==UserScript==
// @name             Replace Favicon for x.com
// @namespace    http://tampermonkey.net/
// @version          1.1
// @description    Replace the favicon of x.com with Twitter's favicon
// @author           6m
// @license           MIT
// @match            https://twitter.com/*
// @match            https://mobile.twitter.com/*
// @match            https://tweetdeck.twitter.com/*
// @match            https://x.com/*
// @match            https://mobile.x.com/*
// @match            https://tweetdeck.x.com/*
// @exclude          https://twitter.com/account/*
// @exclude          https://x.com/account/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/509635/Replace%20Favicon%20for%20xcom.user.js
// @updateURL https://update.greasyfork.org/scripts/509635/Replace%20Favicon%20for%20xcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建新的 favicon 链接元素
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.type = 'image/x-icon';
    newFavicon.href = 'https://abs.twimg.com/favicons/twitter.ico';

    // 查找并替换旧的 favicon
    const oldFavicon = document.querySelector('link[rel="icon"]');
    if (oldFavicon) {
        oldFavicon.parentNode.removeChild(oldFavicon);
    }

    // 添加新的 favicon
    document.head.appendChild(newFavicon);
})();
