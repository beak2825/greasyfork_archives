// ==UserScript==
// @name         Access Control For Mindfulness (ctrl+m)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Beautiful mindful page for website access control. Press Ctrl+S to enable access control and custom access time.
// @author       KQ yang
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515843/Access%20Control%20For%20Mindfulness%20%28ctrl%2Bm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515843/Access%20Control%20For%20Mindfulness%20%28ctrl%2Bm%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration
    const DEFAULT_CONFIG = {
        startHour: 12,
        endHour: 14,
        restrictedSites: {},
        messageStyle: "background-color: white; margin-top: 20vh; margin-left: 100px; margin-right: 100px; font-size:64px"
    };

    // Load configuration from localStorage
    let CONFIG = JSON.parse(localStorage.getItem('mindfulnessConfig')) || DEFAULT_CONFIG;

    // 添加样式
    function addStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .mindfulness-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                z-index: 999999;
                min-width: 380px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            .mindfulness-panel h2 {
                margin: 0 0 25px 0;
                color: #2c3e50;
                font-size: 24px;
                text-align: center;
                font-weight: 600;
            }

            .mindfulness-panel .setting-group {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
            }

            .mindfulness-panel .setting-item {
                margin-bottom: 15px;
            }

            .mindfulness-panel label {
                display: block;
                margin-bottom: 8px;
                color: #495057;
                font-weight: 500;
            }

            .mindfulness-panel input[type="number"] {
                width: 70px;
                padding: 8px;
                border: 2px solid #e9ecef;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .mindfulness-panel input[type="number"]:focus {
                outline: none;
                border-color: #4dabf7;
            }

            .mindfulness-panel .toggle-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            .mindfulness-panel .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .mindfulness-panel .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
            }

            .mindfulness-panel .toggle-slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            .mindfulness-panel input:checked + .toggle-slider {
                background-color: #2196F3;
            }

            .mindfulness-panel input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }

            .mindfulness-panel .button-group {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 25px;
            }

            .mindfulness-panel button {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .mindfulness-panel button.save {
                background-color: #228be6;
                color: white;
            }

            .mindfulness-panel button.save:hover {
                background-color: #1c7ed6;
            }

            .mindfulness-panel button.cancel {
                background-color: #e9ecef;
                color: #495057;
            }

            .mindfulness-panel button.cancel:hover {
                background-color: #dee2e6;
            }

            .mindfulness-panel .site-info {
                color: #868e96;
                font-size: 14px;
                text-align: center;
                margin-bottom: 20px;
            }

            .mindfulness-panel .time-inputs {
                display: flex;
                gap: 20px;
                justify-content: center;
            }

            .mindfulness-panel .status-label {
                margin-left: 10px;
                font-size: 14px;
                color: #495057;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // 创建配置面板
    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.className = 'mindfulness-panel';

        const currentHost = window.location.hostname;
        const isRestricted = CONFIG.restrictedSites[currentHost];

        panel.innerHTML = `
            <h2>Mindfulness Settings</h2>

            <div class="site-info">
                Current Site: ${currentHost}
            </div>

            <div class="setting-group">
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" id="restrictSite" ${isRestricted ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="status-label">
                        ${isRestricted ? 'Site is restricted' : 'Site is not restricted'}
                    </span>
                </div>

                <div class="setting-item">
                    <label>Access Time Range</label>
                    <div class="time-inputs">
                        <div>
                            <label>Start</label>
                            <input type="number" id="startHour" value="${CONFIG.startHour}" min="0" max="23">
                        </div>
                        <div>
                            <label>End</label>
                            <input type="number" id="endHour" value="${CONFIG.endHour}" min="0" max="23">
                        </div>
                    </div>
                </div>
            </div>

            <div class="button-group">
                <button class="save" id="saveConfig">Save Changes</button>
                <button class="cancel" id="cancelConfig">Cancel</button>
            </div>
        `;

        // 添加事件监听器
        panel.querySelector('#restrictSite').addEventListener('change', function(e) {
            const statusLabel = panel.querySelector('.status-label');
            statusLabel.textContent = e.target.checked ? 'Site is restricted' : 'Site is not restricted';
        });

        panel.querySelector('#saveConfig').addEventListener('click', saveConfiguration);
        panel.querySelector('#cancelConfig').addEventListener('click', () => panel.remove());

        document.body.appendChild(panel);
    }

    // 保存配置
    function saveConfiguration() {
        const panel = document.querySelector('.mindfulness-panel');
        const currentHost = window.location.hostname;

        const newStartHour = parseInt(panel.querySelector('#startHour').value) || 12;
        const newEndHour = parseInt(panel.querySelector('#endHour').value) || 14;
        const newIsRestricted = panel.querySelector('#restrictSite').checked;

        // 保存新配置
        CONFIG.startHour = newStartHour;
        CONFIG.endHour = newEndHour;

        if (newIsRestricted) {
            CONFIG.restrictedSites[currentHost] = true;
        } else {
            delete CONFIG.restrictedSites[currentHost];
        }

        // 保存到 localStorage
        localStorage.setItem('mindfulnessConfig', JSON.stringify(CONFIG));

        // 关闭面板
        panel.remove();

        // 如果网站现在是不受限的，刷新页面恢复访问
        if (!newIsRestricted && wasPreviouslyBlocked()) {
            window.location.reload();
        } else {
            // 检查并应用新的限制
            checkAndApplyRestriction();
        }
    }

    // 检查页面是否之前被阻止
    function wasPreviouslyBlocked() {
        const currentContent = document.body.innerHTML;
        return currentContent.includes("Dear Me!") &&
               currentContent.includes("You preserved this page") &&
               currentContent.includes("maintained mindfulness");
    }

    // 检查并应用访问限制
    function checkAndApplyRestriction() {
        const currentHost = window.location.hostname;

        // 如果当前网站不在限制列表中，直接返回
        if (!CONFIG.restrictedSites[currentHost]) {
            return;
        }

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // 检查是否在允许的时间范围内
        if (hours < CONFIG.startHour || (hours >= CONFIG.endHour && minutes > 0)) {
            // 如果在限制时间内，替换页面内容
            // 设置背景和内容
            document.body.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap');

                    body {
                        margin: 0;
                        padding: 0;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #1a1a1a 0%, #363636 100%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-family: 'Cormorant Garamond', serif;
                        color: #d4af37;
                        overflow: hidden;
                    }

                    .sacred-container {
                        text-align: center;
                        width: 90vw;
                        max-width: 1400px;
                        padding: 60px;
                        background: rgba(0, 0, 0, 0.85);
                        border-radius: 30px;
                        box-shadow: 0 0 100px rgba(212, 175, 55, 0.25);
                        border: 3px solid rgba(212, 175, 55, 0.4);
                        position: relative;
                    }

                    .sacred-symbol {
                        font-size: 7em;
                        margin: 20px 0;
                        color: #d4af37;
                    }

                    .lotus-symbol {
                        width: 120px;
                        height: 120px;
                        margin: 20px auto;
                        background: linear-gradient(45deg, #d4af37, #FFD700);
                        -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12,2L9,12L3,14L9,16L12,22L15,16L21,14L15,12L12,2M12,5.5L14,12.5L18,13.75L14,15L12,19L10,15L6,13.75L10,12.5L12,5.5Z'/%3E%3C/svg%3E") center/contain no-repeat;
                        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12,2L9,12L3,14L9,16L12,22L15,16L21,14L15,12L12,2M12,5.5L14,12.5L18,13.75L14,15L12,19L10,15L6,13.75L10,12.5L12,5.5Z'/%3E%3C/svg%3E") center/contain no-repeat;
                    }

                    .sacred-title {
                        font-size: 7em;
                        margin-bottom: 40px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 8px;
                        color: #d4af37;
                        text-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
                        line-height: 1.2;
                    }

                    .sacred-message {
                        font-size: 4.5em;
                        line-height: 1.3;
                        margin-bottom: 40px;
                        color: #e5e5e5;
                    }

                    .sacred-quote {
                        font-style: italic;
                        font-size: 4em;
                        color: #d4af37;
                        margin: 40px auto;
                        padding: 30px 40px;
                        border-left: 5px solid #d4af37;
                        text-align: left;
                        max-width: 90%;
                        line-height: 1.3;
                    }

                    .sacred-time {
                        font-size: 4.2em;
                        color: #d4af37;
                        margin-top: 50px;
                        padding: 30px;
                        border-top: 2px solid rgba(212, 175, 55, 0.3);
                        line-height: 1.3;
                    }

                    .time-highlight {
                        font-size: 1.2em;
                        font-weight: 600;
                        text-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
                    }

                    /* 响应式调整 */
                    @media (max-width: 768px) {
                        .sacred-title { font-size: 5em; }
                        .sacred-message { font-size: 3.5em; }
                        .sacred-quote { font-size: 3em; }
                        .sacred-time { font-size: 3.2em; }
                        .lotus-symbol {
                            width: 80px;
                            height: 80px;
                        }
                    }

                    @media (max-width: 480px) {
                        .sacred-container { padding: 30px; }
                        .sacred-title { font-size: 4em; }
                        .sacred-message { font-size: 2.8em; }
                        .sacred-quote { font-size: 2.5em; }
                        .sacred-time { font-size: 2.5em; }
                        .lotus-symbol {
                            width: 60px;
                            height: 60px;
                        }
                    }
                </style>

                <div class="sacred-container">
                    <div class="lotus-symbol"></div>
                    <div class="sacred-title">Beloved Me</div>

                    <div class="sacred-message">
                        This stop page kept! A victory! <br>
                    </div>

                    <div class="sacred-quote">
                        "The future you thanks to this conscious moment."
                    </div>

                    <div class="sacred-time">
                        The site awailable between<br>
                        <span class="time-highlight">${CONFIG.startHour}:00 - ${CONFIG.endHour}:00</span>
                    </div>

                    <div class="lotus-symbol"></div>
                </div>
            `;
        }
    }

    // 添加快捷键监听器
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
            e.preventDefault();
            createConfigPanel();
        }
    });

    // 初始化
    addStyles();
    checkAndApplyRestriction();
})();