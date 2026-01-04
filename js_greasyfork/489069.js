

// ==UserScript==
// @name              稳定版 - 聊天数据安全增强
// @namespace         https://github.com/your-namespace/ChatGPT_Enhanced_Toolkit_Mobile
// @supportURL        https://greasyfork.org/zh-CN/scripts/489069-gpt4%E6%97%A0%E9%99%90%E5%88%B7
// @version           1.8
// @description       为ChatGPT手机端增强工具包,包括模型切换、美化活动记录、紧凑界面、错误恢复、使用说明和数据安全增强等功能。
// @icon              https://files.oaiusercontent.com/file-gk3ACPm7Tvy5DHe5aE9fqJ0W?se=2123-12-19T11%3A10%3A14Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D1209600%2C%20immutable&rscd=attachment%3B%20filename%3DFrame%2520612.png&sig=dTPAPU4773Mz4PPaC6kCzsTf7ZiFgLSs/z3%2B3uGxkqY%3D
// @grant             none
// @match             http*://chat.openai.com/*
// @license           MIT
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/489069/%E7%A8%B3%E5%AE%9A%E7%89%88%20-%20%E8%81%8A%E5%A4%A9%E6%95%B0%E6%8D%AE%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/489069/%E7%A8%B3%E5%AE%9A%E7%89%88%20-%20%E8%81%8A%E5%A4%A9%E6%95%B0%E6%8D%AE%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时器间隔时间，这里设置为1000毫秒（1秒）以减少执行频率，减轻卡顿
    var intervalTime = 10;

    var intervalId = setInterval(clickButton, intervalTime);

    function clickButton() {
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            if (button.innerText.includes('继续生成')) {
                button.click();
                console.log('按钮已自动点击');
                clearInterval(intervalId); // 找到并点击后清除定时器
                break;
            }
        }
    }
    console.log('自动点击按钮已初始化。');

    // ----- 共享变量 -----
    let selectedModel = localStorage.getItem("selectedModel") || "GPT-4 (Mobile)";

    // ----- 恢复原始 Fetch -----
    let originalFetch = window.fetch;

    function recoverOriginalFetch() {
        window.fetch = originalFetch;
    }

    // ----- 数据安全增强 -----
    let dataSecurityEnabled = false;

    function enhanceDataSecurity() {
        // 阻止已知的跟踪脚本
        const blockedScripts = ['google-analytics.com', 'doubleclick.net', 'facebook.net', 'www.w3.org', 'chat.openai.com'];
        const existingScripts = document.querySelectorAll('script');

        existingScripts.forEach(script => {
            if (blockedScripts.some(domain => script.src.includes(domain))) {
                console.log(`阻止脚本: ${script.src}`);
                script.parentNode.removeChild(script);
            }
        });

        // 覆盖 navigator 属性以保护用户隐私（例如通过 WebRTC 获取 IP 地址）
        const protectNavigator = () => {
            const modifiedNavigator = {};

            for (let i in navigator) {
                if (typeof navigator[i] === 'function') {
                    modifiedNavigator[i] = navigator[i].bind(navigator);
                } else {
                    modifiedNavigator[i] = navigator[i];
                }
            }

            // 防止访问可用于跟踪用户的属性
            modifiedNavigator.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
            modifiedNavigator.platform = "Win32";

            // 如有必要，可添加修改其他属性
            Object.defineProperty(window, 'navigator', {
                value: modifiedNavigator,
                writable: false,
            });
        };

        // 禁用第三方 Cookie
        const disableCookies = () => {
            document.cookie.split(";").forEach(function(cookie) {
                let eqPos = cookie.indexOf("=");
                let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            });
        };

        protectNavigator();
        disableCookies();

        // 可选择阻止第三方 iframe
        const iframes = document.getElementsByTagName('iframe');
        for (let iframe of iframes) {
            if (!iframe.src.startsWith(window.location.origin)) {
                // 修改或移除 iframe
                console.log(`阻止第三方 iframe: ${iframe.src}`);
                iframe.parentNode.removeChild(iframe);
            }
        }

        dataSecurityEnabled = true;
        console.log('数据安全增强已应用。');
    }

    // ----- 模型切换 -----
    const modelMapping = {
        "GPT-3.5": "text-davinci-002-render-sha",
        "GPT-4 Plugins": "gpt-4-plugins",
        "GPT-4 (Mobile)": "gpt-4-mobile",
    };

    // ----- 增强 Fetch 修改 -----
    function enhancedModifyFetch() {
        window.fetch = new Proxy(window.fetch, {
            apply: function(target, thisArg, argumentsList) {
                try {
                    let [url, options] = argumentsList;
                    if (options && options.body && url.includes('conversation')) {
                        let body = JSON.parse(options.body);
                        if (!modelMapping[selectedModel]) {
                            console.error('所选模型在模型映射中不存在: ', selectedModel);
                            return Reflect.apply(target, thisArg, argumentsList);
                        }
                        body.model = modelMapping[selectedModel] || body.model;
                        options.body = JSON.stringify(body);
                    }

                    // 额外的请求处理
                    const block_url = 'gravatar\\.com|browser-intake-datadoghq\\.com|\\.wp\\.com|intercomcdn\\.com|sentry\\.io|sentry_key=|intercom\\.io|featuregates\\.org|/v1/initialize|/messenger/|statsigapi\\.net|/rgstr|/v1/sdk_exception';
                    if (url.match(block_url)) {
                        return Promise.resolve(); // 阻止指定的跟踪 URL
                    }

                    return Reflect.apply(target, thisArg, argumentsList);
                } catch (error) {
                    console.error('Fetch 代理出错:', error);
                    recoverOriginalFetch();
                    return Reflect.apply(target, thisArg, argumentsList);
                }
            }
        });
    }

    // ----- UI 设计 -----
    function createControlPanel() {
        const panelHTML = `
            <div id="controlPanelContainer" style="position: fixed; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.9); padding: 10px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 9999; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                <div id="controlPanelToggle" style="font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 10px; cursor: pointer;">ChatGPT 增强工具</div>
                <div id="controlPanelContent" style="display: none;">
                    <div style="margin-bottom: 10px;">
                        <label for="modelSelector" style="margin-right: 5px; font-size: 14px;">模型选择:</label>
                        <select id="modelSelector" style="background: rgba(255, 255, 255, 0.8); color: #333; border: none; border-radius: 4px; font-size: 14px; padding: 2px 5px;">
                            <option value="GPT-3.5">GPT-3.5</option>
                            <option value="GPT-4 Plugins">GPT-4 Plugins</option>
                            <option value="GPT-4 (Mobile)">GPT-4 (Mobile)</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
                        <button id="refreshButton" style="background: rgba(255, 255, 255, 0.8); color: #333; border: none; border-radius: 4px; font-size: 14px; padding: 5px 10px;">刷新页面</button>
                        <button id="dataSecurityButton" style="background: rgba(255, 255, 255, 0.8); color: #333; border: none; border-radius: 4px; font-size: 14px; padding: 5px 10px;">数据安全增强</button>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <input type="file" id="backgroundImageInput" accept="image/*" style="display: none;">
                        <button id="customBackgroundButton" style="background: rgba(255, 255, 255, 0.8); color: #333; border: none; border-radius: 4px; font-size: 14px; padding: 5px 10px;">自定义背景</button>
                    </div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = panelHTML;
        document.body.appendChild(container);

        const controlPanelToggle = document.getElementById('controlPanelToggle');
        const controlPanelContent = document.getElementById('controlPanelContent');

        controlPanelToggle.addEventListener('click', function() {
            controlPanelContent.style.display = controlPanelContent.style.display === 'none' ? 'block' : 'none';
        });

        const modelSelector = document.getElementById('modelSelector');
        modelSelector.value = selectedModel;
        modelSelector.addEventListener('change', function() {
            selectedModel = this.value;
            localStorage.setItem("selectedModel", selectedModel);
            enhancedModifyFetch();
        });

        const refreshButton = document.getElementById('refreshButton');
        refreshButton.addEventListener('click', function() {
            location.reload();
        });

        const dataSecurityButton = document.getElementById('dataSecurityButton');
        dataSecurityButton.addEventListener('click', function() {
            if (dataSecurityEnabled) {
                recoverOriginalFetch();
                dataSecurityEnabled = false;
                dataSecurityButton.style.background = 'rgba(255, 255, 255, 0.8)';
                dataSecurityButton.style.color = '#333';
            } else {
                enhanceDataSecurity();
                dataSecurityButton.style.background = 'rgba(0, 128, 0, 0.8)';
                dataSecurityButton.style.color = '#fff';
            }
        });

        const customBackgroundButton = document.getElementById('customBackgroundButton');
        const backgroundImageInput = document.getElementById('backgroundImageInput');

        customBackgroundButton.addEventListener('click', function() {
            backgroundImageInput.click();
        });

        backgroundImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function() {
                    document.body.style.backgroundImage = `url(${reader.result})`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundRepeat = 'no-repeat';
                    document.body.style.backgroundPosition = 'center';
                }
                reader.readAsDataURL(file);
            }
        });

        // 使面板可拖动（移动端触摸，桌面端鼠标拖动）
        const controlPanelContainer = document.getElementById('controlPanelContainer');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        controlPanelContainer.addEventListener('touchstart', dragStart, false);
        controlPanelContainer.addEventListener('touchend', dragEnd, false);
        controlPanelContainer.addEventListener('touchmove', drag, false);

        controlPanelContainer.addEventListener('mousedown', dragStart, false);
        controlPanelContainer.addEventListener('mouseup', dragEnd, false);
        controlPanelContainer.addEventListener('mousemove', drag, false);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === controlPanelContainer || e.target === controlPanelToggle) {
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;

            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, controlPanelContainer);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    // 初始化脚本
    function init() {
        createControlPanel();
        enhancedModifyFetch();
        if (dataSecurityEnabled) {
            enhanceDataSecurity();
            document.getElementById('dataSecurityButton').style.background = 'rgba(0, 128, 0, 0.8)';
            document.getElementById('dataSecurityButton').style.color = '#fff';
        }
    }

    init();
})();