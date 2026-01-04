// ==UserScript==
// @name         Auto豆包
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在豆包AI平台上批量发送提示词的脚本，支持自定义分隔符、自动切换对话、中断和接续发送、快捷键唤起
// @author       您的名字
// @match        https://*.doubao.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/535754/Auto%E8%B1%86%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/535754/Auto%E8%B1%86%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加UI样式
    GM_addStyle(`
        .batch-prompt-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 300px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            padding: 15px;
            font-family: Arial, sans-serif;
            display: none;
        }
        .batch-prompt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
            user-select: none;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .batch-prompt-title {
            font-weight: bold;
            font-size: 16px;
        }
        .batch-prompt-close {
            cursor: pointer;
            font-size: 18px;
        }
        .batch-prompt-textarea {
            width: 100%;
            height: 150px;
            margin-bottom: 10px;
            resize: vertical;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px;
        }
        .batch-prompt-controls {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 10px;
        }
        .batch-prompt-button {
            flex: 1;
            min-width: 80px;
            background: #1677ff;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 13px;
            text-align: center;
        }
        .batch-prompt-button:hover {
            background: #0e5fd9;
        }
        .batch-prompt-button.stop-btn {
            background: #ff4d4f;
        }
        .batch-prompt-button.stop-btn:hover {
            background: #d9363e;
        }
        .batch-prompt-button.continue-btn {
            background: #52c41a;
        }
        .batch-prompt-button.continue-btn:hover {
            background: #389e0d;
        }
        .batch-prompt-button.restart-btn {
            background: #faad14;
        }
        .batch-prompt-button.restart-btn:hover {
            background: #d48806;
        }
        .batch-prompt-button[disabled] {
            background: #d9d9d9;
            cursor: not-allowed;
        }
        .batch-prompt-settings {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 10px;
        }
        .batch-prompt-setting-item {
            display: flex;
            align-items: center;
        }
        .batch-prompt-setting-item label {
            margin-right: 5px;
            white-space: nowrap;
        }
        .batch-prompt-delay {
            width: 60px;
            padding: 5px;
        }
        .batch-prompt-separator {
            width: 80px;
            padding: 5px;
        }
        .batch-prompt-new-chat {
            width: 60px;
            padding: 5px;
        }
        .batch-prompt-status {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
        .batch-prompt-templates {
            margin-top: 10px;
        }
        .batch-prompt-template {
            margin-bottom: 5px;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .batch-prompt-template:hover {
            background: #e5e5e5;
        }
        .batch-prompt-float-icon {
            position: fixed;
            width: 48px;
            height: 48px;
            background: #1677ff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: move;
            user-select: none;
            z-index: 9999;
            transition: transform 0.2s;
        }
        .batch-prompt-float-icon:hover {
            transform: scale(1.1);
        }
        .batch-prompt-float-icon:active {
            transform: scale(0.95);
        }
        .batch-prompt-progress {
            height: 8px;
            background: #f0f0f0;
            border-radius: 4px;
            margin-top: 5px;
            overflow: hidden;
        }
        .batch-prompt-progress-bar {
            height: 100%;
            background: #1677ff;
            border-radius: 4px;
            width: 0%;
            transition: width 0.3s;
        }
        .batch-prompt-shortcut-tip {
            margin-top: 10px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    `);

    // 常用分隔符列表
    const separatorOptions = [
        { value: '\n\n', label: '空行' },
        { value: '\n', label: '换行' },
        { value: '---', label: '三横线' },
        { value: '***', label: '三星号' },
        { value: '===', label: '三等号' },
        { value: ';', label: '分号' },
        { value: '###', label: '井号' }
    ];

    // 模板库
    const promptTemplates = [
        {
            name: "风景图像",
            template: "我想生成一张写实风图片，主体为单个有着深邃眼神、高挑身材、轮廓分明脸庞的人，场景设定在{{场景}}中，人物手持{{物品}}，周围呈现{{环境}}感，{{视角}}视角，{{风格}}风格。",
            variables: {
                "场景": ["宇宙空间站", "热带雨林", "冰川", "沙漠", "都市街头"],
                "物品": ["数据板", "古老书籍", "未来武器", "魔法法杖", "相机"],
                "环境": ["高科技", "神秘", "末日", "宁静", "繁忙"],
                "视角": ["第一人称", "俯视", "仰视", "侧面", "远景"],
                "风格": ["科幻", "写实", "水彩", "电影感", "梦幻"]
            }
        },
        {
            name: "人物肖像",
            template: "我想生成一张{{性别}}肖像照，{{年龄}}，穿着{{服装}}，{{表情}}表情，{{背景}}背景，{{光线}}光线，{{风格}}风格。",
            variables: {
                "性别": ["男性", "女性", "中性"],
                "年龄": ["年轻", "中年", "老年"],
                "服装": ["正装", "休闲装", "运动装", "古装", "未来服装"],
                "表情": ["微笑", "严肃", "沉思", "惊讶", "平静"],
                "背景": ["纯色", "自然", "城市", "工作室", "抽象"],
                "光线": ["自然光", "暖色调", "冷色调", "侧光", "背光"],
                "风格": ["写实", "艺术", "时尚", "电影感", "复古"]
            }
        },
        {
            name: "产品展示",
            template: "我想生成一张{{产品}}的高质量展示图，放置在{{背景}}上，使用{{光线}}照明，强调{{特点}}，{{角度}}视角，{{风格}}风格。",
            variables: {
                "产品": ["手机", "鞋子", "瓶装饮料", "手表", "包包"],
                "背景": ["简约纯色", "大理石", "渐变", "自然环境", "工作室"],
                "光线": ["柔和", "高对比度", "产品轮廓光", "自然光", "聚光"],
                "特点": ["质感", "细节", "整体美感", "功能性", "创新设计"],
                "角度": ["正面", "45度角", "俯视", "特写", "多角度组合"],
                "风格": ["简约", "奢华", "科技感", "自然", "时尚"]
            }
        }
    ];

    // 发送状态变量
    let sendingStatus = {
        isRunning: false,       // 是否正在发送
        isStopped: false,       // 是否已中断
        currentIndex: 0,        // 当前发送位置
        totalCount: 0,          // 总提示词数量
        prompts: [],            // 提示词数组
        delaySeconds: 15,       // 延迟秒数
        newChatFrequency: 0,    // 每隔多少条创建新对话
        separator: '\n\n'       // 分隔符
    };

    // 面板和图标引用
    let floatIcon = null;
    let panel = null;

    // 创建悬浮图标
    function createFloatIcon() {
        if (floatIcon) {
            return floatIcon;
        }

        floatIcon = document.createElement('div');
        floatIcon.className = 'batch-prompt-float-icon';
        floatIcon.textContent = '📝';
floatIcon.title = '批量提示词工具 (Alt+B/Cmd+B 打开/关闭)';

        // 设置初始位置 (右下角)
        floatIcon.style.bottom = '120px';
        floatIcon.style.right = '20px';

        // 点击显示面板
        floatIcon.addEventListener('click', function(e) {
            if (!isDragging) {
                togglePanel();
            }
        });

        // 拖拽相关变量
        let isDragging = false;
        let offsetX, offsetY;

        // 鼠标按下事件
        floatIcon.addEventListener('mousedown', function(e) {
            isDragging = false;
            offsetX = e.clientX - floatIcon.getBoundingClientRect().left;
            offsetY = e.clientY - floatIcon.getBoundingClientRect().top;

            // 阻止默认行为和冒泡
            e.preventDefault();
            e.stopPropagation();

            // 添加鼠标移动和松开事件
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // 鼠标移动事件
        function onMouseMove(e) {
            isDragging = true;

            // 计算新位置
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 限制在窗口内
            const maxX = window.innerWidth - floatIcon.offsetWidth;
            const maxY = window.innerHeight - floatIcon.offsetHeight;

            // 设置新位置
            floatIcon.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            floatIcon.style.top = Math.max(0, Math.min(y, maxY)) + 'px';

            // 移动后清除之前的right/bottom定位
            floatIcon.style.right = 'auto';
            floatIcon.style.bottom = 'auto';

            // 阻止默认行为和冒泡
            e.preventDefault();
            e.stopPropagation();
        }

        // 鼠标松开事件
        function onMouseUp(e) {
            // 移除事件监听
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // 保存位置到localStorage
            saveIconPosition(floatIcon.style.left, floatIcon.style.top);

            // 延迟重置isDragging，允许点击事件发生
            setTimeout(() => {
                isDragging = false;
            }, 10);

            // 阻止默认行为和冒泡
            e.preventDefault();
            e.stopPropagation();
        }

        // 加载之前保存的位置
        const savedPosition = loadIconPosition();
        if (savedPosition) {
            floatIcon.style.left = savedPosition.left;
            floatIcon.style.top = savedPosition.top;
            floatIcon.style.right = 'auto';
            floatIcon.style.bottom = 'auto';
        }

        document.body.appendChild(floatIcon);
        return floatIcon;
    }

    // 显示图标
    function showFloatIcon() {
        if (!floatIcon) {
            floatIcon = createFloatIcon();
        }
        floatIcon.style.display = 'flex';
    }

    // 隐藏图标
    function hideFloatIcon() {
        if (floatIcon) {
            floatIcon.style.display = 'none';
        }
    }

    // 保存图标位置
    function saveIconPosition(left, top) {
        try {
            localStorage.setItem('batchPromptIconPosition', JSON.stringify({ left, top }));
        } catch (e) {
            console.error('保存图标位置失败:', e);
        }
    }

    // 加载图标位置
    function loadIconPosition() {
        try {
            const positionString = localStorage.getItem('batchPromptIconPosition');
            return positionString ? JSON.parse(positionString) : null;
        } catch (e) {
            console.error('加载图标位置失败:', e);
            return null;
        }
    }

    // 保存面板位置
    function savePanelPosition(left, top) {
        try {
            localStorage.setItem('batchPromptPanelPosition', JSON.stringify({ left, top }));
        } catch (e) {
            console.error('保存面板位置失败:', e);
        }
    }

    // 加载面板位置
    function loadPanelPosition() {
        try {
            const positionString = localStorage.getItem('batchPromptPanelPosition');
            return positionString ? JSON.parse(positionString) : null;
        } catch (e) {
            console.error('加载面板位置失败:', e);
            return null;
        }
    }

    // 创建UI
    function createBatchPromptUI() {
        // 创建悬浮图标
        createFloatIcon();

        // 如果面板已存在，直接返回
        if (panel) {
            return panel;
        }

        // 创建主面板
        panel = document.createElement('div');
        panel.className = 'batch-prompt-panel';

        // 生成分隔符选项
        const separatorOptionsHTML = separatorOptions.map(option =>
            `<option value="${option.value}">${option.label}</option>`
        ).join('');

        panel.innerHTML = `
            <div class="batch-prompt-header">
                <div class="batch-prompt-title">豆包批量提示词发送</div>
                <div class="batch-prompt-close">×</div>
            </div>

            <textarea class="batch-prompt-textarea" placeholder="请输入多个提示词，每组之间使用选定的分隔符分隔。也可以使用下方模板生成。"></textarea>

            <div class="batch-prompt-settings">
                <div class="batch-prompt-setting-item">
                    <label>延迟(秒): </label>
                    <input type="number" class="batch-prompt-delay" value="15" min="1" max="60">
                </div>
                <div class="batch-prompt-setting-item">
                    <label>分隔符: </label>
                    <select class="batch-prompt-separator">
                        ${separatorOptionsHTML}
                    </select>
                </div>
                <div class="batch-prompt-setting-item">
                    <label>每隔多少条创建新对话: </label>
                    <input type="number" class="batch-prompt-new-chat" value="0" min="0" max="100">
                    <small style="margin-left: 5px; color: #999;">(0表示不创建)</small>
                </div>
            </div>

            <div class="batch-prompt-controls">
                <button class="batch-prompt-button send-btn">开始发送</button>
                <button class="batch-prompt-button stop-btn" disabled>中断发送</button>
                <button class="batch-prompt-button continue-btn" disabled>接续发送</button>
                <button class="batch-prompt-button restart-btn" disabled>重新发送</button>
            </div>

            <div class="batch-prompt-progress">
                <div class="batch-prompt-progress-bar"></div>
            </div>

            <div class="batch-prompt-status">就绪</div>

            <div class="batch-prompt-templates">
                <div class="batch-prompt-title">模板库</div>
                ${promptTemplates.map((template, index) =>
                    `<div class="batch-prompt-template" data-index="${index}">${template.name}</div>`
                ).join('')}
            </div>

            <div class="batch-prompt-shortcut-tip">
                快捷键: Alt+B 打开/关闭面板, Alt+Y 应急恢复
            </div>
        `;

        document.body.appendChild(panel);

        // 为面板添加拖拽功能
        makePanelDraggable(panel);

        // 事件监听
        panel.querySelector('.batch-prompt-close').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // 按钮事件处理
        panel.querySelector('.send-btn').addEventListener('click', startBatchSend);
        panel.querySelector('.stop-btn').addEventListener('click', stopBatchSend);
        panel.querySelector('.continue-btn').addEventListener('click', continueBatchSend);
        panel.querySelector('.restart-btn').addEventListener('click', restartBatchSend);

        // 模板点击事件
        const templateElements = panel.querySelectorAll('.batch-prompt-template');
        templateElements.forEach(element => {
            element.addEventListener('click', () => {
                const index = element.getAttribute('data-index');
                showTemplateDialog(promptTemplates[index]);
            });
        });

        // 加载保存的设置
        loadSavedSettings();

        // 保存设置变化
        const settingElements = panel.querySelectorAll('.batch-prompt-delay, .batch-prompt-separator, .batch-prompt-new-chat');
        settingElements.forEach(element => {
            element.addEventListener('change', saveSettings);
        });

        // 加载面板位置
        const savedPosition = loadPanelPosition();
        if (savedPosition) {
            panel.style.left = savedPosition.left;
            panel.style.top = savedPosition.top;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }

        return panel;
    }

    // 更新按钮状态
    function updateButtonStatus(status) {
        const sendBtn = document.querySelector('.send-btn');
        const stopBtn = document.querySelector('.stop-btn');
        const continueBtn = document.querySelector('.continue-btn');
        const restartBtn = document.querySelector('.restart-btn');

        if (!sendBtn || !stopBtn || !continueBtn || !restartBtn) return;

        switch (status) {
            case 'idle': // 空闲状态
                sendBtn.disabled = false;
                stopBtn.disabled = true;
                continueBtn.disabled = true;
                restartBtn.disabled = true;
                break;
            case 'sending': // 发送中
                sendBtn.disabled = true;
                stopBtn.disabled = false;
                continueBtn.disabled = true;
                restartBtn.disabled = true;
                break;
            case 'stopped': // 已中断
                sendBtn.disabled = true;
                stopBtn.disabled = true;
                continueBtn.disabled = false;
                restartBtn.disabled = false;
                break;
            case 'completed': // 已完成
                sendBtn.disabled = false;
                stopBtn.disabled = true;
                continueBtn.disabled = true;
                restartBtn.disabled = false;
                break;
        }
    }

    // 更新进度条
    function updateProgressBar(current, total) {
        const progressBar = document.querySelector('.batch-prompt-progress-bar');
        if (!progressBar) return;

        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
    }

    // 为面板添加拖拽功能
    function makePanelDraggable(panel) {
        const header = panel.querySelector('.batch-prompt-header');
        if (!header) return;

        let isDragging = false;
        let offsetX, offsetY;

        // 鼠标按下事件
        header.addEventListener('mousedown', function(e) {
            // 如果点击了关闭按钮，不启动拖拽
            if (e.target.classList.contains('batch-prompt-close')) {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;

            // 添加临时样式
            header.style.cursor = 'grabbing';

            // 阻止默认行为和冒泡
            e.preventDefault();
            e.stopPropagation();

            // 添加鼠标移动和松开事件
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // 鼠标移动事件
        function onMouseMove(e) {
            if (!isDragging) return;

            // 计算新位置
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 限制在窗口内
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            // 设置新位置
            panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';

            // 移动后清除之前的right/bottom定位
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';

            // 阻止默认行为和冒泡
            e.preventDefault();
            e.stopPropagation();
        }

        // 鼠标松开事件
        function onMouseUp(e) {
            if (!isDragging) return;

            isDragging = false;

            // 恢复样式
            header.style.cursor = 'move';

            // 移除事件监听
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // 保存面板位置
            savePanelPosition(panel.style.left, panel.style.top);

            // 阻止默认行为和冒泡
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // 保存设置
    function saveSettings() {
        try {
            const delayInput = document.querySelector('.batch-prompt-delay');
            const separatorSelect = document.querySelector('.batch-prompt-separator');
            const newChatInput = document.querySelector('.batch-prompt-new-chat');

            const settings = {
                delay: delayInput ? delayInput.value : 15,
                separator: separatorSelect ? separatorSelect.value : '\n\n',
                newChat: newChatInput ? newChatInput.value : 0
            };

            localStorage.setItem('batchPromptSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('保存设置失败:', e);
        }
    }

    // 加载保存的设置
    function loadSavedSettings() {
        try {
            const settingsString = localStorage.getItem('batchPromptSettings');
            if (settingsString) {
                const settings = JSON.parse(settingsString);

                const delayInput = document.querySelector('.batch-prompt-delay');
                const separatorSelect = document.querySelector('.batch-prompt-separator');
                const newChatInput = document.querySelector('.batch-prompt-new-chat');

                if (delayInput && settings.delay) {
                    delayInput.value = settings.delay;
                }

                if (separatorSelect && settings.separator) {
                    separatorSelect.value = settings.separator;
                }

                if (newChatInput && settings.newChat !== undefined) {
                    newChatInput.value = settings.newChat;
                }
            }
        } catch (e) {
            console.error('加载设置失败:', e);
        }
    }

    // 显示/隐藏面板
    function togglePanel() {
        if (!panel) {
            panel = createBatchPromptUI();
        }

        if (panel.style.display === 'none' || panel.style.display === '') {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }

    // 恢复图标和面板
    function restoreAll() {
        // 恢复图标
        showFloatIcon();

        // 创建面板（如果不存在）
        if (!panel) {
            panel = createBatchPromptUI();
        }

        // 显示面板
        panel.style.display = 'block';
    }

    // 展示模板对话框
    function showTemplateDialog(template) {
        // 创建模板对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            padding: 20px;
        `;

        let dialogContent = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <h3 style="margin: 0;">${template.name}模板</h3>
                <div style="cursor: pointer; font-size: 20px;" class="template-dialog-close">×</div>
            </div>
            <div style="margin-bottom: 15px;">
                <strong>模板格式:</strong>
                <div style="margin-top: 5px; padding: 10px; background: #f5f5f5; border-radius: 4px;">${template.template}</div>
            </div>
            <div style="margin-bottom: 15px;">
                <strong>变量设置:</strong>
        `;

        // 添加变量选择
        for (const [key, values] of Object.entries(template.variables)) {
            dialogContent += `
                <div style="margin-top: 10px;">
                    <label style="display: block; margin-bottom: 5px;">${key}:</label>
                    <select class="template-variable" data-variable="${key}" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                        ${values.map(value => `<option value="${value}">${value}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        dialogContent += `
            <div style="margin-top: 20px;">
                <strong>生成数量:</strong>
                <input type="number" class="template-count" value="5" min="1" max="100" style="width: 80px; padding: 8px; border-radius: 4px; border: 1px solid #ddd; margin-left: 10px;">
            </div>
            <div style="margin-top: 20px; text-align: right;">
                <button class="template-dialog-cancel" style="background: #f5f5f5; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; margin-right: 10px;">取消</button>
                <button class="template-dialog-generate" style="background: #1677ff; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">生成提示词</button>
            </div>
        `;

        dialog.innerHTML = dialogContent;
        document.body.appendChild(dialog);

        // 关闭按钮
        dialog.querySelector('.template-dialog-close').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        // 取消按钮
        dialog.querySelector('.template-dialog-cancel').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        // 生成按钮
        dialog.querySelector('.template-dialog-generate').addEventListener('click', () => {
            const count = parseInt(dialog.querySelector('.template-count').value);
            const variables = {};

            // 获取所有变量值
            dialog.querySelectorAll('.template-variable').forEach(select => {
                const varName = select.getAttribute('data-variable');
                variables[varName] = select.value;
            });

            // 生成提示词
            generatePrompts(template, variables, count);
            document.body.removeChild(dialog);
        });
    }

    // 生成提示词
    function generatePrompts(template, selectedVariables, count) {
        const prompts = [];

        for (let i = 0; i < count; i++) {
            let prompt = template.template;

            // 替换变量
            for (const [key, value] of Object.entries(selectedVariables)) {
                const randomValue = i === 0 ? value : getRandomFromArray(template.variables[key]);
                prompt = prompt.replace(`{{${key}}}`, randomValue);
            }

            prompts.push(prompt);
        }

        // 获取当前选择的分隔符
        const separatorSelect = document.querySelector('.batch-prompt-separator');
        const separator = separatorSelect ? separatorSelect.value : '\n\n';

        // 更新文本区域
        const textarea = document.querySelector('.batch-prompt-textarea');
        if (textarea) {
            textarea.value = prompts.join(separator);
        }
    }

    // 从数组中随机获取一个元素
    function getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 开始批量发送
    async function startBatchSend() {
        const textarea = document.querySelector('.batch-prompt-textarea');
        const delayInput = document.querySelector('.batch-prompt-delay');
        const separatorSelect = document.querySelector('.batch-prompt-separator');
        const newChatInput = document.querySelector('.batch-prompt-new-chat');
        const statusDiv = document.querySelector('.batch-prompt-status');

        if (!textarea || !textarea.value.trim()) {
            alert('请输入提示词');
            return;
        }

        // 获取设置参数
        const separator = separatorSelect ? separatorSelect.value : '\n\n';
        const delaySeconds = parseInt(delayInput.value) || 15;
        const newChatFrequency = parseInt(newChatInput.value) || 0;

        // 根据选择的分隔符拆分提示词
        const prompts = textarea.value.split(separator).filter(line => line.trim() !== '');

        // 更新发送状态
        sendingStatus = {
            isRunning: true,
            isStopped: false,
            currentIndex: 0,
            totalCount: prompts.length,
            prompts: prompts,
            delaySeconds: delaySeconds,
            newChatFrequency: newChatFrequency,
            separator: separator
        };

        // 更新UI状态
        updateButtonStatus('sending');
        statusDiv.innerHTML = `准备发送 ${prompts.length} 条提示词...`;
        updateProgressBar(0, prompts.length);

        // 开始发送流程
        await sendPromptBatch();
    }

    // 停止批量发送
    function stopBatchSend() {
        if (sendingStatus.isRunning) {
            sendingStatus.isRunning = false;
            sendingStatus.isStopped = true;

            const statusDiv = document.querySelector('.batch-prompt-status');
            if (statusDiv) {
                statusDiv.innerHTML = `已中断发送，当前进度 ${sendingStatus.currentIndex}/${sendingStatus.totalCount}`;
            }

            // 更新UI状态
            updateButtonStatus('stopped');
        }
    }

    // 继续发送
    async function continueBatchSend() {
        if (sendingStatus.isStopped) {
            sendingStatus.isRunning = true;
            sendingStatus.isStopped = false;

            const statusDiv = document.querySelector('.batch-prompt-status');
            if (statusDiv) {
                statusDiv.innerHTML = `继续发送，当前进度 ${sendingStatus.currentIndex}/${sendingStatus.totalCount}`;
            }

            // 更新UI状态
            updateButtonStatus('sending');

            // 继续发送
            await sendPromptBatch();
        }
    }

    // 重新发送
    async function restartBatchSend() {
        // 重置发送状态
        sendingStatus.currentIndex = 0;
        sendingStatus.isRunning = true;
        sendingStatus.isStopped = false;

        // 更新进度条
        updateProgressBar(0, sendingStatus.totalCount);

        const statusDiv = document.querySelector('.batch-prompt-status');
        if (statusDiv) {
            statusDiv.innerHTML = `重新开始发送 ${sendingStatus.totalCount} 条提示词...`;
        }

        // 更新UI状态
        updateButtonStatus('sending');

        // 开始发送
        await sendPromptBatch();
    }

    // 批量发送处理函数
    async function sendPromptBatch() {
        const statusDiv = document.querySelector('.batch-prompt-status');
        const prompts = sendingStatus.prompts;

        for (let i = sendingStatus.currentIndex; i < prompts.length; i++) {
            // 检查是否已停止发送
            if (!sendingStatus.isRunning) {
                return;
            }

            // 更新当前索引
            sendingStatus.currentIndex = i;

            // 检查是否需要创建新对话
            if (sendingStatus.newChatFrequency > 0 && i > 0 && i % sendingStatus.newChatFrequency === 0) {
                if (statusDiv) {
                    statusDiv.innerHTML = `创建新对话...`;
                }
                await createNewChat();
                await sleep(2000); // 等待新对话加载
            }

            if (statusDiv) {
                statusDiv.innerHTML = `正在发送 ${i + 1}/${prompts.length}`;
            }

            // 更新进度条
            updateProgressBar(i + 1, prompts.length);

            const currentPrompt = prompts[i].trim();
            await sendPrompt(currentPrompt);

            if (i < prompts.length - 1 && sendingStatus.isRunning) {
                if (statusDiv) {
                    statusDiv.innerHTML = `等待 ${sendingStatus.delaySeconds} 秒后发送下一条...`;
                }
                await sleep(sendingStatus.delaySeconds * 1000);
            }
        }

        // 发送完成后更新状态
        if (sendingStatus.isRunning) {
            sendingStatus.isRunning = false;

            if (statusDiv) {
                statusDiv.innerHTML = `已完成 ${prompts.length} 条提示词的发送`;
            }

            // 更新UI状态
            updateButtonStatus('completed');
        }
    }

    // 创建新的对话
    async function createNewChat() {
        return new Promise(async (resolve) => {
            try {
                console.log("尝试创建新对话");

                // 方法1: 查找新建对话按钮
                const newChatSelectors = [
                    '.section-item-title-pOY6kw[title="图像生成"]',
                    '[title="图像生成"]',
                    '.section-item-title-pOY6kw'
                ];

                let newChatButton = null;
                for (const selector of newChatSelectors) {
                    const buttons = document.querySelectorAll(selector);
                    if (buttons.length > 0) {
                        // 通常是第一个图像生成按钮
                        newChatButton = buttons[0];
                        console.log("找到新对话按钮:", selector);
                        break;
                    }
                }

                if (newChatButton) {
                    // 模拟点击
                    newChatButton.click();
                    console.log("已点击新对话按钮");

                    // 等待新对话加载
                    await sleep(1500);
                    resolve();
                    return;
                }

                // 方法2: 尝试通过URL转跳创建新对话
                const currentUrl = window.location.href;
                if (currentUrl.includes('doubao.com')) {
                    // 获取当前路径并构建新的路径
                    const baseUrl = currentUrl.split('?')[0].split('#')[0];
                    const newUrl = baseUrl.includes('/chat/')
                        ? baseUrl.replace(/\/chat\/[^\/]+/, '/chat/image')
                        : baseUrl + '/chat/image';

                    console.log("通过URL跳转创建新对话:", newUrl);
                    window.location.href = newUrl;

                    // 等待页面加载
                    await sleep(2000);
                    resolve();
                    return;
                }

                console.error('找不到创建新对话的方法');
                alert('无法创建新对话，请手动创建一个新对话后再继续');
                resolve();
            } catch (error) {
                console.error('创建新对话时出错:', error);
                resolve();
            }
        });
    }

    // 发送单个提示词
    async function sendPrompt(promptText) {
        return new Promise(async (resolve) => {
            try {
                console.log("开始发送提示词:", promptText);

                // 查找输入框 - 尝试几种可能的选择器
                let inputArea = null;

                // 尝试找到Slate编辑器
                const possibleInputSelectors = [
                    '[data-slate-editor="true"]',
                    '[data-testid="chat_input_input"] [contenteditable="true"]',
                    '.editor-yXUeoZ [contenteditable="true"]',
                    '[role="textbox"][contenteditable="true"]'
                ];

                for (const selector of possibleInputSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        inputArea = element;
                        console.log("找到输入框:", selector);
                        break;
                    }
                }

                if (!inputArea) {
                    console.error('找不到输入框，尝试通过DOM结构查找');

                    // 尝试通过更复杂的DOM结构查找
                    const editorContainer = document.querySelector('.editor-container-kXzeJr, .editor-wrapper-UClPXc');
                    if (editorContainer) {
                        const possibleInput = editorContainer.querySelector('[contenteditable="true"]');
                        if (possibleInput) {
                            inputArea = possibleInput;
                            console.log("通过DOM结构找到输入框");
                        }
                    }
                }

                if (!inputArea) {
                    console.error('找不到输入框，无法继续');
                    resolve();
                    return;
                }

                // 清空现有内容并设置新内容
                await setInputContent(inputArea, promptText);

                // 等待片刻确保内容已设置
                await sleep(500);

                // 查找发送按钮
                const sendButtonSelectors = [
                    '#flow-end-msg-send',
                    '[data-testid="chat_input_send_button"]',
                    '.send-btn-xD8q3r',
                    'button[aria-label="发送"]'
                ];

                let sendButton = null;
                for (const selector of sendButtonSelectors) {
                    const button = document.querySelector(selector);
                    if (button) {
                        sendButton = button;
                        console.log("找到发送按钮:", selector);
                        break;
                    }
                }

                if (!sendButton) {
                    // 尝试通过父元素定位
                    const sendBtnWrapper = document.querySelector('.send-btn-wrapper, .container-uEzvxG');
                    if (sendBtnWrapper) {
                        const button = sendBtnWrapper.querySelector('button');
                        if (button) {
                            sendButton = button;
                            console.log("通过父元素找到发送按钮");
                        }
                    }
                }

                if (sendButton) {
                    console.log("点击发送按钮");
                    sendButton.click();

                    // 等待响应加载完成
                    await sleep(2000);
                    console.log("发送完成");
                    resolve();
                } else {
                    console.error('找不到发送按钮');
                    resolve();
                }
            } catch (error) {
                console.error('发送提示词时出错:', error);
                resolve();
            }
        });
    }

    // 设置输入内容的多种方法
    async function setInputContent(element, text) {
        console.log("尝试设置输入内容");

        // 方法1: 直接设置textContent
        element.textContent = text;

        // 方法2: 使用input事件
        try {
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: text
            });
            element.dispatchEvent(inputEvent);
        } catch (e) {
            console.log("InputEvent方法失败:", e);
        }

        // 方法3: 使用execCommand (旧方法，但在某些场景可能更有效)
        try {
            element.focus();
            document.execCommand('insertText', false, text);
        } catch (e) {
            console.log("execCommand方法失败:", e);
        }

        // 方法4: 使用ClipboardEvent
        try {
            const clipboardEvent = new ClipboardEvent('paste', {
                bubbles: true,
                cancelable: true,
                clipboardData: new DataTransfer()
            });

            // 设置剪贴板数据
            clipboardEvent.clipboardData.setData('text/plain', text);
            element.dispatchEvent(clipboardEvent);
        } catch (e) {
            console.log("ClipboardEvent方法失败:", e);
        }

        // 确保变化被检测到
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);

        // 等待一点时间确保内容被接受
        await sleep(300);

        console.log("输入内容设置完成:", element.textContent);
    }

    // 等待函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 全局键盘事件处理器
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt+B 或 Cmd+B 打开/关闭面板
            if ((e.altKey && e.key === 'b') || (e.metaKey && e.key === 'b')) {
                e.preventDefault();
                togglePanel();
            }

            // Alt+Y: 应急恢复所有元素
            if (e.altKey && e.key === 'y') {
                e.preventDefault();
                restoreAll();
            }
        });
    }

    // 初始化
    function initialize() {
        // 设置键盘快捷键
        setupKeyboardShortcuts();

        // 等待页面加载完成
        const checkInterval = setInterval(() => {
            // 检查页面是否包含输入框或编辑器
            const inputExists = document.querySelector('[data-testid="chat_input_input"], [data-slate-editor="true"], .editor-yXUeoZ');

            if (inputExists) {
                clearInterval(checkInterval);
                console.log("页面已加载，初始化批量提示词工具");
                createBatchPromptUI();
            }
        }, 1000);

        // 设置超时，防止无限等待
        setTimeout(() => {
            clearInterval(checkInterval);
            // 即使没找到特定元素，也尝试创建UI
            if (!document.querySelector('.batch-prompt-panel')) {
                console.log("页面加载超时，尝试初始化批量提示词工具");
                createBatchPromptUI();
            }
        }, 10000);
    }

    // 启动脚本
    initialize();
})();