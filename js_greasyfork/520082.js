// ==UserScript==
// @name         哪吒监控v0后台一键脚本修复
// @namespace    https://rong6.cn
// @version      1.0
// @description  修复哪吒监控v0版本后台复制的Agent一键安装脚本安装无效的问题。
// @author       rong6
// @match        *://*.*/server
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520082/%E5%93%AA%E5%90%92%E7%9B%91%E6%8E%A7v0%E5%90%8E%E5%8F%B0%E4%B8%80%E9%94%AE%E8%84%9A%E6%9C%AC%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/520082/%E5%93%AA%E5%90%92%E7%9B%91%E6%8E%A7v0%E5%90%8E%E5%8F%B0%E4%B8%80%E9%94%AE%E8%84%9A%E6%9C%AC%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('copy', function (e) {
        // 阻止默认复制行为
        e.preventDefault();

        // 从选中的内容获取复制内容
        let selection = window.getSelection().toString();

        // 替换目标链接
        const oldLink = "https://raw.githubusercontent.com/nezhahq/scripts/main/install.sh";
        const newLink = "https://raw.githubusercontent.com/rong6/nezha-v0/master/install.sh";

        if (selection.includes(oldLink)) {
            selection = selection.replace(oldLink, newLink);
        }

        // 将修改后的内容设置为新的剪切板内容
        e.clipboardData.setData('text/plain', selection);
    });
})();