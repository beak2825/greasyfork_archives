// ==UserScript==
// @name         强制跳转到 GreasyFork
// @namespace     https://github.com/richardtyson
// @version       1.5
// @author        Richard Tyson
// @description   彻底绕过 userscript.zone，直接无痕跳转到 GreasyFork（无加载、无历史记录）
// @match         *://userscript.zone/*
// @match         *://www.userscript.zone/*
// @grant         none
// @license       MIT
// @run-at        document-start
// @homepageURL   https://greasyfork.org/zh-CN/scripts
// @supportURL    https://github.com/richardtyson/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/536721/%E5%BC%BA%E5%88%B6%E8%B7%B3%E8%BD%AC%E5%88%B0%20GreasyFork.user.js
// @updateURL https://update.greasyfork.org/scripts/536721/%E5%BC%BA%E5%88%B6%E8%B7%B3%E8%BD%AC%E5%88%B0%20GreasyFork.meta.js
// ==/UserScript==

/*!
 * 强制跳转到 GreasyFork
 * Copyright (c) 2024 Richard Tyson <richard.tyson@example.com>
 *
 * MIT License
 *
 * 权限说明：
 * - 允许自由使用、修改、分发本脚本
 * - 禁止用于违法用途
 * - 作者不承担任何使用责任
 *
 * GitHub: https://github.com/richardtyson/userscripts
 */

(function() {
    'use strict';

    // 0. 定义常量（便于维护）
    const GREASY_FORK_URL = 'https://greasyfork.org/zh-CN/scripts';
    const QUERY_PARAM = 'q';

    // 1. 立即终止页面加载（阻止任何网络请求）
    try {
        window.stop(); // 在支持的环境中立即停止加载
    } catch (e) {
        console.warn('[GreasyFork Redirect] window.stop() failed:', e);
    }

    // 2. 安全提取搜索关键词
    const getSearchKeyword = () => {
        const params = new URLSearchParams(location.search);
        const query = params.get(QUERY_PARAM);
        if (!query) return null;

        try {
            const decoded = decodeURIComponent(query);
            // 如果是URL格式，提取纯净域名（移除协议、www、路径等）
            if (/^https?:\/\//i.test(decoded)) {
                const url = new URL(decoded);
                return url.hostname.replace(/^www\./i, '').split('.')[0]; // 只保留主域名部分
            }
            return decoded.trim(); // 普通搜索词去空格
        } catch (e) {
            return query; // 回退到原始查询
        }
    };

    // 3. 执行跳转逻辑
    const keyword = getSearchKeyword();
    if (keyword) {
        const targetURL = `${GREASY_FORK_URL}?${QUERY_PARAM}=${encodeURIComponent(keyword)}`;
        location.replace(targetURL); // 无痕跳转（不保留历史记录）
    } else {
        // 非搜索页面的兜底处理（可选）
        location.replace(GREASY_FORK_URL);
    }
})();