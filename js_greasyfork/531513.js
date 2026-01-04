// ==UserScript==
// @name         电脑端页面www
// @version      1.4
// @namespace    https://greasyfork.org/users/1171320
// @description  匹配移动端常见子域(m. h5. mobile. wap. touch. 3g.)，尝试将移动网址转换为www网址，失败则恢复原始网址。
// @author       yzcjd
// @author2     Lama AI 辅助
// @match        *://m.*/*
// @match        *://h5.*/*
// @match        *://mobile.*/*
// @match        *://wap.*/*
// @match        *://touch.*/*
// @match        *://3g.*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531513/%E7%94%B5%E8%84%91%E7%AB%AF%E9%A1%B5%E9%9D%A2www.user.js
// @updateURL https://update.greasyfork.org/scripts/531513/%E7%94%B5%E8%84%91%E7%AB%AF%E9%A1%B5%E9%9D%A2www.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hostname = location.hostname;

    // 防止跳转死循环
    if (sessionStorage.getItem('__pc_redirected__')) return;

    // 正则匹配常见移动前缀
    const mobilePrefixPattern = /^(m|h5|mobile|wap|touch|3g)\./i;
    if (!mobilePrefixPattern.test(hostname)) return;

    // 将匹配到的移动前缀替换为 www.
    const pcHostname = hostname.replace(mobilePrefixPattern, 'www.');

    // 重新组装完整 PC 版地址
    const pcUrl = location.protocol + '//' + pcHostname + location.pathname + location.search + location.hash;

    // 检查目标PC页面是否存在
    fetch(pcUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                sessionStorage.setItem('__pc_redirected__', '1'); // 设置跳转标记
                window.location.href = pcUrl; // 跳转到PC版
            } else {
                console.warn('[跳转失败] PC版返回状态:', response.status);
            }
        })
        .catch(error => {
            console.warn('[跳转失败] 网络错误:', error);
        });
})();