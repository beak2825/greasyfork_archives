// ==UserScript==
// @name         CSDN搜索结果屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动隐藏搜索引擎中的CSDN结果并显示统计信息
// @author       GNEH
// @match        *://www.baidu.com/s*
// @match        *://www.google.com/search*
// @match        *://cn.bing.com/search*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523751/CSDN%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/523751/CSDN%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建统计面板
    const createStatsPanel = () => {
        const panel = document.createElement('div');
        panel.style = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        panel.innerHTML = `
            <div id="csdn-stats">隐藏CSDN结果：<span id="count">0</span> 条</div>
            <div id="csdn-links" style="margin-top:10px;max-height:200px;overflow-y:auto"></div>
        `;
        document.body.appendChild(panel);
        return {count: panel.querySelector('#count'), links: panel.querySelector('#csdn-links')};
    };

    // 检测并隐藏CSDN结果
    const processResults = (container, stats) => {
        let hiddenCount = 0;
        const csdnLinks = [];
        
        // 遍历搜索结果项
        container.querySelectorAll('.result, .g, .b_algo').forEach(item => {
            // 百度搜索结果判断
            const isBaidu = item.querySelector('.c-container') !== null;
            // 谷歌/Bing结果判断
            const isGoogle = item.querySelector('.tF2Cxc, .b_algo') !== null;
            
            // 检测CSDN特征
            const isCSDN = (isBaidu && item.querySelector('.c-color-gray')?.textContent.includes('CSDN')) ||
                          (isGoogle && item.querySelector('h3')?.textContent.includes('CSDN')) ||
                          item.querySelector('a')?.href.includes('csdn.net');

            if (isCSDN) {
                hiddenCount++;
                const link = item.querySelector('a')?.href;
                if (link) csdnLinks.push(link);
                item.style.display = 'none';
            }
        });

        // 更新统计面板
        stats.count.textContent = hiddenCount;
        stats.links.innerHTML = csdnLinks.map(link => 
            `<a href="${link}" target="_blank" style="display:block;color:#4CAF50;margin:5px 0">${link}</a>`
        ).join('');
    };

    // 主执行函数
    const init = () => {
        const statsPanel = createStatsPanel();
        const observer = new MutationObserver((mutations) => {
            document.querySelectorAll('.result, .g, .b_algo').forEach(container => {
                processResults(container, statsPanel);
            });
        });

        // 初始处理
        document.querySelectorAll('.result, .g, .b_algo').forEach(container => {
            processResults(container, statsPanel);
        });

        // 监听动态加载内容
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 延迟执行避免冲突
    setTimeout(init, 1000);
})();