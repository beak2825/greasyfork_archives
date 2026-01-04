// ==UserScript==
// @name         自动复制
// @name:zh-CN   自动复制
// @name:en      Auto-Copy
// @name:ja      オートコピー
// @name:ko      자동 복사
// @name:es      Copia Automática
// @namespace    gura8390/copy/1
// @license MIT
// @version      2.2.3
// @description  自动复制，鼠标选中，直接复制，省去你的左手。
// @description:en Automatically copy selected text to clipboard
// @description:ja 選択したテキストを自動的にコピーします
// @description:ko 선택한 텍스트를 자동으로 복사합니다
// @description:es Copia automáticamente el texto seleccionado
// @author       lbihhe
// @icon         data:image/png;base64,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
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525500/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/525500/%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

/*!
MIT License

Copyright (c) [2024] [gura8390]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

    const STORAGE_KEY = 'auto_copy_enabled';
    let isEnabled = GM_getValue(STORAGE_KEY, true);
    let menuCommands = [];

    // ========================
    // 多语言支持系统
    // ========================
    const i18n = {
        'en': {
            panelTitle: 'Auto Copy Control',
            toggleBtn: isEnabled => isEnabled ? '🟢 Enabled' : '🔴 Disabled',
            statusText: isEnabled => `Status: ${isEnabled ? 'Working' : 'Paused'}`,
            copied: 'Text copied',
            copyFailed: 'Copy field',
            enableNotify: 'Auto copy enabled',
            disableNotify: 'Auto copy disabled',
            openPanel: 'Open Control Panel',
            closePanel: 'Close Control Panel',
            menuEnable: 'Enable Auto Copy',
            menuDisable: 'Disable Auto Copy'
        },
        'zh-CN': {
            panelTitle: '智能复制控制',
            toggleBtn: isEnabled => isEnabled ? '🟢已启用' : '🔴已禁用',
            statusText: isEnabled => `当前状态: ${isEnabled ? '✓ 运行中' : '✗ 已暂停'}`,
            copied: '文本已复制',
            copyFailed: '复制失败',//火狐浏览器不支持
            enableNotify: '自动复制功能已启用',
            disableNotify: '自动复制功能已禁用',
            openPanel: '打开控制面板',
            closePanel: '关闭控制面板',
            menuEnable: '启用自动复制',
            menuDisable: '禁用自动复制'
        },
        'ja': {
            panelTitle: '自動コピー制御',
            toggleBtn: isEnabled => isEnabled ? '🟢有効' : '🔴無効',
            statusText: isEnabled => `状態: ${isEnabled ? '✓ 動作中' : '✗ 停止中'}`,
            copied: 'コピーされました',
            copyFailed: 'コピー失敗',
            enableNotify: '自動コピーが有効になりました',
            disableNotify: '自動コピーが無効になりました',
            openPanel: 'コントロールパネルを開く',
            closePanel: 'コントロールパネルを閉じる',
            menuEnable: '自動コピーを有効にする',
            menuDisable: '自動コピーを無効にする'
        },
        'ko': {
            panelTitle: '자동 복사 제어',
            toggleBtn: isEnabled => isEnabled ? '🟢활성화됨' : '🔴비활성화됨',
            statusText: isEnabled => `상태: ${isEnabled ? '✓ 작동 중' : '✗ 일시 중지됨'}`,
            copied: '텍스트가 복사되었습니다',
            copyFailed: '복사 실패',
            enableNotify: '자동 복사가 활성화되었습니다',
            disableNotify: '자동 복사가 비활성화되었습니다',
            openPanel: '제어판 열기',
            closePanel: '제어판 닫기',
            menuEnable: '자동 복사 활성화',
            menuDisable: '자동 복사 비활성화'
        },
        'es': {
            panelTitle: 'Control de Copia Automática',
            toggleBtn: isEnabled => isEnabled ? '🟢Activado' : '🔴Desactivado',
            statusText: isEnabled => `Estado: ${isEnabled ? '✓ Trabajando' : '✗ Pausado'}`,
            copied: 'Texto copiado',
            copyFailed: 'Error al copiar',
            enableNotify: 'Copia automática activada',
            disableNotify: 'Copia automática desactivada',
            openPanel: 'Abrir Panel de Control',
            closePanel: 'Cerrar Panel de Control',
            menuEnable: 'Activar Copia Automática',
            menuDisable: 'Desactivar Copia Automática'
        }
    };

    // 自动检测浏览器语言
    const getBrowserLang = () => {
        const lang = navigator.languages?.[0] || navigator.language || 'en';
        return lang.split('-')[0];
    };

    const currentLang = Object.keys(i18n).find(l => l.startsWith(getBrowserLang())) || 'en';
    const t = i18n[currentLang] || i18n.en;

    // ========================
    // 视觉反馈系统
    // ========================
    const createFeedback = (textKey, e) => {
        const feedback = document.createElement('div');
        feedback.innerHTML = `
            <div class="feedback-container">
                <svg class="feedback-icon" viewBox="0 0 24 24">
                    ${textKey === 'copied'
                        ? '<path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'
                        : '<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'}
                </svg>
                <span class="feedback-text">${t[textKey]}</span>
            </div>
        `;

        Object.assign(feedback.style, {
            position: 'fixed',
            left: `${Math.min(e.clientX + 10, window.innerWidth - 200)}px`,
            top: `${e.clientY + 20}px`,
            zIndex: 2147483647,
            pointerEvents: 'none'
        });

        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    };

    // ========================
    // 状态指示系统
    // ========================
    const createStatusIcon = () => {
        const icon = document.createElement('div');
        icon.className = 'status-icon';
        icon.innerHTML = `
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" class="status-base"/>
                <path class="status-indicator" d="M8 12l3 3 5-6"/>
            </svg>
        `;

        Object.assign(icon.style, {
            position: 'fixed',
            bottom: '20px',
            right: '-10px',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            zIndex: 2147483647,
            transition: 'right 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
            opacity: '0.8'
        });

        icon.addEventListener('click', () => {
            const panel = document.querySelector('.control-panel');
            if (panel) {
                panel.remove();
                updateMenuCommands();
            } else {
                toggleFeature();
            }
        });

        icon.addEventListener('mouseenter', () => {
            icon.style.transition = 'none';
            icon.style.right = '20px';
            icon.style.transform = 'scale(1.1)';
            icon.style.opacity = '1';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transition = 'right 0.3s ease, transform 0.3s ease, opacity 0.3s ease';
            icon.style.right = '-10px';
            icon.style.transform = 'scale(1)';
            icon.style.opacity = '0.8';
        });

        updateIconStyle(icon);
        return icon;
    };

    const updateIconStyle = (icon) => {
        const color = isEnabled ? '#4CAF50' : '#F44336';
        icon.style.filter = `drop-shadow(0 2px 4px ${color}40)`;
        icon.querySelector('.status-indicator').style.stroke = color;
        icon.querySelector('.status-base').style.stroke = color;
    };

    // ========================
    // 控制面板系统
    // ========================
    const createControlPanel = () => {
        const panel = document.createElement('div');
        panel.className = 'control-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>${t.panelTitle}</h3>
                <div class="close-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </div>
            </div>
            <div class="panel-body">
                <button class="toggle-btn ${isEnabled ? 'active' : ''}">
                    ${t.toggleBtn(isEnabled)}
                </button>
                <div class="status-text">
                    ${t.statusText(isEnabled)}
                </div>
            </div>
        `;

        panel.querySelector('.toggle-btn').addEventListener('click', toggleFeature);
        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.transform = 'translateY(100%)';
            setTimeout(() => {
                panel.remove();
                updateMenuCommands();
            }, 300);
        });

        return panel;
    };

    // ========================
    // 核心功能逻辑
    // ========================
    const handleSelection = (e) => {
        if (!isEnabled) return;

        const selection = window.getSelection().toString().trim();
        if (!selection) return;

        navigator.clipboard.writeText(selection)
            .then(() => createFeedback('copied', e))
            .catch(err => {
                createFeedback('copyFailed', e);
                console.error('Copy failed:', err);
            });
    };

    const toggleFeature = () => {
        isEnabled = !isEnabled;
        GM_setValue(STORAGE_KEY, isEnabled);
        updateIconStyle(statusIcon);
        showGlobalNotification();
        if (document.querySelector('.control-panel')) refreshControlPanel();
    };

    // ========================
    // 辅助功能
    // ========================
    const showGlobalNotification = () => {
        const notification = document.createElement('div');
        notification.className = 'global-notification';
        notification.textContent = isEnabled ? t.enableNotify : t.disableNotify;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 1500);
    };

    const refreshControlPanel = () => {
        document.querySelector('.control-panel')?.remove();
        document.body.appendChild(createControlPanel());
        updateMenuCommands();
    };

    // ========================
    // 菜单管理系统
    // ========================
    const updateMenuCommands = () => {
        // 清除旧菜单
        menuCommands.forEach(cmd => GM_unregisterMenuCommand(cmd));
        menuCommands = [];

        // 注册新菜单
        if (document.querySelector('.control-panel')) {
            menuCommands.push(GM_registerMenuCommand(t.closePanel, () => {
                document.querySelector('.control-panel')?.remove();
                updateMenuCommands();
            }));
        } else {
            menuCommands.push(GM_registerMenuCommand(t.openPanel, () => {
                document.body.appendChild(createControlPanel());
                updateMenuCommands();
            }));
        }

        menuCommands.push(GM_registerMenuCommand(
            isEnabled ? t.menuDisable : t.menuEnable,
            toggleFeature
        ));
    };

    // ========================
    // 样式系统
    // ========================
    GM_addStyle(`
        .feedback-container {
            background: linear-gradient(145deg, #f8f9fa, #ffffff);
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease, fadeOut 0.5s ease 1.5s forwards;
        }

        .feedback-icon {
            width: 20px;
            height: 20px;
            color: ${isEnabled ? '#4CAF50' : '#F44336'};
        }

        .feedback-text {
            color: #2d3436;
            font-family: -apple-system, system-ui;
            font-size: 14px;
        }

        .status-icon:hover {
            transform: scale(1.1);
            opacity: 1;
        }

        .control-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(255,255,255,0.98);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            padding: 24px;
            width: 280px;
            transform: translateY(0);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(0,0,0,0.1);
            z-index: 2147483647;
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .panel-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #2d3436;
        }

        .close-btn {
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s ease;
            display: flex;
            color: rgba(0,0,0,0.5);
        }

        .close-btn:hover {
            background: rgba(0,0,0,0.05);
            color: rgba(0,0,0,0.8);
            transform: rotate(90deg);
        }

        .toggle-btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 12px;
            background: linear-gradient(145deg, #f0f0f0, #ffffff);
            color: #666;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .toggle-btn.active {
            background: linear-gradient(145deg, #4CAF50, #45a049);
            color: white;
            box-shadow: 0 4px 16px rgba(76,175,80,0.3);
        }

        .status-text {
            margin-top: 16px;
            text-align: center;
            color: #666;
            font-size: 13px;
        }

        .status-text span {
            color: ${isEnabled ? '#4CAF50' : '#F44336'};
            font-weight: bold;
        }

        .global-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 8px 16px;
            border-radius: 8px;
            z-index: 2147483647;
            opacity: 0.9;
        }

        @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `);


    //测试
// 检查剪贴板权限
navigator.permissions.query({ name: 'clipboard-write' })
    .then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
            console.log('Clipboard write permission granted');
            // 你可以安全地使用剪贴板 API
        } else if (permissionStatus.state === 'prompt') {
            console.log('Clipboard write permission is prompt');
            // 用户可能会被提示请求权限
        } else {
            console.log('Clipboard write permission denied');
            // 权限被拒绝
        }
    })
    .catch(err => {
        console.error('Error checking clipboard permission:', err);
    });


    // ========================
    // 初始化系统
    // ========================
    const statusIcon = createStatusIcon();
    document.body.appendChild(statusIcon);
    document.addEventListener('mouseup', handleSelection);
    updateMenuCommands();
})();