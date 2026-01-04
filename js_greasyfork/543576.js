// ==UserScript==
// @name         灰度检测工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  检测页面灰度状态并显示灰度信息
// @author       You
// @match        https://crm.sankuai.com/*
// @match        https://ecom.meituan.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543576/%E7%81%B0%E5%BA%A6%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/543576/%E7%81%B0%E5%BA%A6%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const APP_ID = '30518';
    const API_URL = `https://talos-api.sankuai.com/talos-app/canary/strategyCalculate/getOnlineCanaryDetailByAppId?appId=${APP_ID}`;
    let ACCESS_TOKEN = localStorage.getItem('gray-check-token');

    let canaryData = null;
    let isExpanded = false;

    // 状态类型
    const STATUS_TYPES = {
        AUTH_ERROR: 'auth_error',
        PRODUCTION: 'production', 
        CANARY: 'canary'
    };

    function createIndicatorUI(status, data = null) {
        const indicator = document.createElement('div');
        indicator.id = 'gray-check-indicator';
        
        let iconContent, statusText, statusClass, detailContent;
        
        switch(status) {
            case STATUS_TYPES.AUTH_ERROR:
                iconContent = `
                    <div class="status-icon auth-error">
                        <div class="lock-container">
                            <div class="lock-body"></div>
                            <div class="lock-shackle"></div>
                            <div class="warning-dot"></div>
                        </div>
                    </div>`;
                statusText = '需要授权';
                statusClass = 'auth-error';
                detailContent = `
                    <div class="auth-form">
                        <div class="auth-message">
                            <div class="message-icon">🔐</div>
                            <p>检测到授权已过期，请输入新的访问令牌以继续使用灰度检测功能</p>
                        </div>
                        <div class="input-group">
                            <label for="token-input">ACCESS_TOKEN</label>
                            <input type="text" id="token-input" placeholder="请粘贴您的访问令牌..." />
                            <div class="input-hint">令牌将安全保存在本地，下次访问时自动使用</div>
                        </div>
                        <button id="save-token" class="save-btn">
                            <span class="btn-text">保存并刷新</span>
                            <span class="btn-icon">✓</span>
                        </button>
                    </div>`;
                break;
                
            case STATUS_TYPES.PRODUCTION:
                iconContent = `
                    <div class="status-icon production">
                        <span class="icon">✓</span>
                    </div>`;
                statusText = '生产环境';
                statusClass = 'production';
                detailContent = `
                    <div class="status-info">
                        <p>当前运行在生产环境</p>
                        <div class="info-item">
                            <label>当前版本:</label>
                            <span>${data?.currentVersion || 'unknown'}</span>
                        </div>
                    </div>`;
                break;
                
            case STATUS_TYPES.CANARY:
                const canaryInfo = data.canaryInstance;
                const version = data.version;
                iconContent = `
                    <div class="indicator-icon">
                        <div class="radar-container">
                            <div class="radar-sweep"></div>
                            <div class="radar-grid">
                                <div class="grid-circle circle-1"></div>
                                <div class="grid-circle circle-2"></div>
                                <div class="grid-line line-h"></div>
                                <div class="grid-line line-v"></div>
                            </div>
                        </div>
                        <span class="percentage">${canaryInfo.percentage}%</span>
                    </div>`;
                statusText = '灰度环境';
                statusClass = 'canary';
                detailContent = `
                    <div class="canary-info">
                        <div class="info-item">
                            <label>灰度比例:</label>
                            <span class="percentage-value">${canaryInfo.percentage}%</span>
                        </div>
                        <div class="info-item">
                            <label>版本:</label>
                            <span class="version-value">${version}</span>
                        </div>
                        <div class="info-item">
                            <label>状态:</label>
                            <span class="status-value">${canaryInfo.status}</span>
                        </div>
                        <div class="info-item">
                            <label>操作员:</label>
                            <span class="operator-value">${canaryInfo.operatorMis}</span>
                        </div>
                        <div class="info-item">
                            <label>上线时间:</label>
                            <span class="online-time">${new Date(canaryInfo.onlineTime).toLocaleString('zh-CN')}</span>
                        </div>
                    </div>`;
                break;
        }
        
        indicator.innerHTML = `
            ${iconContent}
            <div class="detail-panel ${statusClass}" style="display: none;">
                <div class="panel-header">
                    <h3>${statusText}</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="panel-content">
                    ${detailContent}
                </div>
            </div>
        `;

        const styles = `
            <style>
                #gray-check-indicator {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .indicator-icon, .status-icon {
                    position: relative;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }

                .indicator-icon {
                    box-shadow: 0 2px 12px rgba(16, 185, 129, 0.3);
                    background: radial-gradient(circle at center, #1f2937 0%, #111827 100%);
                    border: 2px solid #10b981;
                }

                .indicator-icon:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
                }

                .status-icon.auth-error {
                    background: radial-gradient(circle at center, #f97316 0%, #ea580c 100%);
                    border: 2px solid #f97316;
                    box-shadow: 0 2px 12px rgba(249, 115, 22, 0.3);
                }

                .status-icon.auth-error:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
                }

                .lock-container {
                    position: relative;
                    width: 20px;
                    height: 20px;
                }

                .lock-body {
                    position: absolute;
                    bottom: 2px;
                    left: 3px;
                    width: 14px;
                    height: 10px;
                    background: white;
                    border-radius: 2px;
                }

                .lock-shackle {
                    position: absolute;
                    top: 0;
                    left: 6px;
                    width: 8px;
                    height: 8px;
                    border: 2px solid white;
                    border-bottom: none;
                    border-radius: 4px 4px 0 0;
                }

                .warning-dot {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 6px;
                    height: 6px;
                    background: #fbbf24;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.2); }
                }

                .status-icon.production {
                    background: radial-gradient(circle at center, #059669 0%, #047857 100%);
                    border: 2px solid #059669;
                    box-shadow: 0 2px 12px rgba(5, 150, 105, 0.3);
                }

                .status-icon.production:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 16px rgba(5, 150, 105, 0.4);
                }

                .status-icon .icon {
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                }

                .radar-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    overflow: hidden;
                }

                .radar-sweep {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 50%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent 0%, #10b981 70%, #22c55e 100%);
                    transform-origin: left center;
                    transform: translate(0, -50%) rotate(0deg);
                    animation: radarSweep 3s linear infinite;
                }

                .radar-grid {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0.3;
                }

                .grid-circle {
                    position: absolute;
                    border: 1px solid #10b981;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .circle-1 {
                    width: 60%;
                    height: 60%;
                }

                .circle-2 {
                    width: 30%;
                    height: 30%;
                }

                .grid-line {
                    position: absolute;
                    background: #10b981;
                }

                .line-h {
                    width: 100%;
                    height: 1px;
                    top: 50%;
                    left: 0;
                }

                .line-v {
                    width: 1px;
                    height: 100%;
                    top: 0;
                    left: 50%;
                }

                @keyframes radarSweep {
                    from {
                        transform: translate(0, -50%) rotate(0deg);
                    }
                    to {
                        transform: translate(0, -50%) rotate(360deg);
                    }
                }

                .indicator-icon .percentage {
                    color: #10b981;
                    font-weight: 600;
                    font-size: 10px;
                    z-index: 2;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                    position: relative;
                }

                .detail-panel {
                    position: absolute;
                    top: 70px;
                    left: 0;
                    width: 320px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    border: 1px solid #e1e5e9;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .detail-panel.show {
                    opacity: 1;
                    transform: translateY(0);
                    display: block !important;
                }

                .panel-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn:hover {
                    color: #666;
                }

                .panel-content {
                    padding: 16px 20px;
                }

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .info-item:last-child {
                    margin-bottom: 0;
                }

                .info-item label {
                    color: #666;
                    font-weight: 500;
                }

                .info-item span {
                    color: #333;
                    font-weight: 600;
                }

                .percentage-value {
                    color: #667eea !important;
                }

                .status-value {
                    color: #10b981 !important;
                }

                .auth-form {
                    padding: 20px 0;
                }

                .auth-message {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 20px;
                    padding: 12px;
                    background: #fef3c7;
                    border-radius: 8px;
                    border-left: 4px solid #f59e0b;
                }

                .message-icon {
                    font-size: 16px;
                    margin-right: 8px;
                    flex-shrink: 0;
                }

                .auth-message p {
                    margin: 0;
                    color: #92400e;
                    font-size: 13px;
                    line-height: 1.4;
                }

                .input-group {
                    margin-bottom: 16px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 6px;
                    color: #374151;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .auth-form input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 13px;
                    margin-bottom: 8px;
                    box-sizing: border-box;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: 'Monaco', 'Menlo', monospace;
                }

                .auth-form input:focus {
                    outline: none;
                    border-color: #f97316;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
                }

                .input-hint {
                    font-size: 11px;
                    color: #6b7280;
                    line-height: 1.3;
                }

                .save-btn {
                    width: 100%;
                    padding: 12px 16px;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .save-btn:hover {
                    background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
                }

                .save-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 6px rgba(249, 115, 22, 0.3);
                }

                .btn-text {
                    flex: 1;
                }

                .btn-icon {
                    font-size: 14px;
                }

                .status-info {
                    padding: 10px 0;
                }

                .status-info p {
                    margin: 0 0 12px 0;
                    color: #666;
                    font-size: 13px;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(indicator);

        // 添加事件监听
        const icon = indicator.querySelector('.indicator-icon, .status-icon');
        if (icon) {
            icon.addEventListener('click', togglePanel);
        }
        
        const closeBtn = indicator.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', togglePanel);
        }

        // 保存token的事件监听
        const saveTokenBtn = indicator.querySelector('#save-token');
        if (saveTokenBtn) {
            saveTokenBtn.addEventListener('click', () => {
                const tokenInput = indicator.querySelector('#token-input');
                const newToken = tokenInput.value.trim();
                if (newToken) {
                    ACCESS_TOKEN = newToken;
                    localStorage.setItem('gray-check-token', newToken);
                    alert('Token已保存，页面将自动刷新');
                    location.reload();
                }
            });
        }

        return indicator;
    }

    function togglePanel() {
        const panel = document.querySelector('.detail-panel');
        isExpanded = !isExpanded;
        
        if (isExpanded) {
            panel.classList.add('show');
        } else {
            panel.classList.remove('show');
        }
    }

    function checkCanaryStatus() {
        const deployVersion = window._AWP_DEPLOY_VERSION;
        if (!deployVersion) {
            console.log('未找到 _AWP_DEPLOY_VERSION');
            return;
        }

        console.log('当前版本:', deployVersion);
        console.log('开始检查灰度状态...');

        fetch(API_URL, {
            method: 'GET',
            headers: {
                'access-token': ACCESS_TOKEN,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            console.log('响应状态:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('API响应:', result);
            
            // 检查是否为鉴权失败
            if (result.status === 401 && result.data?.message === "auth failed") {
                throw new Error('AUTH_ERROR');
            }
            
            if (result.code === 200 && result.data) {
                canaryData = result.data;
                console.log('灰度数据:', canaryData);
                
                const matchedCanary = canaryData.find(item => {
                    console.log('检查版本匹配:', item.version, '==', deployVersion);
                    return item.version === deployVersion;
                });

                if (matchedCanary) {
                    console.log('✅ 命中灰度版本:', deployVersion);
                    createIndicatorUI(STATUS_TYPES.CANARY, matchedCanary);
                } else {
                    console.log('❌ 未命中灰度版本，运行在生产环境');
                    console.log('可用灰度版本:', canaryData.map(item => item.version));
                    createIndicatorUI(STATUS_TYPES.PRODUCTION, { currentVersion: deployVersion });
                }
            } else {
                console.log('API返回错误:', result);
                createIndicatorUI(STATUS_TYPES.PRODUCTION, { currentVersion: deployVersion });
            }
        })
        .catch(error => {
            console.error('请求失败:', error);
            if (error.message === 'AUTH_ERROR') {
                console.log('鉴权失败，显示token输入界面');
                createIndicatorUI(STATUS_TYPES.AUTH_ERROR);
            } else {
                console.log('请求失败，默认显示生产环境');
                createIndicatorUI(STATUS_TYPES.PRODUCTION, { currentVersion: deployVersion });
            }
        });
    }

    function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    function waitForSPA() {
        return new Promise((resolve) => {
            const checkDeployVersion = () => {
                if (window._AWP_DEPLOY_VERSION) {
                    resolve();
                } else {
                    setTimeout(checkDeployVersion, 500);
                }
            };
            checkDeployVersion();
        });
    }

    async function init() {
        await waitForPageLoad();
        await waitForSPA();
        checkCanaryStatus();
    }

    init();
})();