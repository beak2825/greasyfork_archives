// ==UserScript==
// @name         WenXiaoBai极速填表（最终修复版）
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  修复用户输入冲突问题的最终版本
// @author       YourName
// @match        https://www.wenxiaobai.com/chat/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530972/WenXiaoBai%E6%9E%81%E9%80%9F%E5%A1%AB%E8%A1%A8%EF%BC%88%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530972/WenXiaoBai%E6%9E%81%E9%80%9F%E5%A1%AB%E8%A1%A8%EF%BC%88%E6%9C%80%E7%BB%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数模块
    const CONFIG = {
        HASH_KEY: 'wxb',             // URL哈希参数键名
        INPUT_SELECTOR: 'textarea:not([readonly])', // 目标输入框选择器
        FILL_DELAY: 0,               // 填充延迟时间
        GUARD_DURATION: 500,         // 防重置保护持续时间
        CHUNK_SIZE: 30,              // 分块填充的字符数
        OBSERVER_DEBOUNCE: 50        // DOM观察者防抖时间
    };

    // 运行时状态管理器
    const state = {
        cachedElement: null,         // 缓存的输入框元素
        valueCache: '',              // 当前填充值缓存
        isUserModified: false,       // 用户修改标记
        isFilling: false,            // 正在填充标记
        fillQueue: null,             // 填充动画帧ID
        observer: null,              // MutationObserver实例
        protectionListeners: new Set(), // 防重置事件监听器集合
        monitorListeners: new Set()  // 输入监控事件监听器集合
    };

    // 核心填充功能模块
    const core = {
        // 分块填充执行器（使用RAF优化性能）
        fillExecutor(value, element) {
            cancelAnimationFrame(state.fillQueue);
            state.isFilling = true;

            const totalLength = value.length;
            let currentPosition = 0;

            const fillChunk = () => {
                // 中断条件检查：用户修改或元素失效
                if (this.shouldStopFill(element)) {
                    state.isFilling = false;
                    return;
                }

                currentPosition = Math.min(currentPosition + CONFIG.CHUNK_SIZE, totalLength);
                element.value = value.slice(0, currentPosition);
                this.triggerInput(element);

                if (currentPosition < totalLength) {
                    state.fillQueue = requestAnimationFrame(fillChunk);
                } else {
                    this.finalizeFill(value, element);
                }
            };

            element.focus({preventScroll: true});
            fillChunk();
        },

        // 填充中断条件检查
        shouldStopFill(element) {
            return state.isUserModified || !element?.isConnected;
        },

        // 完成填充后的收尾工作
        finalizeFill(value, element) {
            state.valueCache = value;
            state.isFilling = false;
            protection.setupGuard(element);
        },

        // 带节流的输入事件触发器
        triggerInput: (() => {
            let lastTrigger = 0;
            return (element) => {
                const now = Date.now();
                if (now - lastTrigger > 50) {
                    element.dispatchEvent(new InputEvent('input', {
                        bubbles: true,
                        cancelable: false,
                        composed: true
                    }));
                    lastTrigger = now;
                }
            };
        })()
    };

    // 防重置保护模块
    const protection = {
        active: false,

        // 初始化保护机制（500ms内阻止外部修改）
        setupGuard(element) {
            this.removeListeners();
            if (this.active) return;

            this.active = true;
            const guardStart = Date.now();

            const eventHandler = (e) => {
                // 保护期结束后不再处理
                if (this.shouldDisableGuard(guardStart) || element.contains(e.target)) return;
                element.value = state.valueCache;
                core.triggerInput(element);
            };

            const cleanup = () => {
                this.active = false;
                this.removeListeners();
            };

            this.addListeners([
                [window, 'click', eventHandler],
                [window, 'focus', eventHandler]
            ]);
            setTimeout(cleanup, CONFIG.GUARD_DURATION);
        },

        // 判断是否超出保护期
        shouldDisableGuard(startTime) {
            return Date.now() - startTime > CONFIG.GUARD_DURATION;
        },

        // 批量添加事件监听器
        addListeners(list) {
            list.forEach(([target, type, handler]) => {
                target.addEventListener(type, handler, {passive: true});
                state.protectionListeners.add({target, type, handler});
            });
        },

        // 清除所有保护监听器
        removeListeners() {
            state.protectionListeners.forEach(({target, type, handler}) => {
                target.removeEventListener(type, handler);
            });
            state.protectionListeners.clear();
        }
    };

    // 用户输入监控模块
    const monitor = {
        // 初始化输入监控
        init(element) {
            this.removeListeners();

            const handleUserInput = (e) => {
                if (state.isFilling) return;
                state.isUserModified = true;
                this.cleanup();
            };

            this.addListeners([
                [element, 'input', handleUserInput]
            ]);
        },

        // 批量添加监控监听器
        addListeners(list) {
            list.forEach(([target, type, handler]) => {
                target.addEventListener(type, handler);
                state.monitorListeners.add({target, type, handler});
            });
        },

        // 清理所有监控相关状态
        cleanup() {
            this.removeListeners();
            protection.removeListeners();
            cancelAnimationFrame(state.fillQueue);
            state.isFilling = false;
        },

        // 移除所有监控监听器
        removeListeners() {
            state.monitorListeners.forEach(({target, type, handler}) => {
                target.removeEventListener(type, handler);
            });
            state.monitorListeners.clear();
        }
    };

    // 主控制模块
    const main = {
        // 初始化入口
        init() {
            this.setupObserver();
            this.immediateCheck();
        },

        // 立即执行元素检查
        immediateCheck() {
            if (this.updateElement() && !state.isUserModified) {
                this.tryFill();
            }
        },

        // 设置DOM变化观察者（防抖处理）
        setupObserver() {
            if (state.observer) return;

            state.observer = new MutationObserver(this.debounce(() => {
                this.immediateCheck();
            }, CONFIG.OBSERVER_DEBOUNCE));

            state.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'disabled']
            });
        },

        // 防抖函数（性能优化）
        debounce(func, wait) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        // 更新目标元素缓存
        updateElement() {
            if (state.cachedElement?.isConnected) return true;
            state.cachedElement = document.querySelector(CONFIG.INPUT_SELECTOR);
            return !!state.cachedElement;
        },

        // 执行填充流程
        tryFill() {
            if (!this.hasFillParam() || state.isUserModified) return;

            const value = new URLSearchParams(window.location.hash.slice(1))
                          .get(CONFIG.HASH_KEY);
            if (value && state.cachedElement) {
                core.fillExecutor(value, state.cachedElement);
                monitor.init(state.cachedElement);
            }
        },

        // 检查URL是否包含填充参数
        hasFillParam() {
            return window.location.hash.includes(`${CONFIG.HASH_KEY}=`);
        }
    };

    // 安全启动模块
    let initialized = false;
    const safeInit = () => {
        if (initialized) return;
        initialized = true;

        const initHandler = () => {
            if (document.readyState === 'complete') {
                main.init();
            }
        };

        // 事件监听绑定
        document.addEventListener('readystatechange', initHandler);
        window.addEventListener('load', initHandler);
        window.addEventListener('hashchange', main.init.bind(main));

        // 立即执行检查
        if (document.readyState === 'complete') {
            main.init();
        }
    };

    safeInit();
})();