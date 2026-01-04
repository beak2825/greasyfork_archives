// ==UserScript==
// @name         Via Css隐藏规则日志(高斯模糊)
// @namespace    https://viayoo.com/
// @version      0.1
// @license      MIT
// @description  检测哪些Css规则在Via上生效，并输出匹配日志。支持动态检测开关。显示结果使用 iOS 风格高斯模糊提示框，支持自适应宽度和滚动，匹配结果双击消失。
// @author       Copilot & Grok
// @run-at       document-end
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/533146/Via%20Css%E9%9A%90%E8%97%8F%E8%A7%84%E5%88%99%E6%97%A5%E5%BF%97%28%E9%AB%98%E6%96%AF%E6%A8%A1%E7%B3%8A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533146/Via%20Css%E9%9A%90%E8%97%8F%E8%A7%84%E5%88%99%E6%97%A5%E5%BF%97%28%E9%AB%98%E6%96%AF%E6%A8%A1%E7%B3%8A%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_STORAGE = {
        ENABLED: 'floatingButtonEnabled',
        LEFT: 'floatingButtonLeft',
        TOP: 'floatingButtonTop',
        DYNAMIC_OBSERVER_ENABLED: 'dynamicObserverEnabled'
    };
    const DEFAULT_CSS_FILE_PATH = '/via_inject_blocker.css';
    const LONG_PRESS_THRESHOLD = 500;
    const OBSERVER_INTERVAL = 2000;
    const BATCH_SIZE = 100;

    const createStyledElement = (tag, styles, text) => {
        const el = document.createElement(tag);
        Object.assign(el.style, styles);
        if (text) el.textContent = text;
        return el;
    };

    const splitSelectors = cssText => {
        const selectors = [];
        let current = '';
        let inBlock = false;
        let bracketDepth = 0;
        let parenDepth = 0;
        let inQuote = false;
        let quoteChar = null;

        for (let i = 0; i < cssText.length; i++) {
            const char = cssText[i];

            if (inQuote) {
                current += char;
                if (char === quoteChar) inQuote = false;
                continue;
            }

            if (char === '"' || char === "'") {
                inQuote = true;
                quoteChar = char;
                current += char;
                continue;
            }

            if (inBlock) {
                if (char === '}') inBlock = false;
                continue;
            }

            if (char === '[') bracketDepth++;
            if (char === ']') bracketDepth--;
            if (char === '(') parenDepth++;
            if (char === ')') parenDepth--;
            if (char === '{' && bracketDepth === 0 && parenDepth === 0 && !inQuote) {
                if (current.trim()) selectors.push(current.trim());
                current = '';
                inBlock = true;
                continue;
            }
            if (char === ',' && bracketDepth === 0 && parenDepth === 0 && !inQuote && !inBlock) {
                if (current.trim()) selectors.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        if (current.trim() && !inBlock) selectors.push(current.trim());
        return selectors.filter(s => s && !s.includes('!important') && !s.startsWith('@'));
    };

    const checkActiveSelectors = async (cssText) => {
        try {
            const selectors = splitSelectors(cssText);
            const activeRules = [];
            const debugInfo = [];

            for (let i = 0; i < selectors.length; i += BATCH_SIZE) {
                const batch = selectors.slice(i, i + BATCH_SIZE);
                for (const selector of batch) {
                    try {
                        const elements = document.querySelectorAll(selector);
                        if (elements.length) {
                            activeRules.push({
                                selector: selector.trim(),
                                count: elements.length
                            });
                        }
                        debugInfo.push({
                            selector: selector.trim(),
                            count: elements.length,
                            exists: elements.length > 0 ? '匹配成功' : '无匹配元素'
                        });
                    } catch (e) {
                        debugInfo.push({
                            selector: selector.trim(),
                            count: 0,
                            exists: `选择器无效: ${e.message}`
                        });
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            return {
                activeRules,
                debugInfo
            };
        } catch (e) {
            console.error(`[Via CSS Logger] 检查选择器失败: ${e.message}`);
            return {
                activeRules: [],
                debugInfo: []
            };
        }
    };

    const showBlurToast = (message, duration = 10000, isPrimary = false) => {
        const existingToast = document.querySelector('.via-blur-toast');
        if (existingToast) existingToast.remove();

        const toast = createStyledElement('div', {
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%) scale(0.8)', // 初始缩小
            maxWidth: 'min(100vw, 600px)',
            maxHeight: isPrimary ? '80vh' : '50vh',
            padding: '15px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            color: '#333',
            fontSize: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            zIndex: '10001',
            opacity: '0',
            transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)', // 回弹效果曲线
            whiteSpace: 'pre-wrap',
            textAlign: isPrimary ? 'left' : 'center',
            lineHeight: '1.5',
            cursor: 'pointer',
            boxSizing: 'border-box',
            overflowY: isPrimary ? 'auto' : 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent'
        }, message);

        // 自定义滚动条样式
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
        .via-blur-toast::-webkit-scrollbar {
            width: 8px;
        }
        .via-blur-toast::-webkit-scrollbar-track {
            background: transparent;
        }
        .via-blur-toast::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 9px;
        }
        .via-blur-toast::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.1);
        }
    `;
        document.head.appendChild(styleSheet);

        if (isPrimary) {
            toast.style.top = '50%';
            toast.style.transform = 'translate(-50%, -50%) scale(0.8)';
        } else {
            toast.style.top = '85%';
        }

        toast.className = 'via-blur-toast';
        document.body.appendChild(toast);

        // 入场动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = isPrimary ? 'translate(-50%, -50%) scale(1)' : 'translateX(-50%) scale(1)';
        }, 10);

        // 离场动画
        const timeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = isPrimary ? 'translate(-50%, -50%) scale(0.8)' : 'translateX(-50%) scale(0.8)';
            setTimeout(() => {
                toast.remove();
                styleSheet.remove();
            }, 500); // 与 transition 持续时间一致
        }, duration);

        // 双击/单击移除
        const removeToast = () => {
            clearTimeout(timeout);
            toast.style.opacity = '0';
            toast.style.transform = isPrimary ? 'translate(-50%, -50%) scale(0.8)' : 'translateX(-50%) scale(0.8)';
            setTimeout(() => {
                toast.remove();
                styleSheet.remove();
            }, 500);
        };

        if (isPrimary) {
            toast.addEventListener('dblclick', removeToast);
        } else {
            toast.addEventListener('click', removeToast);
        }
    };


    const checkCssFile = async (enableDynamic = false) => {
        const cssUrl = `http://${window.location.hostname}${DEFAULT_CSS_FILE_PATH}`;
        console.log(`[Via CSS Logger] 尝试获取 CSS 文件: ${cssUrl}`);
        try {
            const response = await fetch(cssUrl, {
                cache: 'no-cache'
            });
            console.log(`[Via CSS Logger] 获取 CSS 文件，状态码: ${response.status}`);
            if (!response.ok) throw new Error(`状态码: ${response.status}`);

            const rawCss = await response.text();
            if (!rawCss.trim()) throw new Error('CSS文件为空');

            const checkRules = async () => {
                try {
                    const {
                        activeRules
                    } = await checkActiveSelectors(rawCss);

                    if (activeRules.length) {
                        const messageLines = [
                            `🎉 检测完成！共 ${activeRules.length} 条规则生效：`,
                            '--------------------------------',
                            ...activeRules.map((r, i) =>
                                `${i + 1}. 规则: ${window.location.hostname}##${r.selector}\n   匹配数: ${r.count}\n`
                            ),
                            '--------------------------------'
                        ];
                        const fullMessage = messageLines.join('\n');
                        console.log(fullMessage);
                        showBlurToast(fullMessage.slice(0, 2500) + (fullMessage.length > 2500 ? '\n\nℹ️ 日志过长，请查看控制台以获取完整信息' : ''), 10000, true);
                    } else {
                        showBlurToast('⚠️ 没有发现生效的CSS规则！', 3000, false);
                    }

                    if (enableDynamic && GM_getValue(BUTTON_STORAGE.DYNAMIC_OBSERVER_ENABLED, false)) {
                        startDynamicObserver(rawCss);
                    }
                } catch (e) {
                    console.error(`[Via CSS Logger] 规则检查失败: ${e.message}`);
                    showBlurToast(`❌ 规则检查失败: ${e.message}`, 5000, false);
                }
            };

            if (document.readyState === 'complete') {
                await checkRules();
            } else {
                window.addEventListener('load', async () => {
                    await checkRules();
                }, {
                    once: true
                });
            }
        } catch (e) {
            console.error(`[Via CSS Logger] CSS检查失败: ${e.message}`);
            showBlurToast(`❌ 检查CSS文件失败: ${e.message}\nURL: ${cssUrl}`, 5000, false);
        }
    };


    const startDynamicObserver = (cssText) => {
        try {
            let lastCheck = Date.now();
            let hasTriggered = false;
            let isChecking = false;

            const observer = new MutationObserver(async (mutations) => {
                if (hasTriggered || isChecking) return;

                const now = Date.now();
                if (now - lastCheck >= OBSERVER_INTERVAL) {
                    isChecking = true;
                    try {
                        console.log(`[Via CSS Logger] 动态检查触发: ${new Date().toISOString()}, 变化数: ${mutations.length}`);
                        const {
                            activeRules
                        } = await checkActiveSelectors(cssText);
                        if (activeRules.length) {
                            hasTriggered = true;
                            observer.disconnect();
                            const messageLines = [
                                `🎉 动态检测完成！共 ${activeRules.length} 条规则生效：`,
                                '--------------------------------',
                                ...activeRules.map((r, i) =>
                                    `${i + 1}. 规则: ${window.location.hostname}##${r.selector}\n   匹配数: ${r.count}\n`
                                ),
                                '--------------------------------'
                            ];
                            const fullMessage = messageLines.join('\n');
                            console.log(`[Via CSS Logger] 弹窗输出:`, fullMessage);
                            showBlurToast(fullMessage.slice(0, 2500), 10000, true); // 主要消息
                        }
                    } catch (e) {
                        console.error(`[Via CSS Logger] 动态检查失败: ${e.message}`);
                        showBlurToast(`❌ 动态检查失败: ${e.message}`, 5000, false);
                    } finally {
                        isChecking = false;
                        lastCheck = now;
                    }
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (e) {
            console.error(`[Via CSS Logger] 动态监控启动失败: ${e.message}`);
            showBlurToast(`❌ 动态监控启动失败: ${e.message}`, 5000, false);
        }
    };

    const createFloatingButton = () => {
        if (window.self !== window.top) return;

        const button = createStyledElement('div', {
            position: 'fixed',
            zIndex: '10000',
            width: '80px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '0.5px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#1C2526',
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: '15px',
            fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '500',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            opacity: '0.95',
            transition: 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.5), opacity 0.2s, box-shadow 0.2s',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
        }, 'CSS日志');

        const defaultLeft = window.innerWidth - 100;
        const defaultTop = window.innerHeight - 100;
        button.style.left = `${GM_getValue(BUTTON_STORAGE.LEFT, defaultLeft)}px`;
        button.style.top = `${GM_getValue(BUTTON_STORAGE.TOP, defaultTop)}px`;

        document.body.appendChild(button);

        let isDragging = false,
            startX,
            startY,
            startLeft,
            startTop,
            touchStartTime;

        button.addEventListener('touchstart', e => {
            e.preventDefault();
            touchStartTime = Date.now();
            isDragging = false;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = parseInt(button.style.left) || 0;
            startTop = parseInt(button.style.top) || 0;

            button.style.transform = 'scale(0.95)';
            button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)';
        });

        button.addEventListener('touchmove', e => {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Date.now() - touchStartTime >= LONG_PRESS_THRESHOLD) {
                isDragging = true;
                const newLeft = startLeft + deltaX;
                const newTop = startTop + deltaY;
                const rect = button.getBoundingClientRect();
                button.style.left = `${Math.max(0, Math.min(newLeft, window.innerWidth - rect.width))}px`;
                button.style.top = `${Math.max(0, Math.min(newTop, window.innerHeight - rect.height))}px`;
            }
        });

        button.addEventListener('touchend', e => {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.3)';

            if (isDragging && touchDuration >= LONG_PRESS_THRESHOLD) {
                const rect = button.getBoundingClientRect();
                const newLeft = rect.left + rect.width / 2 < window.innerWidth / 2 ? 0 : window.innerWidth - rect.width;
                button.style.left = `${newLeft}px`;
                GM_setValue(BUTTON_STORAGE.LEFT, newLeft);
                GM_setValue(BUTTON_STORAGE.TOP, parseInt(button.style.top));
            } else if (touchDuration < LONG_PRESS_THRESHOLD) {
                showBlurToast('正在匹配对应规则……', 2000, false);
                checkCssFile(GM_getValue(BUTTON_STORAGE.DYNAMIC_OBSERVER_ENABLED, false));
            }
        });

        return button;
    };

    const ensureButtonExists = () => {
        if (!document.querySelector("div[style*='CSS日志']")) {
            createFloatingButton();
        }
    };

    const resetButtonPosition = () => {
        const defaultLeft = window.innerWidth - 100;
        const defaultTop = window.innerHeight - 100;
        GM_setValue(BUTTON_STORAGE.LEFT, defaultLeft);
        GM_setValue(BUTTON_STORAGE.TOP, defaultTop);

        const button = document.querySelector("div[style*='CSS日志']");
        if (button) {
            button.style.left = `${defaultLeft}px`;
            button.style.top = `${defaultTop}px`;
        }
        showBlurToast('✅ 悬浮按钮位置已重置至默认位置！', 3000, false);
    };

    const init = () => {
        try {
            const isButtonEnabled = GM_getValue(BUTTON_STORAGE.ENABLED, false);
            const isDynamicObserverEnabled = GM_getValue(BUTTON_STORAGE.DYNAMIC_OBSERVER_ENABLED, false);

            GM_registerMenuCommand(
                isButtonEnabled ? '关闭悬浮按钮' : '开启悬浮按钮',
                () => {
                    GM_setValue(BUTTON_STORAGE.ENABLED, !isButtonEnabled);
                    showBlurToast(`✅ 悬浮按钮已${isButtonEnabled ? '关闭' : '开启'}！`, 3000, false);
                    location.reload();
                }
            );
            GM_registerMenuCommand(
                isDynamicObserverEnabled ? '关闭动态检测' : '开启动态检测',
                () => {
                    GM_setValue(BUTTON_STORAGE.DYNAMIC_OBSERVER_ENABLED, !isDynamicObserverEnabled);
                    showBlurToast(`✅ 动态检测已${isDynamicObserverEnabled ? '关闭' : '开启'}！`, 3000, false);
                    location.reload();
                }
            );

            GM_registerMenuCommand('检测CSS隐藏规则', () => checkCssFile(false));
            GM_registerMenuCommand('重置悬浮按钮位置', resetButtonPosition);

            if (isButtonEnabled) {
                document.readyState === 'loading' ?
                    document.addEventListener('DOMContentLoaded', ensureButtonExists) :
                    ensureButtonExists();
            }
        } catch (e) {
            console.error(`[Via CSS Logger] 初始化失败: ${e.message}`);
            showBlurToast(`❌ 脚本初始化失败: ${e.message}`, 5000, false);
        }
    };

    init();
})();