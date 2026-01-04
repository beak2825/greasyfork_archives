// ==UserScript==
// @name         ChatGPT PoW 显示助手-私用修改版
// @namespace    https://linux.do/u/zgccrui
// @version      0.1
// @description  实时显示PoW难度值及模拟手机UA，并提供更完善的设备信息伪装。
// @license      GNU Affero General Public License v3.0 or later
// @author       zgccrui
// @match        https://chatgpt.com/*
// @icon         https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/openai.svg
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526789/ChatGPT%20PoW%20%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B-%E7%A7%81%E7%94%A8%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/526789/ChatGPT%20PoW%20%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B-%E7%A7%81%E7%94%A8%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 模拟手机UA及设备指纹伪装部分 ***/
    function applyMobileUASimulation() {
        // 定义 iPhone 14 Pro Max 的 User-Agent 字符串
        const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) " +
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";

        // 重写 navigator.userAgent
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return mobileUA; },
            configurable: false,
            enumerable: true
        });

        // 重写 navigator.platform
        Object.defineProperty(navigator, 'platform', {
            get: function () { return 'iPhone'; },
            configurable: false,
            enumerable: true
        });

        // 重写 window.devicePixelRatio
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function () { return 3; },
            configurable: false,
            enumerable: true
        });

        // 模拟触摸事件支持
        window.ontouchstart = function () { };
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: function () { return 5; },
            configurable: false,
            enumerable: true
        });

        // 重写 navigator.languages，模拟真实手机语言设置
        Object.defineProperty(navigator, 'languages', {
            get: function () { return ['en-US', 'en']; },
            configurable: false,
            enumerable: true
        });

        // 重写 navigator.hardwareConcurrency，模拟较少 CPU 核心数
        Object.defineProperty(navigator, 'hardwareConcurrency', {
            get: function () { return 4; },
            configurable: false,
            enumerable: true
        });

        // 重写 navigator.deviceMemory，模拟较低内存（单位：GB）
        Object.defineProperty(navigator, 'deviceMemory', {
            get: function () { return 2; },
            configurable: false,
            enumerable: true
        });

        // 重写 window.screen 的相关属性，模拟手机屏幕尺寸与色彩深度
        Object.defineProperty(window.screen, 'width', {
            get: function () { return 390; },
            configurable: false,
            enumerable: true
        });
        Object.defineProperty(window.screen, 'height', {
            get: function () { return 844; },
            configurable: false,
            enumerable: true
        });
        Object.defineProperty(window.screen, 'availWidth', {
            get: function () { return 390; },
            configurable: false,
            enumerable: true
        });
        Object.defineProperty(window.screen, 'availHeight', {
            get: function () { return 844; },
            configurable: false,
            enumerable: true
        });
        Object.defineProperty(window.screen, 'colorDepth', {
            get: function () { return 24; },
            configurable: false,
            enumerable: true
        });
        Object.defineProperty(window.screen, 'pixelDepth', {
            get: function () { return 24; },
            configurable: false,
            enumerable: true
        });

        // 重写 matchMedia 以支持移动设备的媒体查询
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function (query) {
            if (query.includes('(pointer: coarse)') || query.includes('(max-width: 428px)')) {
                return {
                    matches: true,
                    media: query,
                    onchange: null,
                    addListener: function () { },
                    removeListener: function () { },
                    addEventListener: function () { },
                    removeEventListener: function () { },
                    dispatchEvent: function () { return false; }
                };
            }
            return originalMatchMedia.call(window, query);
        };

        // 如果支持 userAgentData（客户端提示），则伪装相关信息
        if (navigator.userAgentData) {
            Object.defineProperty(navigator, 'userAgentData', {
                get: function() {
                    return {
                        brands: [
                            { brand: "Apple", version: "16.0" },
                            { brand: "Chromium", version: "108" }
                        ],
                        mobile: true,
                        getHighEntropyValues: async function(hints) {
                            const values = {};
                            hints.forEach(hint => {
                                if (hint === "platform") values[hint] = "iOS";
                                if (hint === "platformVersion") values[hint] = "16.0";
                            });
                            return values;
                        }
                    };
                },
                configurable: false,
                enumerable: true
            });
        }

        // 触发 resize 和 orientationchange 事件以确保页面适应新尺寸
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('orientationchange'));
    }

    // 检查 localStorage 中是否启用了模拟手机UA
    const isMobileUASimulated = localStorage.getItem('simulateMobileUA') === 'true';
    if (isMobileUASimulated) {
        applyMobileUASimulation();
    }

    /*** PoW Display Helper 部分 ***/
    window.addEventListener('DOMContentLoaded', () => {
        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            #pow-display {
                position: absolute;
                padding: 4px;
                border-radius: 12px;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                background: none;
                border: 1px solid rgba(230, 230, 230, 0);
                right: 10px;
                color: #333;
            }
            #pow-display:hover {
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(230, 230, 230, 0.8);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
                padding: 10px 16px;
                backdrop-filter: blur(8px);
            }
            #pow-indicator-wrapper {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
                overflow: visible;
            }
            #pow-indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                transition: all 0.4s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                flex-shrink: 0;
                margin-left: 8px;
            }
            #pow-text {
                white-space: nowrap;
                transition: all 0.4s ease;
                opacity: 0;
                max-width: 0;
                overflow: hidden;
            }
            #pow-display:hover #pow-text,
            #pow-display.expanded #pow-text {
                opacity: 1;
                max-width: 300px;
            }
            #pow-display.updating #pow-indicator {
                animation: pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.3);
                    opacity: 0.7;
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            #pow-display {
                animation: fadeIn 0.5s ease-out;
            }
            #pow-ua-container {
                max-height: 0;
                opacity: 0;
                overflow: hidden;
                flex-direction: column;
                gap: 8px;
                margin-top: 0;
                padding-top: 0;
                border-top: 1px solid rgba(230, 230, 230, 0);
                font-size: 12px;
                width: 0;
                transition: all 0.4s ease-out;
                white-space: nowrap;
                overflow-x: hidden;
                color: #555;
            }
            #pow-display:hover #pow-ua-container,
            #pow-display.expanded #pow-ua-container {
                max-height: 100px;
                opacity: 1;
                margin-top: 8px;
                padding-top: 8px;
                width: 100%;
                transition-delay: 0s;
                border-top: 1px solid rgba(230, 230, 230, 0.8);
            }
            #pow-ua-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                transform: translateY(0);
                transition: transform 0.4s ease-out;
            }
            #pow-ua-hint {
                color: #666;
                font-size: 11px;
                margin-top: 4px;
                opacity: 0;
                transform: translateY(-5px);
                transition: all 0.4s ease-out;
            }
            #pow-ua-hint.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .custom-checkbox {
                display: inline-block;
                position: relative;
                padding-left: 25px;
                cursor: pointer;
                font-size: 12px;
                user-select: none;
                color: inherit;
            }
            .custom-checkbox input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }
            .checkmark {
                position: absolute;
                top: 0;
                left: 0;
                height: 18px;
                width: 18px;
                background-color: #eee;
                border-radius: 4px;
                transition: all 0.4s ease;
            }
            .custom-checkbox:hover input ~ .checkmark {
                background-color: #ccc;
            }
            .custom-checkbox input:checked ~ .checkmark {
                background-color: #2196F3;
            }
            .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }
            .custom-checkbox input:checked ~ .checkmark:after {
                display: block;
            }
            .custom-checkbox .checkmark:after {
                left: 6px;
                top: 2px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            @media (prefers-color-scheme: dark) {
                #pow-display {
                    background: none;
                    border: none;
                    color: #f0f0f0;
                    border: 1px solid rgba(70, 70, 70, 0);
                }
                #pow-display:hover {
                    background: rgba(40, 40, 40, 0.95);
                    border: 1px solid rgba(70, 70, 70, 0.8);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                }
                #pow-ua-container {
                    border-top: none;
                    color: #ddd;
                }
                .custom-checkbox {
                    color: #f0f0f0;
                }
                .checkmark {
                    background-color: #555;
                }
                .custom-checkbox:hover input ~ .checkmark {
                    background-color: #666;
                }
                .custom-checkbox input:checked ~ .checkmark {
                    background-color: #1e90ff;
                }
                #pow-ua-hint {
                    color: #bbb;
                }
            }
        `;
        document.head.appendChild(style);

        // 创建 PoW 显示元素
        const powDisplay = document.createElement('div');
        powDisplay.id = 'pow-display';

        const indicatorWrapper = document.createElement('div');
        indicatorWrapper.id = 'pow-indicator-wrapper';

        const textContent = document.createElement('span');
        textContent.id = 'pow-text';

        const indicator = document.createElement('div');
        indicator.id = 'pow-indicator';

        indicatorWrapper.appendChild(textContent);
        indicatorWrapper.appendChild(indicator);
        powDisplay.appendChild(indicatorWrapper);

        // 创建 UA 模拟复选框容器
        const uaContainer = document.createElement('div');
        uaContainer.id = 'pow-ua-container';

        const uaWrapper = document.createElement('div');
        uaWrapper.id = 'pow-ua-wrapper';

        const uaLabel = document.createElement('label');
        uaLabel.className = 'custom-checkbox';
        uaLabel.innerHTML = `
            模拟手机UA
            <input type="checkbox" id="pow-ua-checkbox">
            <span class="checkmark"></span>
        `;

        const uaHint = document.createElement('div');
        uaHint.id = 'pow-ua-hint';
        uaHint.style.display = 'none';
        uaHint.innerText = '✻ 需要刷新页面生效';

        uaWrapper.appendChild(uaLabel);
        uaContainer.appendChild(uaWrapper);
        uaContainer.appendChild(uaHint);
        powDisplay.appendChild(uaContainer);

        document.body.appendChild(powDisplay);

        // 更新 PoW 难度显示函数
        const updateDifficultyIndicator = (difficulty) => {
            const powDisplay = document.getElementById('pow-display');
            const indicator = document.getElementById('pow-indicator');
            const textContent = document.getElementById('pow-text');
            powDisplay.classList.add('updating');
            setTimeout(() => powDisplay.classList.remove('updating'), 1200);
            if (difficulty === 'N/A') {
                textContent.innerText = 'PoW难度: 等待中...';
                indicator.style.backgroundColor = '#95a5a6';
                textContent.style.color = '#95a5a6';
                powDisplay.classList.remove('expanded');
                return;
            }
            const cleanDifficulty = difficulty.replace('0x', '').replace(/^0+/, '');
            const hexLength = cleanDifficulty.length;
            let level, color;
            if (hexLength <= 2) {
                level = '困难';
                color = '#e74c3c';
            } else if (hexLength === 3) {
                level = '中等';
                color = '#f39c12';
            } else if (hexLength === 4) {
                level = '简单';
                color = '#3498db';
            } else {
                level = '极易';
                color = '#27ae60';
            }
            textContent.innerHTML = `PoW难度: ${difficulty} (${level})`;
            indicator.style.backgroundColor = color;
            textContent.style.color = color;
            if (level !== '极易') {
                powDisplay.classList.add('expanded');
            } else {
                powDisplay.classList.remove('expanded');
            }
        };

        // 拦截 Fetch 请求
        const originalFetch = window.fetch;
        window.fetch = async function (resource, options) {
            try {
                const response = await originalFetch(resource, options);
                const url = typeof resource === 'string' ? resource : resource.url;
                if (url.includes('/backend-api/sentinel/chat-requirements') ||
                    url.includes('/backend-anon/sentinel/chat-requirements')) {
                    const data = await response.clone().json();
                    const difficulty = data.proofofwork?.difficulty || 'N/A';
                    updateDifficultyIndicator(difficulty);
                }
                return response;
            } catch (e) {
                console.error('请求拦截时出错:', e);
                return originalFetch(resource, options);
            }
        };

        // 更新显示位置的函数
        const updatePosition = () => {
            const target = document.getElementById('composer-background');
            if (target) {
                const rect = target.getBoundingClientRect();
                const scrollX = window.scrollX || window.pageXOffset;
                const scrollY = window.scrollY || window.pageYOffset;
                powDisplay.style.position = 'absolute';
                powDisplay.style.top = '';
                powDisplay.style.right = `${document.documentElement.clientWidth - (rect.right + scrollX) + 50}px`;
                powDisplay.style.bottom = `${document.documentElement.clientHeight - (rect.bottom + scrollY) + 8}px`;
                powDisplay.style.left = '';
            }
        };

        // 使用 requestAnimationFrame 持续更新位置
        const raf = () => {
            updatePosition();
            requestAnimationFrame(raf);
        };

        // 初始化并监听位置变化
        const waitForElement = (selector, timeout = 10000) => {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) {
                    return resolve(element);
                }
                const observer = new MutationObserver((mutations, obs) => {
                    const el = document.querySelector(selector);
                    if (el) {
                        obs.disconnect();
                        resolve(el);
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }, timeout);
            });
        };

        waitForElement('#composer-background')
            .then(target => {
                raf();
                window.addEventListener('resize', updatePosition);
                window.addEventListener('scroll', updatePosition);
            })
            .catch(error => {
                console.error(error);
            });

        // 控制展开状态的鼠标事件
        powDisplay.addEventListener('mouseenter', () => {
            if (powDisplay.classList.contains('expanded')) {
                powDisplay.classList.remove('expanded');
            }
        });

        // 复选框事件监听
        const uaCheckbox = document.getElementById('pow-ua-checkbox');
        uaCheckbox.checked = isMobileUASimulated;
        uaCheckbox.addEventListener('change', () => {
            const isChecked = uaCheckbox.checked;
            const savedState = localStorage.getItem('simulateMobileUA') === 'true';
            const uaHint = document.getElementById('pow-ua-hint');
            if (isChecked !== savedState) {
                uaHint.style.display = 'block';
                setTimeout(() => {
                    uaHint.classList.add('visible');
                }, 10);
            } else {
                uaHint.classList.remove('visible');
                setTimeout(() => {
                    uaHint.style.display = 'none';
                }, 300);
            }
            localStorage.setItem('simulateMobileUA', isChecked);
        });

        // 初始化显示
        updateDifficultyIndicator('N/A');

        // 元素可见性检测
        function checkElementVisibility() {
            const target = document.getElementById('composer-background');
            if (!target || target.offsetParent === null) {
                powDisplay.style.display = 'none';
            } else {
                powDisplay.style.display = 'flex';
            }
        }
        checkElementVisibility();

        const observer = new MutationObserver(() => {
            checkElementVisibility();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
        });
    });
})();
