// ==UserScript==
// @name             雨课堂阻止自动暂停播放
// @name:en          Yuketang Anti Auto Pause
// @name:es          Evitar pausa automática en Yuketang
// @namespace        https://tampermonkey.net/
// @version          1.0
// @description      阻止雨课堂视频在失去焦点时自动暂停
// @description:en   Prevent Yuketang videos from auto-pausing when window loses focus
// @description:es   Evita que los vídeos de Yuketang se pausen automáticamente al perder el foco de la ventana
// @author           Anonym
// @match            https://*.yuketang.cn/*
// @grant            none
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/544181/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%BB%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/544181/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%BB%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('🚀 雨课堂防暂停解决方案 v1.0');
    console.log('');

    // 防止重复执行
    if (window.YuketangAntiPause) {
        console.log('⚠️ 防暂停脚本已在运行中');
        return;
    }

    // 标记脚本已运行
    window.YuketangAntiPause = {
        version: '1.0',
        status: 'active',
        stats: {
            videoPausePrevented: 0,
            eventBlocked: 0,
            startTime: new Date()
        },
        // 面板控制函数
        togglePanel: () => {
            console.log('🔧 togglePanel 被调用');
            const panel = document.getElementById('yuketang-anti-pause-panel');
            const content = document.getElementById('panel-content');
            const mini = document.getElementById('panel-mini');

            if (!panel || !content || !mini) {
                console.log('❌ 找不到面板元素');
                return;
            }

            if (content.style.display === 'none') {
                // 展开面板
                console.log('🔧 展开面板');
                content.style.display = 'block';
                mini.style.display = 'none';
                panel.style.padding = '12px';
                panel.style.minWidth = '160px';
                panel.style.opacity = '1';
            } else {
                // 最小化面板
                console.log('🔧 最小化面板');
                content.style.display = 'none';
                mini.style.display = 'block';
                panel.style.padding = '8px';
                panel.style.minWidth = '32px';
                panel.style.opacity = '0.5';
            }
        }
    };

    const stats = window.YuketangAntiPause.stats;

    // ==================== 核心功能区域 ====================

    // 1. 视频暂停拦截 - 最重要的功能
    console.log('🎯 正在保护视频播放...');
    const protectVideos = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            if (!video._antiPauseProtected) {
                const originalPause = video.pause;

                video.pause = function () {
                    stats.videoPausePrevented++;
                    console.log(`🛡️ 阻止视频${index + 1}暂停 (第${stats.videoPausePrevented}次)`);
                    return Promise.resolve();
                };

                video._antiPauseProtected = true;
                console.log(`✅ 已保护视频${index + 1}`);
            }
        });
        return videos.length;
    };

    const videoCount = protectVideos();
    if (videoCount === 0) {
        console.log('⏳ 暂未发现视频，将持续监控...');
    }

    // 2. 页面可见性伪装 - 核心欺骗机制
    console.log('🎭 正在伪装页面可见性...');

    // 伪装document.hidden
    try {
        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: true
        });

        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true
        });

        console.log('✅ 页面可见性伪装成功');
    } catch (e) {
        console.log('⚠️ 页面可见性伪装失败:', e.message);
    }

    // 3. jQuery事件拦截 - 雨课堂特有机制
    if (window.$ && window.$.fn && window.$.fn.trigger) {
        console.log('🔧 正在设置jQuery事件拦截...');

        const originalTrigger = window.$.fn.trigger;
        let controlToggleCount = 0;
        let lastToggleLogTime = 0;

        window.$.fn.trigger = function (event, data) {
            if (typeof event === 'string') {
                // 拦截所有暂停相关事件
                if (event.includes('pause') && !event.includes('toggle')) {
                    stats.eventBlocked++;
                    console.log(`🚫 拦截暂停事件: "${event}"`);
                    return this;
                }

                // 控制toggle事件日志频率
                if (event === 'control.toggle') {
                    controlToggleCount++;
                    const now = Date.now();

                    if (now - lastToggleLogTime > 5000) {
                        console.log(`🔄 已处理${controlToggleCount}次control.toggle事件`);
                        lastToggleLogTime = now;
                    }
                }
            }

            return originalTrigger.call(this, event, data);
        };

        console.log('✅ jQuery事件拦截设置完成');
    } else {
        console.log('⚠️ 未检测到jQuery，跳过相关拦截');
    }

    // 4. 事件监听器保护
    console.log('🛡️ 正在设置事件监听器保护...');

    // 清理现有的危险事件处理器
    const dangerousEvents = ['onblur', 'onfocus', 'onvisibilitychange', 'onpagehide', 'onpageshow'];
    dangerousEvents.forEach(event => {
        if (window[event]) {
            window[event] = null;
            console.log(`🧹 清理了window.${event}`);
        }
    });

    // 拦截新的事件监听器添加
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        const blockedEvents = ['visibilitychange', 'blur', 'focus', 'pagehide', 'pageshow'];

        if (blockedEvents.includes(type)) {
            console.log(`🚫 阻止添加事件监听器: ${type}`);
            return;
        }

        return originalAddEventListener.call(this, type, listener, options);
    };

    console.log('✅ 事件监听器保护设置完成');

    // ==================== 监控和恢复机制 ====================

    // 5. 定期检查和恢复视频播放
    const keepVideoPlaying = () => {
        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            if (video.paused && !video.ended && video.readyState >= 2) {
                console.log(`🔄 自动恢复视频${index + 1}播放`);
                video.play().catch(() => { });
            }
        });

        // 检查新视频
        if (videos.length > videoCount) {
            protectVideos();
        }
    };

    setInterval(keepVideoPlaying, 3000);

    // 6. 状态监控面板
    console.log('📊 正在创建状态监控面板...');

    const createStatusPanel = () => {
        // 移除旧面板
        const existingPanel = document.getElementById('yuketang-anti-pause-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'yuketang-anti-pause-panel';
        panel.innerHTML = `
            <div id="panel-content">
                <div style="font-weight: bold; color: #fff; margin-bottom: 4px;">
                    🛡️ 雨课堂防暂停 v1.0
                </div>
                <div id="panel-stats" style="font-size: 11px; line-height: 1.3;"></div>
                <div style="margin-top: 6px;">
                    <button id="minimize-btn"
                            style="padding: 2px 6px; font-size: 10px; border: none; border-radius: 2px; cursor: pointer;">
                        最小化
                    </button>
                </div>
            </div>
            <div id="panel-mini" style="display: none; text-align: center; font-size: 16px; line-height: 1;">
                🛡️
            </div>
        `;

        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 999999;
            min-width: 160px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(panel);

        // 添加事件监听器
        const minimizeBtn = document.getElementById('minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🔧 点击了最小化按钮');
                window.YuketangAntiPause.togglePanel();
            });
        }

        // 添加面板点击事件（用于最小化状态下的展开）
        panel.addEventListener('click', (e) => {
            const mini = document.getElementById('panel-mini');
            if (mini && mini.style.display !== 'none') {
                console.log('🔧 点击了最小化面板');
                window.YuketangAntiPause.togglePanel();
            }
        });

        // 更新状态信息
        const updateStats = () => {
            const statsEl = document.getElementById('panel-stats');
            if (statsEl) {
                const runTime = Math.floor((new Date() - stats.startTime) / 1000);
                statsEl.innerHTML = `
                    状态: <span style="color: #90EE90;">● 运行中</span><br>
                    运行时间: ${runTime}秒<br>
                    拦截暂停: ${stats.videoPausePrevented}次<br>
                    阻止事件: ${stats.eventBlocked}次<br>
                    页面焦点: ${document.hasFocus() ? '✓ 有' : '✗ 无'}
                `;
            }
        };

        setInterval(updateStats, 2000);
        updateStats();

        console.log('✅ 状态监控面板创建完成');
    };

    createStatusPanel();

    // 7. 错误处理
    window.addEventListener('error', (e) => {
        if (e.message && e.message.includes('pause')) {
            console.log('🛡️ 拦截暂停相关错误');
            e.preventDefault();
        }
    }, true);

    // ==================== 启动完成 ====================

    console.log('');
    console.log('🎉 雨课堂防暂停终极解决方案启动完成！');
    console.log('');
    console.log('🔧 已启用功能:');
    console.log('   ✅ 视频暂停拦截');
    console.log('   ✅ 页面可见性伪装');
    console.log('   ✅ jQuery事件拦截');
    console.log('   ✅ 事件监听器保护');
    console.log('   ✅ 自动恢复播放');
    console.log('   ✅ 状态监控面板');
    console.log('   ✅ 优化日志输出');
    console.log('');
    console.log('💡 现在可以安全地切换窗口或标签页，视频将继续播放！');
    console.log('📱 右上角的绿色面板显示实时状态信息');
    console.log('');

})();
