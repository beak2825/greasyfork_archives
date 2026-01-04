// ==UserScript==
// @name         Bilibili 动态美化（优化版）
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  动态粉粉嫩嫩，功能：1. 美化页面；2. 隐藏个人动态发布框；3. 隐藏右侧热门话题；4. 隐藏up发布的广告动态。优化了样式注入、MutationObserver等性能问题。
// @author       Water WHNI
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501630/Bilibili%20%E5%8A%A8%E6%80%81%E7%BE%8E%E5%8C%96%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/501630/Bilibili%20%E5%8A%A8%E6%80%81%E7%BE%8E%E5%8C%96%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 默认设置与用户配置 ***/
    const defaultSettings = {
        customBackgroundURL: 'https://i0.hdslb.com/bfs/article/bfecb9a12cb9708d8d79bb9c17532e347747aeaf.jpg@1256w_708h_!web-article-pic.avif',
        hideElementsEnabled: true,
        hideRightSidebar: true,
        hidePostBar: true,
        autoFrash: true,
        autoClickInterval: 5,
        enableAutoClick: true,
        backgroundTransparency: 61,
        backgroundTransparency2: 81,
        backgroundTransparencyFloat: 91
    };

    const settings = {};
    for (const key in defaultSettings) {
        settings[key] = GM_getValue(key, defaultSettings[key]);
    }

    /*** 合并主样式 ***/
    const mainStyles = `
        .bili-live-card, .floor-single-card, .adblock-tips { display: none !important; }
        .bili-dyn-card-video__body, .bili-dyn-card-live__body, .bili-dyn-card-pgc__body { border: none !important; }
        .bili-dyn-sidebar { right: 5vw !important; }
        .bili-header__channel { background: none !important; }
        .bili-dyn-up-list__item__name.bili-ellipsis,
        .bili-dyn-time.fs-small,
        .item-desc,
        .bili-dyn-action,
        .bili-dyn-more__btn,
        .bili-dyn-card-video__stat__item,
        #bili-header-container span,
        svg { color: rgb(251, 114, 153) !important; }
        .bili-dyn-interaction__item__desc .bili-rich-text__content { color: #2f3238e0 !important; }
        .header-upload-entry { background-color: #fc8bab6b !important; }
        .bili-dyn-more__btn:hover { background-color: #fa5a5742 !important; border-radius: 50% !important; }
        .bili-dyn-card-video__desc, .bili-dyn-publishing__hint { color: #424549 !important; }
        .bili-dyn-list-notification.fs-small { color: rgb(251, 114, 153) !important; }
        .bili-dyn-content {
            border: 2px solid transparent !important;
            border-radius: 10px !important;
            box-shadow: 0 0 0 rgb(251, 114, 153) !important;
            transition: box-shadow 0.3s ease-in-out !important;
        }
        .bili-dyn-content:hover {
            box-shadow: 0 0 15px rgb(251, 114, 153), 0 0 15px rgb(251, 114, 153) !important;
            background-color: #ffffff80 !important;
        }
        .bili-dyn-up-list__item__face {
            border: 1px solid transparent !important;
            box-shadow: 0 0 0 rgb(251, 114, 153) !important;
            transition: box-shadow 0.3s ease-in-out !important;
        }
        .bili-dyn-up-list__item__face:hover {
            box-shadow: 0 0 5px rgb(251, 114, 153), 0 0 5px rgb(251, 114, 153) !important;
        }
        .bili-dyn-up-list__nav.next .bili-dyn-up-list__nav__shadow {
            background: linear-gradient(90deg, hsla(0, 0%, 100%, 0), rgb(251 114 153 / 60%) !important;
        }
        .bili-dyn-up-list__nav__shim { background: rgb(251 114 153 / 60%) !important; }
        .bili-dyn-up-list__nav.prev .bili-dyn-up-list__nav__shadow {
            background: linear-gradient(270deg, hsla(0, 0%, 100%, 0), rgb(251 114 153 / 60%) !important;
        }
        .bili-album__watch__content { height: 30vw !important; }
        .bili-album__watch__content img { height: 30vw !important; max-width: 60% !important; }
        :root {
            --bg1: rgba(255,255,255,${settings.backgroundTransparency / 100}) !important;
            --bg2: rgba(255,255,255,${settings.backgroundTransparency2 / 100}) !important;
            --bg1_float: rgba(255,255,255,${settings.backgroundTransparencyFloat / 100}) !important;
        }
    `;
    GM_addStyle(mainStyles);

    /*** 条件样式合并注入 ***/
    let additionalStyles = '';
    if (settings.hideRightSidebar) {
        additionalStyles += `
            .right { display: none !important; }
            #app > div.bili-dyn-home--member > main { width: 70vw !important; }
        `;
    }
    if (settings.hidePostBar) {
        additionalStyles += `
            .bili-dyn-publishing { display: none !important; }
            #app > div.bili-dyn-home--member > main > section:nth-child(1) { display: none !important; }
            .bili-dyn-up-list__window { padding: 20px 0 !important; margin-top: 2px !important; }
        `;
    }
    if (additionalStyles) {
        GM_addStyle(additionalStyles);
    }

    /*** 样式节点复用：背景图 & 背景透明度 ***/
    const bgImageStyleEl = GM_addStyle(''); // 用于背景图样式
    const updateBackgroundImage = (url) => {
        bgImageStyleEl.innerHTML = `
            .bg {
                background-image: url("${url}") !important;
                background-size: cover !important;
                background-attachment: fixed !important;
                background-position: center center !important;
                background-repeat: no-repeat !important;
                height: 100% !important;
            }
        `;
    };
    updateBackgroundImage(settings.customBackgroundURL);

    const transparencyStyleEl = GM_addStyle(''); // 用于透明度变量
    const updateTransparency = (transparency, tB2, bg1F) => {
        transparencyStyleEl.innerHTML = `
            :root {
                --bg1: rgba(255,255,255,${transparency/100}) !important;
                --bg2: rgba(255,255,255,${tB2/100}) !important;
                --bg1_float: rgba(255,255,255,${bg1F/100}) !important;
            }
        `;
    };
    updateTransparency(settings.backgroundTransparency, settings.backgroundTransparency2, settings.backgroundTransparencyFloat);

    /*** 隐藏广告动态的逻辑（加入防抖处理） ***/
    const hideSpecificElements = () => {
        document.querySelectorAll('.bili-dyn-list__item').forEach(item => {
            if (item.querySelector('.bili-rich-text-module.goods')) {
                item.style.display = 'none';
            }
        });
    };
    // 简单防抖函数
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };
    const debouncedHide = debounce(hideSpecificElements, 100);
    if (settings.hideElementsEnabled) {
        hideSpecificElements();
        new MutationObserver(debouncedHide).observe(document.body, { childList: true, subtree: true });
    }

    /*** 定时自动点击“加载新动态” ***/
    const checkAndClick = () => {
        const selector = '#app > div.bili-dyn-home--member > main > section:nth-child(3) > div.bili-dyn-list > div.bili-dyn-list__notification > div';
        const element = document.querySelector(selector);
        if (element) {
            try {
                element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            } catch (e) {
                const event = document.createEvent('Event');
                event.initEvent('click', true, true);
                element.dispatchEvent(event);
            }
        }
    };
    let autoClickIntervalId;
    const setupAutoClick = () => {
        if (settings.enableAutoClick) {
            autoClickIntervalId = setInterval(checkAndClick, settings.autoClickInterval * 1000);
        }
    };
    setupAutoClick();

    /*** 菜单与交互设置（基本逻辑保持不变） ***/
    const createToggle = (label, key) => {
        const container = document.createElement('div');
        container.style.cssText = `
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        const toggleLabel = document.createElement('label');
        toggleLabel.innerText = label;
        toggleLabel.style.margin = '0';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = settings[key];
        checkbox.style.marginLeft = '10px';
        checkbox.onchange = () => settings[key] = checkbox.checked;
        container.append(toggleLabel, checkbox);
        return { container, checkbox };
    };

    GM_registerMenuCommand('设置', () => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 8vh;
            right: 1vw;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            z-index: 9999;
            width: 320px;
            font-family: Arial, sans-serif;
            overflow: auto;
        `;

        const modalHeader = document.createElement('div');
        modalHeader.style.cssText = `
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        `;
        modalHeader.innerText = '设置';

        // 背景图片输入及应用
        const bgInputContainer = document.createElement('div');
        bgInputContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            width: 100%;
        `;
        const bgInputLabel = document.createElement('label');
        bgInputLabel.innerText = '背景图片URL: ';
        bgInputLabel.style.flex = '0 0 35%';
        const bgInput = document.createElement('input');
        bgInput.type = 'text';
        bgInput.value = settings.customBackgroundURL;
        bgInput.style.cssText = `
            flex: 1;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        const applyBgButton = document.createElement('button');
        applyBgButton.innerText = '应用';
        applyBgButton.style.cssText = `
            width: 100%;
            padding: 5px 10px;
            background-color: #12a9df;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 5px;
        `;
        applyBgButton.onclick = () => {
            const newURL = bgInput.value;
            GM_setValue('customBackgroundURL', newURL);
            updateBackgroundImage(newURL);
        };
        bgInputContainer.append(bgInputLabel, bgInput);

        // 创建开关
        const { container: hideUpAdContainer, checkbox: hideUpAdCheckbox } = createToggle('隐藏UP广告动态', 'hideElementsEnabled');
        const { container: hideSidebarContainer, checkbox: hideSidebarCheckbox } = createToggle('隐藏右边栏', 'hideRightSidebar');
        const { container: hidePostBarContainer, checkbox: hidePostBarCheckbox } = createToggle('隐藏动态发布', 'hidePostBar');
        const { container: timerToggleContainer, checkbox: timerToggleCheckbox } = createToggle('自动加载新动态', 'enableAutoClick');

        // 点击间隔输入框
        const intervalContainer = document.createElement('div');
        intervalContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            width: 100%;
        `;
        const intervalLabel = document.createElement('label');
        intervalLabel.innerText = '点击间隔 (秒): ';
        intervalLabel.style.flex = '0 0 35%';
        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.min = '1';
        intervalInput.value = settings.autoClickInterval || 5;
        intervalInput.style.cssText = `
            flex: 1;
            padding: 5px;
            margin-left: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        `;
        intervalInput.oninput = () => {
            const interval = Math.max(1, parseInt(intervalInput.value));
            settings.autoClickInterval = interval;
            GM_setValue('autoClickInterval', interval);
            if (settings.enableAutoClick) {
                clearInterval(autoClickIntervalId);
                autoClickIntervalId = setInterval(checkAndClick, interval * 1000);
            }
        };
        intervalContainer.append(intervalLabel, intervalInput);

        // 背景透明度滑块
        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            width: 100%;
        `;
        const sliderLabel = document.createElement('label');
        sliderLabel.innerText = '背景透明度: ';
        sliderLabel.style.flex = '0 0 35%';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = settings.backgroundTransparency;
        slider.style.cssText = `
            flex: 1;
            margin-left: 5px;
        `;
        slider.oninput = () => {
            const transparency = parseInt(slider.value);
            settings.backgroundTransparency2 = Math.min(transparency + 20, 100);
            settings.backgroundTransparencyFloat = Math.min(transparency + 50, 100);
            GM_setValue('backgroundTransparency', transparency);
            GM_setValue('backgroundTransparency2', settings.backgroundTransparency2);
            GM_setValue('backgroundTransparencyFloat', settings.backgroundTransparencyFloat);
            updateTransparency(transparency, settings.backgroundTransparency2, settings.backgroundTransparencyFloat);
        };
        sliderContainer.append(sliderLabel, slider);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        `;
        const closeButton = document.createElement('button');
        closeButton.innerText = '关闭';
        closeButton.style.cssText = `
            padding: 5px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        closeButton.onclick = () => document.body.removeChild(modal);
        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.style.cssText = `
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        saveButton.onclick = () => {
            GM_setValue('hideElementsEnabled', hideUpAdCheckbox.checked);
            GM_setValue('hideRightSidebar', hideSidebarCheckbox.checked);
            GM_setValue('hidePostBar', hidePostBarCheckbox.checked);
            GM_setValue('enableAutoClick', timerToggleCheckbox.checked);
            GM_setValue('autoClickInterval', Math.max(1, parseInt(intervalInput.value)));
            location.reload();
        };
        buttonContainer.append(saveButton, closeButton);

        modal.append(
            modalHeader,
            bgInputContainer, applyBgButton,
            hideUpAdContainer,
            hideSidebarContainer,
            hidePostBarContainer,
            timerToggleContainer,
            intervalContainer,
            sliderContainer,
            buttonContainer
        );
        document.body.appendChild(modal);
    });

})();
