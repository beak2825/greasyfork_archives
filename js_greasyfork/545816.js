// ==UserScript==
// @name         纽约时报中文网切换为双语
// @license      MIT
// @namespace    surwall07@gmail.com
// @version      1.0
// @description  自动切换纽约时报中文网为双语，并且默认设置为简体中文。
// @author       Marcus Xu
// @match        *://cn.nytimes.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @run-at       document-start
// @grant        GM_cookie

// @downloadURL https://update.greasyfork.org/scripts/545816/%E7%BA%BD%E7%BA%A6%E6%97%B6%E6%8A%A5%E4%B8%AD%E6%96%87%E7%BD%91%E5%88%87%E6%8D%A2%E4%B8%BA%E5%8F%8C%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/545816/%E7%BA%BD%E7%BA%A6%E6%97%B6%E6%8A%A5%E4%B8%AD%E6%96%87%E7%BD%91%E5%88%87%E6%8D%A2%E4%B8%BA%E5%8F%8C%E8%AF%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.pathname === '/zh-hant/') {
        location.href = 'https://cn.nytimes.com/tools/r.html?url=/&langkey=zh-hans'
    }

    // 详情文章页面，比如 "/technology/20250814/coding-ai-jobs-students/"
    const articlePattern = /^\/[a-z-]+\/\d+\/[a-z0-9-]+\//i;

    if (articlePattern.test(location.pathname)) {
        // 当前页面是文章详情页面
        console.log('文章详情页面')
        if (location.pathname.endsWith('/zh-hant/')) {
            location.pathname = location.pathname.replace('/zh-hant/', '/zh-hans/dual/')
        } else if (location.pathname.endsWith('/zh-hans/')) {
            location.pathname += 'dual/'
        } else if (location.pathname.endsWith('/dual/')) {
        } else {
            location.pathname += 'dual/'
        }
    }

})();