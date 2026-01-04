// ==UserScript==
// @name         复制网页标题和链接 (配置快捷键)
// @name:zh-CN   复制网页标题和链接 (配置快捷键)
// @namespace    https://greasyfork.org/
// @version      0.2.0
// @description  Copies the page title and URL with a configurable shortcut (Default: Alt+S). The shortcut can be set by a key combination in the UserScript menu.
// @description:zh-CN 默认 Alt+S 复制网页标题和链接。快捷键可在油猴菜单通过直接按键组合配置。
// @author       妮娜可
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/538632/%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%20%28%E9%85%8D%E7%BD%AE%E5%BF%AB%E6%8D%B7%E9%94%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538632/%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%20%28%E9%85%8D%E7%BD%AE%E5%BF%AB%E6%8D%B7%E9%94%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置管理类：负责快捷键的读取、保存和格式化显示
    class ShortcutConfig {
        constructor() {
            this.key = GM_getValue('shortcut_key', 's');
            this.ctrl = GM_getValue('shortcut_ctrl', false);
            this.alt = GM_getValue('shortcut_alt', true);
            this.shift = GM_getValue('shortcut_shift', false);
        }

        save() {
            GM_setValue('shortcut_key', this.key);
            GM_setValue('shortcut_ctrl', this.ctrl);
            GM_setValue('shortcut_alt', this.alt);
            GM_setValue('shortcut_shift', this.shift);
        }

        getDisplayString() {
            const parts = [];
            if (this.ctrl) parts.push('Ctrl');
            if (this.alt) parts.push('Alt');
            if (this.shift) parts.push('Shift');

            // 格式化按键显示：' ' -> 'Space', 'a' -> 'A', 'arrowdown' -> 'ArrowDown'
            let displayKey = this.key.toLowerCase();
            if (displayKey === ' ') {
                displayKey = 'Space';
            } else if (displayKey.length === 1) {
                displayKey = displayKey.toUpperCase();
            } else {
                displayKey = displayKey.replace(/\b\w/g, l => l.toUpperCase());
            }

            parts.push(displayKey);
            return parts.join(' + ');
        }

        matches(event) {
            const keyMatch = event.key.toLowerCase() === this.key.toLowerCase();
            const ctrlMatch = event.ctrlKey === this.ctrl;
            const altMatch = event.altKey === this.alt;
            const shiftMatch = event.shiftKey === this.shift;

            return keyMatch && ctrlMatch && altMatch && shiftMatch;
        }
    }

    // UI 管理类：负责所有界面元素的创建和交互（提示框、设置面板）
    class UIManager {
        constructor() {
            this.toastElement = null;
            this.promptElement = null;
            this.initElements();
        }

        initElements() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.createElements());
            } else {
                this.createElements();
            }
        }

        createElements() {
            this.createToastElement();
            this.createPromptElement();
        }

        createToastElement() {
            this.toastElement = document.createElement('div');
            this.toastElement.className = 'copy-toast-message';
            this.toastElement.style.display = 'none';
            document.body.appendChild(this.toastElement);
        }

        createPromptElement() {
            this.promptElement = document.createElement('div');
            this.promptElement.className = 'shortcut-setup-prompt';
            this.promptElement.style.display = 'none';
            document.body.appendChild(this.promptElement);
        }

        showToast(message, type = 'info', duration = 2500) {
            if (!this.toastElement) return;

            this.toastElement.innerHTML = message;
            this.toastElement.className = 'copy-toast-message';

            this.toastElement.style.opacity = '0';
            this.toastElement.style.display = 'flex';
            void this.toastElement.offsetWidth; // 强制浏览器重绘，确保动画效果
            this.toastElement.style.opacity = '1';

            setTimeout(() => {
                this.toastElement.style.opacity = '0';
                setTimeout(() => {
                    this.toastElement.style.display = 'none';
                }, 300);
            }, duration);
        }

        showPrompt(content) {
            if (!this.promptElement) return;
            this.promptElement.innerHTML = content;
            this.promptElement.style.display = 'flex';
        }

        hidePrompt() {
            if (!this.promptElement) return;
            this.promptElement.style.display = 'none';
        }
    }

    // 主应用类：整合配置和UI，处理核心逻辑
    class CopyTitleApp {
        constructor() {
            this.config = new ShortcutConfig();
            this.ui = new UIManager();
            this.isSettingShortcut = false;
            this.init();
        }

        init() {
            this.bindEvents();
            this.registerMenuCommand();
            this.addStyles();
        }

        bindEvents() {
            // 使用事件捕获（第三个参数为 true），确保能优先处理按键事件，防止被页面其他脚本拦截。
            document.addEventListener('keydown', (e) => this.handleKeyDown(e), true);
        }

        registerMenuCommand() {
            GM_registerMenuCommand(`设置复制快捷键 (当前: ${this.config.getDisplayString()})`, () => {
                this.startShortcutSetting();
            });
        }

        startShortcutSetting() {
            this.isSettingShortcut = true;
            const content = `
                请按下您想设置的新快捷键组合。<br>
                当前: ${this.config.getDisplayString()}<br>
                按 ESC 键取消。
            `;
            this.ui.showPrompt(content);
        }

        handleKeyDown(e) {
            if (this.isSettingShortcut) {
                this.handleShortcutSetting(e);
            } else {
                this.handleCopyShortcut(e);
            }
        }

        handleShortcutSetting(e) {
            e.preventDefault();
            e.stopPropagation();

            if (e.key === 'Escape') {
                this.cancelShortcutSetting();
                return;
            }

            // 忽略单独的修饰键（如只按下 Alt），等待主键的输入
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
                this.updatePromptWithModifiers(e);
                return;
            }

            this.setNewShortcut(e);
        }

        updatePromptWithModifiers(e) {
            const currentModifiers = [];
            if (e.ctrlKey) currentModifiers.push('Ctrl');
            if (e.altKey) currentModifiers.push('Alt');
            if (e.shiftKey) currentModifiers.push('Shift');

            let heldModifiers = currentModifiers.join(' + ');
            if (heldModifiers) heldModifiers += ' + ';

            const content = `
                请按下您想设置的新快捷键组合。<br>
                当前按下: ${heldModifiers} _ <br>
                (请继续按下主键, 如 A, B, 1, 等)<br>
                按 ESC 键取消。
            `;
            this.ui.showPrompt(content);
        }

        setNewShortcut(e) {
            this.config.key = e.key.toLowerCase();
            this.config.ctrl = e.ctrlKey;
            this.config.alt = e.altKey;
            this.config.shift = e.shiftKey;
            this.config.save();

            this.isSettingShortcut = false;
            this.ui.hidePrompt();
            this.ui.showToast(`快捷键已更新为: ${this.config.getDisplayString()}`, 'success', 3000);
            
            // 动态更新菜单项，无需刷新页面
            this.registerMenuCommand(); 
        }

        cancelShortcutSetting() {
            this.isSettingShortcut = false;
            this.ui.hidePrompt();
            this.ui.showToast('快捷键设置已取消', 'info');
        }

        handleCopyShortcut(e) {
            if (!this.config.matches(e)) return;

            // 阻止将单独的修饰键（如 "Alt"）作为快捷键触发，避免误操作
            if (['control', 'alt', 'shift', 'meta'].includes(this.config.key.toLowerCase()) &&
                !(this.config.ctrl || this.config.alt || this.config.shift)) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            this.copyTitleAndUrl();
        }

        copyTitleAndUrl() {
            // 使用 document.title 和 location.href 可以正确获取顶层或 iframe 内的标题和链接
            const title = document.title;
            const url = location.href;

            if (!title && !url) {
                this.ui.showToast(this.getErrorMessage('无标题或URL'), 'error');
                return;
            }

            try {
                const textToCopy = `『${title || '无标题'}』\n${url}`;
                GM_setClipboard(textToCopy);
                this.ui.showToast(this.getSuccessMessage(), 'success');
            } catch (err) {
                console.error("GM_setClipboard error:", err);
                this.ui.showToast(this.getErrorMessage('复制失败 (权限?)'), 'error');
            }
        }

        getSuccessMessage() {
            // [优化] 为SVG增加无障碍属性 aria-hidden 和 focusable
            return `
                <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; color: #4CAF50;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>复制成功!</span>
            `;
        }

        getErrorMessage(text) {
            // [优化] 为SVG增加无障碍属性 aria-hidden 和 focusable
            return `
                <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; color: #F44336;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>${text}</span>
            `;
        }

        addStyles() {
            GM_addStyle(`
                .copy-toast-message {
                    position: fixed;
                    left: 50%;
                    top: 50px;
                    transform: translateX(-50%);
                    background: rgba(50, 50, 50, 0.85);
                    backdrop-filter: blur(8px) saturate(150%);
                    -webkit-backdrop-filter: blur(8px) saturate(150%);
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 2147483646;
                    color: #fff;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    min-width: 180px;
                    justify-content: center;
                }
                .copy-toast-message svg {
                    vertical-align: middle;
                }
                .shortcut-setup-prompt {
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(30, 30, 30, 0.92);
                    backdrop-filter: blur(10px) saturate(180%);
                    -webkit-backdrop-filter: blur(10px) saturate(180%);
                    padding: 25px 35px;
                    border-radius: 12px;
                    z-index: 2147483647;
                    color: #eee;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    font-size: 18px;
                    text-align: center;
                    line-height: 1.6;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-width: 300px;
                    max-width: 90%;
                }
            `);
        }
    }

    // 初始化应用
    new CopyTitleApp();
})();