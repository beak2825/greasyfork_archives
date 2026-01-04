// ==UserScript==
// @name         解决电脑QQ打开网页"已停止访问该网页" "当前网页非官方页面""如需浏览，请使用浏览器访问"
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  解决电脑QQ打开网页提示"已停止访问该网页" "当前网页非官方页面""如需浏览，请使用浏览器访问"。把QQ强行附加的中转链接，还原为原始链接。该脚本对浏览器性能的影响微乎其微，实际使用中完全无法感知性能差异。相反，它通过跳过中转页面的加载，反而提升了整体浏览体验，节省了流量和时间。可以放心使用。
// @author       yezi_jinn
// @match        *://c.pc.qq.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542081/%E8%A7%A3%E5%86%B3%E7%94%B5%E8%84%91QQ%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%22%E5%B7%B2%E5%81%9C%E6%AD%A2%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E9%A1%B5%22%20%22%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%22%22%E5%A6%82%E9%9C%80%E6%B5%8F%E8%A7%88%EF%BC%8C%E8%AF%B7%E4%BD%BF%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AE%BF%E9%97%AE%22.user.js
// @updateURL https://update.greasyfork.org/scripts/542081/%E8%A7%A3%E5%86%B3%E7%94%B5%E8%84%91QQ%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%22%E5%B7%B2%E5%81%9C%E6%AD%A2%E8%AE%BF%E9%97%AE%E8%AF%A5%E7%BD%91%E9%A1%B5%22%20%22%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%22%22%E5%A6%82%E9%9C%80%E6%B5%8F%E8%A7%88%EF%BC%8C%E8%AF%B7%E4%BD%BF%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E8%AE%BF%E9%97%AE%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析URL参数
    const getQueryParam = (name) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    };

    // 支持的URL参数名列表（按优先级）
    const urlParamNames = [
        'url',         // 标准参数
        'pfurl',       // 新发现的参数
        'redirectUrl'  // 可能的其他变体
    ];

    // 查找有效的原始URL参数
    let originalUrl = null;
    for (const paramName of urlParamNames) {
        originalUrl = getQueryParam(paramName);
        if (originalUrl) break;
    }

    // 处理找到的URL
    if (originalUrl) {
        try {
            // 解码URL并验证格式
            const decodedUrl = decodeURIComponent(originalUrl);

            // 验证是否是有效的HTTP(S) URL
            if (/^https?:\/\//i.test(decodedUrl)) {
                // 使用replace导航避免历史记录问题
                window.location.replace(decodedUrl);
            }
        } catch (e) {
            console.error('URL解析错误:', e);
        }
    } else {
        // 调试信息：显示未处理的URL参数
        console.log('未找到原始URL参数，当前URL参数:',
            Array.from(new URLSearchParams(window.location.search).entries()));
    }
})();
