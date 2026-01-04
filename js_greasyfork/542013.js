// ==UserScript==
// @name         自动生成章节脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动点击生成正文按钮并监控状态
// @author       zhouyanbl
// @match        https://zuojia.baidu.com/aieditor?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542013/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%AB%A0%E8%8A%82%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/542013/%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E7%AB%A0%E8%8A%82%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制按钮
    const btn = document.createElement('button');
    btn.id = 'autoGenBtn';
    btn.textContent = '开始自动生成';
    btn.style.position = 'fixed';
    btn.style.top = '10px'; // 顶部距离
    btn.style.left = '50%'; // 水平居中
    btn.style.transform = 'translateX(-50%)'; // 向左偏移自身宽度的50%达到居中
    btn.style.padding = '12px 25px';
    btn.style.background = '#4CAF50';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '9999';
    btn.style.fontSize = '16px';
    btn.style.fontWeight = 'bold';
    btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    btn.style.transition = 'all 0.3s';

    document.body.appendChild(btn);

    let intervalId = null;

    btn.addEventListener('click', function() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            btn.textContent = '开始自动生成';
            btn.style.background = '#4CAF50';
        } else {
            intervalId = setInterval(autoGenerate, 1000);
            btn.textContent = '运行中...';
            btn.style.background = '#f44336';
        }
    });

    function autoGenerate() {
        // 检查是否有正在加载的章节
        const isLoading = document.querySelector('.outline-item.is-loading');
        if (isLoading) {
            console.log('有章节正在生成中，跳过');
            return;
        }

        // 查找所有操作项
        const items = document.querySelectorAll('.outline-item .operate');

        // 标记是否全部完成
        let allCompleted = true;

        // 查找并点击第一个"生成正文"按钮
        for (const item of items) {
            const textDiv = item.querySelector('.text');
            if (!textDiv) continue;

            if (textDiv.textContent.trim() === '生成正文') {
                allCompleted = false;
                item.click();
                console.log('点击生成按钮');
                break; // 每次只点击第一个
            } else if (textDiv.textContent.trim() === '重新生成') {
                // 正常状态，继续检查
            } else {
                allCompleted = false;
            }
        }

        // 检查所有操作项是否都显示"重新生成"
        if (allCompleted) {
            clearInterval(intervalId);
            intervalId = null;
            btn.textContent = '开始自动生成';
            btn.style.background = '#4CAF50';
            alert('章节生成已完成！');
            console.log('所有章节已完成');
        }
    }
})();