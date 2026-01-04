// ==UserScript==
// @name         洛谷反诈中心
// @namespace    http://tampermonkey.net/
// @version      2024-10-15-plus
// @description  反诈！！！
// @author       _s_z_y_
// @match        https://www.luogu.com.cn/*
// @match        https://www.luogu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=143.113
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512705/%E6%B4%9B%E8%B0%B7%E5%8F%8D%E8%AF%88%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/512705/%E6%B4%9B%E8%B0%B7%E5%8F%8D%E8%AF%88%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==
let targetStrings = JSON.parse(localStorage.getItem('targetStrings')) || ['mihoyo'];

// 创建提示框
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'black';
tooltip.style.color = 'white';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '5px';
tooltip.style.display = 'none';
tooltip.style.zIndex = '10000';
document.body.appendChild(tooltip);

// 检查链接的 href 中是否包含目标字符串
function handleMouseOver(event) {
    const link = event.target.closest('a');
    if (link && link.href) {
        targetStrings.forEach(targetString => {
            const regex = new RegExp(targetString.replace(/\*/g, '.*'));
            if (regex.test(link.href)) {
                tooltip.innerText = `链接包含: ${targetString}`;
                tooltip.style.display = 'block';
                tooltip.style.left = `${event.pageX + 10}px`;
                tooltip.style.top = `${event.pageY + 10}px`;
            }
        });
    }
}

// 隐藏提示框
function handleMouseOut() {
    tooltip.style.display = 'none';
}

// 显示自定义确认框
let confirmDialogVisible = false;
function showConfirmDialog(link) {
    if (confirmDialogVisible) return;

    confirmDialogVisible = true;
    const confirmDialog = document.createElement('div');
    confirmDialog.style.position = 'fixed';
    confirmDialog.style.top = '50%';
    confirmDialog.style.left = '50%';
    confirmDialog.style.transform = 'translate(-50%, -50%)';
    confirmDialog.style.zIndex = '10000';
    confirmDialog.style.backgroundColor = '#f9f9f9';
    confirmDialog.style.border = '1px solid #ccc';
    confirmDialog.style.padding = '20px';
    confirmDialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    confirmDialog.style.borderRadius = '8px';
    confirmDialog.style.width = '300px';

    const message = document.createElement('p');
    message.innerText = `你即将打开一个链接:\n${link.href}\n是否确定继续?`;
    // 设置自动换行
    message.style.wordWrap = 'break-word';  // 自动换行
    message.style.overflow = 'hidden';  // 隐藏溢出部分
    message.style.maxWidth = '100%';  // 限制最大宽度
    confirmDialog.appendChild(message);

    const confirmButton = document.createElement('button');
    confirmButton.innerText = '确定';
    confirmButton.style.marginTop = '10px';
    confirmButton.style.padding = '8px 12px';
    confirmButton.style.backgroundColor = 'lightgray';
    confirmButton.style.color = 'white';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.cursor = 'not-allowed';
    confirmButton.disabled = true;

    setTimeout(() => {
        confirmButton.disabled = false;
        confirmButton.style.backgroundColor = '#4CAF50';
        confirmButton.style.cursor = 'pointer';
    }, 1000);

    confirmButton.onclick = () => {
        window.location.href = link.href;
        document.body.removeChild(confirmDialog);
        confirmDialogVisible = false;
    };
    confirmDialog.appendChild(confirmButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerText = '取消';
    cancelButton.style.marginTop = '10px';
    cancelButton.style.marginLeft = '20px';
    cancelButton.style.padding = '8px 12px';
    cancelButton.style.backgroundColor = 'red';
    cancelButton.style.color = 'white';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.onclick = () => {
        document.body.removeChild(confirmDialog);
        confirmDialogVisible = false;
    };
    confirmDialog.appendChild(cancelButton);

    // 立即将焦点移动到取消按钮
    cancelButton.focus();  // 移动焦点到取消按钮

    // 监听 Enter 键关闭确认框
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  // 阻止默认的 Enter 行为
            cancelButton.onclick();  // 调用取消按钮的点击事件
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    document.body.appendChild(confirmDialog);
}

// 检查链接的点击事件
function handleLinkClick(event) {
    const link = event.target.closest('a');
    if (link && link.href) {
        const matchedKeywords = targetStrings.filter(targetString => {
            const regex = new RegExp(targetString.replace(/\*/g, '.*'));
            return regex.test(link.href);
        });
        if (matchedKeywords.length > 0) {
            event.preventDefault();
            showConfirmDialog(link);
        }
    }
}

// 鼠标移动事件
document.addEventListener('mousemove', function (event) {
    handleMouseOver(event);
});

document.addEventListener('mouseout', handleMouseOut);
document.addEventListener('click', handleLinkClick);

// 监听 Ctrl+M 打开编辑界面
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        showEditUI();
    }
});

// 显示编辑UI界面
function showEditUI() {
    if (document.getElementById('editUI')) return;

    const editUI = document.createElement('div');
    editUI.id = 'editUI';
    editUI.style.position = 'fixed';
    editUI.style.top = '50%';
    editUI.style.left = '50%';
    editUI.style.transform = 'translate(-50%, -50%)';
    editUI.style.zIndex = '10000';
    editUI.style.backgroundColor = '#f9f9f9';
    editUI.style.border = '1px solid #ccc';
    editUI.style.padding = '20px';
    editUI.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    editUI.style.borderRadius = '8px';
    editUI.style.width = '400px';

    const instructions = document.createElement('p');
    instructions.innerText = '管理目标字符串:';
    instructions.style.fontWeight = 'bold';
    editUI.appendChild(instructions);

    const keywordList = document.createElement('div');
    keywordList.style.marginBottom = '10px';
    editUI.appendChild(keywordList);

    // 创建显示关键词的函数
    function displayKeywords() {
        keywordList.innerHTML = ''; // 清空关键词列表

        targetStrings.forEach((keyword, index) => {
            const keywordRow = document.createElement('div');
            keywordRow.style.display = 'flex';
            keywordRow.style.alignItems = 'center';
            keywordRow.style.marginBottom = '5px';

            const keywordInput = document.createElement('input');
            keywordInput.type = 'text';
            keywordInput.value = keyword;
            keywordInput.style.flex = '1';
            keywordInput.style.backgroundColor = '#f0f0f0';
            keywordInput.style.border = '1px solid #ccc';
            keywordInput.style.borderRadius = '4px';
            keywordInput.style.padding = '4px';

            keywordInput.addEventListener('input', () => {
                targetStrings[index] = keywordInput.value.trim();
                localStorage.setItem('targetStrings', JSON.stringify(targetStrings));
            });

            keywordRow.appendChild(keywordInput);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = '删除';
            deleteButton.style.marginLeft = '10px';
            deleteButton.style.padding = '4px 8px';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '4px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = () => {
                targetStrings.splice(index, 1);
                localStorage.setItem('targetStrings', JSON.stringify(targetStrings));
                displayKeywords();
            };
            keywordRow.appendChild(deleteButton);

            keywordList.appendChild(keywordRow);
        });
    }

    const addKeywordButton = document.createElement('button');
    addKeywordButton.innerText = '添加关键词';
    addKeywordButton.style.marginTop = '10px';
    addKeywordButton.style.padding = '8px 12px';
    addKeywordButton.style.backgroundColor = 'blue';
    addKeywordButton.style.color = 'white';
    addKeywordButton.style.border = 'none';
    addKeywordButton.style.borderRadius = '4px';
    addKeywordButton.style.cursor = 'pointer';
    addKeywordButton.onclick = () => {
        targetStrings.push('');
        localStorage.setItem('targetStrings', JSON.stringify(targetStrings));
        displayKeywords();
    };
    editUI.appendChild(addKeywordButton);

    const closeButton = document.createElement('button');
    closeButton.innerText = '关闭';
    closeButton.style.marginTop = '10px';
    closeButton.style.marginLeft = '20px';
    closeButton.style.padding = '8px 12px';
    closeButton.style.backgroundColor = 'lightgray';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
        document.body.removeChild(editUI);
    };
    editUI.appendChild(closeButton);

    displayKeywords(); // 初始化显示关键词

    document.body.appendChild(editUI);
}

// 添加初始关键词
localStorage.setItem('targetStrings', JSON.stringify(targetStrings));
