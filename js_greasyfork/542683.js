// ==UserScript==
// @name         抖音视频信息同步到飞书b
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取抖音网页版当前视频信息并同步到飞书多维表格，可以从A.JS或0715.js获取数据
// @author       观澜话不多
// @license MIT
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/jingxuan*
// @match        https://www.douyin.com/root/search/*
// @match        https://www.douyin.com/search/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      open.feishu.cn
// @connect      www.douyin.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/542683/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E5%90%8C%E6%AD%A5%E5%88%B0%E9%A3%9E%E4%B9%A6b.user.js
// @updateURL https://update.greasyfork.org/scripts/542683/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E5%90%8C%E6%AD%A5%E5%88%B0%E9%A3%9E%E4%B9%A6b.meta.js
// ==/UserScript==

/*
 * 注意：本脚本可以配合A.JS(原0715.js)使用，也可以单独使用
 *
 * 配合使用时：
 * 1. 首先安装并启用A.JS(原0715.js)脚本
 * 2. 在页面中打开一个抖音视频
 * 3. 点击"等待信息面板"按钮或手动点击A.JS的面板
 * 4. 然后使用本脚本将数据同步到飞书
 *
 * 单独使用时：
 * 本脚本会尝试自行获取视频信息，但由于抖音限制，可能会遇到验证码、
 * 登录限制等问题，导致获取数据失败
 */

(function() {
    'use strict';

    // 全局变量
    let currentVideoData = null;
    let logContainer = null;
    let isRunning = false;

    // 拖拽相关变量
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // 观察A.JS/0715.js面板的变量
    let observer0715 = null;

    // 激活相关常量和变量
    const ACTIVATION_KEY = 'douyin_activation_status';
    const DEVICE_ID_KEY = 'douyin_device_id';
    const SECRET_KEY = 'db94xy20240605'; // 使用一个固定的密钥值
    const VALID_DAYS = 30; // 激活码有效期(天)

    // 缓存机制
    const ACTIVATION_CACHE = {
        status: null,
        timestamp: 0,
        CACHE_TTL: 60000 // 缓存有效期，毫秒
    };

    // 飞书多维表格配置
    const FEISHU_CONFIG = {
        APP_ID: 'cli_a7317a5d6afd901c',
        APP_SECRET: 'cdGf1f5n5xY0tI6F07xKkcU1iPoFVdPD',
        BASE_ID: 'T1M4bzmLLarNLhs5jcEcwAcRn8Q',    // 多维表格 base ID
        TABLE_ID: 'tbliBckxa87pskV8',              // 数据表 ID
        API_URL: 'https://open.feishu.cn/open-apis',
        TOKEN: null,
        ACTIVATION_TABLE_ID: 'tbliBckxa87pskV8'    // 激活码表ID
    };

    // 配置字段
    const requiredFields = {
        '作者昵称': 1,
        '视频标题': 1,
        '点赞数': 2,
        '评论数': 2,
        '收藏数': 2,
        '转发数': 2,
        '视频链接': 1,
        '解析后直链': 1,
        '发布时间': 1
    };

    // 信息面板ID - 兼容A.JS和0715.js
    const INFO_PANEL_ID = 'douyin-info-panel';

    // 字段类型缓存
    let actualFieldTypes = {};
    let fieldTypesCache = {};
    let accessTokenCache = { token: null, expireTime: 0 };

    // 样式
    const styles = `
        #feishu-panel {
            position: fixed;
            top: 70px;
            right: 10px;
            width: 160px;
            padding: 12px;
            background-color: rgba(247, 248, 250, 0.95);
            color: #1D2129;
            border-radius: 8px;
            z-index: 9999;
            font-size: 12px;
            line-height: 1.4;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
            border: 1px solid #E5E6EB;
            user-select: none;
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #E5E6EB;
            cursor: move;
        }

        .panel-header strong {
            font-weight: 600;
            font-size: 14px;
            color: #1D2129;
        }

        .close-btn {
            cursor: pointer;
            font-size: 12px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            color: #4E5969;
            transition: all 0.2s;
        }

        .close-btn:hover {
            background-color: #F2F3F5;
        }

        .form-group {
            margin-bottom: 8px;
        }

        .form-group label {
            display: block;
            margin-bottom: 3px;
            color: #86909C;
            font-size: 11px;
        }

        .form-group input {
            width: 100%;
            padding: 6px 8px;
            border-radius: 4px;
            border: 1px solid #E5E6EB;
            background: #F7F8FA;
            color: #1D2129;
            font-size: 11px;
            outline: none;
        }

        .buttons {
            display: flex;
            gap: 6px;
            margin: 8px 0;
        }

        button {
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            background-color: #165DFF;
            color: white;
            cursor: pointer;
            font-size: 11px;
            transition: background-color 0.2s;
        }

        button:hover {
            background-color: #0E42D2;
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .log-container {
            max-height: 120px;
            overflow-y: auto;
            margin-top: 10px;
            padding: 8px;
            background-color: #F2F3F5;
            border-radius: 4px;
            font-size: 11px;
            color: #4E5969;
        }

        .copy-input {
            flex: 1;
            padding: 6px 8px;
            border-radius: 4px;
            border: 1px solid #E5E6EB;
            background: #F7F8FA;
            color: #1D2129;
            font-size: 11px;
            outline: none;
        }

        .copy-button {
            margin-left: 4px;
            padding: 6px 8px;
            border-radius: 4px;
            border: none;
            background: #165DFF;
            color: white;
            cursor: pointer;
            font-size: 11px;
            white-space: nowrap;
        }

        .video-status {
            background: #F2F3F5;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 10px;
        }

        .status-indicator {
            font-size: 11px;
        }

        .status-success {
            color: #00B42A;
            margin-bottom: 3px;
        }

        .status-icon {
            display: inline-block;
            margin-right: 3px;
        }

        .status-detail {
            margin-top: 3px;
        }

        .status-title {
            font-weight: 600;
            font-size: 11px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: help;
        }

        .status-author {
            font-size: 11px;
            color: #4E5969;
        }

        .status-stats {
            font-size: 11px;
            color: #4E5969;
            margin-top: 2px;
        }

        .action-buttons {
            display: flex;
            gap: 6px;
            margin-bottom: 10px;
        }

        .action-button {
            flex: 1;
            padding: 6px 0;
            font-size: 11px;
        }

        .section-header {
            font-weight: 600;
            font-size: 11px;
            padding: 6px 0;
            cursor: pointer;
            border-bottom: 1px solid #E5E6EB;
            margin-bottom: 8px;
        }

        .section-header:hover {
            color: #165DFF;
        }

        .toggle-icon {
            font-size: 9px;
            margin-right: 4px;
        }

        .config-section {
            margin-bottom: 8px;
        }

        .section-content {
            padding-top: 6px;
        }

        .status-error {
            color: #F53F3F;
            margin-bottom: 3px;
        }
    `;

    // 初始化函数
    function init() {
        // 先检查激活状态
        checkActivation().then(isActivated => {
            if (!isActivated) {
                createActivationDialog();
                return; // 未激活则不继续初始化
            }

            // 已激活，继续初始化
            addStyles();
            createPanel();
            createFloatingButton();
            checkInfoPanelExists();
            observeInfoPanel(); // 添加对信息面板的观察

            // 定期检查激活状态
            startActivationCheck();

            // 显示激活状态
            showActivationStatus();
        });
    }

    // 定期检查激活状态
    function startActivationCheck() {
        setInterval(async () => {
            const activationCode = GM_getValue('activation_code');
            if (!activationCode) return;

            try {
                const isActive = await checkActivationWithRemote();
                if (!isActive) {
                    showFloatingTip('激活状态已失效，请重新激活');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            } catch (e) {
                console.error('检查激活状态失败:', e);
            }
        }, 30 * 60 * 1000); // 每30分钟检查一次
    }

    // 添加浮动按钮
    function createFloatingButton() {
        // 先检查激活状态
        if (!GM_getValue(ACTIVATION_KEY)) {
            // 未激活时不创建按钮
            return null;
        }

        const button = document.createElement('div');
        button.id = 'floating-douyin-button';
        button.innerHTML = '抖音助手';
        button.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background-color: #165DFF;
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 10px rgba(22, 93, 255, 0.3);
            font-size: 12px;
            font-weight: 500;
            user-select: none;
            transition: all 0.2s ease;
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#0E42D2';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#165DFF';
        });

        button.addEventListener('click', () => {
            const panel = document.getElementById('feishu-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';

                // 如果面板显示，刷新当前视频信息
                if (panel.style.display !== 'none') {
                    autoFetchCurrentVideo();
                }
            }
        });

        document.body.appendChild(button);
    }

    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    }

    // 导出视频信息为JSON
    function exportVideoInfo() {
        if (!currentVideoData) {
            addLog('没有可导出的视频信息', 'error');
            return;
        }

        try {
            const jsonStr = JSON.stringify(currentVideoData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // 创建下载链接
            const a = document.createElement('a');
            const videoId = getAwemeId() || new Date().getTime();
            a.download = `抖音视频_${videoId}.json`;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            addLog('视频信息已导出为JSON文件', 'success');
        } catch (e) {
            addLog(`导出失败: ${e.message}`, 'error');
        }
    }

    // 创建面板
    function createPanel() {
        // 先检查激活状态
        if (!GM_getValue(ACTIVATION_KEY)) {
            // 未激活时不创建主面板，等待激活
            return null;
        }

        const panel = document.createElement('div');
        panel.id = 'feishu-panel';

        // 从存储中获取配置
        const appId = GM_getValue('feishu_app_id', '');
        const appSecret = GM_getValue('feishu_app_secret', '');
        const tableUrl = GM_getValue('feishu_table_url', '');

        // 从存储中获取面板位置
        const panelX = GM_getValue('panel_x', null);
        const panelY = GM_getValue('panel_y', null);

        if (panelX !== null && panelY !== null) {
            panel.style.left = panelX + 'px';
            panel.style.top = panelY + 'px';
            panel.style.right = 'auto';
        }

        panel.innerHTML = `
            <div class="panel-header">
                <strong>抖音视频助手</strong>
                <span class="close-btn">✕</span>
            </div>

            <div id="video-status" class="video-status">
                <div class="status-indicator">未获取数据</div>
            </div>

            <div class="action-buttons">
                <button id="refresh-video" class="action-button">刷新信息</button>
                <button id="wait-0715-sync" class="action-button">传入飞书</button>
            </div>

            <div class="config-section">
                <div class="section-header" id="feishu-config-toggle">
                    <span class="toggle-icon">▶</span> 飞书同步配置
                </div>
                <div id="feishu-config-content" class="section-content" style="display: none;">
                    <div class="form-group">
                        <label>飞书 App ID</label>
                        <input type="text" id="feishu-app-id" value="${appId}" placeholder="输入飞书应用App ID">
                    </div>

                    <div class="form-group">
                        <label>飞书 App Secret</label>
                        <input type="password" id="feishu-app-secret" value="${appSecret}" placeholder="输入飞书应用App Secret">
                    </div>

                    <div class="form-group">
                        <label>飞书表格URL</label>
                        <input type="text" id="feishu-table-url" value="${tableUrl}" placeholder="输入多维表格URL">
                    </div>

                    <div class="buttons">
                        <button id="save-config">保存配置</button>
                        <button id="test-config">测试配置</button>
                    </div>
                </div>
            </div>

            <div id="log-container" class="log-container"></div>
        `;

        document.body.appendChild(panel);

        // 保存日志容器引用
        logContainer = document.getElementById('log-container');

        // 添加事件监听
        document.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // 飞书配置展开/折叠功能
        document.getElementById('feishu-config-toggle').addEventListener('click', () => {
            const content = document.getElementById('feishu-config-content');
            const icon = document.querySelector('#feishu-config-toggle .toggle-icon');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.textContent = '▼';
            } else {
                content.style.display = 'none';
                icon.textContent = '▶';
            }
        });

        document.getElementById('save-config').addEventListener('click', saveConfig);
        document.getElementById('test-config').addEventListener('click', testConfig);
        document.getElementById('refresh-video').addEventListener('click', autoFetchCurrentVideo);
        document.getElementById('wait-0715-sync').addEventListener('click', waitFor0715AndSync);

        // 添加拖拽功能
        setupDraggable(panel);

        updateSyncButton();

        // 添加键盘快捷键
        document.addEventListener('keydown', function(e) {
            // Alt+D 快捷键显示/隐藏面板
            if (e.altKey && e.key === 'd') {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                e.preventDefault();
            }
        });

        return panel;
    }

    // 等待信息面板出现并同步数据到飞书
    function waitFor0715AndSync() {
        // 先检查激活状态
        checkActivation().then(isActivated => {
            if (!isActivated) {
                createActivationDialog();
                return;
            }

            addLog('开始等待信息面板出现并同步数据...', 'info');
            updateStatusIndicator(null, '等待信息面板...');

            const syncButton = document.getElementById('wait-0715-sync');
            if (syncButton) {
                syncButton.disabled = true;
                syncButton.textContent = '等待中...';
            }

            let attempts = 0;
            const maxAttempts = 20;
            const interval = setInterval(() => {
                attempts++;
                const panel = document.getElementById(INFO_PANEL_ID);
                if (panel && panel.style.display !== 'none') {
                    clearInterval(interval);
                    addLog('已发现信息面板，尝试获取数据并同步', 'success');
                    updateStatusIndicator(null, '正在获取数据...');

                    if (syncButton) {
                        syncButton.disabled = false;
                        syncButton.textContent = '传入飞书';
                    }

                    // 尝试获取数据并同步
                    getDataFromInfoPanel()
                        .then(data => {
                            currentVideoData = data;
                            displayVideoInfo(data);
                            addLog('已成功获取面板数据', 'success');

                            // 立即同步到飞书
                            syncVideoData(data);
                        })
                        .catch(error => {
                            updateStatusIndicator(null, '获取数据失败');
                            addLog(`获取面板数据失败: ${error.message}`, 'error');
                        });

                    return;
                }

                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    updateStatusIndicator(null, '等待超时');
                    addLog('等待超时，请先打开视频信息面板', 'error');

                    if (syncButton) {
                        syncButton.disabled = false;
                        syncButton.textContent = '传入飞书';
                    }
                }
            }, 500);
        });
    }

    // 同步视频数据到飞书
    async function syncVideoData(videoData) {
        // 先检查激活状态
        const isActivated = await checkActivation();
        if (!isActivated) {
            createActivationDialog();
            return;
        }

        if (isRunning) return;

        isRunning = true;
        addLog('开始同步数据到飞书...', 'info');
        updateStatusIndicator(videoData, '正在同步到飞书...');
        updateSyncButton();

        try {
            const appId = document.getElementById('feishu-app-id').value.trim();
            const appSecret = document.getElementById('feishu-app-secret').value.trim();
            const tableUrl = document.getElementById('feishu-table-url').value.trim();

            if (!appId || !appSecret || !tableUrl) {
                throw new Error('请先展开并完成飞书同步配置');
            }

            // 如果没有直链但有链接，尝试获取直链
            if (!videoData['解析后直链'] && videoData['视频链接']) {
                try {
                    addLog('尝试获取视频直链...', 'info');
                    const directUrl = await getVideoDirectUrl(videoData['视频链接']);
                    if (directUrl) {
                        videoData['解析后直链'] = directUrl;
                        addLog('无水印直链获取成功', 'success');
                    }
                } catch (error) {
                    addLog('获取视频直链失败，继续处理', 'warning');
                }
            }

            // 准备飞书API
            const { appToken, tableId } = parseFeishuUrl(tableUrl);
            const accessToken = await getFeishuAccessToken(appId, appSecret);

            // 确保字段存在
            await ensureFieldsExist(appToken, tableId, accessToken, requiredFields);

            // 写入数据
            await addToFeishuTable(appToken, tableId, accessToken, [videoData]);

            addLog('视频数据已成功同步到飞书表格', 'success');
            updateStatusIndicator(videoData, '同步成功');

        } catch (error) {
            addLog(`同步失败: ${error.message}`, 'error');
            updateStatusIndicator(videoData, '同步失败');
        } finally {
            isRunning = false;
            updateSyncButton();
        }
    }

    // 检测信息面板是否存在并运行
    function checkInfoPanelExists() {
        // 尝试检测信息面板是否已经运行
        const panel = document.getElementById(INFO_PANEL_ID);
        if (panel) {
            addLog('检测到信息面板已存在', 'success');
            return true;
        }

        // 或者尝试搜索所有脚本，看是否有相关脚本
        const scripts = Array.from(document.querySelectorAll('script'));
        for (const script of scripts) {
            if (script.src && (script.src.includes('0715') || script.src.includes('A.JS'))) {
                addLog('检测到视频信息脚本已加载', 'success');
                return true;
            }
        }

        addLog('未检测到视频信息面板脚本，部分功能可能受限', 'warning');
        return false;
    }

    // 监听信息面板的出现
    function observeInfoPanel() {
        // 如果已经在观察，则不重复创建
        if (observer0715) return;

        const config = { childList: true, subtree: true };

        // 创建一个观察器实例
        observer0715 = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是信息面板
                            if (node.id === INFO_PANEL_ID || node.querySelector(`#${INFO_PANEL_ID}`)) {
                                addLog('检测到信息面板已创建', 'success');

                                // 等待面板内容加载
                                setTimeout(() => {
                                    try {
                                        getDataFromInfoPanel()
                                            .then(data => {
                                                currentVideoData = data;
                                                displayVideoInfo(data);
                                                addLog('已自动获取信息面板数据', 'success');
                                            })
                                            .catch(error => {
                                                addLog(`自动获取数据失败: ${error.message}`, 'warning');
                                            });
                                    } catch (e) {
                                        console.error('尝试获取信息面板数据时出错:', e);
                                    }
                                }, 500);

                                // 可以选择是否停止观察
                                // observer0715.disconnect();
                                return;
                            }
                        }
                    }
                }
            }
        });

        // 开始观察document的变化
        observer0715.observe(document.body, config);
        addLog('已开始监听信息面板', 'info');
    }

    // 设置拖拽功能
    function setupDraggable(panel) {
        const header = panel.querySelector('.panel-header');

        header.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            // 阻止文本选择
            e.preventDefault();

            // 获取鼠标相对于面板的位置
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;

            isDragging = true;

            // 添加鼠标移动和松开事件监听
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }

        function drag(e) {
            if (!isDragging) return;

            // 计算新位置
            const newX = e.clientX - dragOffsetX;
            const newY = e.clientY - dragOffsetY;

            // 确保面板不会移出视口
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            const finalX = Math.min(Math.max(0, newX), maxX);
            const finalY = Math.min(Math.max(0, newY), maxY);

            // 设置面板位置
            panel.style.left = finalX + 'px';
            panel.style.top = finalY + 'px';
            panel.style.right = 'auto';

            // 保存位置到存储
            GM_setValue('panel_x', finalX);
            GM_setValue('panel_y', finalY);
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    // 更新同步按钮状态
    function updateSyncButton() {
        const syncBtn = document.getElementById('sync-video');
        if (!syncBtn) return;

        const videoId = getAwemeId();
        const hasConfig = checkHasConfig();

        syncBtn.disabled = !videoId || !hasConfig || isRunning;
    }

    // 检查配置
    function checkHasConfig() {
        const appId = document.getElementById('feishu-app-id')?.value;
        const appSecret = document.getElementById('feishu-app-secret')?.value;
        const tableUrl = document.getElementById('feishu-table-url')?.value;

        return appId && appSecret && tableUrl;
    }

    // 添加日志
    function addLog(message, type = 'info') {
        if (!logContainer) return;

        const logEntry = document.createElement('div');
        logEntry.style.color = type === 'error' ? '#F53F3F' :
                              type === 'success' ? '#00B42A' :
                              type === 'warning' ? '#FF7D00' : '#4E5969';

        // 添加时间戳和简洁消息
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // 如果消息过长，截断并添加工具提示
        let displayMessage = message;
        if (message.length > 30) {
            displayMessage = message.substring(0, 27) + '...';
            logEntry.title = message; // 添加完整消息作为工具提示
        }

        logEntry.innerHTML = `<span style="color:#86909C;font-size:9px;">${timeStr}</span> ${displayMessage}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        // 控制日志数量
        if (logContainer.children.length > 30) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    // 清理日志
    function clearLog() {
        if (logContainer) {
            logContainer.innerHTML = '';
        }
    }

    // 保存配置
    function saveConfig() {
        const appId = document.getElementById('feishu-app-id').value.trim();
        const appSecret = document.getElementById('feishu-app-secret').value.trim();
        const tableUrl = document.getElementById('feishu-table-url').value.trim();

        if (!appId || !appSecret || !tableUrl) {
            addLog('请填写完整配置信息', 'error');
            return;
        }

        GM_setValue('feishu_app_id', appId);
        GM_setValue('feishu_app_secret', appSecret);
        GM_setValue('feishu_table_url', tableUrl);

        addLog('配置已保存', 'success');
        updateSyncButton();
    }

    // 从飞书表格URL中提取App Token和Table ID
    function parseFeishuUrl(url) {
        const appTokenMatch = url.match(/\/(?:base|sheets)\/([^\/\?]+)/);
        const tableIdMatch = url.match(/[?&]table=([^&]+)/);

        if (!appTokenMatch || !tableIdMatch) {
            throw new Error('无法从URL中解析App Token和Table ID');
        }

        return {
            appToken: appTokenMatch[1],
            tableId: tableIdMatch[1]
        };
    }

    // 获取飞书访问令牌
    function getFeishuAccessToken(appId, appSecret) {
        return new Promise((resolve, reject) => {
            // 检查缓存
            const now = Date.now();
            if (accessTokenCache.token && now < accessTokenCache.expireTime) {
                addLog('使用缓存的访问令牌', 'success');
                resolve(accessTokenCache.token);
                return;
            }

            addLog('正在获取飞书访问令牌...', 'info');
            console.log('请求飞书访问令牌，参数:', { app_id: appId, app_secret: '***' });

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify({
                    app_id: appId,
                    app_secret: appSecret
                }),
                onload: function(response) {
                    console.log('飞书令牌响应状态:', response.status, response.statusText);

                    try {
                        if (!response.responseText) {
                            console.error('空响应');
                            reject(new Error('获取访问令牌失败: 空响应'));
                            return;
                        }

                        const data = JSON.parse(response.responseText);
                        console.log('飞书令牌响应数据:', data);

                        if (data.code === 0 && data.tenant_access_token) {
                            // 缓存令牌，有效期设为90分钟
                            accessTokenCache.token = data.tenant_access_token;
                            accessTokenCache.expireTime = Date.now() + (90 * 60 * 1000);
                            addLog('飞书访问令牌获取成功', 'success');
                            resolve(data.tenant_access_token);
                        } else {
                            console.error('获取令牌失败:', data);
                            reject(new Error(data.msg || '获取飞书访问令牌失败'));
                        }
                    } catch (e) {
                        console.error('解析响应失败:', e, '原始响应:', response.responseText);
                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error('网络请求失败:', error);
                    reject(new Error('网络请求失败: ' + (error.message || '未知错误')));
                },
                ontimeout: function() {
                    console.error('请求超时');
                    reject(new Error('获取访问令牌超时'));
                }
            });
        });
    }

    // 获取飞书表格现有字段
    function getFeishuFields(appToken, tableId, accessToken) {
        return new Promise((resolve, reject) => {
            // 检查缓存
            const cacheKey = `${appToken}_${tableId}`;
            if (fieldTypesCache[cacheKey]) {
                addLog('使用缓存的字段信息', 'success');
                resolve(fieldTypesCache[cacheKey]);
                return;
            }

            addLog('正在获取飞书表格字段...', 'info');
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields`,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            const fields = result.data.items || [];
                            fieldTypesCache[cacheKey] = fields;
                            addLog(`获取到 ${fields.length} 个字段`, 'success');
                            resolve(fields);
                        } else {
                            reject(new Error(result.msg || '获取字段列表失败'));
                        }
                    } catch (e) {
                        reject(new Error('响应解析失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 创建飞书字段
    function createFeishuField(appToken, tableId, accessToken, fieldName, fieldType) {
        return new Promise((resolve, reject) => {
            addLog(`正在创建字段: ${fieldName}`, 'info');
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                data: JSON.stringify({
                    field_name: fieldName,
                    type: fieldType
                }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            addLog(`字段"${fieldName}"创建成功`, 'success');
                            resolve(result.data.field);
                        } else {
                            reject(new Error(`创建字段失败: ${result.msg}`));
                        }
                    } catch (e) {
                        reject(new Error('响应解析失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 确保所需字段存在
    async function ensureFieldsExist(appToken, tableId, accessToken, requiredFields) {
        try {
            const existingFields = await getFeishuFields(appToken, tableId, accessToken);
            const existingFieldNames = existingFields.map(field => field.field_name);

            // 记录字段类型
            existingFields.forEach(field => {
                actualFieldTypes[field.field_name] = field.type;
            });

            const missingFields = {};
            Object.keys(requiredFields).forEach(fieldName => {
                if (!existingFieldNames.includes(fieldName)) {
                    missingFields[fieldName] = requiredFields[fieldName];
                }
            });

            if (Object.keys(missingFields).length === 0) {
                addLog('所有字段都已存在', 'success');
                return;
            }

            addLog(`需要创建 ${Object.keys(missingFields).length} 个字段`, 'warning');

            const createPromises = Object.keys(missingFields).map(fieldName => {
                const fieldType = missingFields[fieldName];
                return createFeishuField(appToken, tableId, accessToken, fieldName, fieldType)
                    .then(field => {
                        if (field) {
                            actualFieldTypes[field.field_name] = field.type;
                        }
                        return field;
                    })
                    .catch(error => {
                        addLog(`字段创建失败: ${error.message}`, 'error');
                        return null;
                    });
            });

            await Promise.all(createPromises);
            addLog('字段创建完成', 'success');

        } catch (error) {
            throw error;
        }
    }

    // 添加数据到飞书表格
    async function addToFeishuTable(appToken, tableId, accessToken, records) {
        return new Promise((resolve, reject) => {
            addLog('正在上传数据到飞书表格...', 'info');

            const requestData = {
                records: records.map(record => ({ fields: record }))
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_create`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            addLog('数据成功写入飞书表格', 'success');
                            resolve(result.data);
                        } else {
                            let errorMessage = `写入失败: ${result.msg || '未知错误'}`;
                            if (result.msg?.includes('FieldConvFail')) {
                                errorMessage = '字段类型转换失败，请检查数据格式';
                            }
                            reject(new Error(errorMessage));
                        }
                    } catch (e) {
                        reject(new Error('响应解析失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 获取视频ID
    function getAwemeId() {
        // 视频页
        let match = window.location.pathname.match(/\/video\/(\d+)/);
        if (match) return match[1];

        // modal弹窗页
        const url = new URL(window.location.href);
        const modalId = url.searchParams.get('modal_id');
        if (modalId && /^\d+$/.test(modalId)) return modalId;

        return null;
    }

    // 获取视频详情
    async function fetchVideoInfo(videoId) {
        addLog(`正在获取视频信息...`, 'info');

        try {
            // 构造API参数
            const params = {
                "aid": 6383,
                "device_platform": "webapp",
                "aweme_id": videoId
            };

            const paramStr = Object.entries(params).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&');
            const url = `https://www.douyin.com/aweme/v1/web/aweme/detail/?${paramStr}`;

            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'accept': 'application/json',
                    'referer': window.location.href
                }
            });

            const text = await response.text();
            const data = JSON.parse(text);

            if (data && data.aweme_detail) {
                addLog('视频信息获取成功', 'success');
                return data;
            } else {
                throw new Error('API返回数据格式异常');
            }
        } catch (e) {
            addLog(`获取视频信息失败: ${e.message}`, 'error');
            throw e;
        }
    }

    // 获取视频无水印链接
    async function getVideoDirectUrl(videoUrl) {
        try {
            addLog('正在获取视频直链...', 'info');

            // 模拟移动端UA
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://www.douyin.com/'
            };

            const response = await fetch(videoUrl, {
                method: 'HEAD',
                headers: headers,
                redirect: 'follow'
            });

            let finalUrl = response.url;
            addLog('视频直链获取成功', 'success');
            return finalUrl;

        } catch (e) {
            addLog(`获取视频直链失败: ${e.message}`, 'error');
            return null;
        }
    }

    // 格式化视频数据
    function formatVideoData(info) {
        if (!info || !info.aweme_detail) return null;

        const aweme = info.aweme_detail;
        const stats = aweme.statistics || {};
        const author = aweme.author || {};

        // 获取视频播放地址
        let playUrl = '';
        if (aweme.video && aweme.video.play_addr && aweme.video.play_addr.url_list && aweme.video.play_addr.url_list.length > 0) {
            playUrl = aweme.video.play_addr.url_list[0];
        }

        const data = {
            '作者昵称': author.nickname || '未知作者',
            '视频标题': aweme.desc || '无标题',
            '点赞数': Number(stats.digg_count || 0),
            '评论数': Number(stats.comment_count || 0),
            '收藏数': Number(stats.collect_count || 0),
            '转发数': Number(stats.share_count || 0),
            '视频链接': `https://www.douyin.com/video/${aweme.aweme_id}`,
            '解析后直链': playUrl,
            '发布时间': aweme.create_time ? new Date(aweme.create_time * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };

        return data;
    }

    // 显示视频信息
    function displayVideoInfo(data) {
        if (!data) return;

        const statusIndicator = document.querySelector('.status-indicator');
        if (!statusIndicator) return;

        // 更新状态指示器，显示视频基本信息，更紧凑的布局
        statusIndicator.innerHTML = `
            <div class="status-success">
                <span class="status-icon">✓</span> 已获取数据
            </div>
            <div class="status-detail">
                <div class="status-title" title="${data['视频标题'] || '未知标题'}">${truncateText(data['视频标题'] || '未知标题', 15)}</div>
                <div class="status-author">作者: ${truncateText(data['作者昵称'] || '未知', 10)}</div>
                <div class="status-stats">
                    👍 ${formatNumberCompact(data['点赞数'])}
                    💬 ${formatNumberCompact(data['评论数'])}
                </div>
            </div>
        `;

        // 添加工具提示以显示完整标题和作者
        const statusTitle = document.querySelector('.status-title');
        if (statusTitle) {
            statusTitle.title = data['视频标题'] || '未知标题';
        }

        const statusAuthor = document.querySelector('.status-author');
        if (statusAuthor) {
            statusAuthor.title = data['作者昵称'] || '未知';
        }

        updateSyncButton();
    }

    // 辅助函数：截断文本
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // 辅助函数：紧凑格式化数字
    function formatNumberCompact(num) {
        if (!num && num !== 0) return '0';
        if (num >= 100000000) {
            return (num / 100000000).toFixed(1) + '亿';
        } else if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num.toString();
    }

    // 测试配置
    async function testConfig() {
        // 先检查激活状态
        const isActivated = await checkActivation();
        if (!isActivated) {
            createActivationDialog();
            return;
        }

        clearLog();
        addLog('开始测试飞书配置...', 'info');

        try {
            const appId = document.getElementById('feishu-app-id').value.trim();
            const appSecret = document.getElementById('feishu-app-secret').value.trim();
            const tableUrl = document.getElementById('feishu-table-url').value.trim();

            if (!appId || !appSecret || !tableUrl) {
                throw new Error('请先填写完整配置信息');
            }

            const { appToken, tableId } = parseFeishuUrl(tableUrl);
            addLog('飞书URL解析成功', 'success');

            const accessToken = await getFeishuAccessToken(appId, appSecret);
            addLog('飞书访问令牌获取成功', 'success');

            // 检测现有字段类型
            const existingFields = await getFeishuFields(appToken, tableId, accessToken);
            addLog(`已获取到${existingFields.length}个表格字段`, 'success');

            await ensureFieldsExist(appToken, tableId, accessToken, requiredFields);

            addLog('飞书配置测试成功！可以开始同步视频数据', 'success');

        } catch (error) {
            addLog(`配置测试失败: ${error.message}`, 'error');
        }
    }

    // 同步当前视频到飞书
    async function syncCurrentVideo() {
        // 先检查激活状态
        const isActivated = await checkActivation();
        if (!isActivated) {
            createActivationDialog();
            return;
        }

        if (isRunning) return;

        isRunning = true;
        clearLog();
        addLog('开始同步当前视频数据...', 'info');
        updateStatusIndicator(null, '正在获取数据...');
        updateSyncButton();

        try {
            const videoId = getAwemeId();
            if (!videoId) {
                throw new Error('未能获取视频ID，请确保在视频页面');
            }

            let videoData = null;

            // 先尝试从信息面板获取数据
            try {
                videoData = await getDataFromInfoPanel();
                if (videoData) {
                    addLog('已从信息面板成功获取视频数据', 'success');
                }
            } catch (error) {
                addLog(`从信息面板获取数据失败: ${error.message}，尝试直接抓取`, 'warning');
            }

            // 如果从信息面板获取失败，再尝试直接抓取
            if (!videoData) {
                // 获取视频信息
                const info = await fetchVideoInfo(videoId);
                videoData = formatVideoData(info);

                if (!videoData) {
                    throw new Error('无法解析视频数据');
                }
            }

            // 显示获取到的视频信息
            currentVideoData = videoData;
            displayVideoInfo(videoData);

            const appId = document.getElementById('feishu-app-id').value.trim();
            const appSecret = document.getElementById('feishu-app-secret').value.trim();
            const tableUrl = document.getElementById('feishu-table-url').value.trim();

            // 如果飞书配置齐全，则进行同步
            if (appId && appSecret && tableUrl) {
                // 尝试获取直链并同步
                await syncVideoData(videoData);
            } else {
                // 显示配置未完成提示
                addLog('未配置飞书，请展开配置区域完成设置', 'warning');
                // 自动展开配置区域
                const configContent = document.getElementById('feishu-config-content');
                const icon = document.querySelector('#feishu-config-toggle .toggle-icon');
                if (configContent && configContent.style.display === 'none') {
                    configContent.style.display = 'block';
                    if (icon) icon.textContent = '▼';
                }
            }

        } catch (error) {
            addLog(`同步失败: ${error.message}`, 'error');
            updateStatusIndicator(null, '同步失败');
        } finally {
            isRunning = false;
            updateSyncButton();
        }
    }

    // 监听URL变化
    function listenUrlChange() {
        // 先检查激活状态
        if (!GM_getValue(ACTIVATION_KEY)) {
            return; // 未激活时不监听URL变化
        }

        let lastUrl = location.href;
        let lastVideoId = null;

        // 创建一个观察器实例
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(() => {
                    updateSyncButton();
                    autoFetchCurrentVideo();
                }, 500);
            }
        });

        // 开始观察document的变化
        observer.observe(document, { subtree: true, childList: true });

        // 监听popstate事件（浏览器前进后退）
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                updateSyncButton();
                autoFetchCurrentVideo();
            }, 500);
        });

        // 每隔一段时间检查一次视频ID是否变化
        setInterval(() => {
            const currentVideoId = getAwemeId();
            if (currentVideoId && currentVideoId !== lastVideoId) {
                lastVideoId = currentVideoId;
                autoFetchCurrentVideo();
            }
        }, 1000);
    }

    // 自动获取当前视频信息（但不同步到飞书）
    async function autoFetchCurrentVideo() {
        // 先检查激活状态
        const isActivated = await checkActivation();
        if (!isActivated) {
            updateStatusIndicator(null, '请先激活软件');
            return;
        }

        try {
            const videoId = getAwemeId();
            if (!videoId) {
                // 更新状态指示器
                updateStatusIndicator(null, '未能获取视频ID');
                return;
            }

            // 更新状态指示器为正在加载
            updateStatusIndicator(null, '正在获取视频信息...');

            // 先尝试从信息面板获取数据
            try {
                const videoData = await getDataFromInfoPanel();
                if (videoData) {
                    // 更新数据和状态
                    currentVideoData = videoData;
                    displayVideoInfo(videoData);
                    addLog('已成功获取视频数据', 'success');
                    return; // 成功获取数据，直接返回
                }
            } catch (error) {
                console.log('从信息面板获取数据失败，尝试直接抓取:', error.message);
            }

            // 如果从信息面板获取失败，再尝试直接抓取
            const info = await fetchVideoInfo(videoId);
            const videoData = formatVideoData(info);

            if (videoData) {
                // 更新数据和状态
                currentVideoData = videoData;
                displayVideoInfo(videoData);
                addLog('已成功获取视频数据', 'success');

                // 如果有视频链接，尝试获取直链
                if (videoData['视频链接']) {
                    try {
                        const directUrl = await getVideoDirectUrl(videoData['视频链接']);
                        if (directUrl) {
                            videoData['解析后直链'] = directUrl;
                            addLog('已获取无水印视频直链', 'success');
                        }
                    } catch (e) {
                        console.warn('获取视频直链失败', e);
                    }
                }
            } else {
                updateStatusIndicator(null, '获取视频信息失败');
                addLog('获取视频信息失败', 'error');
            }
        } catch (error) {
            console.error('自动获取视频信息失败:', error);
            updateStatusIndicator(null, '获取信息失败');
            addLog('自动获取视频信息失败，请尝试使用信息面板查看信息', 'error');
        }
    }

    // 更新状态指示器
    function updateStatusIndicator(data, message = null) {
        const statusIndicator = document.querySelector('.status-indicator');
        if (!statusIndicator) return;

        if (data) {
            // 如果有数据，使用displayVideoInfo显示
            displayVideoInfo(data);
        } else {
            // 如果没有数据，显示简洁的错误或提示信息
            statusIndicator.innerHTML = `
                <div class="status-error">
                    <span class="status-icon">!</span> ${message || '未获取数据'}
                </div>
            `;

            // 添加工具提示以显示完整错误信息
            if (message && message.length > 15) {
                const statusError = statusIndicator.querySelector('.status-error');
                if (statusError) {
                    statusError.title = message;
                }
            }
        }
    }

    // 添加重试函数
    async function fetchWithRetry(url, options, maxRetries = 3) {
        let retries = 0;
        while (retries < maxRetries) {
            try {
                const response = await fetch(url, options);
                return response;
            } catch (error) {
                retries++;
                if (retries === maxRetries) {
                    throw error;
                }
                addLog(`网络请求失败，${retries}秒后重试(${retries}/${maxRetries})...`, 'warning');
                await new Promise(resolve => setTimeout(resolve, retries * 1000));
            }
        }
    }

    function xmlRequestWithRetry(options, maxRetries = 3) {
        return new Promise((resolve, reject) => {
            let retries = 0;

            function attemptRequest() {
                GM_xmlhttpRequest({
                    ...options,
                    timeout: 15000, // 增加超时时间到15秒
                    ontimeout: function() {
                        if (retries < maxRetries) {
                            retries++;
                            addLog(`请求超时，${retries}秒后重试(${retries}/${maxRetries})...`, 'warning');
                            setTimeout(attemptRequest, retries * 1000);
                        } else {
                            reject(new Error('请求超时，已达到最大重试次数'));
                        }
                    },
                    onerror: function(error) {
                        if (retries < maxRetries) {
                            retries++;
                            addLog(`网络错误，${retries}秒后重试(${retries}/${maxRetries})...`, 'warning');
                            setTimeout(attemptRequest, retries * 1000);
                        } else {
                            reject(new Error('网络请求失败，已达到最大重试次数'));
                        }
                    },
                    onload: options.onload
                });
            }

            attemptRequest();
        });
    }

    function checkNetworkStatus() {
        return navigator.onLine;
    }

    function showNetworkErrorNotification(message, retryCallback) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ff4d4f;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        notification.innerHTML = `
            <div>${message}</div>
            <button style="margin-top: 10px; padding: 5px 10px; background: white; color: #ff4d4f; border: none; border-radius: 4px; cursor: pointer;">重试</button>
        `;

        document.body.appendChild(notification);

        notification.querySelector('button').addEventListener('click', () => {
            notification.remove();
            if (typeof retryCallback === 'function') {
                retryCallback();
            }
        });

        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 10000);
    }

    async function addToFeishuTableWithRetry(appToken, tableId, accessToken, records, maxRetries = 3) {
        let retries = 0;
        while (retries < maxRetries) {
            try {
                addLog(`正在上传数据到飞书表格(尝试 ${retries + 1}/${maxRetries})...`, 'info');

                const requestData = {
                    records: records.map(record => ({ fields: record }))
                };

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_create`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        data: JSON.stringify(requestData),
                        timeout: 15000,
                        onload: function(response) {
                            try {
                                const result = JSON.parse(response.responseText);
                                if (result.code === 0) {
                                    resolve(result.data);
                                } else {
                                    reject(new Error(result.msg || '未知错误'));
                                }
                            } catch (e) {
                                reject(new Error('响应解析失败'));
                            }
                        },
                        onerror: function(error) {
                            reject(new Error('网络请求失败'));
                        },
                        ontimeout: function() {
                            reject(new Error('请求超时'));
                        }
                    });
                });

                addLog('数据成功写入飞书表格', 'success');
                return result;

            } catch (error) {
                retries++;
                if (retries === maxRetries) {
                    throw error;
                }

                const waitTime = retries * 2000;
                addLog(`写入失败: ${error.message}，${waitTime/1000}秒后重试...`, 'warning');
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    function logError(error, context) {
        console.error(`[抖音飞书同步错误] ${context || '未知上下文'}:`, error);

        // 记录到本地存储，方便后续查看
        const errorLogs = JSON.parse(localStorage.getItem('douyin_feishu_error_logs') || '[]');
        errorLogs.push({
            timestamp: new Date().toISOString(),
            message: error.message || String(error),
            stack: error.stack,
            context: context
        });

        // 只保留最近20条错误记录
        while (errorLogs.length > 20) {
            errorLogs.shift();
        }

        localStorage.setItem('douyin_feishu_error_logs', JSON.stringify(errorLogs));
    }

    window.addEventListener('online', () => {
        addLog('网络连接已恢复', 'success');
        updateSyncButton(); // 更新按钮状态
    });

    window.addEventListener('offline', () => {
        addLog('网络连接已断开', 'error');
        updateSyncButton(); // 更新按钮状态
    });

    // 添加设备指纹生成函数
    function generateDeviceFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            new Date().getTimezoneOffset(),
            screen.colorDepth,
            screen.width + 'x' + screen.height,
            navigator.hardwareConcurrency,
            navigator.deviceMemory,
            navigator.vendor
        ].join('|');

        // 使用更稳定的哈希算法
        let hash = 0;
        for (let i = 0; i < components.length; i++) {
            const char = components.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        // 转换为固定长度的字符串
        return Math.abs(hash).toString(36).substring(0, 8);
    }

    // 获取或创建设备ID
    function getOrCreateDeviceId() {
        let deviceId = GM_getValue(DEVICE_ID_KEY);

        if (!deviceId) {
            // 生成新的设备ID，结合设备指纹和随机数
            const fingerprint = generateDeviceFingerprint();
            const randomPart = Math.random().toString(36).substring(2, 6);
            deviceId = `${fingerprint}${randomPart}`;

            // 保存到存储
            GM_setValue(DEVICE_ID_KEY, deviceId);
        }

        return deviceId;
    }

    // 检查激活状态
    async function checkActivation() {
        // 首先检查缓存
        const now = Date.now();
        if (ACTIVATION_CACHE.status !== null && (now - ACTIVATION_CACHE.timestamp) < ACTIVATION_CACHE.CACHE_TTL) {
            return ACTIVATION_CACHE.status;
        }

        const activationStatus = GM_getValue(ACTIVATION_KEY);
        const deviceId = GM_getValue(DEVICE_ID_KEY);
        const activationCode = GM_getValue('activation_code');
        const recordId = GM_getValue('record_id');
        const expireTime = GM_getValue('expire_time');

        if (!deviceId || !activationStatus || !activationCode || !recordId || !expireTime) {
            ACTIVATION_CACHE.status = false;
            ACTIVATION_CACHE.timestamp = now;
            return false;
        }

        // 检查本地过期时间
        if (new Date() > new Date(expireTime)) {
            GM_setValue(ACTIVATION_KEY, null);
            GM_setValue('activation_code', null);
            GM_setValue('record_id', null);
            GM_setValue('expire_time', null);
            showFloatingTip('激活码已过期，请重新激活');
            ACTIVATION_CACHE.status = false;
            ACTIVATION_CACHE.timestamp = now;
            return false;
        }

        // 设置缓存
        ACTIVATION_CACHE.status = true;
        ACTIVATION_CACHE.timestamp = now;
        return true;
    }

    // 带远程验证的激活检查
    async function checkActivationWithRemote() {
        // 首先检查本地状态
        const localActivated = await checkActivation();
        if (!localActivated) return false;

        // 如果本地状态正常，再检查远程状态
        try {
            const activationCode = GM_getValue('activation_code');
            const recordId = GM_getValue('record_id');
            const deviceId = GM_getValue(DEVICE_ID_KEY);

            if (!activationCode || !recordId || !deviceId) return false;

            if (!FEISHU_CONFIG.TOKEN) {
                await getFeishuAccessToken();
            }

            // 检查飞书表格中的状态
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.ACTIVATION_TABLE_ID}/records/${recordId}`,
                    headers: {
                        'Authorization': `Bearer ${FEISHU_CONFIG.TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.code === 0) {
                const record = data.data.record;
                const now = new Date().getTime();

                // 检查状态和过期时间
                if (record.fields.状态 !== '正常' || now > record.fields.过期时间) {
                    clearActivationInfo();
                    showFloatingTip('激活码已过期或失效，请重新激活');
                    return false;
                }

                // 计算剩余时间
                const expireTime = new Date(record.fields.过期时间);
                const remainingTime = Math.ceil((expireTime - now) / (1000 * 60 * 60 * 24)); // 剩余天数
                GM_setValue('remaining_time', remainingTime); // 存储剩余时间

                // 检查设备ID
                const recordDeviceId = Array.isArray(record.fields.设备ID) ?
                    record.fields.设备ID[0]?.text :
                    record.fields.设备ID;

                if (recordDeviceId !== deviceId) {
                    clearActivationInfo();
                    showFloatingTip('设备ID不匹配，请重新激活');
                    return false;
                }

                return true;
            }
        } catch (e) {
            console.error('远程验证失败:', e);
            return false;
        }

        return false;
    }

    // 清除激活信息
    function clearActivationInfo() {
        GM_setValue(ACTIVATION_KEY, null);
        GM_setValue('activation_code', null);
        GM_setValue('record_id', null);
        GM_setValue('expire_time', null);
        GM_setValue('remaining_time', null);
    }

    // 显示浮动提示
    function showFloatingTip(message) {
        const tip = document.createElement('div');
        tip.className = 'floating-tip';
        tip.innerHTML = `
            <div class="icon">i</div>
            <span>${message}</span>
        `;

        document.body.appendChild(tip);

        setTimeout(() => {
            tip.classList.add('show');
        }, 100);

        setTimeout(() => {
            tip.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(tip);
            }, 300);
        }, 3000);
    }

    // 从信息面板获取数据
    function getDataFromInfoPanel() {
        return new Promise((resolve, reject) => {
            try {
                // 查找信息面板
                const panel = document.getElementById(INFO_PANEL_ID);
                if (!panel || panel.style.display === 'none') {
                    reject(new Error('信息面板未找到或未显示'));
                    return;
                }

                // 提取数据
                const result = {};

                // 获取标题
                const titleEl = Array.from(panel.querySelectorAll('div')).find(el =>
                    el.textContent.includes('标题：') ||
                    el.classList.contains('info-value') && el.previousElementSibling &&
                    el.previousElementSibling.textContent.includes('标题')
                );

                if (titleEl) {
                    if (titleEl.classList.contains('info-value')) {
                        result['视频标题'] = titleEl.textContent.trim();
                    } else {
                        result['视频标题'] = titleEl.textContent.replace('标题：', '').trim();
                    }
                }

                // 获取作者
                const authorEl = Array.from(panel.querySelectorAll('div')).find(el =>
                    el.textContent.includes('作者：') ||
                    el.classList.contains('info-value') && el.previousElementSibling &&
                    el.previousElementSibling.textContent.includes('作者')
                );

                if (authorEl) {
                    if (authorEl.classList.contains('info-value')) {
                        result['作者昵称'] = authorEl.textContent.trim();
                    } else {
                        result['作者昵称'] = authorEl.textContent.replace('作者：', '').trim();
                    }
                }

                // 获取视频链接
                const linkInputs = panel.querySelectorAll('input[readonly]');
                if (linkInputs && linkInputs.length > 0) {
                    result['视频链接'] = linkInputs[0].value;
                }

                // 检查是否有统计数字区域
                const statsContainer = panel.querySelector('.stats-container') ||
                                      panel.querySelector('div[style*="grid-template-columns"]');

                if (statsContainer) {
                    // 新版面板 - 使用统计卡片布局
                    const statItems = statsContainer.querySelectorAll('.stat-item') ||
                                      statsContainer.querySelectorAll('div[style*="text-align: center"]');

                    if (statItems && statItems.length >= 4) {
                        const statsData = Array.from(statItems).map(item => {
                            const valueEl = item.querySelector('.stat-value') ||
                                           item.querySelector('div[style*="font-weight: 500"]');
                            const labelEl = item.querySelector('.stat-label') ||
                                           item.querySelector('div[style*="font-size: 12px"]');

                            if (valueEl && labelEl) {
                                return {
                                    label: labelEl.textContent.trim(),
                                    value: valueEl.textContent.trim()
                                };
                            }
                            return null;
                        }).filter(item => item !== null);

                        // 匹配统计数据
                        statsData.forEach(stat => {
                            if (stat.label === '点赞') {
                                result['点赞数'] = parseStatValue(stat.value);
                            } else if (stat.label === '评论') {
                                result['评论数'] = parseStatValue(stat.value);
                            } else if (stat.label === '收藏') {
                                result['收藏数'] = parseStatValue(stat.value);
                            } else if (stat.label === '转发') {
                                result['转发数'] = parseStatValue(stat.value);
                            }
                        });
                    }
                } else {
                    // 旧版面板 - 使用文本格式
                    const statsEls = Array.from(panel.querySelectorAll('div')).filter(el =>
                        el.textContent.includes('点赞：') ||
                        el.textContent.includes('评论：') ||
                        el.textContent.includes('收藏：') ||
                        el.textContent.includes('转发：')
                    );

                    statsEls.forEach(el => {
                        if (el.textContent.includes('点赞：')) {
                            let value = el.textContent.replace('点赞：', '').trim();
                            result['点赞数'] = parseStatValue(value);
                        }
                        else if (el.textContent.includes('评论：')) {
                            let value = el.textContent.replace('评论：', '').trim();
                            result['评论数'] = parseStatValue(value);
                        }
                        else if (el.textContent.includes('收藏：')) {
                            let value = el.textContent.replace('收藏：', '').trim();
                            result['收藏数'] = parseStatValue(value);
                        }
                        else if (el.textContent.includes('转发：')) {
                            let value = el.textContent.replace('转发：', '').trim();
                            result['转发数'] = parseStatValue(value);
                        }
                    });
                }

                // 获取视频直链
                const directLinkContainer = panel.querySelector('.direct-link-container') ||
                                           panel.querySelector('div[style*="margin-top: 12px"]');

                if (directLinkContainer) {
                    const directLinkInput = directLinkContainer.querySelector('input[readonly]');
                    if (directLinkInput) {
                        result['解析后直链'] = directLinkInput.value;
                    }
                } else if (linkInputs && linkInputs.length > 1) {
                    // 旧版面板可能没有容器类名
                    result['解析后直链'] = linkInputs[1].value;
                }

                // 添加发布时间(此数据面板没有提供，使用当前日期)
                result['发布时间'] = new Date().toISOString().split('T')[0];

                // 检查获取的数据是否足够
                if (!result['视频标题'] || !result['作者昵称'] || !result['视频链接']) {
                    reject(new Error('从面板获取的数据不完整'));
                    return;
                }

                resolve(result);
            } catch (e) {
                reject(new Error(`解析面板数据失败: ${e.message}`));
            }
        });
    }

    // 解析数值 (处理"万"和"亿"单位)
    function parseStatValue(value) {
        if (!value) return 0;

        if (value.includes('亿')) {
            return Math.floor(parseFloat(value.replace('亿', '')) * 100000000);
        } else if (value.includes('万')) {
            return Math.floor(parseFloat(value.replace('万', '')) * 10000);
        } else {
            return parseInt(value, 10) || 0;
        }
    }

    // 验证激活码
    async function verifyActivationCode(deviceId, code) {
        try {
            const token = await getFeishuAccessToken(FEISHU_CONFIG.APP_ID, FEISHU_CONFIG.APP_SECRET);
            console.log('获取到的访问令牌:', token);

            return new Promise((resolve, reject) => {
                console.log('开始验证激活码:', code, '设备ID:', deviceId);

                // 使用正确的筛选语法，value必须是数组，并添加conjunction参数
                const requestData = {
                    page_size: 10,
                    filter: {
                        conjunction: "and", // 添加conjunction参数
                        conditions: [
                            {
                                field_name: "激活码1",
                                operator: "is",
                                value: [code]
                            }
                        ]
                    }
                };

                console.log('发送验证请求:', JSON.stringify(requestData));

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.ACTIVATION_TABLE_ID}/records/search`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: JSON.stringify(requestData),
                    onload: function(response) {
                        console.log('验证响应状态:', response.status, response.statusText);
                        console.log('验证响应原始内容:', response.responseText);

                        try {
                            if (!response.responseText) {
                                console.error('空响应');
                                resolve(false);
                                return;
                            }

                            let data;
                            try {
                                data = JSON.parse(response.responseText);
                                console.log('验证响应数据:', data);
                            } catch (e) {
                                console.error('JSON解析失败:', e, '原始响应:', response.responseText);
                                resolve(false);
                                return;
                            }

                            if (!data || data.code !== 0) {
                                console.error('API返回错误:', data);
                                resolve(false);
                                return;
                            }

                            if (!data.data || !data.data.items || data.data.items.length === 0) {
                                console.log('未找到匹配的激活码记录');
                                resolve(false);
                                return;
                            }

                            const record = data.data.items[0];
                            const fields = record.fields;
                            console.log('找到激活码记录:', fields);

                            // 验证激活码状态和过期时间
                            const now = new Date().getTime();
                            if (fields.状态 !== '正常' || (fields.过期时间 && now > fields.过期时间)) {
                                console.log('激活码状态不正常或已过期');
                                resolve(false);
                                return;
                            }

                            // 验证设备ID - 处理文本格式
                            if (fields.设备ID) {
                                const existingDeviceId = Array.isArray(fields.设备ID) ?
                                    fields.设备ID[0]?.text : fields.设备ID;

                                if (existingDeviceId && existingDeviceId !== deviceId) {
                                    console.log('设备ID不匹配:', {existing: existingDeviceId, current: deviceId});
                                    resolve(false);
                                    return;
                                }
                            }

                            // 更新记录 - 使用文本格式
                            const updatedFields = {
                                设备ID: deviceId,
                                激活时间: new Date().toISOString(),
                                状态: fields.状态 || '正常'
                            };

                            if (fields.过期时间) {
                                updatedFields.过期时间 = fields.过期时间;
                            }

                            // 使用 Promise 处理更新记录
                            updateActivationRecord(record.record_id, updatedFields)
                                .then(() => {
                                    // 保存到存储
                                    GM_setValue(ACTIVATION_KEY, 'activated');
                                    GM_setValue('activation_code', code);
                                    GM_setValue('record_id', record.record_id);

                                    if (fields.过期时间) {
                                        GM_setValue('expire_time', fields.过期时间);
                                    } else {
                                        // 如果没有过期时间，设置默认30天
                                        const expireDate = new Date();
                                        expireDate.setDate(expireDate.getDate() + VALID_DAYS);
                                        GM_setValue('expire_time', expireDate.getTime());
                                    }

                                    showActivationStatus();
                                    console.log('激活成功');
                                    resolve(true);

                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1500);
                                })
                                .catch((error) => {
                                    console.error('更新记录失败:', error);
                                    resolve(false);
                                });

                        } catch (e) {
                            console.error('处理验证响应失败:', e);
                            resolve(false);
                        }
                    },
                    onerror: function(error) {
                        console.error('验证请求失败:', error);
                        resolve(false);
                    },
                    ontimeout: function() {
                        console.error('验证请求超时');
                        resolve(false);
                    }
                });
            });
        } catch (e) {
            console.error('验证过程出错:', e);
            return false;
        }
    }

    // 更新激活记录
    async function updateActivationRecord(recordId, fields) {
        try {
            const token = await getFeishuAccessToken(FEISHU_CONFIG.APP_ID, FEISHU_CONFIG.APP_SECRET);

            // 格式化日期时间
            const formatDateTime = (dateStr) => {
                if (!dateStr) return null;
                if (typeof dateStr === 'number') return dateStr; // 如果已经是时间戳，直接返回
                const date = new Date(dateStr);
                return date.getTime(); // 转换为时间戳
            };

            // 准备更新的字段数据
            const updateFields = {};

            // 设备ID字段
            if (fields.设备ID) {
                updateFields.设备ID = fields.设备ID;
            }

            // 激活时间字段
            if (fields.激活时间) {
                updateFields.激活时间 = formatDateTime(fields.激活时间);
            }

            // 状态字段
            if (fields.状态) {
                updateFields.状态 = fields.状态;
            }

            // 过期时间字段
            if (fields.过期时间) {
                updateFields.过期时间 = formatDateTime(fields.过期时间);
            }

            console.log('更新记录请求:', {
                recordId: recordId,
                fields: updateFields
            });

            const requestData = {
                fields: updateFields
            };

            console.log('发送更新请求:', JSON.stringify(requestData));

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'PUT',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.ACTIVATION_TABLE_ID}/records/${recordId}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: JSON.stringify(requestData),
                    onload: function(response) {
                        console.log('更新记录响应状态:', response.status, response.statusText);
                        console.log('更新记录响应原始内容:', response.responseText);

                        try {
                            if (!response.responseText) {
                                console.error('更新记录时收到空响应');
                                reject(new Error('更新记录失败: 空响应'));
                                return;
                            }

                            const data = JSON.parse(response.responseText);
                            console.log('更新记录响应:', data);

                            if (data.code === 0) {
                                resolve(data);
                            } else {
                                console.error('更新记录失败:', data);
                                reject(new Error(`更新记录失败: ${data.msg || '未知错误'}`));
                            }
                        } catch (e) {
                            console.error('处理更新响应失败:', e, '原始响应:', response.responseText);
                            reject(e);
                        }
                    },
                    onerror: function(error) {
                        console.error('更新请求失败:', error);
                        reject(new Error('更新记录失败: 网络错误'));
                    },
                    ontimeout: function() {
                        console.error('更新请求超时');
                        reject(new Error('更新记录失败: 请求超时'));
                    }
                });
            });
        } catch (e) {
            console.error('更新记录过程出错:', e);
            throw e;
        }
    }

    // 创建激活对话框
    function createActivationDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'activation-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            z-index: 9999;
        `;

        const dialog = document.createElement('div');
        dialog.className = 'activation-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 24px;
            border-radius: 12px;
            width: 90%;
            max-width: 360px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
        `;

        // 使用设备ID获取函数
        const deviceId = getOrCreateDeviceId();

        dialog.innerHTML = `
            <h3 style="font-size: 17px; margin-bottom: 4px;">软件激活</h3>
            <p style="color: #999; font-size: 14px; margin: 0 0 20px;">请输入激活码以继续使用</p>
            <div class="input-container" style="margin-bottom: 12px;">
                <label style="color: #333; font-size: 14px; display: block; margin-bottom: 8px;">设备ID</label>
                <input type="text"
                       id="deviceId"
                       value="${deviceId}"
                       readonly
                       style="width: 100%;
                              padding: 12px;
                              border: 1px solid #e5e5e5;
                              border-radius: 8px;
                              font-size: 14px;
                              background: #f5f5f5;">
                <div class="tip" style="font-size: 12px; color: #999; margin-top: 4px;">
                    请复制设备ID并联系微信<span class="copyable-text" style="cursor: pointer; color: #007AFF;">(11208596)</span>获取激活码
                </div>
            </div>
            <div class="input-container" style="margin-bottom: 20px;">
                <label style="color: #333; font-size: 14px; display: block; margin-bottom: 8px;">激活码</label>
                <input type="text"
                       id="activationCode"
                       placeholder="请输入激活码"
                       style="width: 100%;
                              padding: 12px;
                              border: 1px solid #e5e5e5;
                              border-radius: 8px;
                              font-size: 14px;">
            </div>
            <div class="buttons" style="display: flex; gap: 12px;">
                <button class="cancel-btn"
                        style="flex: 1;
                               padding: 12px;
                               border: none;
                               border-radius: 8px;
                               font-size: 14px;
                               background: #f5f5f5;
                               color: #333;
                               cursor: pointer;">
                    取消
                </button>
                <button class="confirm-btn"
                        style="flex: 1;
                               padding: 12px;
                               border: none;
                               border-radius: 8px;
                               font-size: 14px;
                               background: #007AFF;
                               color: white;
                               cursor: pointer;">
                    激活
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .confirm-btn:hover {
                background: #0066DD !important;
            }

            .cancel-btn:hover {
                background: #eee !important;
            }

            .confirm-btn:active {
                transform: scale(0.98);
            }

            .cancel-btn:active {
                transform: scale(0.98);
            }

            .floating-tip {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                padding: 12px 20px;
                border-radius: 10px;
                color: white;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
                display: flex;
                align-items: center;
                gap: 8px;
                pointer-events: none;
            }

            .floating-tip.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }

            .floating-tip .icon {
                width: 18px;
                height: 18px;
                background: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                color: #000;
            }
        `;
        document.head.appendChild(style);

        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        const activationInput = dialog.querySelector('#activationCode');
        const deviceIdInput = dialog.querySelector('#deviceId');
        const wechatElement = dialog.querySelector('.copyable-text');

        // 复制设备ID功能
        deviceIdInput.addEventListener('click', () => {
            deviceIdInput.select();
            document.execCommand('copy');
            showFloatingTip('设备ID已复制到剪贴板');
        });

        // 添加复制微信号功能
        wechatElement.addEventListener('click', () => {
            const tempInput = document.createElement('input');
            tempInput.value = '11208596';
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showFloatingTip('微信号已复制到剪贴板');
        });

        function closeDialog() {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        }

        confirmBtn.addEventListener('click', async () => {
            const code = activationInput.value.trim();
            if (!code) {
                showFloatingTip('请输入激活码');
                return;
            }

            confirmBtn.disabled = true;
            confirmBtn.textContent = '验证中...';
            confirmBtn.style.opacity = '0.7';

            try {
                const result = await verifyActivationCode(deviceId, code);
                if (result) {
                    showFloatingTip('激活成功');
                    setTimeout(() => {
                        closeDialog();
                        window.location.reload();
                    }, 1500);
                } else {
                    showFloatingTip('激活失败，请联系作者11208596');
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = '激活';
                    confirmBtn.style.opacity = '1';
                }
            } catch (e) {
                console.error('验证过程出错:', e);
                showFloatingTip('验证出错，请联系作者11208596');
                confirmBtn.disabled = false;
                confirmBtn.textContent = '激活';
                confirmBtn.style.opacity = '1';
            }
        });

        cancelBtn.addEventListener('click', closeDialog);

        // 聚焦到激活码输入框
        setTimeout(() => activationInput.focus(), 50);
    }

    // 显示激活状态
    function showActivationStatus() {
        const activationStatus = GM_getValue(ACTIVATION_KEY);
        const expireTime = GM_getValue('expire_time');
        const deviceId = GM_getValue(DEVICE_ID_KEY);
        const remainingTime = GM_getValue('remaining_time') || '未知';

        // 创建或获取状态显示面板
        let statusPanel = document.getElementById('activation-status-panel');
        if (!statusPanel) {
            statusPanel = document.createElement('div');
            statusPanel.id = 'activation-status-panel';
            statusPanel.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                padding: 12px 16px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-size: 13px;
                z-index: 9999;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
            `;
            document.body.appendChild(statusPanel);
        }

        // 更新状态显示
        if (activationStatus === 'activated' && expireTime) {
            const now = new Date();
            const expire = new Date(expireTime);

            if (now > expire) {
                clearActivationInfo();
                statusPanel.innerHTML = `
                    <div style="color: #ff3b30;">激活已过期，请重新激活</div>
                    <div style="color: #666; margin-top: 4px; font-size: 12px;">
                        设备ID: <span class="copyable-device-id">${deviceId || '未知'}</span>
                    </div>
                    <div style="color: #666; margin-top: 4px; font-size: 12px;">
                        联系微信: <span class="copyable-wechat">11208596</span>
                    </div>
                `;
                return;
            }

            statusPanel.innerHTML = `
                <div style="color: #00c853;">✓ 已激活</div>
                <div style="color: #666; margin-top: 4px;">
                    剩余 ${remainingTime} 天
                </div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    设备ID: <span class="copyable-device-id">${deviceId || '未知'}</span>
                </div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    联系微信: <span class="copyable-wechat">11208596</span>
                </div>
            `;
        } else {
            statusPanel.innerHTML = `
                <div style="color: #ff3b30;">未激活</div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    设备ID: <span class="copyable-device-id">${deviceId || '未知'}</span>
                </div>
                <div style="color: #666; margin-top: 4px; font-size: 12px;">
                    联系微信: <span class="copyable-wechat">11208596</span>
                </div>
                <div style="margin-top: 8px;">
                    <button id="activate-now-btn" style="
                        padding: 6px 12px;
                        background: #007AFF;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                    ">立即激活</button>
                </div>
            `;

            // 添加激活按钮点击事件
            setTimeout(() => {
                const activateBtn = document.getElementById('activate-now-btn');
                if (activateBtn) {
                    activateBtn.addEventListener('click', createActivationDialog);
                }
            }, 0);
        }

        // 添加点击复制设备ID的功能
        const deviceIdElement = statusPanel.querySelector('.copyable-device-id');
        if (deviceIdElement) {
            deviceIdElement.style.cursor = 'pointer';
            deviceIdElement.style.color = '#007AFF';
            deviceIdElement.addEventListener('click', function() {
                const tempInput = document.createElement('input');
                tempInput.value = deviceId;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showFloatingTip('设备ID已复制到剪贴板');
            });
        }

        // 添加点击复制微信号的功能
        const wechatElement = statusPanel.querySelector('.copyable-wechat');
        if (wechatElement) {
            wechatElement.style.cursor = 'pointer';
            wechatElement.style.color = '#007AFF';
            wechatElement.addEventListener('click', function() {
                const tempInput = document.createElement('input');
                tempInput.value = '11208596';
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showFloatingTip('微信号已复制到剪贴板');
            });
        }
    }

    // 初始化
    setTimeout(() => {
        // 在初始化前先检查激活状态
        getOrCreateDeviceId(); // 确保设备ID已创建

        init();

        // 如果未激活，显示激活状态面板
        if (!GM_getValue(ACTIVATION_KEY)) {
            showActivationStatus();
        }
    }, 1000);

    listenUrlChange();
})();