// ==UserScript==
// @name         ChatGPT Helper (面板+小球可见增强版)
// @version      1.10
// @description  支持Access Token获取、服务降级检测等功能，确保小球和面板稳定显示，面板在小球旁边且可拖拽
// @license      GNU Affero General Public License v3.0 or later
// @match        https://chatgpt.com/*
// @match        https://oai.kylelv.com/*
// @match        https://newoai.kylelv.com/*
// @match        https://plus.aivvm.com/*
// @match        https://new.oaifree.com/*
// @match        https://*.new.oaifree.com/*
// @match        https://shared.oaifree.com/*
// @match        https://chat.rawchat.top/*
// @match        https://chat.sharedchat.cn/*
// @match        https://gpt.github.cn.com/*
// @match        https://free.xyhelper.cn/*
// @match        https://chatgpt.dairoot.cn/*
// @icon         https://linux.do/user_avatar/linux.do/f-droid/288/228666_2.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/1416670
// @downloadURL https://update.greasyfork.org/scripts/522061/ChatGPT%20Helper%20%28%E9%9D%A2%E6%9D%BF%2B%E5%B0%8F%E7%90%83%E5%8F%AF%E8%A7%81%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522061/ChatGPT%20Helper%20%28%E9%9D%A2%E6%9D%BF%2B%E5%B0%8F%E7%90%83%E5%8F%AF%E8%A7%81%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;
    const myWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    if (!(
        currentUrl.startsWith('https://chatgpt.com/') ||
        currentUrl.startsWith('https://oai.kylelv.com/') ||
        currentUrl.startsWith('https://newoai.kylelv.com/') ||
        currentUrl.startsWith('https://plus.aivvm.com/') ||
        currentUrl.startsWith('https://new.oaifree.com/') ||
        currentUrl.startsWith('https://shared.oaifree.com/') ||
        currentUrl.startsWith('https://chat.rawchat.top/') ||
        currentUrl.startsWith('https://chat.sharedchat.cn/') ||
        currentUrl.startsWith('https://gpt.github.cn.com/') ||
        currentUrl.startsWith('https://free.xyhelper.cn/') ||
        currentUrl.startsWith('https://chatgpt.dairoot.cn/') ||
        currentUrl.match(/^https:\/\/(?:[^\/]+\.)?new\.oaifree\.com\//)
    )) {
        return;
    }

    // ========== 1. Hook Function.prototype.toString 和 fetch ==========
    (() => {
        const originalToString = myWindow.Function.prototype.toString;
        const myFunction_toString_symbol = myWindow.Symbol('custom_toString');
        const myToString = function () {
            return typeof this === 'function' && this[myFunction_toString_symbol] || originalToString.call(this);
        };

        function set_native(func, key, value) {
            Object.defineProperty(func, key, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: value,
            });
        }

        delete myWindow.Function.prototype.toString;
        set_native(myWindow.Function.prototype, 'toString', myToString);
        set_native(myWindow.Function.prototype.toString, myFunction_toString_symbol, 'function toString() { [native code] }');
        globalThis.hookFix = (func, functionName) => {
            set_native(func, myFunction_toString_symbol, `function ${functionName || ''}() { [native code] }`);
        };
    })();

    // ========== 2. 创建悬浮面板 (带ID) ==========
    const panelId = 'chatgpt-helper-panel';
    let panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed; /* 使用 fixed 以便在页面滚动时保持位置 */
        width: 350px;
        background: linear-gradient(145deg, #f8f9fa, #e9ecef);
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05);
        padding: 20px;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        color: #2c3e50;
        transition: all 0.3s ease;
        display: none;
        z-index: 10001; /* 确保在最前 */
    `;
    // 初始位置设置为小球旁边
    // 位置将在面板显示时动态设置

    const titleBar = document.createElement('div');
    titleBar.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; font-size: 18px; color: #2c3e50;">
                ChatGPT Helper
            </h2>
            <button id="chatgpt-helper-close-btn" style="background: none; border: none; color: #6c757d; font-size: 20px; cursor: pointer;">×</button>
        </div>
    `;
    panel.appendChild(titleBar);

    const statusSection = document.createElement('div');
    statusSection.innerHTML = `
        <div style="background-color: #f1f3f5; border-radius: 10px; padding: 15px; margin-bottom: 0;">
            <div style="font-weight: 600;">服务降级检测</div>
            <div>PoW难度: <span id="difficulty">N/A</span> <span id="difficulty-level"></span></div>
            <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">
                <em>这个值越小，代表PoW难度越高，ChatGPT认为你的IP风险越高。</em>
            </div>
            <div>IP质量: <span id="ip-quality">N/A</span></div>
            <div id="persona-container" style="display: none;">用户类型: <span id="persona">N/A</span></div>
        </div>
    `;
    panel.appendChild(statusSection);

    const tokenSection = document.createElement('div');
    tokenSection.innerHTML = `
        <div style="background-color: #f1f3f5; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
            <div style="font-weight: 600; font-size: 16px; text-align: center; margin-bottom: 10px;">Access Token Tool</div>
            <div style="margin-bottom: 15px;">
                <textarea id="chatgpt-helper-token-display" style="
                    width: 100%;
                    height: 100px;
                    border: 1px solid #ced4da;
                    border-radius: 8px;
                    padding: 10px;
                    resize: none;
                    font-family: monospace;
                    background-color: #f8f9fa;
                "></textarea>
            </div>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <button id="chatgpt-helper-fetch-btn" style="
                    flex: 1;
                    padding: 10px;
                    background-color: #2ecc71;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                ">获取</button>
                <button id="chatgpt-helper-copy-btn" style="
                    flex: 1;
                    padding: 10px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                ">复制</button>
            </div>
        </div>
    `;
    panel.appendChild(tokenSection);


    const createToast = (message) => {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            border-radius: 8px;
            padding: 10px 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            z-index: 10002;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 1000);
    };

    // ========== 3. 创建悬浮小球 (带ID) ==========
    const ballId = 'chatgpt-helper-ball';
    let ball = document.createElement('div');
    ball.id = ballId;

    // 创建一个小圆点元素用于显示风险等级
    const riskIndicator = document.createElement('div');
    riskIndicator.id = 'risk-indicator';
    ball.appendChild(riskIndicator);

    // 设置小球的样式 + !important
    const setBallStyle = () => {
        ball.style.position = 'fixed';
        ball.style.top = '25%';
        ball.style.right = '20px';
        ball.style.width = '40px';
        ball.style.height = '40px';
        ball.style.borderRadius = '50%';
        ball.style.cursor = 'pointer';
        ball.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        ball.style.transition = 'transform 0.2s';
        // 强化 z-index 与 display
        ball.style.setProperty('z-index', '999999999', 'important');
        ball.style.setProperty('display', 'block', 'important');

        // 设置风险指示器的小圆点样式
        riskIndicator.style.position = 'absolute';
        riskIndicator.style.top = '-2px';
        riskIndicator.style.right = '-2px';
        riskIndicator.style.width = '8px';
        riskIndicator.style.height = '8px';
        riskIndicator.style.borderRadius = '50%';
        riskIndicator.style.backgroundColor = 'transparent'; // 初始无颜色
        riskIndicator.style.opacity = '0.3'; // 初始透明度为30%
    };
    setBallStyle();

    // 根据风险等级更新小圆点的颜色
    const updateRiskIndicator = (color) => {
        riskIndicator.style.backgroundColor = color;
    };

    const getFavicon = () => {
        const favicon = document.querySelector("link[rel~='apple-touch-icon']") ||
            document.querySelector("link[rel~='icon']") ||
            document.querySelector("link[rel='shortcut icon']") ||
            document.querySelector("link[rel='icon']");
        if (favicon) {
            const faviconUrl = favicon.href;
            ball.style.backgroundImage = `url(${faviconUrl})`;
            ball.style.backgroundSize = 'cover';
            ball.style.backgroundPosition = 'center';
        } else {
            ball.style.backgroundColor = 'rgba(0, 123, 255, 0.8)';
        }
    };
    getFavicon();

    ball.addEventListener('mouseenter', () => {
    });
    ball.addEventListener('mouseleave', () => {
    });

    // 点击小球时，面板显示/隐藏
    // 在显示面板时，调整面板的位置相对于小球
    ball.addEventListener('click', () => {
        if (panel.style.display === 'none' || panel.style.display === '') {
            // 显示面板
            userManuallyHidePanel = false; // 记录：用户现在让它显示
            panel.style.display = 'block';
            positionPanel();
        } else {
            // 隐藏面板
            userManuallyHidePanel = true;
            panel.style.display = 'none';
        }
    });

    // ========== 4. 把小球和面板放到 body 中 ==========
    document.body.appendChild(panel);
    document.body.appendChild(ball);

    // ========== 5. 面板的拖拽功能 ==========
    const titleBarDiv = titleBar.querySelector('div');
    let isDragging = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    const dragStart = (e) => {
        // 只有在拖拽 titleBar 时有效
        if (e.target.closest('div') === titleBarDiv) {
            isDragging = true;
            initialX = e.type === 'mousedown' ? e.clientX - xOffset : e.touches[0].clientX - xOffset;
            initialY = e.type === 'mousedown' ? e.clientY - yOffset : e.touches[0].clientY - yOffset;
        }
    };

    const drag = (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.type === 'mousemove' ? e.clientX - initialX : e.touches[0].clientX - initialX;
            currentY = e.type === 'mousemove' ? e.clientY - initialY : e.touches[0].clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, panel);
        }
    };

    const dragEnd = () => {
        isDragging = false;
        initialX = currentX;
        initialY = currentY;
    };

    const setTranslate = (xPos, yPos, el) => {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    };

    titleBar.addEventListener('mousedown', dragStart);
    titleBar.addEventListener('touchstart', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    // ========== 6. 面板上 “关闭按钮” 的逻辑 ==========
    // 也要区分是用户主动点击，还是外部脚本设置
    let userManuallyHidePanel = false;
    const closeBtn = document.getElementById('chatgpt-helper-close-btn');
    closeBtn.addEventListener('click', () => {
        userManuallyHidePanel = true;
        panel.style.display = 'none';
    });

    // ========== 7. Access Token 工具 ==========
    const tokenDisplay = document.getElementById('chatgpt-helper-token-display');
    const fetchBtn = document.getElementById('chatgpt-helper-fetch-btn');
    const copyBtn = document.getElementById('chatgpt-helper-copy-btn');

    fetchBtn.onclick = function () {
        GM_xmlhttpRequest({
            method: "GET",
            url: "/api/auth/session",
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    tokenDisplay.value = data.accessToken || '获取失败';
                } catch (e) {
                    tokenDisplay.value = '获取失败：' + e.message;
                }
            },
            onerror: function () {
                tokenDisplay.value = '网络错误，请重试';
            }
        });
    };

    copyBtn.onclick = function () {
        if (tokenDisplay.value) {
            GM_setClipboard(tokenDisplay.value);
            createToast('Access Token已复制到剪贴板');
        }
    };

    // ========== 8. 服务降级检测 & fetch Hook  ==========
    const updateDifficultyIndicator = (difficulty) => {
        const difficultyLevel = document.getElementById('difficulty-level');
        const ipQuality = document.getElementById('ip-quality');
        if (difficulty === 'N/A') {
            difficultyLevel.innerText = '';
            ipQuality.innerHTML = 'N/A';
            return;
        }
        const cleanDifficulty = difficulty.replace('0x', '').replace(/^0+/, '');
        const hexLength = cleanDifficulty.length;
        let level, qualityText, color;
        if (hexLength <= 2) {
            level = '(困难)';
            qualityText = '高风险';
            color = '#FF0000'; // 红色
            updateRiskIndicator(color); // 更新小圆点颜色
        } else if (hexLength === 3) {
            level = '(中等)';
            qualityText = '中等';
            color = '#FFA500'; // 橙色
            updateRiskIndicator(color); // 更新小圆点颜色
        } else if (hexLength === 4) {
            level = '(简单)';
            qualityText = '良好';
            color = '#FFFF00'; // 黄色
            updateRiskIndicator(color); // 更新小圆点颜色
        } else {
            level = '(极易)';
            qualityText = '优秀';
            color = '#00FF00'; // 绿色
            updateRiskIndicator(color); // 更新小圆点颜色
        }
        difficultyLevel.innerHTML = `<span style="color: ${color}">${level}</span>`;
        ipQuality.innerHTML = `<span style="color: ${color}">${qualityText}</span>`;
    };

    function findChallengeElements() {
        const formFound = document.querySelector('form#challenge-form') !== null;
        const paragraphFound = document.querySelector('p#cf-spinner-please-wait, p#cf-spinner-redirecting') !== null;
        if (formFound && paragraphFound) {
            console.log('发现cf盾');
            return true;
        }
        return false;
    }

    if (!findChallengeElements()) {
        const originalFetch = myWindow.fetch;
        myWindow.fetch = async function (resource, options) {
            try {
                const response = await originalFetch(resource, options);
                const url = typeof resource === 'string' ? resource : resource.url;
                if (
                    url.includes('/backend-api/sentinel/chat-requirements') ||
                    url.includes('/backend-anon/sentinel/chat-requirements')
                ) {
                    const data = await response.clone().json();
                    const difficulty = data.proofofwork?.difficulty || 'N/A';
                    document.getElementById('difficulty').innerText = difficulty;
                    updateDifficultyIndicator(difficulty);
                }
                return response;
            } catch (e) {
                console.error('请求拦截时出错:', e);
                return originalFetch(resource, options);
            }
        };
        hookFix(originalFetch, 'fetch');
    }

    // =============== 9. MutationObserver：防止小球/面板被外部脚本移除 ===============
    const reAddBall = () => {
        if (!document.body.contains(ball)) {
            document.body.appendChild(ball);
            setBallStyle();
            console.log('[ChatGPT Helper] 小球被移除，已重新添加');
        }
    };
    const reAddPanel = () => {
        if (!document.body.contains(panel)) {
            document.body.appendChild(panel);
            console.log('[ChatGPT Helper] 面板被移除，已重新添加');
        }
    };

    const observer = new MutationObserver(() => {
        reAddBall();
        reAddPanel();
    });
    observer.observe(document.body, { childList: true });

    // =============== 10. MutationObserver：防止小球/面板被“强制隐藏” ===============
    // 仅在外部脚本偷偷改 style.display 时，才恢复。 若用户主动关闭面板，我们记录在 userManuallyHidePanel。
    const styleObserver = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            if (m.target === panel && m.attributeName === 'style') {
                const disp = panel.style.display;
                if (disp === 'none' && !userManuallyHidePanel) {
                    // 说明这是外部脚本干的，我们强制恢复
                    panel.style.display = 'block';
                    positionPanel(); // 重新定位
                    console.log('[ChatGPT Helper] 外部脚本把面板设为none，已强制恢复显示');
                }
            }
            if (m.target === ball && m.attributeName === 'style') {
                // 确保小球可见
                setBallStyle();
            }
        });
    });
    styleObserver.observe(panel, { attributes: true, attributeFilter: ['style'] });
    styleObserver.observe(ball, { attributes: true, attributeFilter: ['style'] });

    // ========== 11. 定位面板在小球旁边 ==========
    const positionPanel = () => {
        const ballRect = ball.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        // 将面板放在小球的左侧，稍微偏上
        const top = ballRect.top + window.scrollY;
        const left = ballRect.left - panelRect.width - 10 + window.scrollX; // 10px 间距
        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
    };

    // 初次显示面板时定位
    // 以及在窗口大小变化或滚动时，重新定位面板
    window.addEventListener('resize', () => {
        if (panel.style.display === 'block') {
            positionPanel();
        }
    });

    window.addEventListener('scroll', () => {
        if (panel.style.display === 'block') {
            positionPanel();
        }
    });

})();
