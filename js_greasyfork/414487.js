// ==UserScript==
// @name         我就是积极分子（2025/10/5更新）
// @namespace    laoxin.top
// @version      2.5.1
// @description  党旗飘飘学习平台刷课工具（2025/10/5更新），支持所有网站，可自定义视频播放网站(默认已添加西南石油大学,华北理工大学)
// @author       老新
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @icon         http://www.gov.cn/ztzl/17da/183d03632724084a01bb02.jpg

// @downloadURL https://update.greasyfork.org/scripts/414487/%E6%88%91%E5%B0%B1%E6%98%AF%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90%EF%BC%882025105%E6%9B%B4%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/414487/%E6%88%91%E5%B0%B1%E6%98%AF%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90%EF%BC%882025105%E6%9B%B4%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==

// let settings = {
//         // 1表示开启,0表示关闭
//         // 视频播放相关
//         video: 1, // 视频弹窗自动关闭,默认开启
//         jump: 1, // 自动切换下一个视频任务点,默认开启(需要开启视频弹窗自动关闭)
//         back: 1, // 視頻播放完成自動回到章節列表,默认关闭(需要开启自动切换到下一个任务点)
//         class: 1, // 自动切换到未播放的章节,默认开启(需要开启視頻播放完成自動回到章節列表)
//         // 章节测试及综合测试
//         copy: 1, // 允许右键复制,开启右键菜单
//         answer: 1, // 显示“查答案”按钮（网络题库不保证准确性）
//         // 期末测试
//         test: 1 // 期末测试允许复制，未验证！！！
//     },
// // 从存储中加载设置，如果没有则使用默认值
let defaultSettings = {
    // 1表示开启,0表示关闭
    // 视频播放相关
    video: 1, // 视频弹窗自动关闭,默认开启
    jump: 1, // 自动切换下一个视频任务点,默认开启(需要开启视频弹窗自动关闭)
    back: 1, // 視頻播放完成自動回到章節列表,默认关闭(需要开启自动切换到下一个任务点)
    class: 1, // 自动切换到未播放的章节,默认开启(需要开启視頻播放完成自動回到章節列表)
    autoPage: 1, // 自动翻页,默认开启
    autoLesson: 1, // 自动切换章节,默认开启
    // 章节测试及综合测试
    copy: 1, // 允许右键复制,开启右键菜单
    answer: 1, // 显示"查答案"按钮（网络题库不保证准确性）
    // 期末测试
    test: 1 // 期末测试允许复制，未验证！！！
};

let settings = GM_getValue("script_settings", defaultSettings);

// 默认支持的网站列表
let defaultSites = [
    'rdjy.swpu.edu.cn',
    'ncst.dangqipiaopiao.com',
    
];

// 获取用户配置的网站列表
let enabledSites = GM_getValue("enabled_sites", defaultSites);

// 检查当前网站是否在启用列表中
function isCurrentSiteEnabled() {
    const currentHost = window.location.hostname;
    return enabledSites.some(site => currentHost.includes(site));
}

// 添加当前网站到启用列表
function addCurrentSite() {
    const currentHost = window.location.hostname;
    if (!enabledSites.includes(currentHost)) {
        enabledSites.push(currentHost);
        GM_setValue("enabled_sites", enabledSites);
        addLog(`已添加网站: ${currentHost}`, 'success');
        return true;
    }
    addLog(`网站已存在: ${currentHost}`, 'info');
    return false;
}

// 从启用列表移除网站
function removeSite(site) {
    const index = enabledSites.indexOf(site);
    if (index > -1) {
        enabledSites.splice(index, 1);
        GM_setValue("enabled_sites", enabledSites);
        addLog(`已移除网站: ${site}`, 'success');
        return true;
    }
    return false;
}

let
    _self = unsafeWindow,
    url = location.pathname,
    classLists = [],
    videoLists = [];

let $$ = top.jQuery;

// 日志系统
let logMessages = [];
const MAX_LOGS = 100;

function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const log = { time: timestamp, message, type };
    logMessages.unshift(log);
    if (logMessages.length > MAX_LOGS) {
        logMessages.pop();
    }
    updateLogDisplay();
    console.log(`[${timestamp}] ${message}`);
}

function updateLogDisplay() {
    const logContainer = $$('#script-log-content');
    if (logContainer.length > 0) {
        let html = '';
        logMessages.forEach(log => {
            const colorClass = log.type === 'error' ? 'log-error' : log.type === 'success' ? 'log-success' : 'log-info';
            html += `<div class="log-item ${colorClass}">[${log.time}] ${log.message}</div>`;
        });
        logContainer.html(html || '<div class="log-item">暂无日志</div>');
    }
}

// 保存设置
function saveSettings() {
    GM_setValue("script_settings", settings);
    addLog('设置已保存', 'success');
}

// 创建设置面板UI
function createSettingsPanel() {
    const panelHTML = `
        <div id="script-settings-panel" style="display: none;">
            <div id="script-panel-header">
                <span>⚙️ 我就是积极分子</span>
                <div class="header-buttons">
                    <button id="minimize-btn" title="最小化">−</button>
                    <button id="close-btn" title="关闭">×</button>
                </div>
            </div>
            <div id="script-panel-content">
                <div class="settings-tabs">
                    <button class="tab-btn active" data-tab="settings">设置</button>
                    <button class="tab-btn" data-tab="sites">网站管理</button>
                    <button class="tab-btn" data-tab="logs">日志</button>
                </div>
                
                <div id="settings-tab" class="tab-content active">
                    <div class="donation-banner">
                        <h3>💝 支持作者</h3>
                        <p class="donation-text">如果这个脚本帮助到您，欢迎请作者喝杯咖啡☕</p>
                        <div class="qrcode-container">
                            <img src="https://image.modwu.com/file/upload/1759600465594_9qlvt2qln59rbh7nr7b9zfstabjr.jpg" alt="捐赠收款码" class="donation-qrcode">
                            <p class="qrcode-tip">扫码支持作者 🙏</p>
                        </div>
                        <p class="thank-you">感谢您的慷慨支持！❤️</p>
                    </div>
                    
                    <div class="settings-group">
                        <h3>🎬 视频播放设置</h3>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-video" ${settings.video ? 'checked' : ''}>
                            <span>视频弹窗自动关闭</span>
                            <small>自动关闭视频播放过程中的弹窗提示</small>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-jump" ${settings.jump ? 'checked' : ''}>
                            <span>自动切换下一个视频</span>
                            <small>当前视频播放完毕后自动播放下一个(需要开启视频弹窗自动关闭)</small>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-back" ${settings.back ? 'checked' : ''}>
                            <span>视频完成后返回章节列表</span>
                            <small>所有视频播放完成后自动返回(需要开启自动切换到下一个任务点)</small>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-class" ${settings.class ? 'checked' : ''}>
                            <span>自动切换未播放章节</span>
                            <small>自动选择并播放未完成的章节(需要开启视频播放完成自动返回章节列表)</small>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-autoPage" ${settings.autoPage ? 'checked' : ''}>
                            <span>自动翻页</span>
                            <small>当前页所有课程完成后自动翻到下一页</small>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-autoLesson" ${settings.autoLesson ? 'checked' : ''}>
                            <span>自动切换章节</span>
                            <small>在课程页面自动检测并进入未完成的章节</small>
                        </label>
                    </div>
                    
                    <div class="settings-group">
                        <h3>📝 测试答题设置</h3>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-copy" ${settings.copy ? 'checked' : ''}>
                            <span>允许右键复制</span>
                            <small>解除页面复制限制</small>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-answer" ${settings.answer ? 'checked' : ''}>
                            <span>显示查答案按钮</span>
                            <small>在答题页面显示"查答案"按钮</small>
                        </label>
                        <label class="setting-item">
                            <input type="checkbox" id="setting-test" ${settings.test ? 'checked' : ''}>
                            <span>期末测试允许复制</span>
                            <small>期末考试页面解除复制限制</small>
                        </label>
                    </div>
                    
                    <div class="settings-buttons">
                        <button id="save-settings-btn" class="primary-btn">💾 保存设置</button>
                        <button id="reset-settings-btn" class="secondary-btn">🔄 恢复默认</button>
                    </div>
                </div>
                
                <div id="sites-tab" class="tab-content">
                    <div class="sites-header">
                        <h3>🌐 网站管理</h3>
                        <p class="sites-tip">当前网站: <strong id="current-site-display"></strong></p>
                        <button id="add-current-site-btn" class="primary-btn">➕ 添加当前网站</button>
                    </div>
                    <div class="sites-list-container">
                        <h4>已启用的网站列表:</h4>
                        <div id="sites-list"></div>
                    </div>
                </div>
                
                <div id="logs-tab" class="tab-content">
                    <div class="log-header">
                        <span>📋 运行日志 (最近${MAX_LOGS}条)</span>
                        <button id="clear-logs-btn" class="small-btn">清空日志</button>
                    </div>
                    <div id="script-log-content"></div>
                </div>
            </div>
        </div>
        
        <div id="script-float-btn" title="打开脚本设置">⚙️</div>
    `;
    
    const styleHTML = `
        <style id="script-custom-styles">
            #script-float-btn {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                z-index: 99999;
                transition: all 0.3s ease;
                user-select: none;
            }
            
            #script-float-btn:hover {
                transform: scale(1.1) rotate(90deg);
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
            }
            
            #script-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                max-height: 80vh;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 100000;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            }
            
            #script-settings-panel.minimized #script-panel-content {
                display: none;
            }
            
            #script-settings-panel.minimized {
                width: 300px;
                height: auto;
            }
            
            #script-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                font-size: 16px;
            }
            
            .header-buttons button {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 18px;
                margin-left: 5px;
                transition: background 0.3s;
            }
            
            .header-buttons button:hover {
                background: rgba(255,255,255,0.3);
            }
            
            #script-panel-content {
                max-height: calc(80vh - 60px);
                overflow-y: auto;
            }
            
            .settings-tabs {
                display: flex;
                background: #f5f5f5;
                border-bottom: 2px solid #e0e0e0;
            }
            
            .tab-btn {
                flex: 1;
                padding: 12px;
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #666;
                transition: all 0.3s;
            }
            
            .tab-btn.active {
                background: white;
                color: #667eea;
                border-bottom: 3px solid #667eea;
            }
            
            .tab-btn:hover {
                background: rgba(102, 126, 234, 0.1);
            }
            
            .tab-content {
                display: none;
                padding: 20px;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .settings-group {
                margin-bottom: 25px;
            }
            
            .settings-group h3 {
                font-size: 16px;
                color: #333;
                margin: 0 0 15px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .setting-item {
                display: flex;
                align-items: flex-start;
                padding: 12px;
                margin-bottom: 8px;
                background: #f9f9f9;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.3s;
                flex-direction: column;
            }
            
            .setting-item:hover {
                background: #f0f0f0;
            }
            
            .setting-item input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                margin-right: 10px;
            }
            
            .setting-item > span {
                display: flex;
                align-items: center;
                font-weight: 500;
                color: #333;
                margin-bottom: 4px;
            }
            
            .setting-item input[type="checkbox"] {
                margin-right: 8px;
            }
            
            .setting-item small {
                color: #888;
                font-size: 12px;
                margin-left: 26px;
            }
            
            .settings-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
            }
            
            .primary-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s;
            }
            
            .primary-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }
            
            .secondary-btn, .small-btn {
                background: #f0f0f0;
                color: #666;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s;
            }
            
            .small-btn {
                padding: 6px 15px;
                font-size: 12px;
            }
            
            .secondary-btn:hover, .small-btn:hover {
                background: #e0e0e0;
            }
            
            .donation-banner {
                background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(252, 182, 159, 0.3);
                border: 2px solid rgba(252, 182, 159, 0.5);
            }
            
            .donation-banner h3 {
                font-size: 20px;
                color: #d35400;
                margin: 0 0 10px 0;
                font-weight: bold;
            }
            
            .donation-text {
                color: #e74c3c;
                font-size: 14px;
                margin: 10px 0;
                font-weight: 500;
            }
            
            .qrcode-container {
                margin: 15px 0;
                display: inline-block;
                background: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .donation-qrcode {
                max-width: 200px;
                height: auto;
                border-radius: 8px;
                display: block;
            }
            
            .qrcode-tip {
                margin: 10px 0 0 0;
                font-size: 13px;
                color: #555;
                font-weight: 500;
            }
            
            .thank-you {
                color: #c0392b;
                font-size: 15px;
                margin: 10px 0 0 0;
                font-weight: bold;
                animation: heartbeat 1.5s ease-in-out infinite;
            }
            
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .log-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #f0f0f0;
                font-weight: bold;
                color: #333;
            }
            
            #script-log-content {
                background: #f9f9f9;
                border-radius: 8px;
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                font-size: 12px;
            }
            
            .log-item {
                padding: 8px;
                margin-bottom: 5px;
                border-left: 3px solid #ddd;
                background: white;
                border-radius: 4px;
            }
            
            .log-info {
                border-left-color: #667eea;
            }
            
            .log-success {
                border-left-color: #51cf66;
                color: #2b8a3e;
            }
            
            .log-error {
                border-left-color: #ff6b6b;
                color: #c92a2a;
            }
            
            #script-log-content::-webkit-scrollbar,
            #script-panel-content::-webkit-scrollbar {
                width: 8px;
            }
            
            #script-log-content::-webkit-scrollbar-track,
            #script-panel-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }
            
            #script-log-content::-webkit-scrollbar-thumb,
            #script-panel-content::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            
            #script-log-content::-webkit-scrollbar-thumb:hover,
            #script-panel-content::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            
            .sites-header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .sites-header h3 {
                font-size: 18px;
                color: #333;
                margin: 0 0 10px 0;
            }
            
            .sites-tip {
                color: #666;
                font-size: 14px;
                margin: 10px 0;
            }
            
            #current-site-display {
                color: #667eea;
                font-weight: bold;
            }
            
            #add-current-site-btn {
                margin-top: 10px;
            }
            
            .sites-list-container {
                margin-top: 20px;
            }
            
            .sites-list-container h4 {
                font-size: 14px;
                color: #333;
                margin: 0 0 10px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            #sites-list {
                background: #f9f9f9;
                border-radius: 8px;
                padding: 10px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .site-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                margin-bottom: 8px;
                background: white;
                border-radius: 6px;
                border-left: 3px solid #667eea;
                transition: all 0.3s;
            }
            
            .site-item:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transform: translateX(5px);
            }
            
            .site-item.default {
                border-left-color: #51cf66;
            }
            
            .site-name {
                font-weight: 500;
                color: #333;
                flex: 1;
            }
            
            .site-badge {
                font-size: 11px;
                padding: 3px 8px;
                border-radius: 4px;
                background: #51cf66;
                color: white;
                margin-left: 10px;
            }
            
            .remove-site-btn {
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 5px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s;
            }
            
            .remove-site-btn:hover {
                background: #ff5252;
                transform: scale(1.05);
            }
            
            .remove-site-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        </style>
    `;
    
    $$('body').append(styleHTML + panelHTML);
    
    // 绑定事件
    bindPanelEvents();
    
    addLog('脚本已启动，设置面板已加载', 'success');
}

// 绑定面板事件
function bindPanelEvents() {
    // 悬浮按钮点击
    $$('#script-float-btn').on('click', function() {
        $$('#script-settings-panel').fadeIn(200);
        updateLogDisplay();
        updateSitesDisplay();
    });
    
    // 关闭按钮
    $$('#close-btn').on('click', function() {
        $$('#script-settings-panel').fadeOut(200);
    });
    
    // 最小化按钮
    $$('#minimize-btn').on('click', function() {
        $$('#script-settings-panel').toggleClass('minimized');
    });
    
    // 标签页切换
    $$('.tab-btn').on('click', function() {
        const tab = $$(this).data('tab');
        $$('.tab-btn').removeClass('active');
        $$(this).addClass('active');
        $$('.tab-content').removeClass('active');
        $$('#' + tab + '-tab').addClass('active');
        
        // 切换到网站管理时更新显示
        if (tab === 'sites') {
            updateSitesDisplay();
        }
    });
    
    // 添加当前网站
    $$('#add-current-site-btn').on('click', function() {
        if (addCurrentSite()) {
            updateSitesDisplay();
            alert('当前网站已添加！页面将刷新以应用新设置。');
            location.reload();
        } else {
            alert('当前网站已经在启用列表中！');
        }
    });
    
    // 保存设置
    $$('#save-settings-btn').on('click', function() {
        settings.video = $$('#setting-video').is(':checked') ? 1 : 0;
        settings.jump = $$('#setting-jump').is(':checked') ? 1 : 0;
        settings.back = $$('#setting-back').is(':checked') ? 1 : 0;
        settings.class = $$('#setting-class').is(':checked') ? 1 : 0;
        settings.autoPage = $$('#setting-autoPage').is(':checked') ? 1 : 0;
        settings.autoLesson = $$('#setting-autoLesson').is(':checked') ? 1 : 0;
        settings.copy = $$('#setting-copy').is(':checked') ? 1 : 0;
        settings.answer = $$('#setting-answer').is(':checked') ? 1 : 0;
        settings.test = $$('#setting-test').is(':checked') ? 1 : 0;
        saveSettings();
        alert('设置已保存！页面将刷新以应用新设置。');
        location.reload();
    });
    
    // 恢复默认设置
    $$('#reset-settings-btn').on('click', function() {
        if (confirm('确定要恢复默认设置吗？')) {
            settings = Object.assign({}, defaultSettings);
            saveSettings();
            addLog('已恢复默认设置', 'success');
            alert('已恢复默认设置！页面将刷新。');
            location.reload();
        }
    });
    
    // 清空日志
    $$('#clear-logs-btn').on('click', function() {
        logMessages = [];
        updateLogDisplay();
        addLog('日志已清空', 'info');
    });
    
    // 拖动面板
    makeDraggable();
}

// 更新网站列表显示
function updateSitesDisplay() {
    // 显示当前网站
    $$('#current-site-display').text(window.location.hostname);
    
    const sitesListContainer = $$('#sites-list');
    if (sitesListContainer.length === 0) return;
    
    let html = '';
    if (enabledSites.length === 0) {
        html = '<div class="site-item"><span class="site-name">暂无启用的网站</span></div>';
    } else {
        enabledSites.forEach((site, index) => {
            const isDefault = defaultSites.includes(site);
            const badgeHtml = isDefault ? '<span class="site-badge">默认</span>' : '';
            const disabledAttr = isDefault ? 'disabled' : '';
            html += `
                <div class="site-item ${isDefault ? 'default' : ''}">
                    <span class="site-name">${site}</span>
                    ${badgeHtml}
                    <button class="remove-site-btn" data-site="${site}" ${disabledAttr}>移除</button>
                </div>
            `;
        });
    }
    
    sitesListContainer.html(html);
    
    // 绑定移除按钮事件
    $$('.remove-site-btn').on('click', function() {
        const site = $$(this).data('site');
        if (confirm(`确定要移除网站 "${site}" 吗？`)) {
            if (removeSite(site)) {
                updateSitesDisplay();
                alert('网站已移除！页面将刷新以应用新设置。');
                location.reload();
            }
        }
    });
}

// 使面板可拖动
function makeDraggable() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    const panel = document.getElementById('script-settings-panel');
    const header = document.getElementById('script-panel-header');
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target.tagName === 'BUTTON') return;
        initialX = e.clientX - (parseInt(window.getComputedStyle(panel).left) || 0);
        initialY = e.clientY - (parseInt(window.getComputedStyle(panel).top) || 0);
        isDragging = true;
        panel.style.transform = 'none';
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
        }
    }
    
    function dragEnd() {
        isDragging = false;
    }
}

// 页面加载完成后创建设置面板
$$(document).ready(function() {
    createSettingsPanel();
    
    // 如果当前网站未启用，只显示设置面板，不执行其他功能
    if (!isCurrentSiteEnabled()) {
        addLog(`当前网站(${window.location.hostname})未启用脚本功能，请在"网站管理"中添加`, 'info');
        return;
    }
    
    addLog(`当前网站(${window.location.hostname})已启用脚本功能`, 'success');
});

// 处理 /jjfz/lesson 主页面，自动选择未完成的章节
if (url == "/jjfz/lesson" && settings.autoLesson && isCurrentSiteEnabled()) {
    addLog('进入课程主页，开始检测未完成章节', 'info');
    
    if (GM_getValue("dont_note")) {
        let checkInterval = setInterval(() => {
            // 查找所有章节
            const lessonItems = $$('.lesson_c_ul li');
            
            if (lessonItems.length > 0) {
                addLog(`检测到 ${lessonItems.length} 个章节`, 'info');
                
                // 查找第一个未完成的章节
                let foundIncomplete = false;
                
                lessonItems.each((index, item) => {
                    if (foundIncomplete) return false; // 如果已找到，跳出循环
                    
                    const $item = $$(item);
                    const lessonTitle = $item.find('.lesson_ul_title h2').text().trim();
                    
                    // 获取必读课件数和已完成数
                    const dlItems = $item.find('.lesson_center_dl dd');
                    if (dlItems.length >= 2) {
                        const totalText = dlItems.eq(0).text(); // "必读课件：7"
                        const completedText = dlItems.eq(1).text(); // "已完成必读课件：0"
                        
                        const totalMatch = totalText.match(/(\d+)/);
                        const completedMatch = completedText.match(/(\d+)/);
                        
                        if (totalMatch && completedMatch) {
                            const total = parseInt(totalMatch[1]);
                            const completed = parseInt(completedMatch[1]);
                            
                            addLog(`${lessonTitle}: ${completed}/${total} 已完成`, 'info');
                            
                            // 如果有必读课件且未完成
                            if (total > 0 && completed < total) {
                                const studyBtn = $item.find('.lesson_center_a a.study');
                                const studyUrl = studyBtn.attr('url');
                                
                                if (studyUrl) {
                                    addLog(`发现未完成章节: ${lessonTitle}，准备开始学习`, 'success');
                                    foundIncomplete = true;
                                    clearInterval(checkInterval);
                                    
                                    // 延迟1秒后跳转
                                    setTimeout(() => {
                                        addLog(`正在进入章节: ${lessonTitle}`, 'info');
                                        window.location.href = studyUrl;
                                    }, 1000);
                                    
                                    return false; // 跳出循环
                                }
                            }
                        }
                    }
                });
                
                // 如果没有找到未完成的章节
                if (!foundIncomplete) {
                    addLog('所有章节均已完成！🎉', 'success');
                    clearInterval(checkInterval);
                }
            }
        }, 1000);
    } else {
        video_note();
    }
}

//console.log(url)
if (url == "/jjfz/lesson/video" && settings.class && isCurrentSiteEnabled()) {
    //console.log("测试")
    addLog('进入章节列表页面，开始检测课程', 'info');

    if (GM_getValue("dont_note")) {
        let passNum = 0;
        let cl = setInterval(() => {
            getClassList();
            passNum = $$(".lesson_pass").length;
            console.log(passNum)
            if (classLists.length) {
                addLog(`检测到课程列表，已完成: ${passNum}/${classLists.length}`, 'info');
                
                // 检查当前页所有课程是否都已完成
                if (passNum >= classLists.length && settings.autoPage) {
                    addLog('当前页所有课程已完成，检查是否需要翻页', 'info');
                    clearInterval(cl);
                    
                    // 当前页全部完成，尝试翻到下一页
                    if (!goToNextPage()) {
                        // 没有下一页了，检查是否只有单页
                        const currentPageBtn = $$('.pages a.page_btn');
                        if (currentPageBtn.length === 0) {
                            // 单页且全部完成，直接返回主页
                            addLog('单页课程全部完成！准备返回课程列表主页...', 'success');
                            setTimeout(() => {
                                addLog('正在返回课程列表主页 /jjfz/lesson', 'info');
                                window.location.href = '/jjfz/lesson';
                            }, 2000);
                        }
                    }
                    return;
                }
                
                jumpToVideoFromClass(passNum)
            }
            if (classLists.length) clearInterval(cl);
        }, 1000);
    } else {
        video_note();
    }
}

if (url.indexOf("play") != -1&& settings.video && isCurrentSiteEnabled()) {
    addLog('进入视频播放页面', 'info');
    playVideo();
    let nextVideoFlag = false,
        nextClassFlag = false;
    console.log("这是视频播放方法")
    let vp = setInterval(() => {
        if (!videoLists.length) {
            getVideoList();
        }
        nextVideoFlag = closeAlert();
        if (settings.jump) {
            nextClassFlag = jumpToVideo(videoLists);
            if (nextVideoFlag) nextClassFlag = nextVideo(videoLists);
        }
        if (settings.back) {
            if (nextClassFlag) goBack();
        }
    }, 1000)
}

if (url == "/jjfz/lesson/exam" && isCurrentSiteEnabled()) {
    addLog('进入章节测试页面', 'info');
    if (settings.copy) {
        openCopy();
        test_note();
        addLog('已开启复制功能', 'success');
    }

    if (settings.answer) {
        addLog('答案查询功能已启用', 'success');
        let ga = setInterval(() => {
            if ($$("#get_answer").length == 0) {
                $$("#next_question").after("<a href=\"javascript:void(0);\" id=\"get_answer\" data-val=\"2\">查答案</a>");
                $$("#next_question").after("<span> &nbsp; &nbsp; &nbsp; &nbsp;</span>");
                $$("#get_answer").click(function () {
                    getAnswer();
                })
            }
        }, 250)
    }
}

if (url == "/jjfz/exam_center/end_exam" && isCurrentSiteEnabled()) {
    addLog('进入期末考试页面', 'info');
    if (settings.copy) {
        openCopy();
        test_note();
        addLog('已开启复制功能', 'success');
    }
    if (settings.answer) {
        addLog('答案查询功能已启用', 'success');
        let ga = setInterval(() => {
            if ($$("#get_answer").length == 0) {
                $$("#next_question").after("<a href=\"javascript:void(0);\" id=\"get_answer\" data-val=\"2\">查答案</a>");
                $$("#next_question").after("<span> &nbsp; &nbsp; &nbsp; &nbsp;</span>");
                $$("#get_answer").click(function () {
                    getAnswer();
                })
            }
        }, 250)
    }
}
if (/\/exam\//.test(url) && isCurrentSiteEnabled()) {
    addLog('进入考试页面', 'info');
    openCopy();
    if (GM_getValue("exam_note")) {
    } else {
        exam_note();
    }
}
settings.type = {
    '单选题': "单选题",
    '多选题': '多选题',
    '填空题': '填空题',
    '问答题': '问答题',
    '分析题/解答题/计算题/证明题': 5,
    '阅读理解（选择）/完型填空': 9,
    '判断题': '判断题'
};

function getClassList() {
    let classList = []
    if ($$(".l_list_right")) {
        $$(".l_list_right").each((ind, ele) => {
            if ($$(ele).find("div .r_read").text() == " 必 修 ") {
                classList.push($$(ele).find("h2 a"))
            }
        })
    }
    classLists = classList;
}

function getVideoList() {
    if ($$(".video_lists li").length) {
        console.log("当前视频" + $$(".video_red1").text())
        addLog(`当前视频: ${$$(".video_red1").text()}`, 'info');
        videoLists = $$(".video_lists li");
    }
}

function jumpToVideoFromClass(passNum) {
    if (passNum != classLists.length) {
        addLog(`正在跳转到第 ${passNum + 1} 个章节`, 'info');
        $$(classLists[passNum]).attr('id', 'aRemoveAllTxt');
        document.getElementById("aRemoveAllTxt").click();
    } else {
        addLog('所有章节已完成！', 'success');
    }
}

// 自动翻页功能
function goToNextPage() {
    // 获取当前页码按钮（带class="page_btn"的是当前页）
    const currentPageBtn = $$('.pages a.page_btn');
    
    if (currentPageBtn.length === 0) {
        addLog('未找到分页信息，可能是单页或页面结构变化', 'info');
        return false;
    }
    
    // 查找"下一页"按钮
    const nextPageLink = $$('.pages a:contains("下一页")');
    
    if (nextPageLink.length > 0 && nextPageLink.attr('href')) {
        const nextPageHref = nextPageLink.attr('href');
        addLog(`正在翻到下一页: ${nextPageHref}`, 'info');
        
        // 使用临时元素点击跳转
        nextPageLink.attr('id', 'aRemoveAllTxt');
        document.getElementById("aRemoveAllTxt").click();
        return true;
    } else {
        // 没有"下一页"按钮，说明已经是最后一页，所有课程已完成
        addLog('已到达最后一页，所有课程已完成！准备返回课程列表主页...', 'success');
        
        // 延迟2秒后返回主页，让用户看到提示
        setTimeout(() => {
            addLog('正在返回课程列表主页 /jjfz/lesson', 'info');
            window.location.href = '/jjfz/lesson';
        }, 2000);
        
        return false;
    }
}


function closeAlert() {
    //console.log("测试")
    if ($$(".public_submit").length) {
        //console.log("视频数量" + $$(".video_lists li"))
        let text = $$(".public_text").text();
        if (text.indexOf("当前视频播放完毕") >= 0) {
            addLog('视频播放完毕', 'success');
            return true;
        } else if (text.indexOf("该课程视频你上次观看到") >= 0) {
            addLog('检测到继续播放提示，自动取消', 'info');
            $$(".public_cancel").attr('id', 'aRemoveAllTxt');
            document.getElementById("aRemoveAllTxt").click();
            return false;
        } else {
            addLog('自动关闭弹窗', 'info');
            $$(".public_submit").attr('id', 'aRemoveAllTxt');
            document.getElementById("aRemoveAllTxt").click();
            return false;
        }
    }
}

function nextVideo(videoList) {
    let index = $$(videoList).index($$(".video_red1"));
    if (videoList[index + 1]) {
        addLog(`切换到下一个视频 (${index + 2}/${videoList.length})`, 'info');
        $$(videoList[index + 1]).children("a").attr('id', 'aRemoveAllTxt');
        document.getElementById("aRemoveAllTxt").click();
        return false;
    } else {
        addLog('当前章节所有视频已播放完毕', 'success');
        return true;
    }
}

function jumpToVideo(videoList) {
    if ($$(".video_red1").find("a").attr("style") == "width:70%;color:red") {
        let index = $$(videoList).index($$(".video_red1"));
        if (videoList[index + 1]) {
            addLog(`跳过已完成的视频，切换到第 ${index + 2} 个`, 'info');
            $$(videoList[index + 1]).children("a").attr('id', 'aRemoveAllTxt');
            document.getElementById("aRemoveAllTxt").click();
        } else {
            return true;
        }
    }
}

function goBack() {
    addLog('返回章节列表', 'info');
    $$(".video_goback").attr('id', 'aRemoveAllTxt');
    document.getElementById("aRemoveAllTxt").click();
}

function playVideo() {
    _self.studyTime = function () {
        var diff_time = 5000;
        $.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            url: "/jjfz/lesson/study_time",
            data: {
                rid: "630089",
                study_time: diff_time,
                _xsrf: $(":input[name='_xsrf']").val()
            },
            success: function () {
            }
        });
        flag = setTimeout("studyTime()", diff_time);
    }
    _self.player.on('pause', function (event) {
        if ($$(".public_submit").length) {
        } else _self.player.play();
    });
}

function getAnswer() {

    let question = $$(".exam_h2").text(),
        type = String(settings.type[$$(".e_cont_title span").text()]);
    let postData = {
        question: filterImg($$(".exam_h2"), this).replace(/^（\S*）/, '').replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/[(]\s*[)]。$/, '').replace(/（\s*）。$/, '').replace(/[(]\s*[)]$/, '').replace(/（\s*）$/, ''),
        option: "政治",
        type: Boolean(type) ? type : 10
    }

    addLog(`正在查询答案: ${postData.question.substring(0, 30)}...`, 'info');
    console.log(postData.question);
    console.log(postData.type);



    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://api.902000.xyz:88/wkapi.php',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: 'q=' +encodeURIComponent(postData.question) + '&type=' + postData.type,
        timeout: 5000,
        onload: function (xhr) {

            //console.log(xhr)
            if (xhr.status == 200) {
                let obj = $$.parseJSON(xhr.responseText) || {};
                //return obj.answer;
                let answer = obj.answer;

                if (answer && answer !== "网络题库目前没有答案哦，推荐使用学小易或百度查询！（搜不出来可以多点几次，后台会在百度搜索答案）") {
                    addLog(`查询到答案: ${answer.substring(0, 50)}...`, 'success');
                } else {
                    addLog('题库中未找到答案', 'info');
                }

                if ($$(".e_cont_title").find("span").text() == "判断题") {
                    if (answer != "网络题库目前没有答案哦，推荐使用学小易或百度查询！（搜不出来可以多点几次，后台会在百度搜索答案）" & answer.indexOf("无答案") == -1) {
                        if (question.indexOf(answer) != -1) {
                            answer = "提示：" + answer + "——可根据提示自行判断正误！"
                        } else {
                            answer = "提示：" + answer + "——可根据提示自行判断正误！"
                        }
                    }
                }
                if ($$(".fuck_answer").length == 0) {
                    $$(".answer_list").after("<div class='fuck_answer'>" + answer + "</div>");
                    $$(".answer_list_box").after("<div class='fuck_answer'>" + answer + "</div>");
                } else {
                    $$(".fuck_answer").text(answer);
                }
            } else {
                addLog('答案查询失败，请稍后重试', 'error');
            }
        },
        onerror: function() {
            addLog('答案查询请求失败', 'error');
        }
    })
}

function openCopy() {
    $$(document).ready(new function () {
        document.oncontextmenu = new Function("event.returnValue=true");
        document.onselectstart = new Function("event.returnValue=true");
        document.oncopy = new Function("return true");
    })
}

function exam_note() {
    alert_note(2, ["不同意", "同意"], "考试说明及免责声明", '<p><font color=red>期末考试未经测试，不保证可用性！！！</font></p>' +
        '<p><font color="red">请仔细阅读以下内容</font></p>' +
        '<p>考试平台目前无法测试，脚本是否可以还不清楚</p>' +
        '<p>当前实现方式由推测而来</p>' +
        '<p><font color="red">你使用脚本造成的损失自行承担</font></p>' +
        '<p><font color="red">你点击同意视为遵守以上内容！</font></p>' +
        '<p>欢迎捐赠,对于你的捐赠表示由衷感谢&nbsp; &nbsp;<a href="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN"><font color="red">|点击向我捐赠|</font></a></p>',
        'public_cont1', function () {
            $(".public_close").click(); //此为关闭方法
            GM_setValue("exam_note", false)
            err_note()
        }, function () {
            $(".public_close").click(); //此为关闭方法
            GM_setValue("exam_note", true)
            location.href = "https://greasyfork.org/zh-CN/scripts/414487-%E6%88%91%E5%B0%B1%E6%98%AF%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90";
        });
}

function video_note() {
    alert_note(2, ["关闭", "不在提示"], "我就是积极分子脚本使用说明",  +
        '<p><font color="aqua"></font>详细设置请修改源代码</p>' +
        '<p>欢迎捐赠,对于你的捐赠表示由衷感谢&nbsp; &nbsp;<a href="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN"><font color="red">|点击向我捐赠|</font></a></p>' +
        '<p>本脚本免费使用严谨倒卖</p>' +
        '<p>如果你是以收费方式获得此脚本</p>' +
        '<p>请立即退款并在官方页面下载原版&nbsp; &nbsp;<a href="https://greasyfork.org/zh-CN/scripts/414487-%E6%88%91%E5%B0%B1%E6%98%AF%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90"><font color="red">|点我下载原版|</font></a></p>',
        'public_cont1', function () {
            $(".public_close").click(); //此为关闭方法
            GM_setValue("dont_note", false)
        }, function () {
            $(".public_close").click(); //此为关闭方法
            GM_setValue("dont_note", true)
            location.href = "https://greasyfork.org/zh-CN/scripts/414487-%E6%88%91%E5%B0%B1%E6%98%AF%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90";
        });
}

function test_note() {
    alert_note(1, ["关闭"], "我就是积极分子答题使用说明", '<p>由于精力有限，实在无法提供用户界面</p>' +
        '<p>题库来源于网络，不保证准确性！！！</p>' +
        '<p><font color=red>这个题库的无延迟查询通道已经关了,免费的果然一般（哈哈）</font></p>' +
        '<p>作者没钱搞服务器整题库，所以你懂的</p>' +
        '<p>将就用一下就好，建议打开复制自行搜索！</p>' +
        '<p>推荐使用学小易，非常准确，或者百度,<font color=red>欢迎向我捐赠</font></p>' +
        //'<p>欢迎捐赠,对于你的捐赠表示由衷感谢&nbsp; &nbsp;<a href="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">|点击向我捐赠|</a></p>', +
        '<img src="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">',
        'public_cont1', function () {
            $(".public_close").click(); //此为关闭方法
        });
}

function err_note() {
    alert_note(1, ["关闭"], "如果要继续使用脚本请点击同意", '<p>如果要继续使用脚本请点击同意</p>' +
        //'<p>欢迎捐赠,对于你的捐赠表示由衷感谢&nbsp; &nbsp;<a href="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">|点击向我捐赠|</a></p>', +
        '<img src="https://greasyfork.org/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBazlZIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2148cc9198f8c2d3ac31d261accd3b51e8b97442/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9VY21WemFYcGxYM1J2WDJ4cGJXbDBXd2RwQWNocEFjZz0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--1a5b26c2d16a60cf381d61dcd5b41cdffac6d9dc/15991110507.jpg?locale=zh-CN">',
        'public_cont1', function () {
            $(".public_close").click(); //此为关闭方法
            exam_note();
        });
}


function alert_note(btn_num, btn_text, note_text, public_text, public_cont_class, submit_fun, cancel_fun) {
    if (btn_num == 1) {
        var public_a = '<a href="#" class="public_submit">' + btn_text[0] + '</a>';
    } else {
        var public_a = '<a href="#" class="public_submit">' + btn_text[0] + '</a> <a href="#" class="public_cancel">' + btn_text[1] + '</a>';
    }
    var public_html = '<div class="public_mask"></div><div class="public_cont ' + public_cont_class + '"><div class="public_title"><h3>' + note_text + '</h3><div class="public_close"></div></div><div class="public_text">' + public_text + '</div><div class="public_btn">' + public_a + '</div></div>';
    $("body").append(public_html);
    $(".public_close").click(function () {
        $(".public_mask").remove();
        $(".public_cont").remove();
    });
    $(".public_mask").click(function () {
        $(".public_mask").remove();
        $(".public_cont").remove();
    });
    if (btn_num == 1) {
        $(".public_submit").click(function () {
            submit_fun();
        })
    } else {
        $(".public_submit").click(function () {
            submit_fun();
        });
        $(".public_cancel").click(function () {
            cancel_fun();
        })
    }
}

function filterImg(dom) {
    return $$(dom).clone().find("img[src]").replaceWith(function () {
        return $$("<p></p>").text('<img src="' + $$(this).attr("src") + '">');
    }).end().find("iframe[src]").replaceWith(function () {
        return $$("<p></p>").text('<iframe src="' + $$(this).attr("src") + '"></irame>');
    }).end().text().trim();
}
