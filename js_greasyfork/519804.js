// ==UserScript==
// @name         飞向未来增强辅助
// @namespace    http*://*.tiancai9.click
// @version      3.3
// @description  飞向未来游戏增强辅助
// @author       Oneszhang 丸子
// @match        http*://*.tiancai9.click
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/519804/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5%E5%A2%9E%E5%BC%BA%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/519804/%E9%A3%9E%E5%90%91%E6%9C%AA%E6%9D%A5%E5%A2%9E%E5%BC%BA%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DISABLE_LIST_KEY = 'disableList'; // 本地存储键
    const FISHING_SWITCH_KEY = 'fishingProtection'; // 统一使用 fishingProtection 作为存储键

    // 从 localStorage 加载禁用列表
    let disableList = JSON.parse(localStorage.getItem(DISABLE_LIST_KEY)) || [
        '草药园',
        '医疗站',
        '畜牧场',
        '采集小屋',
        '军营',
        '打猎小屋',
        '农田',
    ];

    // 从 localStorage 加载钓鱼防断线设置
    let fishingProtection = JSON.parse(localStorage.getItem(FISHING_SWITCH_KEY)) || false;

    // 保存禁用列表到 localStorage
    function saveDisableList() {
        localStorage.setItem(DISABLE_LIST_KEY, JSON.stringify(disableList));
    }

    // 保存钓鱼防断线设置到 localStorage
    function saveFishingProtection() {
        localStorage.setItem(FISHING_SWITCH_KEY, JSON.stringify(fishingProtection));
    }

    // ========== 菜单初始化 ==========
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.bottom = '20px';
    menuContainer.style.right = '20px';
    menuContainer.style.padding = '10px';
    menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    menuContainer.style.color = '#fff';
    menuContainer.style.borderRadius = '5px';
    menuContainer.style.zIndex = '1000';
    menuContainer.style.cursor = 'move';
    menuContainer.style.width = '300px';
    menuContainer.style.overflowY = 'auto';
    menuContainer.style.maxHeight = '500px';
    document.body.appendChild(menuContainer);

    // ========== 日志功能区 ==========
    const logSection = document.createElement('div');
    const logTitle = document.createElement('h4');
    logTitle.innerText = '日志';
    logTitle.style.marginBottom = '10px';
    logTitle.style.color = '#fff';
    // logSection.appendChild(logTitle);

    const logContainer = document.createElement('div');
    logContainer.style.backgroundColor = '#333';
    logContainer.style.padding = '5px';
    logContainer.style.borderRadius = '5px';
    logContainer.style.height = '150px';
    logContainer.style.overflowY = 'auto';
    logContainer.style.color = '#fff';
    logContainer.style.fontSize = '12px';
    logSection.appendChild(logContainer);

    function addLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.innerText = `[${timestamp}] ${message}`;
        logContainer.appendChild(logEntry);

        // 限制日志数量为 100 条
        while (logContainer.children.length > 100) {
            logContainer.removeChild(logContainer.firstChild);
        }

        logContainer.scrollTop = logContainer.scrollHeight; // 滚动到底部
    }

    window.addLog = addLog;

    menuContainer.appendChild(logSection);


    // ========== 通用功能区 ==========
    const clickSection = document.createElement('div');
    const clickTitle = document.createElement('h4');
    clickTitle.innerText = '通用功能';
    clickTitle.style.marginBottom = '10px';
    clickTitle.style.color = '#fff';
    // clickSection.appendChild(clickTitle);

    // 通用点击按钮生成
    function createClickButton(text, color, target) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.padding = '5px 10px';
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.margin = '5px 5px 5px 0';
        button.addEventListener('click', () => clickTarget(target));
        clickSection.appendChild(button);
    }

    createClickButton('砍树', '#4CAF50', '大树');
    // createClickButton('农田', '#2196F3', '农田');
    // createClickButton('居所', '#FFD700', '居所');
    // createClickButton('仓库', '#FF5122', '仓库');
    createClickButton('建筑五列', '#FF5722', '建筑五列');
    createClickButton('自动钓鱼', '#009688', '自动钓鱼');
    menuContainer.appendChild(clickSection);

    // ========== Auto Fishing 功能 ==========
    //钓鱼防断线
    const fishingSwitchContainer = document.createElement('div');
    const fishingSwitchLabel = document.createElement('label');
    const fishingSwitch = document.createElement('input');
    fishingSwitch.type = 'checkbox';
    fishingSwitch.checked = fishingProtection; // 使用统一的变量
    fishingSwitchLabel.appendChild(fishingSwitch);
    fishingSwitchLabel.appendChild(document.createTextNode(' 钓鱼防断线开关'));
    fishingSwitchContainer.appendChild(fishingSwitchLabel);
    clickSection.appendChild(fishingSwitchContainer);

    fishingSwitch.addEventListener('change', () => {
        fishingProtection = fishingSwitch.checked; // 更新变量
        localStorage.setItem(FISHING_SWITCH_KEY, JSON.stringify(fishingProtection)); // 使用统一的存储键
        if (fishingProtection) {
            addLog('钓鱼防断线开关已开启');
            initialize();
        } else {
            addLog('钓鱼防断线开关已关闭');
            stopAutoFishing();
        }
    });

    //自动钓鱼
    let autoFishing = false; // 标记是否正在自动钓鱼
    let autoFishingInterval = null; // 存储定时器ID
    const MAX_CONSECUTIVE_ZERO = 3; // 最大连续0%进度次数
    let consecutiveZeroCount = 0; // 当前连续0%进度次数

    async function autoFishingProcess() {
        const holdButton = Array.from(document.querySelectorAll('button')).find(btn => btn.innerText.includes('按住我'));
        const progressText = () => document.querySelector('div.el-progress__text > span');

        if (!holdButton) {
            addLog('未找到“按住我”按钮，没鱼竿啊老铁！');
            stopAutoFishing();
            return;
        }

        try {
            while (autoFishing) {
                // 模拟长按（mousedown）
                holdButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                addLog('抛竿!钓鱼ing~');

                // 轮询检查进度
                let progress = 0;
                consecutiveZeroCount = 0; // 重置计数器
                while (autoFishing && progress < 100) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // 每500ms检查一次
                    const progressElement = progressText();
                    if (progressElement) {
                        progress = parseInt(progressElement.innerText);
                        addLog(`当前进度: ${progress}%`);

                        if (progress === 0 || progress === 100) {
                            consecutiveZeroCount += 1;
                            addLog(`鱼口监控: ${consecutiveZeroCount}`);
                            if (consecutiveZeroCount >= MAX_CONSECUTIVE_ZERO) {
                                addLog('检测到爆杆，重新尝试钓鱼');
                                break; // 跳出内层循环，重新开始钓鱼
                            }
                        } else {
                            // 如果进度不是0，重置计数器
                            consecutiveZeroCount = 0;
                        }
                    } else {
                        addLog('未找到钓鱼进度条元素');
                        break;
                    }
                }

                if (progress >= 100) {
                    // 释放长按（mouseup）
                    holdButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    addLog('鱼来！！！！');

                    // 等待一段时间再进行下一次钓鱼（根据游戏的冷却时间调整）
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
                } else if (consecutiveZeroCount >= MAX_CONSECUTIVE_ZERO) {
                    // 释放长按（mouseup）
                    holdButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    addLog('钓呲了，重新尝试钓鱼');

                    // 等待一段时间再重新尝试
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
                } else {
                    // 如果在过程中被停止或其他原因
                    holdButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    addLog('自动钓鱼已停止或遇到问题');

                    if (fishingProtection) {
                        // 等待一段时间再重新尝试
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
                    }
                }
            }
        } catch (error) {
            addLog(`自动钓鱼过程中出错: ${error}`);
            stopAutoFishing();
        }
    }

    function startAutoFishing() {
        if (autoFishing) {
            addLog('自动钓鱼已在运行中');
            return;
        }
        autoFishing = true;
        addLog('启动自动钓鱼');
        autoFishingProcess();
    }

    function stopAutoFishing() {
        if (!autoFishing) {
            addLog('自动钓鱼未在运行');
            return;
        }
        autoFishing = false;
        addLog('停止自动钓鱼');

        // 钓鱼防断开启才执行
        if (fishingProtection) {
            setTimeout(() => {
                addLog('重新启动自动钓鱼');
                startAutoFishing();
            }, 5000); // 5000毫秒 = 5秒
        }
    }

    async function clickTarget(text) {
        if (text === '建筑五列') {
            const styleElement = document.createElement('style');
            styleElement.innerHTML = `
                .building-box .building {
                    width: calc(20% - 0.35rem) !important;
                }
            `;
            document.head.appendChild(styleElement);
            addLog('已应用建筑五列样式');
            return;
        }

        if (text === '自动钓鱼') {
            if (autoFishing) {
                stopAutoFishing();
            } else {
                startAutoFishing();
            }
            return;
        }

        const targetSpans = Array.from(document.querySelectorAll('div')).filter(span => span.innerText.includes(text));
        if (targetSpans.length === 0) {
            addLog(`未找到包含 "${text}" 的元素`);
            return;
        }

        addLog(`开始撸 "${text}" `);
        for (let i = 0; i < 30; i++) { // 可调整点击次数
            targetSpans.forEach(span => span.click());
            await new Promise(resolve => setTimeout(resolve, 50)); // 50ms 延迟
        }
        addLog(`完成撸 "${text}" `);
    }

    // ========== 禁用列表管理功能区 ==========
    const disableSection = document.createElement('div');
    const disableTitle = document.createElement('h4');
    disableTitle.innerText = '管理禁用列表';
    disableTitle.style.marginBottom = '10px';
    disableTitle.style.color = '#fff';
    // disableSection.appendChild(disableTitle);

    function toggleDisableBuildings() {
        const elements = Array.from(document.querySelectorAll('[data-name]'));
        let hidden = false;

        disableList.forEach(dataName => {
            elements.forEach(el => {
                if (el.getAttribute('data-name') === dataName) {
                    if (el.style.pointerEvents === 'none') {
                        el.style.pointerEvents = '';
                        el.style.opacity = '';
                    } else {
                        el.style.pointerEvents = 'none';
                        el.style.opacity = '0.5';
                        hidden = true;
                    }
                }
            });
        });

        addLog(
            hidden
                ? `已隐藏禁用列表中的建筑: ${disableList.join(', ')}`
                : `已恢复禁用列表中的建筑: ${disableList.join(', ')}`
        );
    }

    const toggleButton = document.createElement('button');
    toggleButton.innerText = '禁用/开启无用建筑';
    toggleButton.style.marginBottom = '10px';
    toggleButton.style.backgroundColor = '#FF9800';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.addEventListener('click', toggleDisableBuildings);
    disableSection.appendChild(toggleButton);

    menuContainer.appendChild(disableSection);

    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.marginBottom = '10px';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.cursor = 'text !important';
    inputField.placeholder = '添加到禁用列表';
    inputField.style.flex = '1';
    inputField.style.color = '#000';
    inputField.style.padding = '5px';
    inputField.style.marginRight = '5px';
    inputField.style.borderRadius = '3px';
    inputField.style.border = '1px solid #ccc';
    inputContainer.appendChild(inputField);

    const addButton = document.createElement('button');
    addButton.innerText = '添加';
    addButton.style.backgroundColor = '#4CAF50';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '3px';
    addButton.style.padding = '5px 10px';
    addButton.style.cursor = 'pointer';
    addButton.addEventListener('click', () => {
        const value = inputField.value.trim();
        if (value && !disableList.includes(value)) {
            disableList.push(value);
            inputField.value = '';
            refreshDisableList();
            saveDisableList();
            addLog(`添加到禁用列表: ${value}`);
        }
    });
    inputContainer.appendChild(addButton);

    disableSection.appendChild(inputContainer);

    const disableListContainer = document.createElement('div');
    disableListContainer.style.marginBottom = '10px';
    disableSection.appendChild(disableListContainer);

    function refreshDisableList() {
        disableListContainer.innerHTML = '';
        disableList.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between';
            listItem.style.alignItems = 'center';
            listItem.style.marginBottom = '5px';

            const text = document.createElement('span');
            text.innerText = item;
            listItem.appendChild(text);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = '删除';
            deleteButton.style.backgroundColor = '#FF5722';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '3px';
            deleteButton.style.padding = '2px 5px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.addEventListener('click', () => {
                disableList.splice(index, 1);
                refreshDisableList();
                saveDisableList();
                addLog(`从禁用列表移除: ${item}`);
            });
            listItem.appendChild(deleteButton);

            disableListContainer.appendChild(listItem);
        });
    }

    refreshDisableList();

    // ========== 拖动功能 ==========
    let offsetX, offsetY;
    menuContainer.addEventListener('mousedown', (e) => {
        // 仅在点击菜单的顶部（比如标题区域）时才开始拖动
        if (e.target === menuContainer || e.target.tagName.toLowerCase() === 'h4') {
            offsetX = e.clientX - menuContainer.getBoundingClientRect().left;
            offsetY = e.clientY - menuContainer.getBoundingClientRect().top;

            menuContainer.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    });

    function onMouseMove(e) {
        menuContainer.style.left = `${e.clientX - offsetX}px`;
        menuContainer.style.top = `${e.clientY - offsetY}px`;
        menuContainer.style.bottom = '';
        menuContainer.style.right = '';
    }

    function onMouseUp() {
        menuContainer.style.cursor = 'move';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // ========== 折叠功能区初始化 ==========
    function createCollapsibleSection(titleText, sectionContent) {
        const section = document.createElement('div');
        const header = document.createElement('div');
        const content = document.createElement('div');

        // Header样式和内容
        header.innerText = titleText;
        header.style.cursor = 'pointer';
        header.style.padding = '5px 10px';
        header.style.backgroundColor = '#444';
        header.style.color = '#fff';
        header.style.borderRadius = '3px';
        header.style.marginBottom = '5px';

        // Content样式
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease';
        content.style.maxHeight = '0px';
        content.style.padding = '0 10px';
        content.style.backgroundColor = '#333';
        content.style.color = '#fff';
        content.style.borderRadius = '3px';

        // 绑定点击事件
        header.addEventListener('click', () => {
            if (content.style.maxHeight === '0px') {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0px';
            }
        });

        // 组装
        content.appendChild(sectionContent);
        section.appendChild(header);
        section.appendChild(content);

        return section;
    }

    // ========== 日志功能区折叠 ==========
    const logContent = document.createElement('div');
    logContent.appendChild(logSection);
    const collapsibleLogSection = createCollapsibleSection('日志', logContent);

    // ========== 通用功能区折叠 ==========
    const clickContent = document.createElement('div');
    clickContent.appendChild(clickSection);
    const collapsibleClickSection = createCollapsibleSection('通用功能', clickContent);

    // ========== 禁用列表功能区折叠 ==========
    const disableContent = document.createElement('div');
    disableContent.appendChild(disableSection);
    const collapsibleDisableSection = createCollapsibleSection('管理禁用列表', disableContent);

    // ========== 添加折叠后的功能区到菜单 ==========
    menuContainer.innerHTML = ''; // 清空初始内容
    menuContainer.appendChild(collapsibleLogSection);
    menuContainer.appendChild(collapsibleClickSection);
    menuContainer.appendChild(collapsibleDisableSection);

    // 在脚本加载时自动启动钓鱼
    function initAutoFishing() {
        addLog('脚本加载完成，自动启动钓鱼');
        startAutoFishing(); // 调用自动钓鱼功能
    }

    // 每10分钟刷新页面
    function autoRefreshPage() {
        if (fishingProtection) { // 只有在钓鱼防断开启时才执行刷新
            setInterval(() => {
                addLog('10分钟到，正在刷新页面...');
                window.location.reload();
            }, 10 * 60 * 1000); // 10分钟（单位：毫秒）
        }
    }

    // 初始化功能
    function initialize() {
        if (fishingProtection) { // 只有在钓鱼防断开启时才执行
            initAutoFishing(); // 启动自动钓鱼
            autoRefreshPage(); // 启动定时刷新
        }
    }

    // 启动脚本功能
    initialize();
})();
