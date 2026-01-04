// ==UserScript==
// @name         豆包，deepseek，元宝表格优化简洁版
// @namespace    https://greasyfork.org/zh-CN/scripts/538175-%E8%B1%86%E5%8C%85-deepseek-%E5%85%83%E5%AE%9D%E8%A1%A8%E6%A0%BC%E4%BC%98%E5%8C%96%E7%AE%80%E6%B4%81%E7%89%88/feedback
// @supportURL   https://greasyfork.org/zh-CN/scripts/538175-%E8%B1%86%E5%8C%85-deepseek-%E5%85%83%E5%AE%9D%E8%A1%A8%E6%A0%BC%E4%BC%98%E5%8C%96%E7%AE%80%E6%B4%81%E7%89%88/feedback
// @version      1.31
// @description  优化表格显示：标题行和首列内容不换行，表格自适应宽度，移除页面横向滚动条
// @icon         http://www.deepseek.com//favicon.ico
// @author       ddrwin
// @match        *://yuanbao.tencent.com/*
// @match        *://*.deepseek.com/*
// @match        *://*.doubao.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @note         2025.6.8  V1.3 优化表格字体大小，减小表格间隙；
// @downloadURL https://update.greasyfork.org/scripts/538175/%E8%B1%86%E5%8C%85%EF%BC%8Cdeepseek%EF%BC%8C%E5%85%83%E5%AE%9D%E8%A1%A8%E6%A0%BC%E4%BC%98%E5%8C%96%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538175/%E8%B1%86%E5%8C%85%EF%BC%8Cdeepseek%EF%BC%8C%E5%85%83%E5%AE%9D%E8%A1%A8%E6%A0%BC%E4%BC%98%E5%8C%96%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心功能：优化表格显示
    function optimizeTables() {
        document.querySelectorAll('table').forEach(table => {
            // 设置表格基本样式
            table.style.width = '100%';
            table.style.overflowX = 'visible';
            table.style.tableLayout = 'auto';
            table.style.borderCollapse = 'collapse';
            table.style.fontSize = '0.9em'; // 进一步减小字体

            // 处理标题行（第一行）
            const headerRow = table.querySelector('tr:first-child, thead tr:first-child');
            if (headerRow) {
                // 统一标题行样式
                headerRow.style.backgroundColor = '#f5f5f5'; // 统一背景颜色
                
                const headerCells = headerRow.querySelectorAll('th, td');
                const titleFontSize = '0.85em'; // 统一标题行字体大小

                headerCells.forEach(cell => {
                    // 替换中文括号为英文括号以节省空间
                    const originalText = cell.textContent;
                    const newText = originalText
                        .replace(/（/g, '(')
                        .replace(/）/g, ')')
                        .replace(/\s+/g, ' '); // 压缩多余空格
                    
                    cell.textContent = newText;
                    
                    // 标题行样式：居中+不换行+超紧凑内边距
                    cell.style.textAlign = 'center';
                    cell.style.fontWeight = 'bold';
                    cell.style.backgroundColor = '#f5f5f5';
                    cell.style.padding = '4px 6px'; // 最小化内边距
                    cell.style.borderBottom = '2px solid #ddd';
                    cell.style.whiteSpace = 'nowrap'; // 标题行不换行
                    // 减小首行字体两号
                    cell.style.fontSize = '0.85em'; // 小字体
                });
            }

            // 处理所有数据行
            const dataRows = table.querySelectorAll('tr:not(:first-child), tbody tr');
            dataRows.forEach(row => {
                const cells = row.querySelectorAll('td');

                cells.forEach((cell, index) => {
                    // 基本数据行样式
                    cell.style.textAlign = 'left';
                    cell.style.padding = '6px 10px';
                    cell.style.borderBottom = '1px solid #eee';
                    cell.style.wordBreak = 'break-word';

                    // 首列特殊样式（与标题行一致）
                    if (index === 0) {
                        cell.style.whiteSpace = 'nowrap';
                        cell.style.backgroundColor = '#f5f5f5'; // 与标题行相同背景
                        cell.style.fontSize = '0.85em'; // 与标题行相同字体大小
                        cell.style.fontWeight = 'bold'; // 与标题行相同加粗
                        cell.style.textAlign = 'center'; // 居中对齐（同于标题行的居中）
                    } else {
                        cell.style.whiteSpace = 'normal';
                    }
                });
            });
        });

        // 移除页面横向滚动条
        document.body.style.overflowX = 'hidden';
    }

    // 初始执行
    optimizeTables();

    // 监控动态加载的表格
    const observer = new MutationObserver(mutations => {
        let needsOptimization = false;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.tagName === 'TABLE' || node.querySelector('table'))) {
                        needsOptimization = true;
                    }
                });
            }
        });
        
        if (needsOptimization) {
            setTimeout(optimizeTables, 100);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();