// ==UserScript==
// @name         解除谷歌“手气不错”、知乎链接的重定向（使用Deepseek 优化）
// @name:zh-CN   解除谷歌“手气不错”、知乎链接的重定向（使用Deepseek 优化）
// @name:en-US   Solve Google I'm Feeling Lucky Redirect Problem/ Zhihu Redirect Problem
// @namespace    SolveRedirect
// @version      0.6
// @author       Bilibili Up 漫游挨踢
// @include      *google.*/*
// @include      *link.zhihu.com/*
// @grant        none
// @description:zh-cn  谷歌手气不错以及知乎会阻止跳转网站，此脚本用于解决此问题。
// @description:en-US  Google 's I'm feeling Lucky and Zhihu will cause redirect problem.This script will solve that.
// @description 谷歌手气不错以及知乎会阻止跳转网站，此脚本用于解决此问题。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526960/%E8%A7%A3%E9%99%A4%E8%B0%B7%E6%AD%8C%E2%80%9C%E6%89%8B%E6%B0%94%E4%B8%8D%E9%94%99%E2%80%9D%E3%80%81%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9A%84%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%88%E4%BD%BF%E7%94%A8Deepseek%20%E4%BC%98%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526960/%E8%A7%A3%E9%99%A4%E8%B0%B7%E6%AD%8C%E2%80%9C%E6%89%8B%E6%B0%94%E4%B8%8D%E9%94%99%E2%80%9D%E3%80%81%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9A%84%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%88%E4%BD%BF%E7%94%A8Deepseek%20%E4%BC%98%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通用URI多重解码函数
    function fullyDecodeURIComponent(str) {
        let decoded = str;
        try {
            while (true) {
                const current = decodeURIComponent(decoded);
                if (current === decoded) break;
                decoded = current;
            }
        } catch (e) {
            // 解码出错时返回当前结果
        }
        return decoded;
    }

    // 处理谷歌重定向
    if (location.hostname.includes('google.com') && location.pathname === '/url') {
        const urlParams = new URLSearchParams(location.search);
        const targetUrl = urlParams.get('q');
        if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
            location.href = fullyDecodeURIComponent(targetUrl);
        }
    }

    // 处理知乎重定向
    if (location.hostname === 'link.zhihu.com') {
        const urlParams = new URLSearchParams(location.search);
        const targetUrl = urlParams.get('target');
        if (targetUrl) {
            location.href = fullyDecodeURIComponent(targetUrl);
        }
    }
})();