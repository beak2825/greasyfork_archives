// ==UserScript==
// @name         【古诗文网】自动展开注释、译文和赏析
// @namespace    https://github.com/realSilasYang
// @version         2025-12-27
// @description    自动展开古诗文网的注释、译文和赏析内容
// @author          阳熙来
// @match          https://www.gushiwen.cn/*
// @grant            none
// @icon             data:image/webp;base64,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
// @license         GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522487/%E3%80%90%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E3%80%91%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%B3%A8%E9%87%8A%E3%80%81%E8%AF%91%E6%96%87%E5%92%8C%E8%B5%8F%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/522487/%E3%80%90%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E3%80%91%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%B3%A8%E9%87%8A%E3%80%81%E8%AF%91%E6%96%87%E5%92%8C%E8%B5%8F%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // ========== 1. 禁用原生弹窗 (保持总是运行，防止后台弹窗干扰) ==========
    // 禁用alert
    window.alert = function() {};
    // 禁用confirm（默认返回true）
    window.confirm = function() { return true; };
    // 禁用prompt（返回空字符串）
    window.prompt = function() { return ""; };
    // ========== 2. 拦截DOM弹窗 ==========
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                const element = node;
                // 特征匹配：通过类名、ID或标签判断
                const isPopup = element.matches([
                    'div[class*="popup"]', // 类名包含popup
                    'div[class*="modal"]', // 类名包含modal
                    'div[id*="dialog"]', // ID包含dialog
                    '.lightbox', // 灯箱弹窗
                    '#cookie-consent' // Cookie提示
                ].join(','));
                if (isPopup) {
                    element.remove();
                }
            });
        });
    });
    // ========== 3. 阻止弹窗触发事件 ==========
    document.addEventListener('click', e => {
        const trigger = e.target.closest([
            '[onclick*="openModal"]', // 包含openModal的点击事件
            '.popup-trigger', // 弹窗触发器类名
            '#show-ad' // 弹窗触发器ID
        ].join(','));
        if (trigger) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true);
    // ========== 初始化 ==========
    window.addEventListener('DOMContentLoaded', () => {
        // 启动DOM监听
        observer.observe(document, {
            childList: true,
            subtree: true
        });
        // 清理现有弹窗
        document.querySelectorAll('.popup, .modal').forEach(popup => {
            popup.remove();
        });
    });
    // 配置项
    const CONFIG = {
        CLICK_DELAY: 50, // 每个按钮点击的延迟时间（毫秒）
        LOAD_MARGIN: '100px', // IntersectionObserver 提前加载的距离（像素）
        DEBUG: false // 是否开启调试模式
    };

    // 按钮与诗词容器的选择器
    const SELECTORS = {
        POEM_CONTAINER: '.sons .cont', // 用于标识诗词内容区域的选择器
        BUTTONS: {
            NOTE: 'img[src="https://ziyuan.guwendao.net/siteimg/zhu-pic.png"]', // 注释按钮
            TRANSLATION: 'img[src="https://ziyuan.guwendao.net/siteimg/yi-pic.png"]', // 译文按钮
            ANALYSIS: 'img[src="https://ziyuan.guwendao.net/siteimg/shang-pic.png"]' // 赏析按钮
        }
    };

    /**
     * 日志工具，用于输出调试信息
     */
    const logger = {
        log: (...args) => CONFIG.DEBUG && console.log('[古诗文展开]', ...args),
        error: (...args) => CONFIG.DEBUG && console.error('[古诗文展开]', ...args)
    };

    /**
     * 检查元素是否在视口中
     * @param {Element} element - 要检查的 HTML 元素
     * @returns {boolean} - 返回布尔值，表示元素是否在视口中
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * 快速点击诗词容器内的所有按钮
     * @param {Element} container - 诗词容器元素
     */
    function clickButtonsInContainer(container) {
        try {
            // 【新增限制】如果页面不可见，则不执行业务逻辑
            if (document.hidden) {
                logger.log('页面不可见，暂停执行展开逻辑');
                return;
            }

            // 如果容器已被处理过，则直接返回
            if (!container || container.hasAttribute('processed')) {
                return;
            }

            const buttons = [];
            // 遍历每种按钮的选择器，收集未点击的按钮
            Object.entries(SELECTORS.BUTTONS).forEach(([type, selector]) => {
                const button = container.querySelector(selector);
                if (button && !button.hasAttribute('clicked') && button.style.display !== 'none') {
                    buttons.push({ type, element: button });
                }
            });

            // 按顺序点击按钮，并设置点击的时间间隔
            if (buttons.length) {
                buttons.forEach((button, index) => {
                    setTimeout(() => {
                        try {
                            button.element.setAttribute('clicked', 'true'); // 标记按钮已被点击
                            button.element.click(); // 执行点击操作
                            logger.log(`Clicked ${button.type} button`);
                        } catch (err) {
                            logger.error(`Error clicking ${button.type} button:`, err);
                        }
                    }, index * CONFIG.CLICK_DELAY);
                });
            }

            // 标记容器已处理
            container.setAttribute('processed', 'true');
        } catch (err) {
            logger.error('Error in clickButtonsInContainer:', err);
        }
    }

    /**
     * 使用 IntersectionObserver 优化性能，按需加载诗词容器
     */
    function setupIntersectionObserver() {
        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 【限制】只有当文档可见时才执行点击和取消观察
                        if (!document.hidden) {
                            clickButtonsInContainer(entry.target); // 当进入视口且可见时，处理该容器
                            observer.unobserve(entry.target); // 停止观察该容器
                        }
                        // 注意：如果 document.hidden 为 true，这里不做操作。
                        // 容器不会被标记为 processed，也不会被 unobserve。
                        // 当用户切回标签页触发 visibilitychange 时，processVisibleContainers 会处理它。
                    }
                });
            }, {
                rootMargin: CONFIG.LOAD_MARGIN, // 设置提前加载的距离
                threshold: 0 // 当容器完全进入视口时触发
            });

            // 遍历所有未处理的诗词容器，并开始观察
            document.querySelectorAll(`${SELECTORS.POEM_CONTAINER}:not([processed])`).forEach(container => {
                observer.observe(container);
            });
        } catch (err) {
            logger.error('Error in setupIntersectionObserver:', err);
            processVisibleContainers(); // 降级处理：直接处理当前视口中的容器
        }
    }

    /**
     * 降级处理：直接处理当前视口中的容器
     */
    function processVisibleContainers() {
        // 【限制】如果页面不可见，直接退出
        if (document.hidden) return;

        try {
            const containers = document.querySelectorAll(`${SELECTORS.POEM_CONTAINER}:not([processed])`);
            containers.forEach(container => {
                if (isInViewport(container)) {
                    clickButtonsInContainer(container); // 处理视口中的容器
                }
            });
        } catch (err) {
            logger.error('Error in processVisibleContainers:', err);
        }
    }

    /**
     * 监听 DOM 中新增的内容，用于动态加载的场景
     */
    function observeNewContent() {
        try {
            const observer = new MutationObserver((mutations) => {
                let shouldProcess = false;

                // 遍历所有变动记录，判断是否有新增的诗词容器
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        const hasNewPoems = Array.from(mutation.addedNodes).some(node =>
                            node.nodeType === Node.ELEMENT_NODE &&
                            (node.matches(SELECTORS.POEM_CONTAINER) ||
                                node.querySelector(SELECTORS.POEM_CONTAINER))
                        );

                        if (hasNewPoems) {
                            shouldProcess = true;
                            break;
                        }
                    }
                }

                if (shouldProcess) {
                    setupIntersectionObserver(); // 如果有新增内容，则重新设置观察器
                }
            });

            // 监听整个文档的子节点变动
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (err) {
            logger.error('Error in observeNewContent:', err);
        }
    }

    /**
     * 防抖函数：限制高频调用，延迟执行
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 延迟时间（毫秒）
     * @returns {Function}
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 初始化脚本
     */
    function init() {
        try {
            logger.log('Initializing...');
            setupIntersectionObserver(); // 设置 IntersectionObserver
            observeNewContent(); // 监听新增内容
        } catch (err) {
            logger.error('Error in init:', err);
        }
    }

    // 使用防抖包装初始化函数
    const debouncedInit = debounce(init, 100);

    // 添加页面事件监听器
    window.addEventListener('load', debouncedInit);
    window.addEventListener('popstate', debouncedInit);
    window.addEventListener('scroll', debounce(processVisibleContainers, 100));

    // 监听标签页可见性变化
    // 当用户从其他标签页切换回来时，触发一次检查
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            logger.log('Tab became visible, processing pending containers...');
            processVisibleContainers();
            // 也可以重新初始化 Observer 以确保捕获漏掉的元素
            setupIntersectionObserver();
        }
    });

    // 重写 history.pushState 方法，监控前端路由变化
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        debouncedInit();
    };

    // 立即初始化
    debouncedInit();

    // 如果开启了调试模式，导出调试接口
    if (CONFIG.DEBUG) {
        window._gushiwen_debug = {
            processVisibleContainers,
            clickButtonsInContainer,
            CONFIG,
            SELECTORS
        };
    }
})();