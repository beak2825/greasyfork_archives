// ==UserScript==
// @name         QQ PC 链接自动跳转（去尾部斜杠）
// @namespace    https://yourdomain.example/
// @version      1.2
// @description  自动将 c.pc.qq.com/ios.html 的跳转链接重定向到其 'url' 参数指定的目标地址，去除尾部斜杠。
// @author       Your Name
// @match        https://c.pc.qq.com/ios.html?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539032/QQ%20PC%20%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%EF%BC%88%E5%8E%BB%E5%B0%BE%E9%83%A8%E6%96%9C%E6%9D%A0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539032/QQ%20PC%20%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%EF%BC%88%E5%8E%BB%E5%B0%BE%E9%83%A8%E6%96%9C%E6%9D%A0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHref = window.location.href;

    try {
        const currentUrl = new URL(currentHref);
        let targetUrlParam = currentUrl.searchParams.get('url');

        if (targetUrlParam) {
            // 去掉末尾的斜杠或 URL 编码的斜杠
            targetUrlParam = targetUrlParam.replace(/(\/|%2F)+$/, '');

            console.log('跳转到去除尾部斜杠的链接:', targetUrlParam);
            window.location.replace(targetUrlParam);
        } else {
            console.log('未找到 url 参数。');
        }
    } catch (e) {
        console.error('处理 URL 失败:', e);
    }
})();
