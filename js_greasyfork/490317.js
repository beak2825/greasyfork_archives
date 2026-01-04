// ==UserScript==
// @name         天雪快速找免完成量种子
// @namespace    https://gist.github.com/cwzsquare/5855176188388631ab192ec69833ecfe
// @version      2024-03-19
// @description  在天雪种子列表只渲染2XSFC、No-cast、FC标签的行来挑选下载，对新人更加友好
// @author       NeXT
// @match        https://skyeysnow.com/forum.php?mod=torrents
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490317/%E5%A4%A9%E9%9B%AA%E5%BF%AB%E9%80%9F%E6%89%BE%E5%85%8D%E5%AE%8C%E6%88%90%E9%87%8F%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/490317/%E5%A4%A9%E9%9B%AA%E5%BF%AB%E9%80%9F%E6%89%BE%E5%85%8D%E5%AE%8C%E6%88%90%E9%87%8F%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义观察器的回调函数
    var observerCallback = function(mutationsList, observer) {
        // 在变化发生时重新执行脚本
        executeScript();
    };

    // 创建一个观察器实例
    var observer = new MutationObserver(observerCallback);

    // 配置观察器以观察目标节点的子节点变化
    var observerConfig = {
        childList: true,
        subtree: true
    };

    // 启动观察器，并指定观察的目标节点
    observer.observe(document.body, observerConfig);

    // 执行脚本的函数
    function executeScript() {
        // 获取所有的table元素
        var tables = document.querySelectorAll('table.torrents');

        // 遍历每个table元素
        tables.forEach(function(table) {
            // 获取所有的行元素
            var rows = table.querySelectorAll('tr');

            // 遍历每一行
            rows.forEach(function(row, index) {
                // 只渲染第一行和符合条件的行
                if (index === 0 || (row.querySelector('tr > td:nth-child(2) > table.torrentname > tbody > tr:first-child > td:first-child > span:has(img.sp_0, img.sp_00, img.sp_000)'))) {
                    row.style.display = 'table-row'; // 显示行
                } else {
                    row.style.display = 'none'; // 隐藏行
                }
            });
        });
    }

    // 第一次执行脚本
    executeScript();
})();