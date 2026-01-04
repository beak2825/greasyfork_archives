// ==UserScript==
// @name         腾讯元宝自动切换模型(记忆版)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  [带记忆功能]自动切换DeepSeek+智能同步用户设置+状态持久化
// @license      MIT
// @author       YourName
// @match        https://yuanbao.tencent.com/*
// @icon         https://cdn-bot.hunyuan.tencent.com/logo.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528035/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%A8%A1%E5%9E%8B%28%E8%AE%B0%E5%BF%86%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528035/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%A8%A1%E5%9E%8B%28%E8%AE%B0%E5%BF%86%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强配置系统
    const CONFIG = {
        TARGET_MODEL: 'DeepSeek',
        DEFAULT_SETTINGS: {
            DEEP_THINK: true,
            WEB_SEARCH: true
        },
        RETRY_INTERVAL: 1000,       // 增加等待时间
        MAX_RETRY: 8,              // 增加重试次数
        SYNC_DELAY: 1500,
        MODEL_MENU_WAIT: 800       // 新增模型菜单等待时间
    };

    // 智能选择器系统（改进XPath匹配）
    const SELECTORS = {
        MODEL_SWITCH: 'button[dt-button-id="model_switch"]',
        MODEL_LIST_ITEM: modelName =>
            `//div[contains(@class,"drop-down-item")]//div[contains(normalize-space(), "${modelName}")]`,
        DEEP_THINK: 'button[dt-button-id="deep_think"]',
        WEB_SEARCH: 'button[dt-button-id="online_search"]',
        ACTIVE_INDICATOR: '.t-icon-check-mark', // 新增激活状态指示器
        MODEL_MENU: '.model-switch-menu',       // 新增模型菜单选择器
        CHAT_CONTAINER: '.chat-container',
        INPUT_AREA: '.input-area'
    };

    // 状态管理系统
    let isProcessing = false;
    let retryCount = 0;
    let userSettings = {};

    // 存储系统初始化（保持不变）
    const initStorage = () => {
        userSettings = Object.fromEntries(
            Object.keys(CONFIG.DEFAULT_SETTINGS).map(key => [
                key,
                GM_getValue(key, CONFIG.DEFAULT_SETTINGS[key])
            ])
        );
    };

    // 增强版元素等待系统（增加错误处理）
    const waitForElement = async (selector, isXPath = false) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checker = () => {
                try {
                    let element;
                    if (isXPath) {
                        const result = document.evaluate(
                            selector,
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        );
                        element = result.singleNodeValue;
                    } else {
                        element = document.querySelector(selector);
                    }

                    if (element) {
                        resolve(element);
                        return;
                    }
                } catch (error) {
                    console.error('元素查询错误:', error);
                }

                if (Date.now() - startTime < CONFIG.RETRY_INTERVAL * CONFIG.MAX_RETRY) {
                    setTimeout(checker, CONFIG.RETRY_INTERVAL);
                } else {
                    reject(new Error(`元素加载超时: ${selector}`));
                }
            };

            checker();
        });
    };

    // 增强安全交互系统（增加视觉反馈）
    const safeClick = async (element, retries = 3) => {
        try {
            // 添加点击动画效果
            element.style.transform = 'scale(0.98)';
            element.style.transition = 'transform 0.1s';

            element.scrollIntoView({behavior: 'smooth', block: 'center'});
            await new Promise(r => setTimeout(r, 300));

            const originalBoxShadow = element.style.boxShadow;
            element.style.boxShadow = '0 0 8px rgba(0, 255, 157, 0.5)';

            element.click();
            await new Promise(r => setTimeout(r, 500));

            // 恢复样式
            element.style.transform = '';
            element.style.boxShadow = originalBoxShadow;
        } catch (error) {
            if (retries > 0) {
                await safeClick(element, retries - 1);
            } else {
                throw new Error('元素点击失败');
            }
        }
    };

    // 改进模型控制系统（增加菜单等待）
    const switchModel = async () => {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // 检查当前模型状态
            const currentModel = await waitForElement(SELECTORS.MODEL_SWITCH)
                .then(btn => btn.querySelector('.t-button__text')?.textContent?.trim());

            if (currentModel === CONFIG.TARGET_MODEL) {
                console.log('目标模型已激活，跳过切换');
                return;
            }

            // 打开模型切换面板
            const switchBtn = await waitForElement(SELECTORS.MODEL_SWITCH);
            await safeClick(switchBtn);

            // 等待菜单完全加载
            await waitForElement(SELECTORS.MODEL_MENU);
            await new Promise(r => setTimeout(r, CONFIG.MODEL_MENU_WAIT));

            // 选择目标模型
            const modelItem = await waitForElement(
                SELECTORS.MODEL_LIST_ITEM(CONFIG.TARGET_MODEL),
                true
            );
            await safeClick(modelItem);
            console.log('模型切换成功');

            // 等待界面稳定
            await new Promise(r => setTimeout(r, CONFIG.SYNC_DELAY));
            await applyUserSettings();
        } catch (error) {
            console.error('模型控制异常:', error);
            if (retryCount++ < CONFIG.MAX_RETRY) {
                setTimeout(switchModel, CONFIG.RETRY_INTERVAL);
            }
        } finally {
            isProcessing = false;
        }
    };

    // 改进用户设置应用（使用稳定状态判断）
    const applyUserSettings = async () => {
        const syncFeature = async (selector, settingKey) => {
            try {
                const element = await waitForElement(selector);
                const shouldActive = userSettings[settingKey];
                // 使用更可靠的状态判断方式
                const isActive = !!element.querySelector(SELECTORS.ACTIVE_INDICATOR);

                if (shouldActive !== isActive) {
                    await safeClick(element);
                    console.log(`${settingKey} 已同步: ${shouldActive}`);
                    await new Promise(r => setTimeout(r, 500));
                }
            } catch (error) {
                console.error(`${settingKey} 同步失败:`, error);
            }
        };

        await Promise.all([
            syncFeature(SELECTORS.DEEP_THINK, 'DEEP_THINK'),
            syncFeature(SELECTORS.WEB_SEARCH, 'WEB_SEARCH')
        ]);
    };

    // 增强用户行为监听（事件委托）
    const initUserListener = () => {
        const handleSettingChange = (element, settingKey) => {
            const isActive = !!element.querySelector(SELECTORS.ACTIVE_INDICATOR);
            GM_setValue(settingKey, isActive);
            userSettings[settingKey] = isActive;
        };

        document.addEventListener('click', async (event) => {
            try {
                // 使用事件委托处理动态元素
                const webSearchBtn = event.target.closest(SELECTORS.WEB_SEARCH);
                if (webSearchBtn) {
                    await new Promise(r => setTimeout(r, 300)); // 等待状态更新
                    handleSettingChange(webSearchBtn, 'WEB_SEARCH');
                }

                const deepThinkBtn = event.target.closest(SELECTORS.DEEP_THINK);
                if (deepThinkBtn) {
                    await new Promise(r => setTimeout(r, 300));
                    handleSettingChange(deepThinkBtn, 'DEEP_THINK');
                }
            } catch (error) {
                console.error('设置监听错误:', error);
            }
        });
    };

    // 优化界面观察系统（精确观察范围）
    const initObserver = () => {
        const observer = new MutationObserver(mutations => {
            if (!mutations.some(m => m.addedNodes.length > 0)) return;
            switchModel();
        });

        const observeTarget = document.querySelector(SELECTORS.INPUT_AREA) || document.body;
        observer.observe(observeTarget, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    };

    // 样式注入（保持不变）
    const injectStyles = () => {
        GM_addStyle(`
            .tamper-status {
                /* 原有样式保持不变 */
            }
        `);
        // 状态提示注入逻辑保持不变
    };

    // 主初始化流程（增加错误处理）
    const init = async () => {
        try {
            initStorage();
            injectStyles();
            initUserListener();
            initObserver();

            // 初始同步
            await switchModel();
            await applyUserSettings();
        } catch (error) {
            console.error('初始化失败:', error);
        }
    };

    // 启动逻辑优化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init, {once: true});
    }
})();
