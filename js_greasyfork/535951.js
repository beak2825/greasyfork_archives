// ==UserScript==
// @name         Plyr Video Controller Pro (可安装版)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  带浮动控制面板的Plyr视频控制器（播放时触发跳转+自动点击确认）
// @author       glenn
// @match        http://dxzx.ouc.edu.cn/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535951/Plyr%20Video%20Controller%20Pro%20%28%E5%8F%AF%E5%AE%89%E8%A3%85%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535951/Plyr%20Video%20Controller%20Pro%20%28%E5%8F%AF%E5%AE%89%E8%A3%85%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储
    const config = {
        autoSkip: GM_getValue('autoSkip', true),
        enableSeek: GM_getValue('enableSeek', true),
        playbackSpeed: GM_getValue('speed', 2.0),
        skipDelay: GM_getValue('delay', 100),
        autoClick: GM_getValue('autoClick', true),
        debugMode: GM_getValue('debug', true)
    };

    // 精准样式（匹配目标网站UI）
    GM_addStyle(`
        #plyr-control-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(255,255,255,0.95);
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px 15px;
            width: 260px;
            box-shadow: 0 3px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #plyr-control-panel h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }
        .control-row {
            margin: 12px 0;
            display: flex;
            align-items: center;
        }
        .control-label {
            flex: 1;
            font-size: 14px;
            color: #555;
        }
        .control-btn {
            background: #f8f9fa;
            border: 1px solid #dadce0;
            color: #3c4043;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        }
        .control-btn:hover {
            background: #f1f3f4;
            border-color: #d2e3fc;
        }
        .control-checkbox {
            margin-right: 8px;
            accent-color: #1a73e8;
        }
        .speed-input {
            width: 50px;
            padding: 4px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            text-align: center;
        }
    `);

    // 自动点击"我知道了"（精准匹配图片结构）
    function autoClickConfirm() {
        if (!config.autoClick) return false;
        
        // 精确匹配路径：.public_cont1 > .public_table > .public_text > a.public_result
        const confirmButton = document.querySelector('.public_cont1 .public_table .public_text a.public_result');
        
        if (confirmButton && confirmButton.textContent.trim() === "我知道了") {
            confirmButton.click();
            debugLog('自动点击成功');
            return true;
        }
        return false;
    }

    // 创建控制面板（中文化界面）
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'plyr-control-panel';
        panel.innerHTML = `
            <h3>Plyr视频控制器</h3>
            <div class="control-row">
                <label class="control-label">
                    <input type="checkbox" class="control-checkbox" id="auto-skip" ${config.autoSkip ? 'checked' : ''}>
                    自动跳转结尾
                </label>
            </div>
            <div class="control-row">
                <label class="control-label">
                    <input type="checkbox" class="control-checkbox" id="enable-seek" ${config.enableSeek ? 'checked' : ''}>
                    启用进度条
                </label>
            </div>
            <div class="control-row">
                <label class="control-label">
                    <input type="checkbox" class="control-checkbox" id="auto-click" ${config.autoClick ? 'checked' : ''}>
                    自动点击确认
                </label>
            </div>
            <div class="control-row">
                <span class="control-label">播放速度:</span>
                <input type="number" class="speed-input" id="speed-control" min="0.5" max="4" step="0.1" value="${config.playbackSpeed}">
            </div>
            <div class="control-row" style="justify-content: flex-end;">
                <button class="control-btn" id="apply-btn">应用设置</button>
                <button class="control-btn" id="reset-btn">重置视频</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 事件监听
        document.getElementById('apply-btn').addEventListener('click', applySettings);
        document.getElementById('reset-btn').addEventListener('click', resetVideo);
    }

    // 应用设置
    function applySettings() {
        config.autoSkip = document.getElementById('auto-skip').checked;
        config.enableSeek = document.getElementById('enable-seek').checked;
        config.autoClick = document.getElementById('auto-click').checked;
        config.playbackSpeed = parseFloat(document.getElementById('speed-control').value);

        GM_setValue('autoSkip', config.autoSkip);
        GM_setValue('enableSeek', config.enableSeek);
        GM_setValue('autoClick', config.autoClick);
        GM_setValue('speed', config.playbackSpeed);

        if (window.currentPlayer) {
            setupPlayerHooks(window.currentPlayer);
        }
        alert('设置已保存！');
    }

    // 重置视频
    function resetVideo() {
        if (window.currentPlayer) {
            window.currentPlayer.currentTime = 0;
            window.currentPlayer.play();
        }
    }

    // 核心控制逻辑
    function setupPlayerHooks(player) {
        // 移除原有限制
        player.off('ended');
        player.off('timeupdate');

        // 设置播放速度
        player.speed = config.playbackSpeed;

        // 启用进度条
        if (config.enableSeek) {
            player.media.controls = true;
            player.media.removeAttribute('controlslist');
            document.querySelector('.plyr__progress').style.display = 'block';
        }

        // 播放时跳转逻辑
        player.on('play', () => {
            if (config.autoSkip) {
                setTimeout(() => {
                    if (player.duration > 0) {
                        player.currentTime = player.duration - 1;
                        debugLog('已触发结尾跳转');
                    }
                }, config.skipDelay);
            }
            autoClickConfirm();
        });

        // 添加自动点击触发点
        player.on('pause', autoClickConfirm);
        player.on('ended', autoClickConfirm);
    }

    // 播放器检测
    function detectPlayer() {
        const video = document.querySelector('video');
        if (video) {
            const checkInterval = setInterval(() => {
                if (video.plyr) {
                    clearInterval(checkInterval);
                    window.currentPlayer = video.plyr;
                    setupPlayerHooks(video.plyr);
                }
            }, 500);
        }
    }

    // 初始化
    function init() {
        createControlPanel();
        detectPlayer();
        
        // 监听动态内容加载
        new MutationObserver((mutations) => {
            detectPlayer();
            autoClickConfirm();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定时检查确认按钮（每2秒）
        setInterval(autoClickConfirm, 2000);
    }

    // 调试日志
    function debugLog(message) {
        if (config.debugMode) console.log(`[Plyr控制] ${new Date().toLocaleTimeString()}: ${message}`);
    }

    // 启动
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();