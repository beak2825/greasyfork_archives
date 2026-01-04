// ==UserScript==
// @name        Universal Audio Device Selector
// @name:zh-cn  音频输出切换器
// @name:ja     ユニバーサル音声切替器
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.2.1
// @author      tiamed
// @license     MIT
// @homepageURL https://github.com/tiamed/universal-audio-device-selector
// @description Allows you to select audio output device on any sites (except iframe)
// @description:zh-cn   可在任意网站切换音视频的音频输出设备（iframe除外）
// @description:ja     「あらゆるウェブサイトで音声出力デバイスの選択を可能にするスクリプト ※iframe内のコンテンツは除外」
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/529985/Universal%20Audio%20Device%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/529985/Universal%20Audio%20Device%20Selector.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.self !== window.top) return;

    const STORAGE_KEY = 'audioDeviceSettings';
    const LOCALE_KEYS = {
        BUTTON_TITLE: 'BUTTON_TITLE',
        MENU_TITLE_POSTFIX: 'DEVICE_NAME',
    };
    const LOCALE_ZH = {
        [LOCALE_KEYS.BUTTON_TITLE]: '音频输出切换器',
        [LOCALE_KEYS.MENU_TITLE_POSTFIX]: '的设备',
    };
    const LOCALE_JA = {
        [LOCALE_KEYS.BUTTON_TITLE]: '音声切替器',
        [LOCALE_KEYS.MENU_TITLE_POSTFIX]: 'のデバイス',
    };
    const LOCALE_EN = {
        [LOCALE_KEYS.BUTTON_TITLE]: 'audio device selector',
        [LOCALE_KEYS.MENU_TITLE_POSTFIX]: "'s devices",
    };
    const UI_STYLE = {
        button: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '24px',
            height: '24px',
            background: '#444',
            color: '#fff',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 999999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            display: 'grid',
            placeItems: 'center',
            opacity: '0.5',
        },
        menu: {
            position: 'fixed',
            bottom: '60px',
            right: '20px',
            background: '#333',
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 999999,
            display: 'none',
            maxHeight: '60vh',
            overflowY: 'auto',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            minWidth: '200px',
            userSelect: 'none',
            WebkitUserSelect: 'none',
        },
        item: {
            activeBg: '#444',
            defaultBg: 'transparent',
        },
    };

    let locale = LOCALE_EN;
    let devices = [];
    let currentDevice = null;
    let isInitialized = false;
    let observer;

    // 存储管理
    const storage = {
        get() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')[
                    location.hostname
                ];
            } catch {
                return null;
            }
        },
        set(deviceId) {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            data[location.hostname] = deviceId;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        },
    };

    // 主入口
    async function main() {
        setupLocale();
        const { button, menu } = createUI();
        document.body.append(button, menu);

        // 自动应用已有设置
        const hasSetting = await tryAutoApply();
        updateButtonState(button, hasSetting);

        setupMutationObserver();
        setupEventListeners(button, menu);
    }

    function setupLocale() {
        if (window.navigator.language.includes('zh')) {
            locale = LOCALE_ZH;
        }
        if (window.navigator.language.includes('ja')) {
            locale = LOCALE_JA;
        }
    }

    // 创建UI元素
    function createUI() {
        const button = document.createElement('div');
        Object.assign(button.style, UI_STYLE.button);

        // 创建 SVG 元素
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
        );
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.style.verticalAlign = 'middle';

        // 创建路径元素
        const path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path',
        );
        path.setAttribute(
            'd',
            'M12 3.006c0-.873-1.04-1.327-1.68-.733L6.448 5.866a.5.5 0 0 1-.34.134H3.5A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h2.607a.5.5 0 0 1 .34.133l3.873 3.594c.64.593 1.68.14 1.68-.733V3.006z',
        );
        path.setAttribute('fill', 'currentColor');

        // 组装 SVG
        svg.appendChild(path);
        button.appendChild(svg);

        const menu = document.createElement('div');
        Object.assign(menu.style, UI_STYLE.menu);

        button.title = locale[LOCALE_KEYS.BUTTON_TITLE]; // 添加鼠标悬停提示

        return {
            button,
            menu,
        };
    }

    // 尝试自动应用设置
    async function tryAutoApply() {
        const savedId = storage.get();
        if (!savedId) return false;

        try {
            await initDevices(true);
            await updateDeviceList();
            currentDevice = devices.find((d) => d.deviceId === savedId);
            if (currentDevice) {
                await applyToAllMedia();
                return true;
            }
        } catch (e) {
            console.warn('Auto apply failed:', e);
        }
        return false;
    }

    // 设备初始化
    async function initDevices(silent = false) {
        if (isInitialized) return true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            stream.getTracks().forEach((t) => t.stop());
            isInitialized = true;
            return true;
        } catch (e) {
            if (!silent) console.error('Permission required:', e);
            return false;
        }
    }

    // 更新设备列表
    async function updateDeviceList() {
        devices = (await navigator.mediaDevices.enumerateDevices()).filter(
            (d) => d.kind === 'audiooutput' && d.deviceId !== 'default',
        );
    }

    // 应用到所有媒体元素
    async function applyToAllMedia() {
        const mediaElements = document.querySelectorAll('video, audio');
        for (const media of mediaElements) {
            if (currentDevice?.deviceId && media.setSinkId) {
                try {
                    await media.setSinkId(currentDevice.deviceId);
                } catch (e) {
                    console.warn('Switch failed:', media.src, e);
                }
            }
        }
    }

    // 更新按钮状态
    function updateButtonState(button, isActive) {
        button.style.background = isActive
            ? '#00ADB5'
            : UI_STYLE.button.background;
    }

    // 设置DOM监听
    function setupMutationObserver() {
        observer = new MutationObserver((mutations) => {
            const hasMedia = mutations.some((mutation) =>
                [...mutation.addedNodes].some(
                    (n) =>
                        n.nodeType === Node.ELEMENT_NODE &&
                        (n.tagName === 'VIDEO' || n.tagName === 'AUDIO'),
                ),
            );
            if (hasMedia) applyToAllMedia();
        });
        observer.observe(document, {
            subtree: true,
            childList: true,
        });
    }

    // 设置事件监听
    function setupEventListeners(button, menu) {
        // 按钮点击
        button.addEventListener('click', async () => {
            if (!isInitialized && !(await initDevices())) return;

            await updateDeviceList();
            refreshDeviceList(menu, button);
            menu.style.display =
                menu.style.display === 'block' ? 'none' : 'block';
        });

        // 全局点击关闭菜单
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== button) {
                menu.style.display = 'none';
            }
        });
    }

    // 刷新设备列表
    function refreshDeviceList(menu, button) {
        // 清空原有内容
        while (menu.firstChild) {
            menu.removeChild(menu.firstChild);
        }

        // 创建标题
        const title = document.createElement('div');
        title.textContent = `${location.hostname} ${
            locale[LOCALE_KEYS.MENU_TITLE_POSTFIX]
        }`;
        title.style.cssText =
            'margin-bottom:10px; font-weight: bold; padding: 0 5px';
        menu.appendChild(title);

        // 动态创建设备项
        devices.forEach((d) => {
            const item = document.createElement('div');
            item.className = 'device-item';
            item.dataset.id = d.deviceId;
            item.textContent = d.label; // 使用 textContent 防止 XSS

            // 设置内联样式
            item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        background: ${
            d.deviceId === currentDevice?.deviceId
                ? UI_STYLE.item.activeBg
                : UI_STYLE.item.defaultBg
        };
        border-radius: 4px;
        margin: 2px 0;
        transition: background 0.2s;
    `;

            // 绑定点击事件
            item.addEventListener('click', async () => {
                currentDevice = devices.find(
                    (device) => device.deviceId === d.deviceId,
                );
                storage.set(currentDevice.deviceId);
                await applyToAllMedia();
                refreshDeviceList(menu, button);
                updateButtonState(button, true);
                menu.style.display = 'none';
            });

            menu.appendChild(item);
        });
    }

    window.addEventListener('load', main);
})();
