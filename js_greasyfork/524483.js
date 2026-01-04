// ==UserScript==
// @name         搜索自动添加高级语法
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在搜索时自动添加自定义的高级语法，支持百度、谷歌、必应，支持移动端和电脑端
// @author       神楽
// @match        *://www.google.com/*
// @match        *://www.baidu.com/*
// @match        *://m.baidu.com/*
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524483/%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E9%AB%98%E7%BA%A7%E8%AF%AD%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/524483/%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E9%AB%98%E7%BA%A7%E8%AF%AD%E6%B3%95.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 需要添加的高级语法，可根据需要修改
    const blockedKeyword = "-zhihu";
 
    // 白名单关键词（精准匹配）
    const whitelist = [
        "翻译",
        "ip",
        "测速"
    ]; // 用户可在此处添加自定义白名单
 
    const searchEngines = {
        google: ["q"],
        baidu: ["wd", "word"],
        bing: ["q"]
    };
 
    function getQueryParams(url) {
        return new URLSearchParams(new URL(url).search);
    }
 
    function isWhitelisted(query) {
        // 转换为小写进行匹配
        const queryLower = query.trim().toLowerCase();
        return whitelist.some(word => queryLower === word.toLowerCase());
    }
 
    function updateSearchQuery(paramNames) {
        const params = getQueryParams(window.location.href);
        let updated = false;
 
        for (const paramName of paramNames) {
            const currentQuery = params.get(paramName);
            if (currentQuery) {
                // 白名单检查
                if (isWhitelisted(currentQuery)) return;
 
                if (!currentQuery.includes(blockedKeyword)) {
                    params.set(paramName, `${blockedKeyword} ${currentQuery}`);
                    updated = true;
                    break;
                }
            }
        }
 
        if (updated) {
            window.location.replace(`${window.location.origin}${window.location.pathname}?${params.toString()}`);
        }
    }
 
    const hostname = window.location.hostname;
    for (const [engine, paramNames] of Object.entries(searchEngines)) {
        if (hostname.includes(engine)) {
            updateSearchQuery(paramNames);
            break;
        }
    }
})();
