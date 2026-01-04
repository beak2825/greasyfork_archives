// ==UserScript==
// @name         复制页面localStorage工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在页面上添加按钮，一键复制当前页面的所有localStorage数据
// @author       lisp
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/532542/%E5%A4%8D%E5%88%B6%E9%A1%B5%E9%9D%A2localStorage%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532542/%E5%A4%8D%E5%88%B6%E9%A1%B5%E9%9D%A2localStorage%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并添加按钮
    function addCopyButton() {
        // 移除已存在的按钮（如果存在）
        const existingBtn = document.getElementById('copy-ls-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        // 创建新按钮
        const btn = document.createElement('button');
        btn.id = 'copy-ls-btn';
        btn.textContent = '📋 复制 localStorage';
        btn.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // 添加悬停效果
        btn.addEventListener('mouseover', () => {
            btn.style.background = '#45a049';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = '#4CAF50';
        });

        // 按钮点击事件
        btn.addEventListener('click', () => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }

            const script = `try {
    const data = ${JSON.stringify(data, null, 2)};
    console.log('开始导入 ' + Object.keys(data).length + ' 条数据...');
    Object.keys(data).forEach(k => localStorage.setItem(k, data[k]));
    console.log('✅ 导入完成');
} catch(e) {
    console.error('❌ 导入失败:', e);
}
// localStorage 导入工具 (生成于 ${new Date().toLocaleString()})`;

            // 使用油猴API复制到剪贴板（兼容不同版本的Tampermonkey）
            try {
                // 方法1：新版Tampermonkey返回Promise
                if (GM_setClipboard(script).then) {
                    GM_setClipboard(script)
                        .then(() => showSuccess())
                        .catch(() => fallbackCopy(script));
                }
                // 方法2：旧版Tampermonkey不返回Promise
                else {
                    GM_setClipboard(script, 'text');
                    showSuccess();
                }
            } catch (e) {
                // 方法3：如果GM_setClipboard失败，回退到prompt方法
                fallbackCopy(script);
            }
        });

        document.body.appendChild(btn);
    }

    function showSuccess() {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                title: '复制成功',
                text: '已复制localStorage导入代码到剪贴板！',
                timeout: 2000
            });
        } else {
            alert('已复制localStorage导入代码到剪贴板！');
        }
    }

    function fallbackCopy(text) {
        prompt('请手动复制以下代码到目标网页执行', text);
    }

    // 页面加载完成后添加按钮
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(addCopyButton, 1);
    } else {
        window.addEventListener('DOMContentLoaded', addCopyButton);
    }
})();