// ==UserScript==
// @name         文本行数统计
// @version      1.0
// @description  统计选中文本的行数
// @author       GIlbert Wong
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/462198
// @downloadURL https://update.greasyfork.org/scripts/533191/%E6%96%87%E6%9C%AC%E8%A1%8C%E6%95%B0%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/533191/%E6%96%87%E6%9C%AC%E8%A1%8C%E6%95%B0%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化配置
    if (typeof GM_getValue('enableAllUrls') === 'undefined') {
        GM_setValue('enableAllUrls', false);
    }
    if (typeof GM_getValue('enabledUrls') === 'undefined') {
        GM_setValue('enabledUrls', []);
    }

    // 注册菜单命令
    GM_registerMenuCommand('启用所有网站', function() {
        const currentValue = GM_getValue('enableAllUrls');
        GM_setValue('enableAllUrls', !currentValue);
        alert((!currentValue ? '已启用' : '已禁用') + '所有网站');
    });

    GM_registerMenuCommand('管理网址列表', function() {
        const urls = GM_getValue('enabledUrls', []);
        const input = prompt('请输入要启用的网址（多个网址用英文逗号分隔）：\n当前启用的网址：\n' + urls.join('\n'), urls.join(','));
        if (input !== null) {
            const newUrls = input.split(',').map(url => url.trim()).filter(url => url);
            GM_setValue('enabledUrls', newUrls);
            alert('网址列表已更新！');
        }
    });

    // 检查当前URL是否启用
    const currentUrl = window.location.href;
    const enabledUrls = GM_getValue('enabledUrls', []);
    const enableAllUrls = GM_getValue('enableAllUrls', false);

    if (enableAllUrls || enabledUrls.some(url => currentUrl.includes(url))) {
        // 监听鼠标抬起事件
        document.addEventListener('mouseup', function() {
            const selection = window.getSelection();
            if (selection && selection.toString().trim()) {
                // 获取选中的文本
                const text = selection.toString();
                // 计算行数
                const lineCount = text.split('\n').length;

                // 创建弹窗
                const popup = document.createElement('div');
                popup.style.cssText = `
                    position: fixed;
                    padding: 10px 15px;
                    background: #333;
                    color: white;
                    border-radius: 5px;
                    font-size: 14px;
                    z-index: 10000;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    pointer-events: none;
                    transition: opacity 0.3s;
                `;
                popup.textContent = `选中了 ${lineCount} 行`;

                // 获取选中文本的位置
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // 设置弹窗位置
                popup.style.left = `${rect.left + window.scrollX}px`;
                popup.style.top = `${rect.bottom + window.scrollY + 10}px`;

                // 添加到页面
                document.body.appendChild(popup);

                // 2秒后移除弹窗
                setTimeout(() => {
                    popup.style.opacity = '0';
                    setTimeout(() => popup.remove(), 300);
                }, 2000);
            }
        });
    }
})();