// ==UserScript==
// @name         网页模糊切换工具
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @license MIT
// @description  一键模糊/恢复整个网页，支持快捷键自定义、模糊程度调节、指示器可关闭、遮罩层自定义内容
// @author       otis
// @icon    https://file.fishpi.cn/2025/07/logo-12ba9b4e.jpeg
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/542676/%E7%BD%91%E9%A1%B5%E6%A8%A1%E7%B3%8A%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542676/%E7%BD%91%E9%A1%B5%E6%A8%A1%E7%B3%8A%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    const defaultSettings = {
        blurEnabled: false,
        blurAmount: 5,
        hotkey: 'Ctrl+B',
        overlayContent: '时间', // "时间" 或自定义文本
        timeMode: 'time' // 'time' 仅时间, 'datetime' 日期+时间
    };

    // 获取或初始化设置
    let settings = {
        blurEnabled: GM_getValue('blurEnabled', defaultSettings.blurEnabled),
        blurAmount: GM_getValue('blurAmount', defaultSettings.blurAmount),
        hotkey: GM_getValue('hotkey', defaultSettings.hotkey),
        overlayContent: GM_getValue('overlayContent', defaultSettings.overlayContent),
        timeMode: GM_getValue('timeMode', defaultSettings.timeMode)
    };

    // 创建遮罩层
    const blurOverlay = document.createElement('div');
    blurOverlay.id = 'blur-overlay';
    blurOverlay.style.cssText = `
        position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
        z-index: 999999; pointer-events: auto;
        backdrop-filter: blur(${settings.blurAmount}px);
        -webkit-backdrop-filter: blur(${settings.blurAmount}px);
        background: rgba(255,255,255,0.7);
        display: none;
        transition: backdrop-filter 0.2s, -webkit-backdrop-filter 0.2s;
    `;
    // 遮罩层内容区
    const overlayContentDiv = document.createElement('div');
    overlayContentDiv.style.cssText = `
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        color: white; font-size: 2em; pointer-events: auto;
        background: rgba(0,0,0,0.4); padding: 16px 32px; border-radius: 12px;
        min-width: 120px; text-align: center;
    `;
    blurOverlay.appendChild(overlayContentDiv);
    document.body.appendChild(blurOverlay);

    // 添加状态指示器（提前创建，避免未初始化访问）
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.right = '10px';
    indicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '999999';
    indicator.style.fontFamily = 'Arial, sans-serif';
    indicator.style.fontSize = '12px';
    indicator.style.cursor = 'pointer';
    indicator.title = '点击关闭指示器';
    document.body.appendChild(indicator);

    // 更新指示器
    function updateIndicator() {
        indicator.textContent = `模糊效果: ${settings.blurEnabled ? '开启' : '关闭'} (${settings.blurAmount}px) 快捷键: ${settings.hotkey}`;
    }

    // 遮罩层内容更新
    let timeInterval = null;
    function updateOverlayContent() {
        if (settings.overlayContent === '时间') {
            // 显示当前时间或日期+时间
            const updateTime = () => {
                const now = new Date();
                if (settings.timeMode === 'datetime') {
                    overlayContentDiv.textContent = now.toLocaleString();
                } else {
                    overlayContentDiv.textContent = now.toLocaleTimeString();
                }
            };
            updateTime();
            if (timeInterval) clearInterval(timeInterval);
            timeInterval = setInterval(updateTime, 1000);
        } else {
            overlayContentDiv.textContent = settings.overlayContent.replace(/\\n/g, '\n');
            if (timeInterval) {
                clearInterval(timeInterval);
                timeInterval = null;
            }
        }
    }

    // 动态弥散模糊（仅保留模糊动画，背景为纯白）
    let blurAnimFrame = null;
    function startDynamicBlur() {
        if (blurAnimFrame) cancelAnimationFrame(blurAnimFrame);
        function animate() {
            if (!settings.blurEnabled) return;
            // 在 blurAmount±2 范围内随机变化
            const min = Math.max(1, settings.blurAmount - 2);
            const max = settings.blurAmount + 2;
            const blur = (Math.random() * (max - min) + min).toFixed(2);
            blurOverlay.style.backdropFilter = `blur(${blur}px)`;
            blurOverlay.style.webkitBackdropFilter = `blur(${blur}px)`;
            blurAnimFrame = requestAnimationFrame(animate);
        }
        animate();
    }
    function stopDynamicBlur() {
        if (blurAnimFrame) {
            cancelAnimationFrame(blurAnimFrame);
            blurAnimFrame = null;
        }
        blurOverlay.style.backdropFilter = `blur(${settings.blurAmount}px)`;
        blurOverlay.style.webkitBackdropFilter = `blur(${settings.blurAmount}px)`;
    }

    // 应用模糊效果
    function applyBlur() {
        if (settings.blurEnabled) {
            blurOverlay.style.display = 'block';
            startDynamicBlur();
            updateOverlayContent();
        } else {
            blurOverlay.style.display = 'none';
            stopDynamicBlur();
            if (timeInterval) {
                clearInterval(timeInterval);
                timeInterval = null;
            }
        }
        updateIndicator();
    }

    // 切换模糊状态
    function toggleBlur() {
        settings.blurEnabled = !settings.blurEnabled;
        GM_setValue('blurEnabled', settings.blurEnabled);
        applyBlur();
    }

    // 设置模糊程度
    function setBlurAmount(amount) {
        settings.blurAmount = amount;
        GM_setValue('blurAmount', settings.blurAmount);
        if (settings.blurEnabled) {
            applyBlur();
        } else {
            updateIndicator();
        }
    }

    // 设置快捷键
    function setHotkey(hotkey) {
        settings.hotkey = hotkey;
        GM_setValue('hotkey', hotkey);
        updateIndicator();
    }

    // 设置遮罩层内容
    function setOverlayContent(content) {
        settings.overlayContent = content;
        GM_setValue('overlayContent', settings.overlayContent);
        if (settings.blurEnabled) updateOverlayContent();
    }

    // 解析快捷键字符串
    function matchHotkey(e, hotkeyStr) {
        const [mod, key] = hotkeyStr.split('+');
        return (
            ((mod.toLowerCase() === 'ctrl' && e.ctrlKey) ||
             (mod.toLowerCase() === 'alt' && e.altKey) ||
             (mod.toLowerCase() === 'shift' && e.shiftKey)) &&
            e.key.toLowerCase() === key.toLowerCase()
        );
    }

    // 指示器点击关闭
    indicator.addEventListener('click', () => {
        indicator.style.display = 'none';
    });

    // 初始化模糊状态
    applyBlur();

    // 添加快捷键监听
    document.addEventListener('keydown', function(e) {
        if (matchHotkey(e, settings.hotkey)) {
            e.preventDefault();
            toggleBlur();
        }
    });

    // 监听 ESC 键关闭模糊
    document.addEventListener('keydown', function(e) {
        if (settings.blurEnabled && e.key === 'Escape') {
            e.preventDefault();
            toggleBlur();
        }
    });

    // 添加菜单命令
    GM_registerMenuCommand('切换模糊效果 (' + settings.hotkey + ')', toggleBlur);
    GM_registerMenuCommand('设置模糊程度', function() {
        const amount = prompt('请输入模糊程度 (1-20):', settings.blurAmount);
        if (amount !== null) {
            const num = parseInt(amount, 10);
            if (!isNaN(num) && num >= 1 && num <= 20) {
                setBlurAmount(num);
            } else {
                alert('请输入1-20之间的数字');
            }
        }
    });
    GM_registerMenuCommand('设置快捷键', function() {
        const key = prompt('请输入快捷键（如 Ctrl+B、Alt+Q、Shift+Z）:', settings.hotkey);
        if (key && /^\s*(Ctrl|Alt|Shift)\s*\+\s*\w\s*$/i.test(key)) {
            setHotkey(key.replace(/\s+/g, ''));
        } else if (key) {
            alert('格式错误，请输入如 Ctrl+B、Alt+Q、Shift+Z');
        }
    });
    GM_registerMenuCommand('设置遮罩层内容', function() {
        const content = prompt('请输入遮罩层显示内容（输入“时间”可显示当前时间，或自定义文本，支持\\n换行）:', settings.overlayContent);
        if (content !== null && content.trim() !== '') {
            setOverlayContent(content.trim());
        }
    });
    GM_registerMenuCommand('设置时间显示模式', function() {
        const mode = prompt('请输入时间显示模式：time（仅时间）或 datetime（日期+时间）', settings.timeMode);
        if (mode === 'time' || mode === 'datetime') {
            settings.timeMode = mode;
            GM_setValue('timeMode', mode);
            if (settings.blurEnabled && settings.overlayContent === '时间') updateOverlayContent();
        } else {
            alert('请输入 time 或 datetime');
        }
    });
    GM_registerMenuCommand('重置所有设置', function() {
        if (confirm('确定要重置所有设置吗？')) {
            settings = {...defaultSettings};
            GM_setValue('blurEnabled', settings.blurEnabled);
            GM_setValue('blurAmount', settings.blurAmount);
            GM_setValue('hotkey', settings.hotkey);
            GM_setValue('overlayContent', settings.overlayContent);
            applyBlur();
        }
    });

    // 初始更新指示器
    updateIndicator();
})();
