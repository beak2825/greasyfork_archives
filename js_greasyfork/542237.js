// ==UserScript==
// @name         语雀文档链接直达,避免语雀提醒风险:"如需浏览，请复制后访问。"
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在语雀文档中，点开链接跳转时，直达目标地址。把语雀强行附加的中转链接，还原为原始链接。不再提示：“该链接疑似存在风险，请谨慎操作。如需浏览，请复制后访问。”
// @author       yezi_jinn
// @match        *://www.yuque.com/r/goto*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542237/%E8%AF%AD%E9%9B%80%E6%96%87%E6%A1%A3%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE%2C%E9%81%BF%E5%85%8D%E8%AF%AD%E9%9B%80%E6%8F%90%E9%86%92%E9%A3%8E%E9%99%A9%3A%22%E5%A6%82%E9%9C%80%E6%B5%8F%E8%A7%88%EF%BC%8C%E8%AF%B7%E5%A4%8D%E5%88%B6%E5%90%8E%E8%AE%BF%E9%97%AE%E3%80%82%22.user.js
// @updateURL https://update.greasyfork.org/scripts/542237/%E8%AF%AD%E9%9B%80%E6%96%87%E6%A1%A3%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE%2C%E9%81%BF%E5%85%8D%E8%AF%AD%E9%9B%80%E6%8F%90%E9%86%92%E9%A3%8E%E9%99%A9%3A%22%E5%A6%82%E9%9C%80%E6%B5%8F%E8%A7%88%EF%BC%8C%E8%AF%B7%E5%A4%8D%E5%88%B6%E5%90%8E%E8%AE%BF%E9%97%AE%E3%80%82%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 性能优化：使用最高效的URL参数解析
    const getUrlParam = (name) => {
        // 直接操作URL字符串避免创建URL对象
        const queryStart = window.location.href.indexOf('?');
        if (queryStart === -1) return null;

        const params = window.location.href.slice(queryStart + 1);
        const nameEq = name + '=';
        const pairs = params.split('&');

        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair.startsWith(nameEq)) {
                return pair.slice(nameEq.length);
            }
        }
        return null;
    };

    // 主执行函数（无任何UI操作）
    const redirectImmediately = () => {
        // 1. 获取URL参数
        const encodedUrl = getUrlParam('url');
        if (!encodedUrl) return;

        try {
            // 2. 直接使用原生解码（最快方法）
            const decodedUrl = decodeURIComponent(encodedUrl);

            // 3. 极简URL验证
            if (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://')) {
                // 4. 最高效重定向方式
                window.stop(); // 立即停止页面加载
                window.location.replace(decodedUrl); // 不产生历史记录
            }
        } catch(e) {
            // 最小化错误处理
        }
    };

    // 立即执行（不等待DOM）
    redirectImmediately();
})();