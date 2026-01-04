// ==UserScript==
// @name         反诈中心
// @namespace    none
// @version      0.0.2
// @description  所有网站-反诈中心
// @author       yangrenrui & _s_z_y_ & Murasame
// @match        *://*/*
// @match        *://*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://llong.tech&size=64
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515166/%E5%8F%8D%E8%AF%88%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/515166/%E5%8F%8D%E8%AF%88%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取目标关键词列表和正则表达式列表
    let targetStrings = JSON.parse(localStorage.getItem('targetStrings')) || ['florr','bilibili','mihoyo','hornex'];
    let targetRegexes = JSON.parse(localStorage.getItem('targetRegexes')) || ['/^https?:\/\/([a-zA-Z0-9-]+\.)?bilibili\.(com|cn)\/.*/','/^https?:\/\/([a-zA-Z0-9-]+\.)?mihoyo\.(com|cn)\/.*/', '/^https?:\\/\\/malicious\\.site\\//','/^https?:\/\/([a-zA-Z0-9-]+\.)?florr\.io\/.*/','/^https?:\/\/([a-zA-Z0-9-]+\.)?hornex\.pro\/.*/'];

    // 解析关键词列表，支持正则表达式
    let targetPatterns = [];
    function updatePatterns() {
        targetPatterns = targetStrings.map(str => str).concat(targetRegexes.map(str => {
            if (str.startsWith('/') && str.endsWith('/')) {
                try {
                    let patternBody = str.slice(1, -1);
                    return new RegExp(patternBody);
                } catch (e) {
                    console.error(`无效的正则表达式: ${str}`);
                    return null;
                }
            } else {
                console.warn(`正则表达式模式中的项应以斜杠包裹: ${str}`);
                return null;
            }
        }).filter(item => item !== null));
    }
    updatePatterns();

    // 创建提示弹窗
    function createPopup(message, type = 'info') {
        const popup = document.createElement('div');
        popup.className = `custom-popup ${type}`;
        popup.innerText = message;
        document.body.appendChild(popup);

        // 显示动画
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            popup.classList.remove('show');
            // 移除元素
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 300);
        }, 500);
    }

    // 注入自定义CSS
    const style = document.createElement('style');
    style.innerHTML = `
    /* 提示弹窗样式 */
    .custom-popup {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(50, 50, 50, 0.9);
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 10005;
        font-family: Arial, sans-serif;
        pointer-events: none;
    }
    .custom-popup.show {
        opacity: 1;
        transform: translateY(0);
    }
    .custom-popup.info {
        background-color: #e74c3c;
    }
    .custom-popup.success {
        background-color: rgba(76, 175, 80, 0.9);
    }
    .custom-popup.error {
        background-color: rgba(244, 67, 54, 0.9);
    }
    .custom-popup.warning {
        background-color: rgba(255, 152, 0, 0.9);
    }

    /* 编辑界面样式 */
    #editUI {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10002;
        background-color: #fff;
        border: 2px solid #333;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: Arial, sans-serif;
    }
    #editUI h2 {
        text-align: center;
        margin-top: 0;
    }
    #editUI h3 {
        margin-bottom: 10px;
    }
    #editUI button {
        font-size: 14px;
    }
    #editUI .section {
        margin-bottom: 30px;
    }
    #editUI .item-block {
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }
    #editUI .item-block code {
        font-family: Consolas, monospace;
    }
    #editUI .item-buttons {
        display: flex;
        gap: 5px;
    }
    #editUI .item-buttons button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
    }
    #editUI .add-button {
        padding: 8px 16px;
        background-color: #2196F3;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }
    #editUI .save-cancel-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
    }
    #editUI .save-cancel-buttons button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }
    #editUI .save-button {
        background-color: #4CAF50;
        color: #fff;
    }
    #editUI .cancel-button {
        background-color: #f44336;
        color: #fff;
    }

    /* 提示框样式 */
    .tooltip-custom {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 8px 12px;
        border-radius: 6px;
        display: none;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        z-index: 10000;
        pointer-events: none;
        transition: opacity 0.3s;
    }
    .tooltip-custom.show {
        display: block;
        opacity: 1;
    }
    `;
    document.head.appendChild(style);

    // 创建提示框
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-custom';
    document.body.appendChild(tooltip);

    // 创建确认窗口
    const confirmDialog = document.createElement('div');
    confirmDialog.style.position = 'absolute';
    confirmDialog.style.backgroundColor = '#fff';
    confirmDialog.style.color = '#000';
    confirmDialog.style.padding = '15px 20px';
    confirmDialog.style.borderRadius = '8px';
    confirmDialog.style.display = 'none';
    confirmDialog.style.fontSize = '14px';
    confirmDialog.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    confirmDialog.style.zIndex = '10001';
    confirmDialog.style.width = '300px';
    confirmDialog.style.boxSizing = 'border-box';
    document.body.appendChild(confirmDialog);

    // 确认内容
    const confirmText = document.createElement('p');
    confirmText.innerText = '您即将打开一个疑似诈骗链接：';
    confirmText.style.margin = '0 0 10px 0';
    confirmDialog.appendChild(confirmText);

    const urlText = document.createElement('p');
    urlText.style.wordBreak = 'break-all';
    urlText.style.margin = '0 0 10px 0';
    confirmDialog.appendChild(urlText);

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'right';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    confirmDialog.appendChild(buttonContainer);

    const confirmButton = document.createElement('button');
    confirmButton.innerText = '确定 (Enter)';
    confirmButton.style.padding = '6px 12px';
    confirmButton.style.backgroundColor = '#4CAF50';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.fontSize = '14px';
    confirmButton.onclick = () => {
        window.open(confirmButton.linkHref, '_blank');
        hideConfirmDialog();
        createPopup('已打开链接', 'success');
    };
    buttonContainer.appendChild(confirmButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerText = '取消 (Esc)';
    cancelButton.style.padding = '6px 12px';
    cancelButton.style.backgroundColor = '#f44336';
    cancelButton.style.color = '#fff';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.fontSize = '14px';
    cancelButton.onclick = () => {
        hideConfirmDialog();
        createPopup('已取消', 'info');
    };
    buttonContainer.appendChild(cancelButton);

    let currentLinkHref = '';
    let mouseX = 0;
    let mouseY = 0;

    // 显示确认窗口
    function showConfirmDialog(x, y, href) {
        currentLinkHref = href;
        urlText.innerText = href;
        confirmDialog.style.left = `${x + 10}px`;
        confirmDialog.style.top = `${y + 10}px`;
        confirmDialog.style.display = 'block';
        confirmButton.linkHref = href;
        confirmButton.focus();
    }

    // 隐藏确认窗口
    function hideConfirmDialog() {
        confirmDialog.style.display = 'none';
        currentLinkHref = '';
    }

    // 监听鼠标移动以记录位置
    document.addEventListener('mousemove', function(event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    });

    // 处理鼠标点击事件
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (link && link.href) {
            for (let pattern of targetPatterns) {
                if (typeof pattern === 'string') {
                    if (link.href.includes(pattern)) {
                        event.preventDefault();
                        showConfirmDialog(mouseX, mouseY, link.href);
                        return;
                    }
                } else if (pattern instanceof RegExp) {
                    if (pattern.test(link.href)) {
                        event.preventDefault();
                        showConfirmDialog(mouseX, mouseY, link.href);
                        return;
                    }
                }
            }
        }
    });

    // 处理键盘事件
    document.addEventListener('keydown', function(e) {
        if (confirmDialog.style.display === 'block') {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.open(confirmButton.linkHref, '_blank');
                hideConfirmDialog();
                createPopup('已打开链接', 'success');
            } else if (e.key === 'Escape') {
                e.preventDefault();
                hideConfirmDialog();
                createPopup('已取消', 'info');
            }
        }

        // Ctrl + M 打开编辑界面
        if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
            e.preventDefault();
            showEditUI();
        }
    });

    // 监听鼠标悬停显示提示框
    function handleMouseOver(event) {
        const link = event.target.closest('a');
        if (link && link.href) {
            for (let pattern of targetPatterns) {
                if (typeof pattern === 'string') {
                    if (link.href.includes(pattern)) {
                        tooltip.innerText = `疑似诈骗链接 (关键字匹配): ${pattern}`;
                        tooltip.style.left = `${event.pageX + 10}px`;
                        tooltip.style.top = `${event.pageY + 10}px`;
                        tooltip.classList.add('show');
                        return;
                    }
                } else if (pattern instanceof RegExp) {
                    if (pattern.test(link.href)) {
                        tooltip.innerText = `疑似诈骗链接 (正则匹配): ${pattern}`;
                        tooltip.style.left = `${event.pageX + 10}px`;
                        tooltip.style.top = `${event.pageY + 10}px`;
                        tooltip.classList.add('show');
                        return;
                    }
                }
            }
            tooltip.classList.remove('show');
        }
    }

    // 监听鼠标移出隐藏提示框
    function handleMouseOut() {
        tooltip.classList.remove('show');
    }

    document.addEventListener('mousemove', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // 创建编辑关键词和正则表达式的UI
    function showEditUI() {
        if (document.getElementById('editUI')) return;
        const editUI = document.createElement('div');
        editUI.id = 'editUI';

        // 匹配关键字模式部分
        const keywordSection = document.createElement('div');
        keywordSection.className = 'section';

        const keywordTitle = document.createElement('h3');
        keywordTitle.innerText = '匹配关键字模式';
        keywordSection.appendChild(keywordTitle);

        const keywordList = document.createElement('div');
        keywordList.id = 'keywordList';
        keywordSection.appendChild(keywordList);

        // 渲染关键词列表
        function renderKeywordList() {
            keywordList.innerHTML = '';
            targetStrings.forEach((keyword, index) => {
                const keywordBlock = document.createElement('div');
                keywordBlock.className = 'item-block';

                const keywordDisplay = document.createElement('div');
                keywordDisplay.innerHTML = `<code>${keyword}</code>`;
                keywordBlock.appendChild(keywordDisplay);

                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'item-buttons';

                const editButton = document.createElement('button');
                editButton.innerHTML = '🖊';
                editButton.title = '编辑';
                editButton.onclick = () => {
                    enterEditMode(keywordBlock, 'keyword', index, keyword);
                };
                buttonGroup.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '×';
                deleteButton.title = '删除';
                deleteButton.onclick = () => {
                    createCustomConfirm(`确定要删除关键词 "${keyword}" 吗？`, () => {
                        targetStrings.splice(index, 1);
                        updatePatterns();
                        renderKeywordList();
                        renderRegexList();
                        createPopup('已删除', 'success');
                    });
                };
                buttonGroup.appendChild(deleteButton);

                keywordBlock.appendChild(buttonGroup);
                keywordList.appendChild(keywordBlock);
            });
        }

        renderKeywordList();

        const addKeywordButton = document.createElement('button');
        addKeywordButton.innerText = '+ 添加关键词';
        addKeywordButton.className = 'add-button';
        addKeywordButton.onclick = () => {
            enterAddMode('keyword');
        };
        keywordSection.appendChild(addKeywordButton);

        editUI.appendChild(keywordSection);

        // 高级模式部分
        const regexSection = document.createElement('div');
        regexSection.className = 'section';

        const regexTitle = document.createElement('h3');
        regexTitle.innerText = '高级模式（正则表达式）';
        regexSection.appendChild(regexTitle);

        const regexList = document.createElement('div');
        regexList.id = 'regexList';
        regexSection.appendChild(regexList);

        // 渲染正则表达式列表
        function renderRegexList() {
            regexList.innerHTML = '';
            targetRegexes.forEach((regex, index) => {
                const regexBlock = document.createElement('div');
                regexBlock.className = 'item-block';

                const regexDisplay = document.createElement('div');
                regexDisplay.innerHTML = `<code>${regex}</code>`;
                regexBlock.appendChild(regexDisplay);

                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'item-buttons';

                const editButton = document.createElement('button');
                editButton.innerHTML = '🖊';
                editButton.title = '编辑';
                editButton.onclick = () => {
                    enterEditMode(regexBlock, 'regex', index, regex);
                };
                buttonGroup.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '×';
                deleteButton.title = '删除';
                deleteButton.onclick = () => {
                    createCustomConfirm(`确定要删除正则表达式 "${regex}" 吗？`, () => {
                        targetRegexes.splice(index, 1);
                        updatePatterns();
                        renderKeywordList();
                        renderRegexList();
                        createPopup('已删除', 'success');
                    });
                };
                buttonGroup.appendChild(deleteButton);

                regexBlock.appendChild(buttonGroup);
                regexList.appendChild(regexBlock);
            });
        }

        renderRegexList();

        const addRegexButton = document.createElement('button');
        addRegexButton.innerText = '+ 添加正则表达式';
        addRegexButton.className = 'add-button';
        addRegexButton.onclick = () => {
            enterAddMode('regex');
        };
        regexSection.appendChild(addRegexButton);

        editUI.appendChild(regexSection);

        // 按钮容器
        const buttonContainerEdit = document.createElement('div');
        buttonContainerEdit.className = 'save-cancel-buttons';

        const saveButtonEdit = document.createElement('button');
        saveButtonEdit.innerText = '保存';
        saveButtonEdit.className = 'save-button';
        saveButtonEdit.onclick = () => {
            try {
                // 验证所有正则表达式
                targetRegexes.forEach(regex => {
                    if (regex.startsWith('/') && regex.endsWith('/')) {
                        new RegExp(regex.slice(1, -1));
                    } else {
                        throw new Error(`正则表达式必须以斜杠 "/" 包裹: ${regex}`);
                    }
                });

                // 更新存储
                localStorage.setItem('targetStrings', JSON.stringify(targetStrings));
                localStorage.setItem('targetRegexes', JSON.stringify(targetRegexes));

                createPopup('已自动保存', 'success');
                document.body.removeChild(editUI);
            } catch (error) {
                createPopup(`保存失败: ${error.message}`, 'error');
            }
        };
        buttonContainerEdit.appendChild(saveButtonEdit);

        const cancelButtonEdit = document.createElement('button');
        cancelButtonEdit.innerText = '取消';
        cancelButtonEdit.className = 'cancel-button';
        cancelButtonEdit.onclick = () => {
            createPopup('已取消', 'info');
            document.body.removeChild(editUI);
        };
        buttonContainerEdit.appendChild(cancelButtonEdit);

        editUI.appendChild(buttonContainerEdit);
        document.body.appendChild(editUI);
    }

    // 进入编辑模式
    function enterEditMode(block, type, index, currentValue) {
        block.innerHTML = '';

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.gap = '10px';
        inputContainer.style.width = '100%';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.style.flexGrow = '1';
        input.style.fontFamily = 'Consolas, monospace';
        input.style.padding = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        inputContainer.appendChild(input);

        const okButton = document.createElement('button');
        okButton.innerText = 'OK (请在编辑后到最下方保存)';
        okButton.style.padding = '5px 10px';
        okButton.style.backgroundColor = '#4CAF50';
        okButton.style.color = '#fff';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';
        okButton.style.fontSize = '14px';
        okButton.onclick = () => {
            saveEdit(block, type, index, input.value.trim());
        };
        inputContainer.appendChild(okButton);

        block.appendChild(inputContainer);

        // 监听 Enter 键
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit(block, type, index, input.value.trim());
            }
        });

        // 自动聚焦输入框
        input.focus();
    }

    // 进入添加模式
    function enterAddMode(type) {
        let sectionId = type === 'keyword' ? 'keywordList' : 'regexList';
        let list = document.getElementById(sectionId);

        const addBlock = document.createElement('div');
        addBlock.className = 'item-block';

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.gap = '10px';
        inputContainer.style.width = '100%';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = type === 'keyword' ? '输入新的关键词' : '输入新的正则表达式（需用斜杠包裹）';
        input.style.flexGrow = '1';
        input.style.fontFamily = 'Consolas, monospace';
        input.style.padding = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        inputContainer.appendChild(input);

        const okButton = document.createElement('button');
        okButton.innerText = 'OK';
        okButton.style.padding = '5px 10px';
        okButton.style.backgroundColor = '#4CAF50';
        okButton.style.color = '#fff';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';
        okButton.style.fontSize = '14px';
        okButton.onclick = () => {
            const newValue = input.value.trim();
            if (newValue === '') {
                createPopup('输入不能为空', 'error');
                return;
            }
            if (type === 'regex') {
                if (!newValue.startsWith('/') || !newValue.endsWith('/')) {
                    createPopup('正则表达式必须以斜杠 "/" 包裹。', 'error');
                    return;
                }
                try {
                    new RegExp(newValue.slice(1, -1));
                } catch (e) {
                    createPopup('无效的正则表达式。', 'error');
                    return;
                }
                targetRegexes.push(newValue);
            } else {
                targetStrings.push(newValue);
            }
            updatePatterns();
            renderEditUI();
            createPopup('已自动保存', 'success');
        };
        inputContainer.appendChild(okButton);

        // 监听 Enter 键
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                okButton.click();
            }
        });

        addBlock.appendChild(inputContainer);
        list.appendChild(addBlock);

        // 自动聚焦输入框
        input.focus();
    }

    // 保存编辑
    function saveEdit(block, type, index, newValue) {
        if (type === 'keyword') {
            if (newValue === '') {
                createPopup('关键词不能为空。', 'error');
                return;
            }
            targetStrings[index] = newValue;
        } else if (type === 'regex') {
            if (!newValue.startsWith('/') || !newValue.endsWith('/')) {
                createPopup('正则表达式必须以斜杠 "/" 包裹。', 'error');
                return;
            }
            try {
                new RegExp(newValue.slice(1, -1));
                targetRegexes[index] = newValue;
            } catch (e) {
                createPopup('无效的正则表达式。', 'error');
                return;
            }
        }

        updatePatterns();
        renderEditUI();
        createPopup('已自动保存', 'success');
    }

    // 重新渲染编辑界面
    function renderEditUI() {
        const editUI = document.getElementById('editUI');
        if (editUI) {
            document.body.removeChild(editUI);
            showEditUI();
        }
    }

    // 自定义确认弹窗
    function createCustomConfirm(message, onConfirm) {
        // 创建遮罩
        const overlay = document.createElement('div');
        overlay.className = 'custom-confirm-overlay';
        document.body.appendChild(overlay);

        // 创建弹窗
        const confirmBox = document.createElement('div');
        confirmBox.className = 'custom-confirm-box';

        const msg = document.createElement('p');
        msg.innerText = message;
        confirmBox.appendChild(msg);

        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.justifyContent = 'flex-end';
        buttons.style.gap = '10px';

        const yesButton = document.createElement('button');
        yesButton.innerText = '确定';
        yesButton.style.padding = '6px 12px';
        yesButton.style.backgroundColor = '#4CAF50';
        yesButton.style.color = '#fff';
        yesButton.style.border = 'none';
        yesButton.style.borderRadius = '4px';
        yesButton.style.cursor = 'pointer';
        yesButton.onclick = () => {
            onConfirm();
            document.body.removeChild(overlay);
            document.body.removeChild(confirmBox);
        };
        buttons.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.innerText = '取消';
        noButton.style.padding = '6px 12px';
        noButton.style.backgroundColor = '#f44336';
        noButton.style.color = '#fff';
        noButton.style.border = 'none';
        noButton.style.borderRadius = '4px';
        noButton.style.cursor = 'pointer';
        noButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(confirmBox);
        };
        buttons.appendChild(noButton);

        confirmBox.appendChild(buttons);
        document.body.appendChild(confirmBox);

        // CSS for custom confirm
        const confirmStyle = document.createElement('style');
        confirmStyle.innerHTML = `
        .custom-confirm-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10003;
        }
        .custom-confirm-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            z-index: 10004;
            font-family: Arial, sans-serif;
            width: 300px;
        }
        .custom-confirm-box p {
            margin-bottom: 20px;
            font-size: 14px;
        }
        .custom-confirm-box button {
            font-size: 14px;
        }
        `;
        document.head.appendChild(confirmStyle);
    }
})();
