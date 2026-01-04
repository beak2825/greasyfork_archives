// ==UserScript==
// @name         剪贴板属于用户！！！
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  剪贴板属于用户！
// @author       LWF
// @license       MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512792/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%B1%9E%E4%BA%8E%E7%94%A8%E6%88%B7%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/512792/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%B1%9E%E4%BA%8E%E7%94%A8%E6%88%B7%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储每个网站的拒绝次数
    const refusalCounts = {};

    // 检测剪贴板写入尝试
    document.addEventListener('copy', function(e) {
        // 如果用户已经永久拒绝，则阻止复制
        if (refusalCounts[window.location.hostname] === 3) {
            e.preventDefault();
            return;
        }

        // 弹出对话框询问用户是否允许复制
        const allowCopy = confirm('您是否允许此网站复制内容到剪贴板？');

        if (!allowCopy) {
            // 用户拒绝复制
            e.preventDefault();

            // 更新拒绝次数
            if (refusalCounts[window.location.hostname]) {
                refusalCounts[window.location.hostname]++;
            } else {
                refusalCounts[window.location.hostname] = 1;
            }

            // 如果连续拒绝三次，则永久阻止
            if (refusalCounts[window.location.hostname] === 3) {
                alert('您已永久拒绝此网站的剪贴板访问权限。');
            }
        }
    });
})();