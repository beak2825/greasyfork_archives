// ==UserScript==
// @name         网站URL简化|去除杂乱参数
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  自动清理必应搜索、B站视频、百度搜索、KIMI AI、360搜索、CSDN博客和搜狗搜索等的URL中的多余参数，优化浏览体验
// @author       xjy666a
// @license      MIT
// @match        https://cn.bing.com/search*
// @match        https://www.bing.com/search*
// @match        https://www.bilibili.com/video/*
// @match        https://www.baidu.com/*
// @match        https://kimi.moonshot.cn/*
// @match        https://minecraft.fandom.com/*
// @match        https://www.so.com/s*
// @match        https://blog.csdn.net/*
// @match        https://www.sogou.com/sogou*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @priority     1
// @icon         https://www.helloimg.com/i/2025/04/26/680c9e8d2db2f.png
// @downloadURL https://update.greasyfork.org/scripts/524527/%E7%BD%91%E7%AB%99URL%E7%AE%80%E5%8C%96%7C%E5%8E%BB%E9%99%A4%E6%9D%82%E4%B9%B1%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/524527/%E7%BD%91%E7%AB%99URL%E7%AE%80%E5%8C%96%7C%E5%8E%BB%E9%99%A4%E6%9D%82%E4%B9%B1%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==
 
/* MIT License
 
Copyright (c) 2024 xjy666a
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
 
(function() {
    'use strict';
 
    // 默认设置
    const defaultSettings = {
        enableCleaner: true,
        enableBing: true,
        enableBilibili: true,
        enableBaidu: true,
        enableKimi: true,
        enableMinecraft: true,
        enable360: true,
        enableCSDN: true,
        enableSogou: true,
        enableClipboardCleaner: true,
        usageCount: 0,
        ratingRequested: false
    };
 
    // 获取设置
    function getSettings() {
        return {
            enableCleaner: GM_getValue('enableCleaner', defaultSettings.enableCleaner),
            enableBing: GM_getValue('enableBing', defaultSettings.enableBing),
            enableBilibili: GM_getValue('enableBilibili', defaultSettings.enableBilibili),
            enableBaidu: GM_getValue('enableBaidu', defaultSettings.enableBaidu),
            enableKimi: GM_getValue('enableKimi', defaultSettings.enableKimi),
            enableMinecraft: GM_getValue('enableMinecraft', defaultSettings.enableMinecraft),
            enable360: GM_getValue('enable360', defaultSettings.enable360),
            enableCSDN: GM_getValue('enableCSDN', defaultSettings.enableCSDN),
            enableSogou: GM_getValue('enableSogou', defaultSettings.enableSogou),
            enableClipboardCleaner: GM_getValue('enableClipboardCleaner', defaultSettings.enableClipboardCleaner),
            usageCount: GM_getValue('usageCount', 0),
            ratingRequested: GM_getValue('ratingRequested', false)
        };
    }
 
    // 切换设置并返回新状态
    function toggleSetting(key) {
        const currentValue = GM_getValue(key, defaultSettings[key]);
        GM_setValue(key, !currentValue);
        return !currentValue;
    }

    // ==================== 清理记录管理系统 ====================
    
    // 获取清理记录
    function getCleaningLogs() {
        const logs = GM_getValue('cleaningLogs', []);
        return logs;
    }

    // 添加清理记录
    function addCleaningLog(originalUrl, cleanedUrl, siteName, action) {
        const logs = getCleaningLogs();
        const log = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            timestampLocal: new Date().toLocaleString('zh-CN'),
            originalUrl: originalUrl,
            cleanedUrl: cleanedUrl,
            siteName: siteName,
            action: action, // 'redirect', 'replaceState', 'noChange'
            savedChars: originalUrl.length - cleanedUrl.length,
            pageTitle: document.title || '未知页面',
            userAgent: navigator.userAgent
        };
        
        // 只保留最近100条记录，避免存储过多
        logs.unshift(log);
        if (logs.length > 100) {
            logs.splice(100);
        }
        
        GM_setValue('cleaningLogs', logs);
        return log;
    }

    // 清空清理记录
    function clearCleaningLogs() {
        GM_setValue('cleaningLogs', []);
        showNotification('已清空清理记录');
    }

    // 导出清理记录为JSON
    function exportCleaningLogs() {
        const logs = getCleaningLogs();
        const dataStr = JSON.stringify(logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `url_cleaner_logs_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('清理记录已导出');
    }

    // 导出清理记录为可读文本
    function exportCleaningLogsAsText() {
        const logs = getCleaningLogs();
        let text = '====== URL 清理记录 ======\n\n';
        text += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
        text += `总记录数: ${logs.length}\n\n`;
        
        logs.forEach((log, index) => {
            text += `[记录 ${index + 1}]\n`;
            text += `时间: ${log.timestampLocal}\n`;
            text += `网站: ${log.siteName}\n`;
            text += `页面标题: ${log.pageTitle}\n`;
            text += `处理方式: ${log.action}\n`;
            text += `节省字符: ${log.savedChars} 个\n`;
            text += `原始URL: ${log.originalUrl}\n`;
            text += `清理后URL: ${log.cleanedUrl}\n`;
            text += `\n${'='.repeat(60)}\n\n`;
        });
        
        const dataBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `url_cleaner_logs_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('清理记录已导出为文本');
    }

    // 复制清理记录到剪贴板（用于反馈）
    function copyLogsForFeedback() {
        const logs = getCleaningLogs();
        const recentLogs = logs.slice(0, 10); // 只复制最近10条
        
        let text = '【URL清理脚本 - BUG反馈】\n\n';
        text += `脚本版本: 2.2\n`;
        text += `浏览器: ${navigator.userAgent}\n`;
        text += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
        text += `最近 ${recentLogs.length} 条清理记录:\n\n`;
        
        recentLogs.forEach((log, index) => {
            text += `${index + 1}. [${log.timestampLocal}] ${log.siteName}\n`;
            text += `   原始: ${log.originalUrl}\n`;
            text += `   清理: ${log.cleanedUrl}\n`;
            text += `   操作: ${log.action}, 节省: ${log.savedChars}字符\n\n`;
        });
        
        GM_setClipboard(text);
        showNotification('已复制最近10条记录，可用于反馈BUG');
    }
 
    // 注册菜单命令
    function registerMenuCommands() {
        const settings = getSettings();
 
        // 主菜单项
        GM_registerMenuCommand(
            `📊 使用次数: ${settings.usageCount} 次`,
            () => showUsageStats()
        );
 
        GM_registerMenuCommand(
            `💬 提供反馈或建议`,
            () => showFeedbackPrompt()
        );
 
        GM_registerMenuCommand(
            `${settings.enableCleaner ? '✅' : '❌'} 启用URL清理`,
            () => {
                toggleSetting('enableCleaner');
                location.reload();
            }
        );
 
        // 网站设置子菜单
        GM_registerMenuCommand(
            `🔧 网站设置...`,
            () => showWebsiteSettings()
        );
 
        GM_registerMenuCommand(
            `📅 显示信息面板`,
            () => showInfoOverlay()
        );

        // 清理记录相关菜单
        const logsCount = getCleaningLogs().length;
        GM_registerMenuCommand(
            `📝 查看清理记录 (${logsCount}条)`,
            () => showCleaningLogsPanel()
        );

        GM_registerMenuCommand(
            `📋 复制记录用于反馈`,
            () => copyLogsForFeedback()
        );

        GM_registerMenuCommand(
            `💾 导出清理记录`,
            () => {
                const choice = confirm('选择导出格式:\n确定 = JSON格式\n取消 = 文本格式');
                if (choice) {
                    exportCleaningLogs();
                } else {
                    exportCleaningLogsAsText();
                }
            }
        );

        GM_registerMenuCommand(
            `🗑️ 清空清理记录`,
            () => {
                if (confirm(`确定要清空所有 ${logsCount} 条清理记录吗？`)) {
                    clearCleaningLogs();
                }
            }
        );
    }
 
    // 显示使用统计详情
    function showUsageStats() {
        const settings = getSettings();
 
        // 创建统计信息弹窗
        const statsPrompt = document.createElement('div');
        statsPrompt.className = 'usage-stats-prompt';
        statsPrompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(34, 34, 34, 0.95);
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-size: 14px;
            min-width: 300px;
            text-align: center;
            transition: opacity 0.3s;
        `;
 
        // 计算使用天数（假设脚本安装日期存储在installDate中）
        const installDate = GM_getValue('installDate', Date.now());
        const daysUsed = Math.ceil((Date.now() - installDate) / (1000 * 60 * 60 * 24));
 
        // 弹窗内容
        statsPrompt.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px;">URL简化脚本使用统计</div>
            <div style="margin-bottom: 10px; text-align: left; padding: 0 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>总使用次数:</span>
                    <span style="font-weight: bold; color: #4CAF50;">${settings.usageCount} 次</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>已使用天数:</span>
                    <span style="font-weight: bold; color: #2196F3;">${daysUsed} 天</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>平均每天使用:</span>
                    <span style="font-weight: bold; color: #FFC107;">${(settings.usageCount / Math.max(daysUsed, 1)).toFixed(1)} 次</span>
                </div>
            </div>
            <button class="close-stats-prompt" style="
                background-color: #555;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
                font-weight: bold;
            ">关闭</button>
        `;
 
        // 添加到页面
        document.body.appendChild(statsPrompt);
 
        // 关闭按钮点击事件
        statsPrompt.querySelector('.close-stats-prompt').addEventListener('click', function() {
            document.body.removeChild(statsPrompt);
        });
    }
 
    // 显示反馈弹窗
    function showFeedbackPrompt() {
        // 检查是否已存在弹窗
        if (document.querySelector('.feedback-prompt')) {
            return;
        }

        // 创建弹窗
        const prompt = document.createElement('div');
        prompt.className = 'feedback-prompt';
        prompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(34, 34, 34, 0.95);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            z-index: 10001;
            font-size: 14px;
            max-width: 480px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            text-align: center;
            transition: opacity 0.3s;
            backdrop-filter: blur(10px);
        `;
 
        // 弹窗内容
        prompt.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px;">💬 功能反馈与建议</div>
            
            <!-- 醒目的调试信息提示 -->
            <div style="
                background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
                color: white;
                padding: 12px 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: left;
                box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
                border-left: 4px solid #E65100;
            ">
                <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">
                    ⚠️ 反馈 BUG 必读
                </div>
                <div style="font-size: 12px; line-height: 1.6; opacity: 0.95;">
                    <strong>请务必提供调试信息，以便快速定位问题：</strong><br>
                    1️⃣ 点击下方"📅 打开信息面板"<br>
                    2️⃣ 点击"显示调试信息"<br>
                    3️⃣ 点击"📋 复制全部调试信息"或截图<br>
                    4️⃣ 在反馈页面粘贴信息或上传截图
                </div>
            </div>
            
            <div style="margin-bottom: 15px; line-height: 1.5; text-align: left; color: #ddd; font-size: 13px;">
                目前本脚本功能较少，你可以反馈，若可以实现，我们会尽量满足！
            </div>
            
            <!-- 快捷按钮 -->
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                <button class="open-info-panel-btn" style="
                    background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    📅 打开信息面板（获取调试信息）
                </button>
                
                <div style="display: flex; gap: 10px;">
                    <a href="https://scriptcat.org/zh-CN/script-show-page/2654/" target="_blank" style="
                        flex: 1;
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        padding: 10px 15px;
                        border-radius: 6px;
                        font-weight: bold;
                        text-align: center;
                        font-size: 13px;
                        box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                        🐱 脚本猫反馈
                    </a>
                    <a href="https://greasyfork.org.cn/zh-CN/scripts/524527-网站url简化-去除杂乱参数" target="_blank" style="
                        flex: 1;
                        display: inline-block;
                        background-color: #2196F3;
                        color: white;
                        text-decoration: none;
                        padding: 10px 15px;
                        border-radius: 6px;
                        font-weight: bold;
                        text-align: center;
                        font-size: 13px;
                        box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                        🍴 Greasy Fork 反馈
                    </a>
                </div>
            </div>
            
            <button class="close-feedback-prompt" style="
                background-color: transparent;
                color: #999;
                border: 1px solid #666;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">关闭</button>
        `;
 
        // 添加到页面
        document.body.appendChild(prompt);

        // "打开信息面板"按钮点击事件
        prompt.querySelector('.open-info-panel-btn').addEventListener('click', function() {
            // 关闭反馈弹窗
            document.body.removeChild(prompt);
            
            // 打开信息面板
            showInfoOverlay();
            
            // 提示用户下一步操作
            setTimeout(() => {
                showNotification('请点击"显示调试信息"按钮获取完整调试信息');
            }, 800);
        });

        // 关闭按钮点击事件
        prompt.querySelector('.close-feedback-prompt').addEventListener('click', function() {
            document.body.removeChild(prompt);
        });

        // 点击反馈链接时关闭弹窗
        prompt.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => {
                    if (document.body.contains(prompt)) {
                        document.body.removeChild(prompt);
                    }
                }, 500);
            });
        });
    }
 
    // 显示清理记录面板
    function showCleaningLogsPanel() {
        const logs = getCleaningLogs();

        // 创建面板
        const panel = document.createElement('div');
        panel.className = 'cleaning-logs-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(34, 34, 34, 0.95);
            color: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-size: 14px;
            width: 90%;
            max-width: 1000px;
            max-height: 85vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        // 构建内容
        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #4fc3f7; padding-bottom: 15px;">
                <h2 style="margin: 0; color: #4fc3f7; font-size: 22px;">📝 URL 清理记录</h2>
                <div style="display: flex; gap: 10px;">
                    <button class="refresh-logs-btn" style="
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🔄 刷新</button>
                    <button class="copy-feedback-btn" style="
                        background-color: #2196F3;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">📋 复制反馈</button>
                    <button class="export-logs-btn" style="
                        background-color: #FF9800;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">💾 导出</button>
                    <button class="clear-logs-btn" style="
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🗑️ 清空</button>
                    <button class="close-logs-panel" style="
                        background-color: #555;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">✖ 关闭</button>
                </div>
            </div>
            
            <div style="margin-bottom: 15px; color: #bbb; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span>总记录数: <strong style="color: #4fc3f7;">${logs.length}</strong> 条</span>
                    <span style="margin-left: 20px;">总节省: <strong style="color: #4CAF50;">${logs.reduce((sum, log) => sum + log.savedChars, 0)}</strong> 字符</span>
                </div>
                <input type="text" class="search-logs-input" placeholder="🔍 搜索记录..." style="
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    width: 250px;
                ">
            </div>

            <div class="logs-container" style="
                flex: 1;
                overflow-y: auto;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                background: rgba(0,0,0,0.2);
                padding: 15px;
            ">
                ${logs.length === 0 ? '<div style="text-align: center; color: #999; padding: 40px;">暂无清理记录</div>' : ''}
            </div>
        `;

        document.body.appendChild(panel);

        // 渲染日志列表
        function renderLogs(logsToRender = logs) {
            const container = panel.querySelector('.logs-container');
            
            if (logsToRender.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #999; padding: 40px;">没有找到匹配的记录</div>';
                return;
            }

            container.innerHTML = logsToRender.map((log, index) => `
                <div style="
                    background: linear-gradient(135deg, rgba(40, 40, 40, 0.6) 0%, rgba(50, 50, 50, 0.6) 100%);
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    border-left: 4px solid ${log.savedChars > 0 ? '#4CAF50' : '#999'};
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="
                                background: ${log.action === 'redirect' ? '#FF9800' : log.action === 'replaceState' ? '#2196F3' : '#999'};
                                color: white;
                                padding: 3px 8px;
                                border-radius: 4px;
                                font-size: 11px;
                                font-weight: bold;
                            ">${log.action === 'redirect' ? '🔄 跳转' : log.action === 'replaceState' ? '✏️ 替换' : '⏸️ 无变化'}</span>
                            <span style="color: #4fc3f7; font-weight: bold; font-size: 15px;">${log.siteName}</span>
                            <span style="color: #999; font-size: 12px;">${log.timestampLocal}</span>
                        </div>
                        <span style="
                            background: ${log.savedChars > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(150, 150, 150, 0.2)'};
                            color: ${log.savedChars > 0 ? '#4CAF50' : '#999'};
                            padding: 4px 10px;
                            border-radius: 4px;
                            font-size: 12px;
                            font-weight: bold;
                        ">${log.savedChars > 0 ? '✔' : '='} 节省 ${log.savedChars} 字符</span>
                    </div>

                    <div style="margin-bottom: 8px;">
                        <div style="color: #999; font-size: 12px; margin-bottom: 3px;">📄 页面标题:</div>
                        <div style="color: #ddd; font-size: 13px; padding-left: 10px;">${log.pageTitle}</div>
                    </div>

                    <div style="margin-bottom: 8px;">
                        <div style="color: #e57373; font-size: 12px; margin-bottom: 3px;">🔗 原始 URL:</div>
                        <div style="
                            background: rgba(0,0,0,0.3);
                            padding: 8px;
                            border-radius: 4px;
                            font-family: monospace;
                            font-size: 11px;
                            color: #ffcccc;
                            word-break: break-all;
                            overflow-wrap: break-word;
                        ">${log.originalUrl}</div>
                    </div>

                    <div>
                        <div style="color: #81c784; font-size: 12px; margin-bottom: 3px;">✅ 清理后 URL:</div>
                        <div style="
                            background: rgba(0,0,0,0.3);
                            padding: 8px;
                            border-radius: 4px;
                            font-family: monospace;
                            font-size: 11px;
                            color: #ccffcc;
                            word-break: break-all;
                            overflow-wrap: break-word;
                        ">${log.cleanedUrl}</div>
                    </div>

                    <div style="margin-top: 10px; display: flex; gap: 8px;">
                        <button onclick="navigator.clipboard.writeText('${log.originalUrl.replace(/'/g, "\\'")}'); alert('已复制原始URL')" style="
                            background: rgba(229, 115, 115, 0.2);
                            color: #e57373;
                            border: 1px solid #e57373;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                        ">复制原始</button>
                        <button onclick="navigator.clipboard.writeText('${log.cleanedUrl.replace(/'/g, "\\'")}'); alert('已复制清理后URL')" style="
                            background: rgba(129, 199, 132, 0.2);
                            color: #81c784;
                            border: 1px solid #81c784;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                        ">复制清理后</button>
                    </div>
                </div>
            `).join('');
        }

        // 初始渲染
        renderLogs();

        // 搜索功能
        const searchInput = panel.querySelector('.search-logs-input');
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            if (!keyword) {
                renderLogs(logs);
                return;
            }
            
            const filtered = logs.filter(log => 
                log.siteName.toLowerCase().includes(keyword) ||
                log.originalUrl.toLowerCase().includes(keyword) ||
                log.cleanedUrl.toLowerCase().includes(keyword) ||
                log.pageTitle.toLowerCase().includes(keyword)
            );
            renderLogs(filtered);
        });

        // 刷新按钮
        panel.querySelector('.refresh-logs-btn').addEventListener('click', () => {
            document.body.removeChild(panel);
            showCleaningLogsPanel();
        });

        // 复制反馈按钮
        panel.querySelector('.copy-feedback-btn').addEventListener('click', () => {
            copyLogsForFeedback();
        });

        // 导出按钮
        panel.querySelector('.export-logs-btn').addEventListener('click', () => {
            const choice = confirm('选择导出格式:\n确定 = JSON格式\n取消 = 文本格式');
            if (choice) {
                exportCleaningLogs();
            } else {
                exportCleaningLogsAsText();
            }
        });

        // 清空按钮
        panel.querySelector('.clear-logs-btn').addEventListener('click', () => {
            if (confirm(`确定要清空所有 ${logs.length} 条清理记录吗？`)) {
                clearCleaningLogs();
                document.body.removeChild(panel);
            }
        });

        // 关闭按钮
        panel.querySelector('.close-logs-panel').addEventListener('click', () => {
            document.body.removeChild(panel);
        });
    }

    // 显示网站设置弹窗
    function showWebsiteSettings() {
        const settings = getSettings();
 
        // 创建设置弹窗
        const settingsPrompt = document.createElement('div');
        settingsPrompt.className = 'website-settings-prompt';
        settingsPrompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(34, 34, 34, 0.95);
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-size: 14px;
            min-width: 300px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            text-align: left;
            transition: opacity 0.3s;
        `;
 
        // 网站设置列表
        const websiteSettings = [
            { key: 'enableBing', name: '必应搜索', icon: '🔍' },
            { key: 'enableBilibili', name: 'B站视频', icon: '📺' },
            { key: 'enableBaidu', name: '百度搜索', icon: '🔍' },
            { key: 'enableKimi', name: 'KIMI AI', icon: '🤖' },
            { key: 'enableMinecraft', name: 'Minecraft Wiki重定向', icon: '🎮' },
            { key: 'enable360', name: '360搜索', icon: '🔍' },
            { key: 'enableCSDN', name: 'CSDN博客', icon: '💻' },
            { key: 'enableSogou', name: '搜狗搜索', icon: '🔍' },
            { key: 'enableClipboardCleaner', name: 'B站分享链接自动清理', icon: '🧓' }
            // 未来可以在这里添加更多网站
        ];
 
        // 构建设置项HTML
        let settingsHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px; text-align: center;">网站设置</div>
            <div style="margin-bottom: 15px;">
                启用或禁用特定网站的URL清理功能:
            </div>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center;">
        `;
 
        // 添加每个网站的设置项
        websiteSettings.forEach(site => {
            settingsHTML += `
                <div style="display: flex; align-items: center;">
                    <span style="margin-right: 8px;">${site.icon}</span>
                    <span>${site.name}</span>
                </div>
                <label class="switch" style="justify-self: end;">
                    <input type="checkbox" data-key="${site.key}" ${settings[site.key] ? 'checked' : ''}>
                    <span class="slider" style="
                        position: relative;
                        display: inline-block;
                        width: 40px;
                        height: 20px;
                        background-color: ${settings[site.key] ? '#4CAF50' : '#ccc'};
                        border-radius: 10px;
                        transition: .4s;
                        cursor: pointer;
                    "></span>
                </label>
            `;
        });

        // 添加推荐提示
        settingsHTML += `
            </div>
            <div style="
                margin-top: 25px;
                padding: 15px;
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%);
                border: 1px solid rgba(76, 175, 80, 0.3);
                border-radius: 8px;
                text-align: center;
            ">
                <div style="font-weight: bold; font-size: 15px; margin-bottom: 8px; color: #4CAF50;">
                    📚 试试我们的另一个脚本
                </div>
                <div style="font-size: 13px; margin-bottom: 12px; color: #ccc; line-height: 1.5;">
                    一个功能强大的浏览器书签管理工具，支持更好的显示、快速搜索、批量操作等功能，让书签管理变得简单高效。
                </div>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <a href="https://scriptcat.org/zh-CN/script-show-page/4578" target="_blank" style="
                        display: inline-block;
                        padding: 6px 12px;
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        📥 脚本猫下载
                    </a>
                    <a href="https://greasyfork.org/zh-CN/scripts/555177-%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B9%A6%E7%AD%BE" target="_blank" style="
                        display: inline-block;
                        padding: 6px 12px;
                        background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        📥 GreasyFork下载
                    </a>
                </div>
            </div>
        `;

        // 添加按钮
        settingsHTML += `
            <div style="display: flex; justify-content: center; margin-top: 20px;">
                <button class="save-settings" style="
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                    font-weight: bold;
                ">保存设置</button>
                <button class="close-settings" style="
                    background-color: #555;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                ">取消</button>
            </div>
        `;
 
        // 设置弹窗内容
        settingsPrompt.innerHTML = settingsHTML;
 
        // 添加到页面
        document.body.appendChild(settingsPrompt);
 
        // 切换开关样式
        settingsPrompt.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const slider = this.nextElementSibling;
                slider.style.backgroundColor = this.checked ? '#4CAF50' : '#ccc';
            });
        });
 
        // 保存按钮点击事件
        settingsPrompt.querySelector('.save-settings').addEventListener('click', function() {
            // 保存所有设置
            settingsPrompt.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                const key = checkbox.dataset.key;
                GM_setValue(key, checkbox.checked);
            });
 
            // 显示保存成功通知
            showNotification('设置已保存');
 
            // 关闭弹窗
            document.body.removeChild(settingsPrompt);
 
            // 重新加载页面以应用设置
            location.reload();
        });
 
        // 关闭按钮点击事件
        settingsPrompt.querySelector('.close-settings').addEventListener('click', function() {
            document.body.removeChild(settingsPrompt);
        });
    }
 
    // 增加使用计数并检查是否需要请求评分
    function incrementUsageCount() {
        const settings = getSettings();
 
        // 增加使用计数
        const newCount = settings.usageCount + 1;
        GM_setValue('usageCount', newCount);
 
        // 检查是否需要请求评分 - 将阈值从50改为10
        if (newCount >= 10 && !settings.ratingRequested) {
            // 显示评分请求
            showRatingPrompt();
            // 标记已请求评分
            GM_setValue('ratingRequested', true);
        }
    }
 
    // 显示评分请求提示
    function showRatingPrompt() {
        // 检查是否已存在提示框
        if (document.querySelector('.rating-prompt')) {
            return;
        }
 
        // 创建提示框
        const prompt = document.createElement('div');
        prompt.className = 'rating-prompt';
        prompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(34, 34, 34, 0.95);
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-size: 14px;
            max-width: 400px;
            text-align: center;
            transition: opacity 0.3s;
        `;
 
        // 提示框内容 - 修改文本以反映新的阈值
        prompt.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; font-size: 16px;">感谢您使用URL简化脚本！</div>
            <div style="margin-bottom: 20px; line-height: 1.5;">
                您已经使用本脚本超过10次，如果觉得它对您有帮助，希望您能花一点时间给它评个分，这将帮助更多人发现它。
            </div>
            <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                <a href="https://scriptcat.org/zh-CN/script-show-page/2654/" target="_blank" style="
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    margin-right: 10px;
                    font-weight: bold;
                ">在脚本猫评分</a>
                <a href="https://greasyfork.org.cn/zh-CN/scripts/524527-网站url简化-去除杂乱参数" target="_blank" style="
                    display: inline-block;
                    background-color: #2196F3;
                    color: white;
                    text-decoration: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    font-weight: bold;
                ">在Greasy Fork评分</a>
            </div>
            <button class="close-rating-prompt" style="
                background-color: transparent;
                color: #ddd;
                border: 1px solid #666;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 5px;
            ">稍后再说</button>
            <div style="font-size: 12px; margin-top: 15px; color: #aaa;">
                您的支持是我们持续改进的动力！
            </div>
        `;
 
        // 添加到页面
        document.body.appendChild(prompt);
 
        // 关闭按钮点击事件
        prompt.querySelector('.close-rating-prompt').addEventListener('click', function() {
            document.body.removeChild(prompt);
        });
 
        // 点击评分链接时关闭提示框
        prompt.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                // 标记用户已点击评分链接
                GM_setValue('userRated', true);
                setTimeout(() => {
                    if (document.body.contains(prompt)) {
                        document.body.removeChild(prompt);
                    }
                }, 500);
            });
        });
    }
 
    // 清理URL的函数
    function cleanUrl(url) {
        try {
            const settings = getSettings();
            if (!settings.enableCleaner) {
                return url;
            }
 
            // 增加使用计数
            incrementUsageCount();
 
            const urlObj = new URL(url);
 
            // 处理Minecraft Wiki重定向
            if (settings.enableMinecraft && urlObj.hostname === 'minecraft.fandom.com') {
                const pathParts = urlObj.pathname.split('/');
                let newUrl;
 
                if (pathParts[1] === 'wiki') {
                    const pageName = pathParts.slice(2).join('/');
                    newUrl = `https://en.minecraft.wiki/w/${pageName}`;
                } else if (pathParts[2] === 'wiki') {
                    const lang = pathParts[1];
                    const pageName = pathParts.slice(3).join('/');
                    newUrl = `https://${lang}.minecraft.wiki/w/${pageName}`;
                }
 
                if (newUrl && newUrl !== url) {
                    // 记录清理日志
                    addCleaningLog(url, newUrl, 'Minecraft Wiki', 'redirect');
                    
                    if (settings.cleanerMode === 'notify') {
                        sessionStorage.setItem('urlCleanNotification', JSON.stringify({
                            siteName: 'Minecraft Wiki',
                            originalUrl: url,
                            cleanedUrl: newUrl
                        }));
                    }
                    window.location.href = newUrl;
                    return url;
                }
            }

            // 处理KIMI AI URL
            if (settings.enableKimi && urlObj.hostname === 'kimi.moonshot.cn') {
                if (urlObj.pathname === '/' || urlObj.pathname === '') {
                    const newUrl = 'https://kimi.moonshot.cn/';
                    if (newUrl !== url) {
                        // 记录清理日志
                        addCleaningLog(url, newUrl, 'KIMI AI', 'redirect');
                        
                        if (settings.cleanerMode === 'notify') {
                            sessionStorage.setItem('urlCleanNotification', JSON.stringify({
                                siteName: 'KIMI AI',
                                originalUrl: url,
                                cleanedUrl: newUrl
                            }));
                        }
                        window.location.href = newUrl;
                        return url;
                    }
                    return newUrl;
                }
            }
 
            // 处理百度搜索URL（保留：wd、pn、si；gpc按规则保留；过滤：tfflag）
            if (settings.enableBaidu && urlObj.hostname === 'www.baidu.com' && urlObj.pathname === '/s') {
                const wd = urlObj.searchParams.get('wd');
                const pn = urlObj.searchParams.get('pn');
                const si = urlObj.searchParams.get('si');
                const gpc = urlObj.searchParams.get('gpc');
 
                if (wd) {
                    let newUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(wd).replace(/%20/g, '+')}`;
                    if (pn) {
                        newUrl += `&pn=${encodeURIComponent(pn)}`;
                    }
                    if (si) {
                        newUrl += `&si=${encodeURIComponent(si)}`;
                    }
                    // gpc：仅当值严格等于 "stf" 时删除；若为 "stf" 后还有内容或不是 "stf" 则保留
                    if (gpc) {
                        const gpcDec = decodeURIComponent(gpc).trim().toLowerCase();
                        if (gpcDec !== 'stf') {
                            newUrl += `&gpc=${encodeURIComponent(gpc)}`;
                        }
                    }
                    if (newUrl !== url) {
                        // 记录清理日志
                        addCleaningLog(url, newUrl, '百度搜索', 'redirect');
                        
                        if (settings.cleanerMode === 'notify') {
                            sessionStorage.setItem('urlCleanNotification', JSON.stringify({
                                siteName: '百度搜索',
                                originalUrl: url,
                                cleanedUrl: newUrl
                            }));
                        }
                        window.location.href = newUrl;
                        return url;
                    }
                    return newUrl;
                }
            }

            // 处理Bing搜索URL (包括国际版)
            if (settings.enableBing && (urlObj.hostname === 'cn.bing.com' || urlObj.hostname === 'www.bing.com') && urlObj.pathname === '/search') {
                const searchQuery = urlObj.searchParams.get('q');
                const firstParam = urlObj.searchParams.get('first');

                if (searchQuery) {
                    // 保持原始域名不变
                    let newUrl = `https://${urlObj.hostname}/search?q=${encodeURIComponent(searchQuery)}`;
                    if (firstParam) {
                        newUrl += `&first=${firstParam}`;
                    }
                    if (newUrl !== url) {
                        // 记录清理日志
                        addCleaningLog(url, newUrl, '必应搜索', 'redirect');
                        
                        if (settings.cleanerMode === 'notify') {
                            sessionStorage.setItem('urlCleanNotification', JSON.stringify({
                                siteName: '必应搜索',
                                originalUrl: url,
                                cleanedUrl: newUrl
                            }));
                        }
                        window.location.href = newUrl;
                        return url;
                    }
                    return newUrl;
                }
            }
 
            // 处理B站视频URL（保留评论定位片段）
            if (settings.enableBilibili && urlObj.hostname === 'www.bilibili.com' && urlObj.pathname.startsWith('/video/')) {
                const bvMatch = urlObj.pathname.match(/\/video\/(BV[\w]+)/);
                if (bvMatch) {
                    const bvid = bvMatch[1];
                    let newUrl = `https://www.bilibili.com/video/${bvid}`;
                    // 保留有效的哈希片段，如 #reply123456789
                    const hash = urlObj.hash || '';
                    if (hash && /^#reply\d+$/i.test(hash)) {
                        newUrl += hash;
                    }
                    
                    // 如果 URL 有变化，记录日志
                    if (newUrl !== url) {
                        addCleaningLog(url, newUrl, 'B站视频', 'replaceState');
                    }
                    
                    // 只返回新URL，不进行跳转（通知在 checkAndCleanUrl 中处理）
                    return newUrl;
                }
            }

            // 处理360搜索URL
            if (settings.enable360 && urlObj.hostname === 'www.so.com' && urlObj.pathname === '/s') {
                const q = urlObj.searchParams.get('q');
                const pn = urlObj.searchParams.get('pn');

                if (q) {
                    let newUrl = `https://www.so.com/s?q=${encodeURIComponent(q)}`;
                    if (pn) {
                        newUrl += `&pn=${pn}`;
                    }
                    if (newUrl !== url) {
                        // 记录清理日志
                        addCleaningLog(url, newUrl, '360搜索', 'redirect');
                        
                        if (settings.cleanerMode === 'notify') {
                            sessionStorage.setItem('urlCleanNotification', JSON.stringify({
                                siteName: '360搜索',
                                originalUrl: url,
                                cleanedUrl: newUrl
                            }));
                        }
                        window.location.href = newUrl;
                        return url;
                    }
                    return newUrl;
                }
            }

            // 处理CSDN博客URL
            if (settings.enableCSDN && urlObj.hostname === 'blog.csdn.net' && urlObj.pathname.includes('/article/details/')) {
                // 提取文章ID
                const articleMatch = urlObj.pathname.match(/\/article\/details\/(\d+)/);
                if (articleMatch) {
                    // 构建干净的URL - 保留路径，移除所有查询参数
                    let newUrl = `https://blog.csdn.net${urlObj.pathname}`;
                    
                    // 保留锚点（如果有评论定位）
                    if (urlObj.hash) {
                        newUrl += urlObj.hash;
                    }
                    
                    // 如果 URL 有变化，记录日志
                    if (newUrl !== url) {
                        addCleaningLog(url, newUrl, 'CSDN博客', 'replaceState');
                    }
                    
                    // 只返回新URL，不进行跳转（使用 replaceState 处理）
                    return newUrl;
                }
            }

            // 处理搜狗搜索URL
            if (settings.enableSogou && urlObj.hostname === 'www.sogou.com' && urlObj.pathname === '/sogou') {
                const query = urlObj.searchParams.get('query');
                const tsn = urlObj.searchParams.get('tsn');
                const page = urlObj.searchParams.get('page');

                if (query) {
                    // 构建干净的URL - 只保留 query、tsn 和 page 参数
                    let newUrl = `https://www.sogou.com/sogou?query=${encodeURIComponent(query)}`;
                    if (tsn) {
                        newUrl += `&tsn=${tsn}`;
                    }
                    if (page) {
                        newUrl += `&page=${page}`;
                    }
                    
                    if (newUrl !== url) {
                        // 记录清理日志
                        addCleaningLog(url, newUrl, '搜狗搜索', 'redirect');
                        
                        if (settings.cleanerMode === 'notify') {
                            sessionStorage.setItem('urlCleanNotification', JSON.stringify({
                                siteName: '搜狗搜索',
                                originalUrl: url,
                                cleanedUrl: newUrl
                            }));
                        }
                        window.location.href = newUrl;
                        return url;
                    }
                    return newUrl;
                }
            }
 
            return url;
        } catch (error) {
            console.error('URL处理错误:', error);
            return url;
        }
    }
 
    // 检查并清理当前URL
    function checkAndCleanUrl() {
        const currentUrl = window.location.href;
        const cleanedUrl = cleanUrl(currentUrl);
 
        if (cleanedUrl !== currentUrl) {
            // 使用 history.replaceState 来更新URL而不刷新页面
            window.history.replaceState(null, '', cleanedUrl);
        }
    }
 
    // 监听URL变化
    let lastUrl = window.location.href;
    new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkAndCleanUrl();
        }
    }).observe(document, {subtree: true, childList: true});
 
    // 处理必应搜索结果中的Minecraft Wiki链接
    function processBingSearchResults() {
        // 同时支持中国版和国际版必应
        if (!window.location.href.includes('.bing.com/search')) return;
 
        // 检查页面是否有内容
        const mainResults = document.getElementById('b_results') ||
                           document.querySelector('.b_results') ||
                           document.querySelector('#main');
 
        // 修改判断条件：检查搜索结果是否存在且内容是否足够
        if (!mainResults || mainResults.children.length < 2) {
            console.log('必应搜索结果似乎为空，准备重试...');
 
            // 重试机制
            if (typeof window.bingRetryCount === 'undefined') {
                window.bingRetryCount = 0;
            }
 
            if (window.bingRetryCount < 3) {
                window.bingRetryCount++;
                console.log(`重试第 ${window.bingRetryCount} 次...`);
 
                // 延迟2秒后重试，给予更多加载时间
                setTimeout(() => {
                    // 如果已经重试了但还是没有结果，保留参数重新加载
                    if (window.bingRetryCount >= 2) {
                        console.log('尝试保留参数重新加载...');
                        sessionStorage.setItem('cleanUrlAfterLoad', 'true');
                        window.location.reload(true); // 强制从服务器重新加载
                    } else {
                        window.location.reload();
                    }
                }, 2000);
 
                return;
            } else {
                console.log('已达到最大重试次数，保留参数加载页面');
                // 标记为已处理，避免无限循环
                window.bingRetryHandled = true;
 
                // 获取当前URL并保留所有参数
                const currentUrl = window.location.href;
 
                // 设置一个标记，表示页面已经加载完成后再清理URL
                sessionStorage.setItem('cleanUrlAfterLoad', 'true');
                sessionStorage.setItem('originalUrl', currentUrl);
 
                // 不再尝试清理URL，让页面正常加载
                return;
            }
        } else {
            // 如果页面加载成功，重置计数器
            window.bingRetryCount = 0;
 
            // 检查是否需要在页面加载后清理URL
            if (sessionStorage.getItem('cleanUrlAfterLoad') === 'true') {
                const originalUrl = sessionStorage.getItem('originalUrl');
                sessionStorage.removeItem('cleanUrlAfterLoad');
                sessionStorage.removeItem('originalUrl');
 
                // 延迟执行URL清理，确保页面已完全加载
                setTimeout(() => {
                    if (mainResults && mainResults.children.length > 2) {
                        checkAndCleanUrl();
                    }
                }, 2000);
            }
        }
 
        // 获取所有未处理的搜索结果链接
        const searchResults = mainResults.querySelectorAll('a[href*="minecraft.fandom.com"]:not([data-wiki-processed])');
 
        searchResults.forEach(link => {
            try {
                // 标记该链接已处理
                link.setAttribute('data-wiki-processed', 'true');
 
                const url = new URL(link.href);
                if (url.hostname === 'minecraft.fandom.com') {
                    const pathParts = url.pathname.split('/');
                    let newUrl;
 
                    // 构建新的Wiki URL
                    if (pathParts[1] === 'wiki') {
                        const pageName = pathParts.slice(2).join('/');
                        newUrl = `https://en.minecraft.wiki/w/${pageName}`;
                    } else if (pathParts[2] === 'wiki') {
                        const lang = pathParts[1];
                        const pageName = pathParts.slice(3).join('/');
                        newUrl = `https://${lang}.minecraft.wiki/w/${pageName}`;
                    }
 
                    if (newUrl) {
                        // 获取搜索结果容器
                        const resultContainer = link.closest('li') || link.parentElement;
 
                        // 设置结果容器样式
                        resultContainer.style.position = 'relative';
                        resultContainer.style.color = '#666';
                        resultContainer.style.pointerEvents = 'none';
 
                        // 创建新链接提示
                        const notice = document.createElement('div');
                        notice.style.cssText = `
                            margin-top: 8px;
                            padding: 8px;
                            background: #f8f8f8;
                            border-radius: 4px;
                            pointer-events: auto;
                        `;
                        notice.innerHTML = `
                            <div style="color: #e74c3c; font-size: 0.9em; margin-bottom: 4px;">
                                ⚠️ 上述链接指向已弃用的旧版Wiki
                            </div>
                            <a href="${newUrl}" style="
                                display: inline-block;
                                color: #2ecc71;
                                font-weight: bold;
                                text-decoration: none;
                            ">
                                👉 访问新版Wiki页面
                            </a>
                        `;
 
                        // 添加新链接提示
                        resultContainer.appendChild(notice);
                    }
                }
            } catch (error) {
                console.error('处理搜索结果链接时出错:', error);
            }
        });
    }
 
    // 使用防抖函数来限制处理频率
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
 
    // 监听页面变化以处理动态加载的搜索结果
    function observeSearchResults() {
        const debouncedProcess = debounce(processBingSearchResults, 300);
 
        // 创建观察器
        const observer = new MutationObserver(() => {
            // 兼容不同版本的必应
            if (document.getElementById('b_results') ||
                document.querySelector('.b_results') ||
                document.querySelector('#main')) {
                debouncedProcess();
            }
        });
 
        // 观察整个body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        // 首次处理
        processBingSearchResults();
 
        // 监听URL变化
        let lastUrl = location.href;
        const urlChecker = setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                // 重置重试计数器
                window.bingRetryCount = 0;
                processBingSearchResults();
            }
        }, 500);
 
        // 清理函数
        return () => {
            observer.disconnect();
            clearInterval(urlChecker);
        };
    }
 
    // 修改B站分享链接清理函数
    function cleanBilibiliShareLink(text) {
        // 检查是否包含B站视频链接
        if (!text.includes('bilibili.com/video/BV')) {
            return text;
        }
 
        try {
            // 检查是否已经是清理过的链接（被||包围的标题）
            if (text.match(/\|\|.+?\|\|\s+https:\/\/www\.bilibili\.com\/video\/BV[\w]+\//)) {
                return text;
            }
 
            // 提取BV号
            const bvMatch = text.match(/bilibili\.com\/video\/(BV[\w]+)/);
            if (!bvMatch) return text;
 
            const bvid = bvMatch[1];
 
            // 检查是否有标题格式【标题】
            const titleMatch = text.match(/【(.+?)】/);
            const title = titleMatch ? titleMatch[1] : '';
 
            // 构建清理后的链接
            const cleanedUrl = `https://www.bilibili.com/video/${bvid}/`;
 
            // 返回清理后的完整文本，使用||包围标题
            if (title) {
                return `||${title}|| ${cleanedUrl}`;
            } else {
                return cleanedUrl;
            }
        } catch (error) {
            console.error('清理B站分享链接时出错:', error);
            return text;
        }
    }
 
    // B站专用剪贴板监听函数
    function monitorBilibiliClipboard() {
        // 只在B站页面上运行
        if (!window.location.hostname.includes('bilibili.com')) return;
 
        const settings = getSettings();
        if (!settings.enableClipboardCleaner || !settings.enableBilibili) return;
 
        // 存储已处理的链接，避免重复处理
        const processedLinks = new Set();
 
        // 定期检查剪贴板内容
        const clipboardCheckInterval = setInterval(() => {
            navigator.clipboard.readText().then(text => {
                // 如果文本已经是清理过的格式（被||包围的标题），跳过
                if (text.match(/\|\|.+?\|\|\s+https:\/\/www\.bilibili\.com\/video\/BV[\w]+\//)) {
                    return;
                }
 
                // 检查是否是B站链接且包含参数
                if (text && text.includes('bilibili.com/video/BV') && text.includes('?')) {
                    // 生成唯一标识，避免重复处理相同链接
                    const linkId = text.trim();
 
                    // 如果已经处理过这个链接，跳过
                    if (processedLinks.has(linkId)) return;
 
                    // 添加到已处理集合
                    processedLinks.add(linkId);
 
                    // 清理链接
                    const cleanedText = cleanBilibiliShareLink(text);
 
                    // 如果清理后有变化，显示提示
                    if (cleanedText !== text) {
                        // 增加使用计数
                        incrementUsageCount();
 
                        // 显示提示框让用户选择复制简化链接
                        showCleanLinkPrompt(cleanedText);
                    }
 
                    // 限制已处理链接集合大小，避免内存泄漏
                    if (processedLinks.size > 50) {
                        const iterator = processedLinks.values();
                        processedLinks.delete(iterator.next().value);
                    }
                }
            }).catch(err => {
                console.error('读取剪贴板失败:', err);
            });
        }, 1000); // 每秒检查一次
 
        // 页面卸载时清除定时器
        window.addEventListener('unload', () => {
            clearInterval(clipboardCheckInterval);
        });
 
        // 仍然保留复制事件监听，以便更及时地响应
        document.addEventListener('copy', function() {
            setTimeout(() => {
                navigator.clipboard.readText().then(text => {
                    // 如果文本已经是清理过的格式，跳过
                    if (text.match(/\|\|.+?\|\|\s+https:\/\/www\.bilibili\.com\/video\/BV[\w]+\//)) {
                        return;
                    }
 
                    if (text && text.includes('bilibili.com/video/BV') && text.includes('?')) {
                        const linkId = text.trim();
                        if (processedLinks.has(linkId)) return;
 
                        processedLinks.add(linkId);
                        const cleanedText = cleanBilibiliShareLink(text);
                        if (cleanedText !== text) {
                            // 增加使用计数
                            incrementUsageCount();
 
                            // 显示提示框让用户选择复制简化链接
                            showCleanLinkPrompt(cleanedText);
                        }
                    }
                }).catch(err => console.error('读取剪贴板失败:', err));
            }, 200);
        });
    }
 
    // 显示清理链接提示框
    function showCleanLinkPrompt(cleanedText) {
        // 检查是否已存在提示框，避免重复显示
        if (document.querySelector('.clean-link-prompt')) {
            return;
        }
 
        // 创建提示框
        const prompt = document.createElement('div');
        prompt.className = 'clean-link-prompt';
        prompt.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(34, 34, 34, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            transition: opacity 0.3s;
        `;
 
        // 提示框内容
        prompt.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">检测到B站分享链接</div>
            <div style="margin-bottom: 12px; color: #ddd; font-size: 12px; word-break: break-all;">${cleanedText}</div>
            <button class="copy-clean-link" style="
                background-color: #00a1d6;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 10px;
            ">复制简化链接</button>
            <button class="close-prompt" style="
                background-color: transparent;
                color: #ddd;
                border: 1px solid #666;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
            ">关闭</button>
        `;
 
        // 添加到页面
        document.body.appendChild(prompt);
 
        // 复制按钮点击事件
        prompt.querySelector('.copy-clean-link').addEventListener('click', function() {
            GM_setClipboard(cleanedText);
            showNotification('已复制简化链接');
            document.body.removeChild(prompt);
        });
 
        // 关闭按钮点击事件
        prompt.querySelector('.close-prompt').addEventListener('click', function() {
            document.body.removeChild(prompt);
        });
 
        // 10秒后自动关闭
        setTimeout(() => {
            if (document.body.contains(prompt)) {
                prompt.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(prompt)) {
                        document.body.removeChild(prompt);
                    }
                }, 300);
            }
        }, 10000);
    }
 
    // 显示通知
    function showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 9999;
            font-size: 14px;
            transition: opacity 0.3s;
        `;
 
        // 添加到页面
        document.body.appendChild(notification);
 
        // 2秒后淡出
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
 
    // 初始化
    function init() {
        // 记录安装日期（如果尚未记录）
        if (!GM_getValue('installDate')) {
            GM_setValue('installDate', Date.now());
        }
 
        // 检查是否是从重试后的页面加载
        const needCleanAfterLoad = sessionStorage.getItem('cleanUrlAfterLoad') === 'true';
 
        // 如果不是重试后的页面加载，正常注册菜单和清理URL
        if (!needCleanAfterLoad) {
            registerMenuCommands();
            checkAndCleanUrl();
        } else {
            // 如果是重试后的页面加载，只注册菜单，不立即清理URL
            registerMenuCommands();
            console.log('页面通过保留参数加载，将在加载完成后清理URL');
        }
 
        // 重置必应重试计数器
        window.bingRetryCount = 0;
        window.bingRetryHandled = false;
 
        // 如果是必应搜索页面(包括国际版)，处理搜索结果
        if (window.location.href.includes('.bing.com/search')) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', observeSearchResults);
            } else {
                observeSearchResults();
            }
        }
 
        // 设置B站专用剪贴板监听
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', monitorBilibiliClipboard);
        } else {
            monitorBilibiliClipboard();
        }
 
        // 添加KIMI AI公式处理
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupKimiFormulaHandler);
        } else {
            setupKimiFormulaHandler();
        }
    }
 
    // 设置KIMI AI公式处理
    function setupKimiFormulaHandler() {
        const settings = getSettings();
        if (!settings.enableKimi || !settings.enableCleaner) return;
 
        // 只在KIMI AI页面上运行
        if (!window.location.hostname.includes('kimi.moonshot.cn')) return;
 
        // 使用MutationObserver监听DOM变化，处理动态加载的公式
        const observer = new MutationObserver(debounce(() => {
            addFormulaClickHandlers();
        }, 500));
 
        // 观察整个body的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        // 首次运行
        addFormulaClickHandlers();
 
        // 页面卸载时清除观察器
        window.addEventListener('unload', () => {
            observer.disconnect();
        });
    }
 
    // 为公式添加点击处理器
    function addFormulaClickHandlers() {
        // 查找所有KaTeX公式元素
        const formulas = document.querySelectorAll('.katex-html:not([data-formula-processed])');
 
        formulas.forEach(formula => {
            // 标记为已处理
            formula.setAttribute('data-formula-processed', 'true');
 
            // 获取公式的父元素，使整个公式可点击
            const formulaContainer = formula.closest('.katex') || formula;
 
            // 添加视觉提示样式
            formulaContainer.style.cursor = 'pointer';
            formulaContainer.title = '点击复制公式';
 
            // 添加悬停效果
            formulaContainer.addEventListener('mouseenter', () => {
                formulaContainer.style.boxShadow = '0 0 3px 1px rgba(0, 161, 214, 0.5)';
            });
 
            formulaContainer.addEventListener('mouseleave', () => {
                formulaContainer.style.boxShadow = 'none';
            });
 
            // 添加点击事件
            formulaContainer.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
 
                // 使用改进的公式提取方法
                let latexFormula = extractLatexFormula(formulaContainer);
 
                // 显示复制公式提示
                showFormulaPrompt(latexFormula, formulaContainer);
 
                // 增加使用计数
                incrementUsageCount();
            });
        });
    }
 
    // 改进的公式提取函数
    function extractLatexFormula(formulaContainer) {
        // 重置所有已处理标记
        formulaContainer.querySelectorAll('[data-processed]').forEach(el => {
            el.removeAttribute('data-processed');
        });
 
        // 首先尝试从annotation元素获取（这是最准确的来源）
        const annotation = formulaContainer.querySelector('.katex-mathml annotation');
        if (annotation) {
            return annotation.textContent;
        }
 
        // 如果找不到annotation，从HTML结构重建LaTeX
        const formula = formulaContainer.querySelector('.katex-html');
        if (!formula) return '';
 
        // 处理分式
        function processFraction(element) {
            const numerator = element.querySelector('.vlist-t:first-child .vlist-r:first-child .vlist > span:last-child');
            const denominator = element.querySelector('.vlist-t:first-child .vlist-r:first-child .vlist > span:first-child');
 
            if (!numerator || !denominator) return '';
 
            // 递归处理分子和分母
            const numText = processElement(numerator);
            const denText = processElement(denominator);
 
            return `\\frac{${numText}}{${denText}}`;
        }
 
        // 处理根号
        function processSqrt(element) {
            // 获取根号内容的容器
            const baseContent = element.querySelector('.vlist-t .vlist-r .vlist > span:last-child .vlist');
            if (!baseContent) {
                // 尝试其他选择器
                const altContent = element.querySelector('.sqrt-line + .vlist-t .vlist-r .vlist > span:last-child');
                if (!altContent) return '';
                return `\\sqrt{${processElement(altContent)}}`;
            }
 
            // 收集根号内所有内容
            let sqrtContent = '';
            const nodes = Array.from(baseContent.children);
 
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (!node) continue;
 
                // 处理基本元素
                if (node.classList.contains('mord') ||
                    node.classList.contains('mbin') ||
                    node.classList.contains('mrel') ||
                    node.classList.contains('mop')) {
 
                    // 处理上标
                    const sup = node.querySelector('.msupsub');
                    if (sup) {
                        const base = node.childNodes[0];
                        const power = sup.querySelector('.vlist-t .vlist-r .vlist > span:last-child');
                        if (base && power) {
                            sqrtContent += `${base.textContent}^{${power.textContent}}`;
                            continue;
                        }
                    }
 
                    // 处理普通文本
                    if (!node.children.length || node.children.length === 1) {
                        const text = node.textContent;
                        if (text === '±') sqrtContent += '\\pm';
                        else if (text === '×') sqrtContent += '\\times';
                        else if (text === '−') sqrtContent += '-';
                        else sqrtContent += text;
                        continue;
                    }
                }
 
                // 处理运算符
                if (node.classList.contains('mbin') || node.classList.contains('mrel')) {
                    sqrtContent += node.textContent;
                    continue;
                }
 
                // 递归处理其他元素
                const result = processElement(node);
                if (result) {
                    if (sqrtContent &&
                        /[a-zA-Z0-9]}]$/.test(sqrtContent) &&
                        /^[a-zA-Z0-9{]/.test(result)) {
                        sqrtContent += ' ';
                    }
                    sqrtContent += result;
                }
            }
 
            return `\\sqrt{${sqrtContent}}`;
        }
 
        // 处理上标
        function processSup(element) {
            const base = element.previousElementSibling;
            const sup = element.querySelector('.vlist-t .vlist-r .vlist > span:last-child');
            if (!base || !sup) return '';
 
            // 递归处理基数和指数
            const baseText = processElement(base);
            const supText = processElement(sup);
 
            // 检查是否需要添加括号
            const needBrackets = baseText.length > 1 && !baseText.match(/^[a-zA-Z0-9]$/);
            const formattedBase = needBrackets ? `{${baseText}}` : baseText;
 
            return `${formattedBase}^{${supText}}`;
        }
 
        // 处理下标
        function processSub(element) {
            const base = element.previousElementSibling;
            const sub = element.querySelector('.vlist-t .vlist-r .vlist > span:first-child');
            if (!base || !sub) return '';
 
            // 递归处理基数和下标
            const baseText = processElement(base);
            const subText = processElement(sub);
 
            return `${baseText}_{${subText}}`;
        }
 
        // 修改递归处理元素函数
        function processElement(element) {
            if (!element) return '';
 
            // 避免重复处理
            if (element.dataset.processed) return '';
            element.dataset.processed = 'true';
 
            // 处理不同类型的元素
            if (element.classList.contains('mfrac')) {
                return processFraction(element);
            }
 
            if (element.classList.contains('sqrt')) {
                return processSqrt(element);
            }
 
            // 处理上标和下标
            if (element.classList.contains('msupsub')) {
                const vlist = element.querySelector('.vlist-t .vlist-r .vlist');
                if (!vlist) return '';
 
                const spans = vlist.children;
                let result = '';
 
                // 检查是否有上标和下标
                let sup = null;
                let sub = null;
 
                for (const span of spans) {
                    if (span.style.top.includes('-2.55')) {
                        // 这是下标
                        sub = span.querySelector('.sizing');
                    } else if (span.style.top.includes('-3.063')) {
                        // 这是上标
                        sup = span.querySelector('.sizing');
                    }
                }
 
                // 获取基数
                const base = element.previousElementSibling;
                if (!base) return '';
 
                const baseText = processElement(base);
 
                // 添加上标和下标
                if (sup) {
                    result = `${baseText}^{${processElement(sup)}}`;
                }
                if (sub) {
                    result = result || baseText;
                    result += `_{${processElement(sub)}}`;
                }
 
                return result;
            }
 
            // 处理基本元素
            if (element.classList.contains('mord') ||
                element.classList.contains('mbin') ||
                element.classList.contains('mrel') ||
                element.classList.contains('mop')) {
                if (!element.children.length) {
                    // 处理特殊字符
                    const text = element.textContent;
                    if (text === '±') return '\\pm';
                    if (text === '×') return '\\times';
                    if (text === '÷') return '\\div';
                    if (text === '·') return '\\cdot';
                    if (text === '−') return '-';
                    return text;
                }
            }
 
            // 递归处理子元素
            let result = '';
            const children = Array.from(element.children);
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const childResult = processElement(child);
                if (childResult) {
                    // 检查是否需要添加空格
                    if (i > 0 &&
                        /[a-zA-Z0-9]}]$/.test(result) &&
                        /^[a-zA-Z0-9{]/.test(childResult) &&
                        !child.classList.contains('msupsub')) {
                        result += ' ';
                    }
                    result += childResult;
                }
            }
 
            // 如果没有子元素但有文本内容
            if (!result && element.textContent) {
                result = element.textContent;
            }
 
            return result;
        }
 
        // 开始处理整个公式
        let result = processElement(formula);
 
        // 如果重建失败，返回基本文本
        if (!result) {
            result = formula.textContent.replace(/\s+/g, ' ').trim();
        }
 
        // 清理和格式化结果
        return formatLatexFormula(result);
    }
 
    // 格式化LaTeX公式
    function formatLatexFormula(formula) {
        return formula
            // 修复可能的语法问题
            .replace(/([a-zA-Z0-9])\\/g, '$1 \\')
            // 处理连续的负号
            .replace(/--/g, '-')
            // 修复特殊命令后的空格
            .replace(/\\(times|pm|div|cdot)(?=[a-zA-Z])/g, '\\$1 ')
            // 修复运算符周围的空格
            .replace(/\s*([=+\-*/±])\s*/g, ' $1 ')
            // 修复括号周围的空格
            .replace(/\s*([{}()])\s*/g, '$1')
            // 修复根号内的空格
            .replace(/\\sqrt\{\s+/g, '\\sqrt{')
            .replace(/\s+\}/g, '}')
            // 修复上标和下标格式
            .replace(/\^{(\d+)}/g, '^{$1}')
            .replace(/_{(\d+)}/g, '_{$1}')
            // 修复多余的空格
            .replace(/\s+/g, ' ')
            .trim();
    }
 
    // 显示公式复制提示
    function showFormulaPrompt(formula, sourceElement) {
        // 检查是否已存在提示框
        if (document.querySelector('.formula-prompt')) {
            document.body.removeChild(document.querySelector('.formula-prompt'));
        }
 
        // 创建提示框
        const prompt = document.createElement('div');
        prompt.className = 'formula-prompt';
        prompt.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(34, 34, 34, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            transition: opacity 0.3s;
        `;
 
        // 提示框内容
        prompt.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">数学公式</div>
            <div style="margin-bottom: 12px; color: #ddd; font-size: 12px; word-break: break-all;
                        background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;
                        font-family: monospace; overflow-x: auto;">${formula}</div>
            <div style="display: flex; gap: 10px;">
                <button class="copy-latex" style="
                    background-color: #00a1d6;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    flex: 1;
                ">复制LaTeX</button>
                <button class="copy-text" style="
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    flex: 1;
                ">复制文本</button>
                <button class="close-prompt" style="
                    background-color: transparent;
                    color: #ddd;
                    border: 1px solid #666;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                ">关闭</button>
            </div>
        `;
 
        // 添加到页面
        document.body.appendChild(prompt);
 
        // 复制LaTeX按钮点击事件
        prompt.querySelector('.copy-latex').addEventListener('click', function() {
            GM_setClipboard(formula);
            showNotification('已复制LaTeX公式');
            document.body.removeChild(prompt);
        });
 
        // 复制文本按钮点击事件
        prompt.querySelector('.copy-text').addEventListener('click', function() {
            let textFormula = formula
                // 处理分式
                .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
                // 处理上标
                .replace(/\^{([^{}]+)}/g, '^($1)')
                .replace(/\^(\d+)(?![)}])/g, '^($1)')
                // 处理下标
                .replace(/_{([^{}]+)}/g, '_($1)')
                .replace(/_(\d+)(?![)}])/g, '_($1)')
                // 处理根号
                .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
                // 处理特殊符号（确保添加空格）
                .replace(/\\times(?!\s)/g, '* ')
                .replace(/\\pm(?!\s)/g, '± ')
                .replace(/\\div(?!\s)/g, '/ ')
                .replace(/\\cdot(?!\s)/g, '* ')
                // 处理希腊字母
                .replace(/\\(alpha|beta|gamma|delta|epsilon|theta|pi|sigma|omega)/g, '\\$1')
                // 保持运算符周围的空格
                .replace(/([a-zA-Z0-9])([\+\-\*\/=±])/g, '$1 $2')
                .replace(/([\+\-\*\/=±])([a-zA-Z0-9])/g, '$1 $2')
                // 清理多余的空格和括号
                .replace(/\(\s+/g, '(')
                .replace(/\s+\)/g, ')')
                .replace(/\s+/g, ' ')
                .trim();
 
            GM_setClipboard(textFormula);
            showNotification('已复制文本形式');
            document.body.removeChild(prompt);
        });
 
        // 关闭按钮点击事件
        prompt.querySelector('.close-prompt').addEventListener('click', function() {
            document.body.removeChild(prompt);
        });
 
        // 10秒后自动关闭
        setTimeout(() => {
            if (document.body.contains(prompt)) {
                prompt.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(prompt)) {
                        document.body.removeChild(prompt);
                    }
                }, 300);
            }
        }, 10000);
    }
 
    // 显示信息遮罩层
    function showInfoOverlay() {
        let apiData = null; // Variable to store API response
        
        // 初始化 API 数据为未加载状态
        window.currentApiData = null;

        // 检查是否已存在卡片
        if (document.querySelector('.info-overlay')) {
            return;
        }
 
        // 创建卡片元素
        const overlay = document.createElement('div');
        overlay.className = 'info-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.85); /* 半透明黑色背景 */
            color: white;
            padding: 20px;
            z-index: 10002; /* 比其他UI高 */
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px); /* 背景模糊效果 */
            transition: opacity 0.3s ease-in-out;
        `;
 
        // 创建内容容器
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%);
            padding: 35px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            position: relative;
            width: 95%;
            height: 95vh;
            max-height: 90vh;
            overflow-y: auto;
            font-size: 14px;
            text-align: center;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        `;
 
        // Interval ID for dynamic update
        let intervalId = null;
        let resizeListener = null;
 
        // 更新时间和视口大小的函数
        function updateDynamicInfo() {
            const now = new Date();
            // 格式化日期时间 (YYYY-MM-DD HH:MM:SS)
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
 
            const timeElement = overlay.querySelector('.info-time');
            if (timeElement) {
                timeElement.textContent = formattedDateTime;
            }
 
            const viewportElement = overlay.querySelector('.info-viewport');
            if (viewportElement) {
                viewportElement.textContent = `${window.innerWidth} x ${window.innerHeight}`;
            }
        }
 
        // 获取设置和其他静态信息
        const settings = getSettings();
        const installDate = GM_getValue('installDate', Date.now());
        const daysUsed = Math.ceil((Date.now() - installDate) / (1000 * 60 * 60 * 24));
 
        // 构建HTML内容
        contentContainer.innerHTML = `
            <h2 style="margin-top: 0; margin-bottom: 20px; color: #4fc3f7; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); font-weight: 300;">
                信息面板
                <span class="info-time" style="margin-left: 15px; font-size: 24px; color: #81c784; font-family: 'Courier New', monospace; background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 8px;"></span>
            </h2>
 
            <!-- 日历卡片 -->
            <div style="display: flex; justify-content: center; margin-bottom: 25px;">
                <div style="width: 220px; height: 280px; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 15px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); overflow: hidden; color: #333; transition: transform 0.3s ease;">
                    <!-- 红色顶部 -->
                    <div style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; text-align: center; padding: 12px 0; font-size: 18px; font-weight: 500;" class="calendar-header">
                        <span class="calendar-year">2025</span>年<span class="calendar-month">4</span>月
                    </div>
 
                    <!-- 大日期数字 -->
                    <div style="font-size: 96px; font-weight: 700; text-align: center; line-height: 1.1; padding: 25px 0 15px; font-family: 'Arial', sans-serif; background: linear-gradient(45deg, #333 0%, #666 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;" class="calendar-day">
                        26
                    </div>
 
                    <!-- 年份日期信息 -->
                    <div style="text-align: center; font-size: 13px; color: #666; padding: 8px 0; background: rgba(0,0,0,0.03);">
                        第<span class="calendar-day-of-year">116</span>天 第<span class="calendar-week">17</span>周
                    </div>
 
                    <!-- 农历信息 -->
                    <div style="text-align: center; font-size: 16px; padding: 12px 0; color: #333; background: linear-gradient(to bottom, #fff 0%, #f8f9fa 100%);" class="calendar-lunar-container">
                        <span class="calendar-lunar" style="font-weight: 600;">加载中...</span>
                        <span class="calendar-weekday" style="color: #666;">加载中...</span>
                    </div>
 
                    <!-- 旧历标签 -->
                    <div style="text-align: center; background: linear-gradient(to bottom, #f5f5f5 0%, #eee 100%); padding: 6px 0; font-size: 12px; color: #888;">
                        旧历
                    </div>
                </div>
            </div>
 
            <!-- 中间：农历日期信息 -->
            <div style="display: flex; background: linear-gradient(135deg, rgba(25, 25, 25, 0.6) 0%, rgba(35, 35, 35, 0.6) 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; justify-content: space-around; align-items: center; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(5px);">
                <div style="text-align: center; padding: 0 20px; position: relative;">
                    <div style="font-size: 18px; color: #bdbdbd; margin-bottom: 8px; font-weight: 300;">农历</div>
                    <div class="info-lunar-date" style="font-size: 32px; color: #ffeb3b; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">加载中...</div>
                </div>
                <div style="text-align: center; padding: 0 20px; position: relative;">
                    <div style="font-size: 18px; color: #bdbdbd; margin-bottom: 8px; font-weight: 300;">干支</div>
                    <div class="info-ganzhi" style="font-size: 24px; color: #81c784; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">加载中...</div>
                </div>
                <div style="text-align: center; padding: 0 20px; position: relative;">
                    <div style="font-size: 18px; color: #bdbdbd; margin-bottom: 8px; font-weight: 300;">节气</div>
                    <div class="info-jieqi" style="font-size: 32px; color: #64b5f6; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">加载中...</div>
                </div>
                <div style="text-align: center; padding: 0 20px; position: relative;">
                    <div style="font-size: 18px; color: #bdbdbd; margin-bottom: 8px; font-weight: 300;">冲煞</div>
                    <div class="info-chongsha" style="font-size: 24px; color: #e57373; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">加载中...</div>
                </div>
            </div>
 
            <!-- 底部：节气、宜忌信息 -->
            <div style="display: flex; flex-direction: row; gap: 15px;">
                <!-- 左下：节气和节日 -->
                <div style="flex: 1; background: linear-gradient(135deg, rgba(25, 25, 25, 0.6) 0%, rgba(35, 35, 35, 0.6) 100%); border-radius: 12px; padding: 20px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(5px);">
                    <h3 style="margin-top: 0; color: #64b5f6; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 12px; font-weight: 300;">
                        <span style="font-size: 18px; vertical-align: middle;">🌿</span> 节气与节日
                    </h3>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 12px 15px; line-height: 1.6;">
                        <strong style="color: #9e9e9e; font-weight: 500;">节气信息:</strong>
                        <span class="info-jieqi" style="color: #7986cb; background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 6px;">加载中...</span>
                        <strong style="color: #9e9e9e; font-weight: 500;">节日事件:</strong>
                        <span class="info-jieri" style="color: #ffcc80; background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 6px;">加载中...</span>
                        <strong style="color: #9e9e9e; font-weight: 500;">彭祖百忌:</strong>
                        <span class="info-pengzu" style="color: #b39ddb; background: rgba(0,0,0,0.2); padding: 4px 12px; border-radius: 6px; font-size: 0.9em;">加载中...</span>
                    </div>
                </div>
 
                <!-- 右下：宜忌 -->
                <div style="flex: 1; background: linear-gradient(135deg, rgba(25, 25, 25, 0.6) 0%, rgba(35, 35, 35, 0.6) 100%); border-radius: 12px; padding: 20px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(5px);">
                    <h3 style="margin-top: 0; color: #64b5f6; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 12px; font-weight: 300;">
                        <span style="font-size: 18px; vertical-align: middle;">📅</span> 今日宜忌
                    </h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="background: linear-gradient(135deg, rgba(38, 77, 0, 0.2) 0%, rgba(38, 77, 0, 0.1) 100%); padding: 15px; border-radius: 8px; border-left: 3px solid #81c784; backdrop-filter: blur(5px);">
                            <strong style="color: #81c784; display: block; margin-bottom: 8px; font-size: 15px;">● 宜</strong>
                            <div class="info-yi" style="color: #a5d6a7; word-break: break-word; line-height: 1.6; font-size: 13px;">加载中...</div>
                        </div>
                        <div style="background: linear-gradient(135deg, rgba(77, 0, 0, 0.2) 0%, rgba(77, 0, 0, 0.1) 100%); padding: 15px; border-radius: 8px; border-left: 3px solid #e57373; backdrop-filter: blur(5px);">
                            <strong style="color: #e57373; display: block; margin-bottom: 8px; font-size: 15px;">● 忌</strong>
                            <div class="info-ji" style="color: #ef9a9a; word-break: break-word; line-height: 1.6; font-size: 13px;">加载中...</div>
                        </div>
                    </div>
                </div>
            </div>
 
            <!-- 调试信息按钮 -->
            <div style="text-align: center; margin-top: 35px;">
                <button class="debug-info-toggle" style="
                    background: linear-gradient(135deg, rgba(30, 30, 30, 0.7) 0%, rgba(40, 40, 40, 0.7) 100%);
                    color: #757575;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 10px 20px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                ">显示调试信息</button>
            </div>
 
            <!-- 调试信息面板（默认隐藏） -->
            <div class="debug-info-panel" style="display: none; margin-top: 20px;">
                <!-- 反馈提示横幅 -->
                <div style="
                    background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
                    border-left: 5px solid #E65100;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                ">
                    <div style="font-size: 36px; line-height: 1;">📸</div>
                    <div style="flex: 1;">
                        <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">
                            🔍 反馈 BUG 必看
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; opacity: 0.95;">
                            如遇到问题，请将下方<strong>所有调试信息截图</strong>（包括清理记录），然后前往脚本猫或 Greasy Fork 反馈。
                            截图包含的详细信息能帮助我们更快定位和修复问题！
                        </div>
                        <div style="margin-top: 8px; display: flex; gap: 10px;">
                            <button class="copy-all-debug-info" style="
                                background: rgba(255, 255, 255, 0.2);
                                color: white;
                                border: 1px solid rgba(255, 255, 255, 0.5);
                                padding: 5px 12px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: bold;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                📋 复制全部调试信息
                            </button>
                            <a href="https://greasyfork.org.cn/zh-CN/scripts/524527-网站url简化-去除杂乱参数" target="_blank" style="
                                background: rgba(255, 255, 255, 0.9);
                                color: #F57C00;
                                border: none;
                                padding: 5px 12px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: bold;
                                text-decoration: none;
                                display: inline-block;
                                transition: all 0.2s;
                            " onmouseover="this.style.background='white'" onmouseout="this.style.background='rgba(255,255,255,0.9)'">
                                🐛 前往反馈页面
                            </a>
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: row; gap: 10px; margin-bottom: 20px;">
                    <!-- 左侧：系统信息 -->
                    <div style="flex: 1; background: rgba(20, 20, 20, 0.3); border-radius: 5px; padding: 15px; text-align: left;">
                        <h3 style="margin-top: 0; color: #64b5f6; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 8px;">
                            <span style="font-size: 16px; vertical-align: middle;">💻</span> 系统信息
                        </h3>
                        <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 10px; line-height: 1.5;">
                            <strong style="color: #9e9e9e;">浏览器语言:</strong> <span>${navigator.language}</span>
                            <strong style="color: #9e9e9e;">操作系统:</strong> <span>${navigator.platform}</span>
                            <strong style="color: #9e9e9e;">屏幕分辨率:</strong> <span>${screen.width} x ${screen.height}</span>
                            <strong style="color: #9e9e9e;">浏览器视口:</strong> <span class="info-viewport" style="font-family: monospace;"></span>
                            <strong style="color: #9e9e9e;">脚本总使用:</strong> <span style="color: #ffb74d;">${settings.usageCount} 次</span>
                            <strong style="color: #9e9e9e;">脚本已使用:</strong> <span style="color: #ffb74d;">${daysUsed} 天</span>
                        </div>
                    </div>
 
                    <!-- 右侧：页面信息 -->
                    <div style="flex: 1; background: rgba(20, 20, 20, 0.3); border-radius: 5px; padding: 15px; text-align: left;">
                        <h3 style="margin-top: 0; color: #64b5f6; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 8px;">
                            <span style="font-size: 16px; vertical-align: middle;">🌐</span> 页面信息
                        </h3>
                        <div style="line-height: 1.5;">
                            <div style="margin-bottom: 8px;">
                                <strong style="color: #9e9e9e; display: block; margin-bottom: 2px;">页面标题:</strong>
                                <div style="word-break: break-all; max-height: 60px; overflow-y: auto; padding: 5px; background: rgba(0,0,0,0.2); border-radius: 3px;">${document.title}</div>
                            </div>
                            <div>
                                <strong style="color: #9e9e9e; display: block; margin-bottom: 2px;">页面URL:</strong>
                                <div style="word-break: break-all; max-height: 60px; overflow-y: auto; padding: 5px; background: rgba(0,0,0,0.2); border-radius: 3px;">
                                    <a href="${window.location.href}" target="_blank" style="color: #4fc3f7;">${window.location.href}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
 
                <!-- API 响应数据 -->
                <div style="background: rgba(20, 20, 20, 0.3); border-radius: 5px; padding: 15px; text-align: left; margin-bottom: 10px;">
                    <h3 style="margin-top: 0; color: #64b5f6; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 8px;">
                        <span style="font-size: 16px; vertical-align: middle;">🔄</span> API 响应数据
                    </h3>
                    <pre class="api-response-data" style="
                        background: rgba(0, 0, 0, 0.2);
                        padding: 10px;
                        border-radius: 4px;
                        color: #aaa;
                        font-family: monospace;
                        font-size: 12px;
                        max-height: 200px;
                        overflow-y: auto;
                        white-space: pre-wrap;
                        word-break: break-all;
                    ">加载中...</pre>
                </div>

                <!-- URL 清理记录 -->
                <div style="background: rgba(20, 20, 20, 0.3); border-radius: 5px; padding: 15px; text-align: left; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 8px;">
                        <h3 style="margin: 0; color: #64b5f6;">
                            <span style="font-size: 16px; vertical-align: middle;">📝</span> URL 清理记录 (最近10条)
                        </h3>
                        <div style="display: flex; gap: 8px;">
                            <button class="view-all-logs-btn" style="
                                background: rgba(76, 175, 80, 0.2);
                                color: #4CAF50;
                                border: 1px solid #4CAF50;
                                padding: 4px 10px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 11px;
                            ">查看全部</button>
                            <button class="copy-logs-feedback-btn" style="
                                background: rgba(33, 150, 243, 0.2);
                                color: #2196F3;
                                border: 1px solid #2196F3;
                                padding: 4px 10px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 11px;
                            ">复制反馈</button>
                        </div>
                    </div>
                    <div class="cleaning-logs-preview" style="
                        background: rgba(0, 0, 0, 0.2);
                        padding: 10px;
                        border-radius: 4px;
                        max-height: 300px;
                        overflow-y: auto;
                    ">
                        ${(() => {
                            const logs = getCleaningLogs().slice(0, 10);
                            if (logs.length === 0) {
                                return '<div style="color: #999; text-align: center; padding: 20px;">暂无清理记录</div>';
                            }
                            return logs.map((log, index) => `
                                <div style="
                                    background: rgba(40, 40, 40, 0.5);
                                    padding: 10px;
                                    border-radius: 4px;
                                    margin-bottom: 8px;
                                    border-left: 3px solid ${log.savedChars > 0 ? '#4CAF50' : '#999'};
                                ">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <span style="
                                                background: ${log.action === 'redirect' ? '#FF9800' : log.action === 'replaceState' ? '#2196F3' : '#999'};
                                                color: white;
                                                padding: 2px 6px;
                                                border-radius: 3px;
                                                font-size: 10px;
                                            ">${log.action === 'redirect' ? '🔄' : log.action === 'replaceState' ? '✏️' : '⏸️'}</span>
                                            <span style="color: #4fc3f7; font-weight: bold; font-size: 12px;">${log.siteName}</span>
                                            <span style="color: #999; font-size: 10px;">${log.timestampLocal}</span>
                                        </div>
                                        <span style="
                                            color: ${log.savedChars > 0 ? '#4CAF50' : '#999'};
                                            font-size: 11px;
                                        ">节省 ${log.savedChars} 字符</span>
                                    </div>
                                    <div style="font-size: 10px; color: #e57373; margin-bottom: 4px;">
                                        原始: <span style="font-family: monospace; word-break: break-all;">${log.originalUrl.length > 100 ? log.originalUrl.substring(0, 100) + '...' : log.originalUrl}</span>
                                    </div>
                                    <div style="font-size: 10px; color: #81c784;">
                                        清理: <span style="font-family: monospace; word-break: break-all;">${log.cleanedUrl.length > 100 ? log.cleanedUrl.substring(0, 100) + '...' : log.cleanedUrl}</span>
                                    </div>
                                </div>
                            `).join('');
                        })()}
                    </div>
                </div>
            </div>
        `;
 
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;'; // HTML entity for 'X'
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            border: none;
            z-index: 10003; /* Ensure button is above content */
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            padding: 0 10px;
            line-height: 1;
            transition: color 0.2s;
        `;
        closeButton.onmouseover = () => closeButton.style.color = '#fff';
        closeButton.onmouseout = () => closeButton.style.color = '#aaa';
 
        // 清理函数
        function closeOverlay() {
            clearInterval(intervalId);
            window.removeEventListener('resize', resizeListener);
            document.body.removeChild(overlay);
        }
 
        // 为关闭按钮添加事件
        closeButton.addEventListener('click', closeOverlay);
 
        // Function to update API data display
        function updateApiDisplay(data) {
            // 为所有元素添加空值检查，避免尝试设置不存在元素的 textContent 属性
            const lunarDateEl = overlay.querySelector('.info-lunar-date');
            if (lunarDateEl) lunarDateEl.textContent = `${data.nyue}${data.nri}`;
 
            const calendarLunarEl = overlay.querySelector('.calendar-lunar');
            if (calendarLunarEl) calendarLunarEl.textContent = `${data.nyue}${data.nri}`;
 
            const weekdayEl = overlay.querySelector('.calendar-weekday');
            if (weekdayEl) weekdayEl.textContent = data.xingqi;
 
            const ganzhiEl = overlay.querySelector('.info-ganzhi');
            if (ganzhiEl) ganzhiEl.textContent = `${data.ganzhinian} ${data.ganzhiyue} ${data.ganzhiri}`;
 
            const xingqiEl = overlay.querySelector('.info-xingqi');
            if (xingqiEl) xingqiEl.textContent = `${data.xingqi}`;
 
            // 获取节气信息 - 同时处理中间部分和左下方的节气信息
            let jieqiInfo = '无节气';
            if (data.jieqimsg && data.jieqimsg.trim() !== '') {
                jieqiInfo = data.jieqimsg;
            } else if (data.jieqi && data.jieqi.trim() !== '') {
                jieqiInfo = data.jieqi;
            }
 
            // 更新所有节气相关元素
            const jieqiElements = overlay.querySelectorAll('.info-jieqi');
            jieqiElements.forEach(element => {
                if (element) element.textContent = jieqiInfo;
            });
 
            // 节日信息 - 同样处理多处显示
            let jieriInfo = '无节日';
            if (data.jieri && data.jieri.trim() !== '') {
                jieriInfo = data.jieri;
            }
 
            const jieriElements = overlay.querySelectorAll('.info-jieri');
            jieriElements.forEach(element => {
                if (element) element.textContent = jieriInfo;
            });
 
            const chongshaEl = overlay.querySelector('.info-chongsha');
            if (chongshaEl) chongshaEl.textContent = data.xiangchong || '无';
 
            const yiEl = overlay.querySelector('.info-yi');
            if (yiEl) yiEl.textContent = data.yi || '无';
 
            const jiEl = overlay.querySelector('.info-ji');
            if (jiEl) jiEl.textContent = data.ji || '无';
 
            const pengzuEl = overlay.querySelector('.info-pengzu');
            if (pengzuEl) pengzuEl.textContent = data.pengzu || '无';
 
            // Update calendar view
            const today = new Date();
            const yearEl = overlay.querySelector('.calendar-year');
            if (yearEl) yearEl.textContent = data.ynian;
 
            const monthEl = overlay.querySelector('.calendar-month');
            if (monthEl) monthEl.textContent = data.yyue;
 
            const dayEl = overlay.querySelector('.calendar-day');
            if (dayEl) dayEl.textContent = data.yri;
 
            // Calculate day of year
            const startOfYear = new Date(today.getFullYear(), 0, 0);
            const diff = today - startOfYear;
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);
 
            const dayOfYearEl = overlay.querySelector('.calendar-day-of-year');
            if (dayOfYearEl) dayOfYearEl.textContent = dayOfYear;
 
            // Get week number
            const weekNumber = Math.ceil(dayOfYear / 7);
            const weekEl = overlay.querySelector('.calendar-week');
            if (weekEl) weekEl.textContent = weekNumber;
 
            // 显示 API 响应数据为简单文本格式
            const apiResponseEl = overlay.querySelector('.api-response-data');
            if (apiResponseEl) {
                try {
                    // 获取节气信息
                    let jieqiInfo = '无节气';
                    if (data.jieqimsg && data.jieqimsg.trim() !== '') {
                        jieqiInfo = data.jieqimsg;
                    } else if (data.jieqi && data.jieqi.trim() !== '') {
                        jieqiInfo = data.jieqi;
                    }

                    // 获取节日信息
                    let jieriInfo = '无节日';
                    if (data.jieri && data.jieri.trim() !== '') {
                        jieriInfo = data.jieri;
                    }

                    // 格式化 API 数据为可读文本
                    const apiText = `日期: ${data.ynian}-${data.yyue}-${data.yri} ${data.xingqi}
农历: ${data.nyue}${data.nri}
干支: ${data.ganzhinian} ${data.ganzhiyue} ${data.ganzhiri}
节气: ${jieqiInfo}
节日: ${jieriInfo}
冲煞: ${data.xiangchong || '无'}
彭祖百忌: ${data.pengzu || '无'}
宜: ${data.yi || '无'}
忌: ${data.ji || '无'}`;

                    apiResponseEl.textContent = apiText;
                    
                    // 保存到全局变量供复制功能使用
                    window.currentApiData = {
                        text: apiText,
                        raw: data
                    };
                } catch (e) {
                    console.error('Error displaying API data:', e);
                    apiResponseEl.textContent = '数据显示出错';
                    window.currentApiData = null;
                }
            }
        }
 
        // Function to set API display to loading error
        function setApiLoadingError() {
            const errorMsg = '加载失败';
 
            // 为所有元素添加空值检查
            const elementsToUpdate = [
                '.info-lunar-date', '.calendar-lunar', '.calendar-weekday',
                '.info-ganzhi', '.info-xingqi', '.info-pengzu'
            ];
 
            elementsToUpdate.forEach(selector => {
                const element = overlay.querySelector(selector);
                if (element) element.textContent = errorMsg;
            });
 
            // 单独处理节气相关元素 - 确保所有节气显示都更新
            const jieqiElements = overlay.querySelectorAll('.info-jieqi');
            jieqiElements.forEach(element => {
                if (element) element.textContent = errorMsg;
            });
 
            // 单独处理节日相关元素
            const jieriElements = overlay.querySelectorAll('.info-jieri');
            jieriElements.forEach(element => {
                if (element) element.textContent = errorMsg;
            });
 
            // 更新其他元素
            const chongshaEl = overlay.querySelector('.info-chongsha');
            if (chongshaEl) chongshaEl.textContent = errorMsg;
 
            const yiEl = overlay.querySelector('.info-yi');
            if (yiEl) yiEl.textContent = errorMsg;
 
            const jiEl = overlay.querySelector('.info-ji');
            if (jiEl) jiEl.textContent = errorMsg;
 
            const pengzuEl = overlay.querySelector('.info-pengzu');
            if (pengzuEl) pengzuEl.textContent = errorMsg;
 
            // 显示API错误信息
            const apiResponseEl = overlay.querySelector('.api-response-data');
            if (apiResponseEl) {
                apiResponseEl.textContent = 'API请求失败：无法获取数据，请稍后再试';
                apiResponseEl.style.color = '#c00';
                
                // 保存错误状态
                window.currentApiData = {
                    text: 'API请求失败',
                    error: true
                };
            }
        }
 
        // 为显示/隐藏调试信息按钮添加事件
        // 使用setTimeout确保DOM完全加载后再绑定事件
        setTimeout(() => {
            const debugToggleBtn = overlay.querySelector('.debug-info-toggle');
            const debugPanel = overlay.querySelector('.debug-info-panel');

            if (debugToggleBtn && debugPanel) {
                debugToggleBtn.addEventListener('click', function() {
                    const isVisible = debugPanel.style.display !== 'none';
                    debugPanel.style.display = isVisible ? 'none' : 'block';
                    debugToggleBtn.textContent = isVisible ? '显示调试信息' : '隐藏调试信息';
                    debugToggleBtn.style.color = isVisible ? '#757575' : '#4fc3f7';

                    // 如果显示调试面板，则滚动到底部
                    if (!isVisible) {
                        setTimeout(() => {
                            contentContainer.scrollTo({
                                top: contentContainer.scrollHeight,
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                });
            } else {
                console.error('调试按钮或面板元素未找到');
            }

            // 为清理记录按钮添加事件监听器
            const viewAllLogsBtn = overlay.querySelector('.view-all-logs-btn');
            if (viewAllLogsBtn) {
                viewAllLogsBtn.addEventListener('click', function() {
                    showCleaningLogsPanel();
                });
            }

            const copyLogsFeedbackBtn = overlay.querySelector('.copy-logs-feedback-btn');
            if (copyLogsFeedbackBtn) {
                copyLogsFeedbackBtn.addEventListener('click', function() {
                    copyLogsForFeedback();
                });
            }

            // 为"复制全部调试信息"按钮添加事件监听器
            const copyAllDebugBtn = overlay.querySelector('.copy-all-debug-info');
            if (copyAllDebugBtn) {
                copyAllDebugBtn.addEventListener('click', function() {
                    // 收集所有调试信息
                    const logs = getCleaningLogs().slice(0, 10);
                    const settings = getSettings();
                    const installDate = GM_getValue('installDate', Date.now());
                    const daysUsed = Math.ceil((Date.now() - installDate) / (1000 * 60 * 60 * 24));
                    
                    let debugInfo = '====== URL 清理脚本 - 完整调试信息 ======\n\n';
                    debugInfo += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
                    debugInfo += `脚本版本: 2.2\n\n`;
                    
                    debugInfo += '=== 系统信息 ===\n';
                    debugInfo += `浏览器语言: ${navigator.language}\n`;
                    debugInfo += `操作系统: ${navigator.platform}\n`;
                    debugInfo += `User Agent: ${navigator.userAgent}\n`;
                    debugInfo += `屏幕分辨率: ${screen.width} x ${screen.height}\n`;
                    debugInfo += `浏览器视口: ${window.innerWidth} x ${window.innerHeight}\n`;
                    debugInfo += `脚本总使用: ${settings.usageCount} 次\n`;
                    debugInfo += `脚本已使用: ${daysUsed} 天\n\n`;
                    
                    debugInfo += '=== 页面信息 ===\n';
                    debugInfo += `页面标题: ${document.title}\n`;
                    debugInfo += `页面URL: ${window.location.href}\n\n`;
                    
                    debugInfo += '=== 脚本设置 ===\n';
                    debugInfo += `总开关: ${settings.enableCleaner ? '启用' : '禁用'}\n`;
                    debugInfo += `清理模式: ${settings.cleanerMode === 'notify' ? '提示模式' : '静默模式'}\n`;
                    debugInfo += `必应搜索: ${settings.enableBing ? '启用' : '禁用'}\n`;
                    debugInfo += `B站视频: ${settings.enableBilibili ? '启用' : '禁用'}\n`;
                    debugInfo += `百度搜索: ${settings.enableBaidu ? '启用' : '禁用'}\n`;
                    debugInfo += `KIMI AI: ${settings.enableKimi ? '启用' : '禁用'}\n`;
                    debugInfo += `Minecraft Wiki: ${settings.enableMinecraft ? '启用' : '禁用'}\n`;
                    debugInfo += `360搜索: ${settings.enable360 ? '启用' : '禁用'}\n`;
                    debugInfo += `B站剪贴板清理: ${settings.enableClipboardCleaner ? '启用' : '禁用'}\n\n`;
                    
                    // 添加 API 响应数据
                    debugInfo += '=== API 响应数据 ===\n';
                    if (window.currentApiData) {
                        if (window.currentApiData.error) {
                            debugInfo += 'API 请求失败\n';
                        } else {
                            debugInfo += window.currentApiData.text + '\n';
                        }
                    } else {
                        debugInfo += '未加载或不可用\n';
                    }
                    debugInfo += '\n';
                    
                    debugInfo += `=== URL 清理记录 (最近 ${logs.length} 条) ===\n\n`;
                    
                    if (logs.length === 0) {
                        debugInfo += '暂无清理记录\n';
                    } else {
                        logs.forEach((log, index) => {
                            debugInfo += `[记录 ${index + 1}]\n`;
                            debugInfo += `时间: ${log.timestampLocal}\n`;
                            debugInfo += `网站: ${log.siteName}\n`;
                            debugInfo += `页面: ${log.pageTitle}\n`;
                            debugInfo += `操作: ${log.action}\n`;
                            debugInfo += `节省: ${log.savedChars} 字符\n`;
                            debugInfo += `原始URL: ${log.originalUrl}\n`;
                            debugInfo += `清理后: ${log.cleanedUrl}\n`;
                            debugInfo += `\n${'='.repeat(60)}\n\n`;
                        });
                    }
                    
                    debugInfo += '\n提示: 请将此信息连同截图一起反馈给开发者\n';
                    debugInfo += '反馈地址: https://greasyfork.org.cn/zh-CN/scripts/524527\n';
                    
                    // 复制到剪贴板
                    GM_setClipboard(debugInfo);
                    
                    // 修改按钮文本提示已复制
                    const originalText = copyAllDebugBtn.textContent;
                    copyAllDebugBtn.textContent = '✅ 已复制！';
                    copyAllDebugBtn.style.background = 'rgba(76, 175, 80, 0.3)';
                    
                    setTimeout(() => {
                        copyAllDebugBtn.textContent = originalText;
                        copyAllDebugBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                    }, 2000);
                    
                    showNotification('调试信息已复制到剪贴板');
                });
            }
        }, 0);
 
        // 组合元素
        overlay.appendChild(contentContainer);
        contentContainer.appendChild(closeButton); // Append button to the content card
 
        // 添加到页面
        document.body.appendChild(overlay);
 
        // Fetch data from API
        // 原始直接请求的API URL
        // const apiUrl = 'https://cn.apihz.cn/api/time/getday.php?id=10000687&key=3cfab27db919e2fa3cf8075df8f04732';
 
        // 替换为通过代理脚本请求
        const apiUrl = 'https://jiao.mg-tool.cn/api/info_panel.php'; // 使用已部署的代理脚本URL
 
        // 验证机制已移除（后续将重写）
        // function generateAuthToken() { }
 
        // 延迟发送API请求，确保DOM元素已经完全加载
        setTimeout(() => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                // 请求头鉴权已移除
                onload: function(response) {
                    try {
                        apiData = JSON.parse(response.responseText);
                        if (apiData.code === 200) {
                            updateApiDisplay(apiData);
                        } else {
                            console.error('API Error:', apiData);
                            setApiLoadingError();
                        }
                    } catch (e) {
                        console.error('Error parsing API response:', e);
                        setApiLoadingError();
                    }
                },
                onerror: function(error) {
                    console.error('GM_xmlhttpRequest Error:', error);
                    setApiLoadingError();
                }
            });
        }, 500); // 延迟500毫秒发送请求
 
        // Initial time update
        updateDynamicInfo();
 
        // Start dynamic update interval
        intervalId = setInterval(updateDynamicInfo, 1000);
 
        // Add resize listener for viewport size
        resizeListener = updateDynamicInfo; // Assign function directly
        window.addEventListener('resize', resizeListener);
 
        // 初始加载文本
        overlay.querySelector('.info-lunar-date').textContent = '加载中...';
        overlay.querySelector('.calendar-lunar').textContent = '加载中...';
        overlay.querySelector('.calendar-weekday').textContent = '加载中...';
        overlay.querySelector('.info-ganzhi').textContent = '加载中...';
        overlay.querySelector('.info-xingqi').textContent = '加载中...';
        overlay.querySelector('.info-jieqi').textContent = '加载中...';
        overlay.querySelector('.info-jieri').textContent = '加载中...';
        overlay.querySelector('.info-chongsha').textContent = '加载中...';
        overlay.querySelector('.info-yi').textContent = '加载中...';
        overlay.querySelector('.info-ji').textContent = '加载中...';
        overlay.querySelector('.info-pengzu').textContent = '加载中...';
    }
 
    init();
})();