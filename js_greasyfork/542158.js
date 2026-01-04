// ==UserScript==
// @name         Site Blocker, more focused 屏蔽特定网站让你更专注
// @namespace    https://greasyfork.org/users/1111205-geekfox
// @version      3.7  // 更新版本号
// @description  屏蔽分心网站并支持手动管理屏蔽列表，显示全屏提醒以保持专注
// @author       GeekFox
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542158/Site%20Blocker%2C%20more%20focused%20%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E7%BD%91%E7%AB%99%E8%AE%A9%E4%BD%A0%E6%9B%B4%E4%B8%93%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542158/Site%20Blocker%2C%20more%20focused%20%E5%B1%8F%E8%94%BD%E7%89%B9%E5%AE%9A%E7%BD%91%E7%AB%99%E8%AE%A9%E4%BD%A0%E6%9B%B4%E4%B8%93%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======= 配置区域 =======
    const DEFAULT_BLOCKED_SITES = [
        "jandan.net",
        "zhihu.com"
    ];
    const DEFAULT_TEMP_ACCESS = true; // 默认允许临时浏览
    const WARNING_TEXT = "Be Focused!"; // 警告文本
    const BACKGROUND_COLOR = "#ffffff"; // 背景颜色（白色）
    const TEXT_COLOR = "#000000";       // 文字颜色（黑色）
    // ======================

    // 获取存储的屏蔽网站列表
    function getBlockedSites() {
        const storedSites = GM_getValue('blockedSites');
        return storedSites !== undefined ? storedSites : DEFAULT_BLOCKED_SITES;
    }

    // 保存屏蔽网站列表
    function saveBlockedSites(sites) {
        GM_setValue('blockedSites', sites);
    }

    // 获取临时访问开关状态
    function getTempAccessEnabled() {
        const storedValue = GM_getValue('tempAccessEnabled');
        return storedValue !== undefined ? storedValue : DEFAULT_TEMP_ACCESS;
    }

    // 设置临时访问开关状态
    function setTempAccessEnabled(enabled) {
        GM_setValue('tempAccessEnabled', enabled);
    }

    // 检查当前网站是否在屏蔽列表中
    function isBlockedSite() {
        const hostname = window.location.hostname.toLowerCase();
        return getBlockedSites().some(site => {
            const domain = site.toLowerCase().replace(/^www\./, '');
            return (
                hostname === domain ||
                hostname.endsWith(`.${domain}`)
            );
        });
    }

    // 创建全屏警告
    function createFullscreenWarning() {
        const overlay = document.createElement('div');
        overlay.id = 'focusBlockerOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${BACKGROUND_COLOR};
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            cursor: default;
        `;

        const textElement = document.createElement('div');
        textElement.textContent = WARNING_TEXT;
        textElement.style.cssText = `
            color: ${TEXT_COLOR};
            font-size: 10vw;
            font-weight: bold;
            text-align: center;
            text-shadow: 0 0 10px rgba(0,0,0,0.5);
            user-select: none;
            max-width: 90vw;
            line-height: 1.2;
        `;

        overlay.appendChild(textElement);

        // 仅当临时访问开启时显示ESC提示
        if (getTempAccessEnabled()) {
            const hintElement = document.createElement('div');
            hintElement.textContent = "Press ESC to temporarily access (5 min)";
            hintElement.style.cssText = `
                color: rgba(255,255,255,0.7);
                font-size: 2vw;
                margin-top: 40px;
                text-align: center;
                user-select: none;
            `;
            overlay.appendChild(hintElement);
        } else {
            const noAccessElement = document.createElement('div');
            noAccessElement.textContent = "Temporary access disabled";
            noAccessElement.style.cssText = `
                color: rgba(255,255,255,0.7);
                font-size: 2vw;
                margin-top: 40px;
                text-align: center;
                user-select: none;
            `;
            overlay.appendChild(noAccessElement);
        }

        document.documentElement.appendChild(overlay);
        return overlay;
    }

    // 编辑屏蔽网站列表
    function editBlockedSites() {
        // 移除全屏警告（如果存在）
        const existingOverlay = document.getElementById('focusBlockerOverlay');
        if (existingOverlay) {
            existingOverlay.style.display = 'none';
        }

        // 创建模态对话框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000000;  // 确保高于全屏警告
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建内容容器
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 80%;
            max-width: 500px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        `;

        // 创建标题
        const title = document.createElement('h2');
        title.textContent = '编辑屏蔽网站列表';
        title.style.cssText = `
            margin-top: 0;
            color: #333;
        `;
        content.appendChild(title);

        // 创建说明文本
        const instructions = document.createElement('p');
        instructions.textContent = '每行输入一个域名（例如：example.com），支持子域名';
        instructions.style.cssText = `
            color: #666;
            margin-bottom: 15px;
            font-size: 14px;
        `;
        content.appendChild(instructions);

        // 创建多行文本框
        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            width: 100%;
            height: 300px;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            font-family: monospace;
        `;
        textarea.value = getBlockedSites().join('\n');
        content.appendChild(textarea);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
            gap: 10px;
        `;
        content.appendChild(buttonContainer);

        // 创建保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.cssText = `
            padding: 8px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        buttonContainer.appendChild(saveButton);

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 8px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        buttonContainer.appendChild(cancelButton);

        // 添加事件监听器
        saveButton.addEventListener('click', () => {
            // 处理输入的域名
            const sites = textarea.value
                .split('\n')
                .map(site => site.trim().toLowerCase().replace(/^www\./, ''))
                .filter(site => site.length > 0);
            
            // 保存并刷新
            saveBlockedSites(sites);
            document.body.removeChild(modal);
            alert(`已保存 ${sites.length} 个屏蔽网站`);
            location.reload();
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            // 恢复全屏警告（如果当前网站被屏蔽）
            if (isBlockedSite() && existingOverlay) {
                existingOverlay.style.display = 'flex';
            }
        });

        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // 切换临时访问开关
    function toggleTempAccess() {
        const currentState = getTempAccessEnabled();
        const newState = !currentState;
        setTempAccessEnabled(newState);
        alert(`临时访问功能已${newState ? '开启' : '关闭'}`);
        location.reload(); // 刷新页面应用新设置
    }

    // 注册菜单命令（修复：移出main函数确保始终注册）
    GM_registerMenuCommand("编辑屏蔽网站列表", editBlockedSites);
    GM_registerMenuCommand("切换临时访问开关", toggleTempAccess);

    // 主函数
    function main() {
        if (isBlockedSite()) {
            const overlay = createFullscreenWarning();
            let temporaryAccess = false;
            
            // 仅当临时访问开启时添加ESC事件监听
            if (getTempAccessEnabled()) {
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        overlay.style.display = 'none';
                        temporaryAccess = true;
                        
                        setTimeout(() => {
                            if (temporaryAccess) {
                                overlay.style.display = 'flex';
                                temporaryAccess = false;
                            }
                        }, 5 * 60 * 1000); // 5分钟
                    }
                });
            }
        }
    }

    // 确保在DOM加载前执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
