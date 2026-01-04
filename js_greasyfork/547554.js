// ==UserScript==
// @name         Multi Screen Manager/多屏分屏管理器 
// @namespace    http://lozn.top/
// @version      1.02
// @description  支持任意数量屏幕的分屏管理器 可以在一个标签选项卡打开2个百度展示2个实时k线行情   Support Multi page show same tab,  ,coustm frame split! 
// @author       lozn
// @license MIT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547554/Multi%20Screen%20Manager%E5%A4%9A%E5%B1%8F%E5%88%86%E5%B1%8F%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/547554/Multi%20Screen%20Manager%E5%A4%9A%E5%B1%8F%E5%88%86%E5%B1%8F%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('多屏管理器已加载');

    let screens = [];
    let isEnabled = false;
    let nextScreenId = 1;

    // 存档和恢复功能
    const STORAGE_KEY = 'multiscreen_config';

    // 保存配置到localStorage
    function saveConfig() {
        const config = {
            screens: screens,
            isEnabled: isEnabled,
            nextScreenId: nextScreenId,
            timestamp: Date.now()
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            console.log('配置已保存:', config);
        } catch (e) {
            console.error('保存配置失败:', e);
        }
    }

    // 从localStorage恢复配置
    function loadConfig() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const config = JSON.parse(saved);
                screens = config.screens || [];
                isEnabled = config.isEnabled || false;
                nextScreenId = config.nextScreenId || 1;

                console.log('配置已恢复:', config);

                // 如果之前是启用状态，自动恢复
                if (isEnabled && screens.length > 0) {
                    setTimeout(() => {
                        enableSplitMode();
                    }, 1500); // 稍微延迟确保页面完全加载
                }

                return true;
            }
        } catch (e) {
            console.error('恢复配置失败:', e);
        }
        return false;
    }

    // 清除存档
    function clearConfig() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('配置已清除');
        } catch (e) {
            console.error('清除配置失败:', e);
        }
    }

    // 创建主控制悬浮窗
    function createMainFloatingWindow() {
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'multi-screen-float';
        floatingWindow.innerHTML = '📺';
        floatingWindow.style.cssText = `
            position: fixed;
            top: 20%;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 20px;
            z-index: 999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
        `;

        // 悬停效果
        floatingWindow.onmouseenter = () => {
            floatingWindow.style.transform = 'scale(1.1)';
            floatingWindow.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
        };

        floatingWindow.onmouseleave = () => {
            floatingWindow.style.transform = 'scale(1)';
            floatingWindow.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        };

        floatingWindow.onclick = () => {
            console.log('主控制窗口被点击');
            if (isEnabled) {
                showManageDialog();
            } else {
                showInitDialog();
            }
        };

        document.body.appendChild(floatingWindow);
        return floatingWindow;
    }

    // 初始化对话框
    function showInitDialog() {
        const dialog = createDialog('🚀 多屏分屏管理器');

        dialog.innerHTML += `
            <div style="margin-bottom: 20px; text-align: center; color: #666;">
                创建您的第一个分屏布局
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">初始屏幕数量：</label>
                <select id="screen-count" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                    <option value="2">2个屏幕</option>
                    <option value="3">3个屏幕</option>
                    <option value="4">4个屏幕</option>
                    <option value="6">6个屏幕 (2x3)</option>
                </select>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button id="create-screens" style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px; font-size: 14px;">创建屏幕</button>
                <button id="cancel-init" style="background: #ccc; color: #333; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">取消</button>
            </div>
        `;

        document.getElementById('create-screens').onclick = () => {
            const count = parseInt(document.getElementById('screen-count').value);
            createInitialScreens(count);
            closeDialog();
        };

        document.getElementById('cancel-init').onclick = closeDialog;
    }

    // 管理对话框
    function showManageDialog() {
        const dialog = createDialog('🎛️ 屏幕管理器');

        let screensHtml = '';
        screens.forEach((screen, index) => {
            screensHtml += `
                <div style="display: flex; align-items: center; margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    <span style="font-weight: bold; margin-right: 10px; min-width: 60px;">屏幕${index + 1}:</span>
                    <input type="text" id="url-${screen.id}" value="${screen.url}" placeholder="https://example.com"
                           style="flex: 1; padding: 5px; border: 1px solid #ddd; border-radius: 3px; margin-right: 10px;">
                    <button onclick="updateScreenUrl(${screen.id})" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">更新</button>
                    <button onclick="removeScreen(${screen.id})" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">删除</button>
                </div>
            `;
        });

        dialog.innerHTML += `
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                ${screensHtml}
            </div>
            <div style="text-align: center; margin-bottom: 15px;">
                <button id="add-screen" style="background: #17a2b8; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">➕ 添加屏幕</button>
                <button id="reset-layout" style="background: #ffc107; color: #333; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">🔄 重置布局</button>
            </div>
            <div style="text-align: center; margin-bottom: 15px;">
                <button id="save-config" style="background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">💾 保存配置</button>
                <button id="load-config" style="background: #17a2b8; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">📂 恢复配置</button>
                <button id="clear-config" style="background: #fd7e14; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">🗑️ 清除存档</button>
            </div>
            <div style="text-align: center;">
                <button id="close-manager" style="background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">关闭管理器</button>
                <button id="exit-split" style="background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">退出分屏</button>
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #999; text-align: center;">
                当前共有 ${screens.length} 个屏幕 | 配置会自动保存
            </div>
        `;

        // 将函数添加到全局作用域以便onclick调用
        window.updateScreenUrl = updateScreenUrl;
        window.removeScreen = removeScreen;

        document.getElementById('add-screen').onclick = () => {
            addNewScreen();
            closeDialog();
            showManageDialog(); // 重新打开以刷新列表
        };

        document.getElementById('reset-layout').onclick = () => {
            resetLayout();
            closeDialog();
        };

        document.getElementById('save-config').onclick = () => {
            saveConfig();
            alert('✅ 配置已保存！下次打开页面会自动恢复。');
        };

        document.getElementById('load-config').onclick = () => {
            if (loadConfig()) {
                alert('✅ 配置已恢复！');
                closeDialog();
                if (isEnabled) {
                    updateLayout();
                }
            } else {
                alert('❌ 没有找到保存的配置。');
            }
        };

        document.getElementById('clear-config').onclick = () => {
            if (confirm('确定要清除所有存档配置吗？')) {
                clearConfig();
                alert('🗑️ 存档已清除！');
            }
        };

        document.getElementById('close-manager').onclick = closeDialog;

        document.getElementById('exit-split').onclick = () => {
            exitSplitMode();
            closeDialog();
        };
    }

    // 创建通用对话框
    function createDialog(title) {
        const overlay = document.createElement('div');
        overlay.id = 'dialog-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.id = 'screen-dialog';
        dialog.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            min-width: 500px;
            max-width: 80vw;
            max-height: 80vh;
            overflow-y: auto;
        `;

        dialog.innerHTML = `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #333; text-align: center;">
                ${title}
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => {
            if (e.target === overlay) closeDialog();
        };

        return dialog;
    }

    function closeDialog() {
        const overlay = document.getElementById('dialog-overlay');
        if (overlay) overlay.remove();
    }

    // 创建初始屏幕
    function createInitialScreens(count) {
        screens = [];
        for (let i = 0; i < count; i++) {
            screens.push({
                id: nextScreenId++,
                url: i === 0 ? 'https://www.baidu.com' : i === 1 ? 'https://www.google.com' : 'about:blank'
            });
        }
        enableSplitMode();
        // 自动保存配置
        saveConfig();
    }

    // 添加新屏幕
    function addNewScreen() {
        screens.push({
            id: nextScreenId++,
            url: 'about:blank'
        });
        if (isEnabled) {
            updateLayout();
        }
        // 自动保存配置
        saveConfig();
    }

    // 删除屏幕
    function removeScreen(screenId) {
        if (screens.length <= 1) {
            alert('至少需要保留一个屏幕！');
            return;
        }

        screens = screens.filter(screen => screen.id !== screenId);
        updateLayout();
        // 自动保存配置
        saveConfig();

        // 重新打开管理对话框以刷新列表
        closeDialog();
        setTimeout(() => showManageDialog(), 100);
    }

    // 更新屏幕URL
    function updateScreenUrl(screenId) {
        const urlInput = document.getElementById(`url-${screenId}`);
        const newUrl = urlInput.value.trim();

        if (!newUrl) {
            alert('请输入有效的URL！');
            return;
        }

        const screen = screens.find(s => s.id === screenId);
        if (screen) {
            screen.url = newUrl;

            if (isEnabled) {
                const iframe = document.getElementById(`iframe-${screenId}`);
                if (iframe) {
                    iframe.src = newUrl;
                }
            }

            // 自动保存配置
            saveConfig();
        }

        alert('URL已更新并保存！');
    }

    // 启用分屏模式
    function enableSplitMode() {
        if (screens.length === 0) return;

        // 隐藏原始内容
        document.body.style.overflow = 'hidden';

        createScreenLayout();
        updateFloatingWindow();
        isEnabled = true;

        // 自动保存配置
        saveConfig();

        console.log('分屏模式已启用，共', screens.length, '个屏幕');
    }

    // 创建屏幕布局
    function createScreenLayout() {
        const container = document.createElement('div');
        container.id = 'multi-screen-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: grid;
            gap: 2px;
            background: #333;
            z-index: 999998;
        `;

        // 计算网格布局
        const { rows, cols } = calculateGridLayout(screens.length);
        container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        // 创建iframe
        screens.forEach(screen => {
            const iframe = document.createElement('iframe');
            iframe.id = `iframe-${screen.id}`;
            iframe.src = screen.url;
            iframe.style.cssText = `
                width: 100%;
                height: 100%;
                border: none;
                background: white;
            `;
            container.appendChild(iframe);
        });

        document.body.appendChild(container);
    }

    // 计算网格布局
    function calculateGridLayout(count) {
        if (count <= 2) return { rows: 1, cols: count };
        if (count <= 4) return { rows: 2, cols: 2 };
        if (count <= 6) return { rows: 2, cols: 3 };
        if (count <= 9) return { rows: 3, cols: 3 };
        if (count <= 12) return { rows: 3, cols: 4 };
        return { rows: Math.ceil(Math.sqrt(count)), cols: Math.ceil(Math.sqrt(count)) };
    }

    // 更新布局
    function updateLayout() {
        const container = document.getElementById('multi-screen-container');
        if (container) {
            container.remove();
            createScreenLayout();
        }
    }

    // 重置布局
    function resetLayout() {
        updateLayout();
    }

    // 退出分屏模式
    function exitSplitMode() {
        const container = document.getElementById('multi-screen-container');
        if (container) {
            container.remove();
        }

        document.body.style.overflow = '';
        updateFloatingWindow();
        isEnabled = false;

        // 保存退出状态
        saveConfig();

        console.log('已退出分屏模式');
    }

    // 更新悬浮窗状态
    function updateFloatingWindow() {
        const floatingWindow = document.getElementById('multi-screen-float');
        if (floatingWindow) {
            if (isEnabled) {
                floatingWindow.innerHTML = '⚙️';
                floatingWindow.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                floatingWindow.title = '管理屏幕';
            } else {
                floatingWindow.innerHTML = '📺';
                floatingWindow.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                floatingWindow.title = '启动多屏';
            }
        }
    }

    // 检查是否在iframe中
    function isInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    // 初始化 - 只在主页面运行
    function init() {
        // 如果在iframe中，不执行任何操作
        if (isInIframe()) {
            console.log('在iframe中，跳过脚本初始化');
            return;
        }

        // 先尝试恢复配置
        const configLoaded = loadConfig();

        setTimeout(() => {
            createMainFloatingWindow();

            if (configLoaded) {
                console.log('欢迎回来！已自动恢复之前的配置。');
            }
        }, 1000);
    }

    init();

})();