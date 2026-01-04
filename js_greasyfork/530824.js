// ==UserScript==
// @name         炼金状态提示器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  根据页面标题显示炼金状态提示
// @author       YourName
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530824/%E7%82%BC%E9%87%91%E7%8A%B6%E6%80%81%E6%8F%90%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530824/%E7%82%BC%E9%87%91%E7%8A%B6%E6%80%81%E6%8F%90%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建容器元素
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '75%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'none'
    });

    // 创建状态提示元素
    const statusIndicator = document.createElement('div');
    Object.assign(statusIndicator.style, {
        fontSize: '120px',
        fontWeight: 'bold',
        color: 'rgba(255, 0, 0, 0.5)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        lineHeight: '0.8' // 添加行高使文字紧贴
    });

    // 小字提示
    const smallText = document.createElement('div');
    Object.assign(smallText.style, {
        fontSize: '20px',
        color: 'rgba(255, 255, 255, 0.7)',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        marginBottom: '8px' // 微调间距
    });
    smallText.textContent = '注意，你正在';

    // 组装元素
    container.appendChild(smallText);
    container.appendChild(statusIndicator);
    document.body.appendChild(container);

    // 标题变化检测器
    const titleObserver = new MutationObserver(() => {
        const match = document.title.match(/炼金 - (\S+)/);
        if (match) {
            container.style.display = 'flex'; // 改为控制容器显示
            statusIndicator.textContent = match[1].substr(0,2);
        } else {
            container.style.display = 'none';
        }
    });

    // 开始观察标题变化
    titleObserver.observe(document.querySelector('title'), {
        childList: true,
        subtree: true,
        characterData: true
    });

    // 初始检测
    titleObserver.takeRecords();
})();