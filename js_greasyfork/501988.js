// ==UserScript==
// @name         咪咕弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  咪咕弹幕。没有就给你搞一个呗，移动这个懒B！
// @icon         https://www.miguvideo.com/favicon.ico
// @author       IDCIM rogermmg@gmail.com
// @match        https://www.miguvideo.com/p/live/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/501988/%E5%92%AA%E5%92%95%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/501988/%E5%92%AA%E5%92%95%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日志函数
    function log(message) {
        console.log('[咪咕弹幕脚本]', message);
    }

    // 默认设置
    const defaultSettings = {
        enabled: true,
        speed: 15,
        fontSize: 20,
        topHalfOnly: true
    };

    // 获取设置
    function getSettings() {
        return {
            enabled: GM_getValue('danmakuEnabled', defaultSettings.enabled),
            speed: GM_getValue('danmakuSpeed', defaultSettings.speed),
            fontSize: GM_getValue('danmakuFontSize', defaultSettings.fontSize),
            topHalfOnly: GM_getValue('danmakuTopHalfOnly', defaultSettings.topHalfOnly)
        };
    }

    // 保存设置
    function saveSettings(settings) {
        GM_setValue('danmakuEnabled', settings.enabled);
        GM_setValue('danmakuSpeed', settings.speed);
        GM_setValue('danmakuFontSize', settings.fontSize);
        GM_setValue('danmakuTopHalfOnly', settings.topHalfOnly);
    }

    // 等待元素出现的函数
    function waitForElement(selector, timeout = 1000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
        });
    }

    // 创建弹幕容器
    function createDanmakuContainer(playerElement) {
        const container = document.createElement('div');
        container.id = 'danmaku-container';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 9999;
        `;
        playerElement.appendChild(container);
        return container;
    }

    // 创建弹幕元素函数
    function createDanmaku(avatar, name, text, settings) {
        const danmaku = document.createElement('div');
        danmaku.className = 'danmaku-item';
        danmaku.style.cssText = `
        position: absolute;
        white-space: nowrap;
        font-size: ${settings.fontSize}px;
        color: #fff;
        text-shadow: 1px 1px 2px #000;
        display: flex;
        align-items: center;
        right: -100%;
        transition: right ${settings.speed}s linear;
    `;
        danmaku.innerHTML = `
        <img src="${avatar}" alt="" style="width: 20px; height: 20px; border-radius: 50%; margin-right: 5px;">
        <span style="font-weight: bold; margin-right: 5px;">${name}</span>
        <span>${text}</span>
    `;
        const topPosition = settings.topHalfOnly ? `${Math.random() * 40}%` : `${Math.random() * 80}%`;
        danmaku.style.top = topPosition;
        return danmaku;
    }


    // 添加新弹幕函数
    function addDanmaku(container, settings) {
        if (!settings.enabled) return;

        log('开始添加弹幕');
        const items = document.querySelectorAll('.list-wrapper .list_item:not(.processed)');
        log(`找到 ${items.length} 个列表项`);

        items.forEach((item, index) => {
            item.classList.add('processed'); // 标记已处理项
            setTimeout(() => {
                const avatarImg = item.querySelector('img');
                const nameSpan = item.querySelector('.name');
                const textSpan = item.querySelector('.text');

                if (!avatarImg || !nameSpan || !textSpan) {
                    log('未找到必要的元素', item);
                    return;
                }

                const avatar = avatarImg.src;
                const name = nameSpan.textContent.trim();
                const text = textSpan.textContent.trim();

                log(`创建弹幕: ${name} - ${text}`);

                const danmaku = createDanmaku(avatar, name, text, settings);
                container.appendChild(danmaku);

                // 开始动画
                setTimeout(() => {
                    danmaku.style.right = '100%';
                }, 50);

                // 动画结束后删除弹幕
                danmaku.addEventListener('transitionend', () => {
                    danmaku.remove();
                });
            }, index * 1000); // 将每个弹幕的间隔时间改为 1 秒
        });
    }


    // 创建设置面板
    function createSettingsPanel(container, settings) {
        const panel = document.createElement('div');
        panel.id = 'danmaku-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            display: none;
        `;
        panel.innerHTML = `
            <h2 style="margin-top: 0;">弹幕设置</h2>
            <label>
                <input type="checkbox" id="danmaku-enabled" ${settings.enabled ? 'checked' : ''}>
                启用弹幕
            </label><br><br>
            <label>
                弹幕速度:
                <input type="range" id="danmaku-speed" min="5" max="30" value="${settings.speed}">
                <span id="speed-value">${settings.speed}</span>秒
            </label><br><br>
            <label>
                字体大小:
                <input type="range" id="danmaku-font-size" min="12" max="24" value="${settings.fontSize}">
                <span id="font-size-value">${settings.fontSize}</span>px
            </label><br><br>
            <label>
                <input type="checkbox" id="danmaku-top-half" ${settings.topHalfOnly ? 'checked' : ''}>
                仅在上半区显示
            </label><br><br>
            <button id="save-settings" style="color:#000;padding:5px;">保存设置</button>
            <button id="close-settings" style="color:#000;padding:5px;">关闭设置</button>
        `;
        document.body.appendChild(panel);

        // 更新显示的值
        document.getElementById('danmaku-speed').addEventListener('input', (e) => {
            document.getElementById('speed-value').textContent = e.target.value;
        });
        document.getElementById('danmaku-font-size').addEventListener('input', (e) => {
            document.getElementById('font-size-value').textContent = e.target.value;
        });

        // 保存设置
        // 保存设置并立即应用
        document.getElementById('save-settings').addEventListener('click', () => {
            const newSettings = {
                enabled: document.getElementById('danmaku-enabled').checked,
                speed: parseInt(document.getElementById('danmaku-speed').value),
                fontSize: parseInt(document.getElementById('danmaku-font-size').value),
                topHalfOnly: document.getElementById('danmaku-top-half').checked
            };
            saveSettings(newSettings);
            panel.style.display = 'none';

            // 更新容器的弹幕设置
            Object.assign(settings, newSettings);

            // 显示或隐藏弹幕容器
            if (settings.enabled) {
                container.style.display = 'block';
                clearDanmaku(container);
                addDanmaku(container, settings); // 立即添加一次弹幕
                clearInterval(addDanmakuInterval); // 清除原有的定时器
                addDanmakuInterval = setInterval(() => addDanmaku(container, settings), 15000); // 重新启动定时器
            } else {
                container.style.display = 'none';
                clearInterval(addDanmakuInterval); // 停止定时器
            }
        });



        // 关闭设置面板
        document.getElementById('close-settings').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        return panel;
    }

    // 清除所有弹幕
    function clearDanmaku(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    // 创建设置按钮
    function createSettingsButton(panel) {
        const button = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = '弹幕设置';
        span.style.cssText = `
            display:block;
            color:#f00f00;
            cursor:pointer;
            font-size:14px;
        `;
        button.append(span);
        button.style.cssText = `
            z-index: 10000;
            width:50px;
            margin-left:20px;
            display:flex;
            align-items:center;
        `;
        button.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // 将按钮插入到 .shareBar .share-info .top 的最后一个元素之后
        const shareInfoTop = document.querySelector('.shareBar .share-info .top');
        if (shareInfoTop) {
            shareInfoTop.appendChild(button);
        } else {
            document.body.appendChild(button);
        }
    }

    // 初始化脚本时只显示当前弹幕
    async function initScript() {
        log('等待#mod-player元素出现');
        try {
            const playerElement = await waitForElement('#mod-player');
            log('#mod-player元素已找到，开始初始化弹幕系统');

            const settings = getSettings();
            const container = createDanmakuContainer(playerElement);
            const settingsPanel = createSettingsPanel(container, settings);
            createSettingsButton(settingsPanel);

            container.style.display = settings.enabled ? 'block' : 'none';

            let addDanmakuInterval;
            if (settings.enabled) {
                addDanmaku(container, settings); // 立即添加一次当前的弹幕
                addDanmakuInterval = setInterval(() => addDanmaku(container, settings), 15000); // 每15秒刷新一次
            }

        } catch (error) {
            log('错误：' + error.message);
        }
    }


    // 运行脚本
    initScript();
})();

