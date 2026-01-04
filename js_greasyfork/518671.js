// ==UserScript==
// @name         搜索引擎搜索结果脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽百度、必应、谷歌、yanfex、360、搜狗等搜索引擎的搜索结果中的知乎，CSDN，少数派和好看视频网站
// @author       You
// @match        *://*.baidu.com/*
// @match        *://*.bing.com/*
// @match        *://*.google.com/*
// @match        *://*.yanfex.com/*
// @match        *://*.360.com/*
// @match        *://*.sogou.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518671/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518671/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要屏蔽的网站域名
    const blockedDomains = ["zhihu.com", "www.zhihu.com", "blog.csdn.net", "www.csdn.net","sspai.com",
                            "baijiahao.baidu.com"];

    // 获取所有搜索结果项
    function getSearchResults() {
        if (window.location.hostname.includes("baidu.com")) {
            return document.querySelectorAll("#content_left .result");
        } else if (window.location.hostname.includes("bing.com")) {
            return document.querySelectorAll("#b_results .b_algo");
        } else if (window.location.hostname.includes("google.com")) {
            return document.querySelectorAll("#search .g");
        } else if (window.location.hostname.includes("yanfex.com")) {
            return document.querySelectorAll("#search .result");
        } else if (window.location.hostname.includes("360.com")) {
            return document.querySelectorAll("#result .result-item");
        } else if (window.location.hostname.includes("sogou.com")) {
            return document.querySelectorAll("#result .res-list");
        }
    }

    // 屏蔽指定域名的搜索结果
    function blockResults() {
        const results = getSearchResults();
        results.forEach(result => {
            const link = result.querySelector("a");
            if (link && blockedDomains.some(domain => link.href.includes(domain))) {
                result.style.display = "none";
            }
        });
    }

    // 初始化屏蔽功能
    blockResults();
})();