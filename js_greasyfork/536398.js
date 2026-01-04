// ==UserScript==
// @name         为 iframe 添加全屏按钮
// @namespace    https://guess.me/
// @version      1.3
// @description  为 iframe 添加全屏按钮，可识别 ESC 自动恢复
// @author       nikoo
// @match        *://read.mixyz.xyz/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536398/%E4%B8%BA%20iframe%20%E6%B7%BB%E5%8A%A0%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/536398/%E4%B8%BA%20iframe%20%E6%B7%BB%E5%8A%A0%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '🔲 全屏 iframe';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '99999';
    btn.style.padding = '10px 15px';
    btn.style.fontSize = '14px';
    btn.style.backgroundColor = '#1f2937';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';

    document.body.appendChild(btn);

    let isFull = false;

    btn.addEventListener('click', () => {
        const iframe = document.querySelector('iframe[src^="blob:"]');
        if (!iframe) {
            alert('找不到目标 iframe');
            return;
        }

        if (!isFull) {
            iframe.requestFullscreen().then(() => {
                // 全屏成功后由事件监听器处理按钮状态
            }).catch(err => {
                console.error('无法全屏:', err);
                alert('浏览器限制或 iframe 设置不允许全屏');
            });
        } else {
            document.exitFullscreen();
        }
    });

    // 监听全屏状态变化（包括 ESC 退出）
    document.addEventListener('fullscreenchange', () => {
        isFull = !!document.fullscreenElement;
        btn.textContent = isFull ? '🟥 退出全屏' : '🔲 全屏 iframe';
    });
})();
