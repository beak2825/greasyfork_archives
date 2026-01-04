// ==UserScript==
// @name         Google搜索的网页手机版转电脑版
// @namespace    http://tampermonkey.net/
// @version      20251207
// @description  目前只匹配了豆瓣，微博和贴吧
// @author       leone
// @match        https://m.douban.com/*
// @match        https://m.weibo.cn/*
// @match        https://waptieba.baidu.com/*
// @match        https://wapforum.baidu.com/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486994/Google%E6%90%9C%E7%B4%A2%E7%9A%84%E7%BD%91%E9%A1%B5%E6%89%8B%E6%9C%BA%E7%89%88%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/486994/Google%E6%90%9C%E7%B4%A2%E7%9A%84%E7%BD%91%E9%A1%B5%E6%89%8B%E6%9C%BA%E7%89%88%E8%BD%AC%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==

(function() {
    if (document.URL.includes('m.douban.com')) {
        const hasSubjectPath = /\/subject_collection(\/|$)/i.test(document.URL);
        if (!hasSubjectPath) {
            window.location.replace(document.URL.replace(/https:\/\/(.*?)\.(.*)/, 'https://www.$2'));
        }    
    }
    else if (document.URL.includes('m.weibo.cn')) {
        window.location.replace(document.URL.replace(/https:\/\/(.*?)\.(.*?)\.cn(.*)/, 'https://www.$2.com$3'));
    }
    else if (document.URL.includes('waptieba.baidu.com')) {
        window.location.replace(document.URL.replace(/https:\/\/wap(.*)/, 'https://$1'));
    }
    else if (document.URL.includes('wapforum.baidu.com')) {
        window.location.replace(document.URL.replace(/https:\/\/wapforum(.*)/, 'https://tieba$1'));
    }
})();