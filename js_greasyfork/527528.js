// ==UserScript==
// @name         腾讯元宝增强脚本 - 自动切换deepseek并记忆深度思考状态
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  貌似元宝已经原生支持这个功能了，大家可以不用下载了，不行的时候大家再来踢我，我继续更新。（自动切换至deepseek模型并记忆深度思考状态）
// @license      MIT
// @author       Diyun
// @match        https://yuanbao.tencent.com/*
// @icon         https://cdn-bot.hunyuan.tencent.com/logo.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527528/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%20-%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2deepseek%E5%B9%B6%E8%AE%B0%E5%BF%86%E6%B7%B1%E5%BA%A6%E6%80%9D%E8%80%83%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/527528/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%20-%20%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2deepseek%E5%B9%B6%E8%AE%B0%E5%BF%86%E6%B7%B1%E5%BA%A6%E6%80%9D%E8%80%83%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======= 公共变量与工具函数 ======= //

    // 状态管理对象
    const state = {
        isSwitching: false,    // 切换操作进行中标记
        hasBound: false,       // 事件绑定标记
        STORAGE_KEY: 'deep_think_last_state',
        BUTTON_SELECTOR: 'button[dt-button-id="deep_think"]'
    };

    // 权限兼容处理
    if (typeof GM_getValue === 'undefined') {
        GM_getValue = (key, def) => localStorage.getItem(key) || def;
        GM_setValue = (key, val) => localStorage.setItem(key, val);
    }

    // 智能元素检测函数（增加超时机制）
    const waitForElement = (selector, isXPath = false, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
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
                } else if (Date.now() - start >= timeout) {
                    reject(new Error('元素查找超时'));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    };

    // ======= 功能一：自动切换模型 ======= //

    // 模型切换主逻辑
    const autoSwitchModel = async () => {
        if (state.isSwitching) return;
        state.isSwitching = true;

        try {
            // 第一阶段：等待并点击模型切换按钮
            const switchBtn = await waitForElement('button[dt-button-id="model_switch"]:not([disabled])');
            switchBtn.click();
            console.debug('[智能切换] 已展开模型列表');

            // 第二阶段：等待并选择目标模型
            const targetItem = await waitForElement(
                '//div[contains(@class,"drop-down-item")][.//div[text()="DeepSeek"]][.//div[contains(.,"深度思考")]]',
                true
            );
            targetItem.click();
            console.log('[智能切换] 模型切换成功');

            // 完成模型切换后，处理深度思考状态
            setTimeout(syncDeepThinkState, 1000);
        } catch (err) {
            console.error('[智能切换] 操作失败:', err);
        } finally {
            state.isSwitching = false;
        }
    };

    // 智能事件绑定
    const smartBind = () => {
        if (state.hasBound) return;

        // 事件委托处理新建对话按钮
        document.body.addEventListener('click', async (e) => {
            const target = e.target.closest('.yb-common-nav__hd__new-chat.J_UseGuideNewChat0');
            if (!target) return;

            console.log('[智能切换] 检测到新建对话操作');
            setTimeout(() => {
                autoSwitchModel().catch(console.error);
            }, 1000); // 根据实际网络状况调整延迟
        }, { once: false, passive: true });

        state.hasBound = true;
    };

    // ======= 功能二：深度思考状态记忆 ======= //

    // 同步深度思考状态
    const syncDeepThinkState = () => {
        const button = document.querySelector(state.BUTTON_SELECTOR);
        if (!button) return;

        const targetState = GM_getValue(state.STORAGE_KEY, 'checked');
        const currentId = button.getAttribute('dt-model-id');

        console.log(`[深度思考] 当前: ${currentId}, 目标: ${targetState === 'checked' ? 'deep_seek' : 'deep_seek_v3'}`);

        // 需要切换的三种情况
        if (
            (targetState === 'unchecked' && currentId === 'deep_seek') ||
            (targetState === 'checked' && currentId === 'deep_seek_v3') ||
            (targetState === null && currentId === 'deep_seek_v3')
        ) {
            button.click();
            console.log('[深度思考] 已执行状态切换');
        }
    };

    // 监听并保存深度思考状态变化
    const listenDeepThinkChanges = () => {
        document.addEventListener('click', (e) => {
            if (e.target.closest(state.BUTTON_SELECTOR)) {
                setTimeout(() => {
                    const button = document.querySelector(state.BUTTON_SELECTOR);
                    if (!button) return;

                    const newState = button.getAttribute('dt-model-id') === 'deep_seek' ? 'checked' : 'unchecked';
                    GM_setValue(state.STORAGE_KEY, newState);
                    console.log(`[深度思考] 状态已保存: ${newState}`);
                }, 300);
            }
        });
    };

    // ======= 初始化与主逻辑 ======= //

    // 页面加载处理
    const init = () => {
        // 主功能初始化 - 自动切换模型
        setTimeout(() => {
            autoSwitchModel().catch(console.error);
            smartBind();
        }, 1500);

        // 深度思考状态记忆功能初始化
        listenDeepThinkChanges();

        // 轻量级DOM监听
        const observer = new MutationObserver((mutations) => {
            // 检查新建按钮的变化
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    const hasRelevantNode = [...mutation.addedNodes].some(node =>
                        node.nodeType === 1 &&
                        node.closest('.yb-common-nav__hd__new-chat.J_UseGuideNewChat0')
                    );
                    if (hasRelevantNode) smartBind();
                }
            }

            // 检查深度思考按钮的出现
            if (document.querySelector(state.BUTTON_SELECTOR)) {
                syncDeepThinkState();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // 立即检查现有深度思考按钮
        if (document.querySelector(state.BUTTON_SELECTOR)) {
            syncDeepThinkState();
        }
    };

    // 启动脚本
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init, { once: true });
    }
})();