// ==UserScript==
// @name         通用广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  实时屏蔽网站的广告元素，支持可视化自定义选择器
// @author       bbbyqq
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532260/%E9%80%9A%E7%94%A8%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/532260/%E9%80%9A%E7%94%A8%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认隐藏列表
    const DEFAULT_HIDE_LIST = [
        '.ad',
        '#ad'
    ];

    // 从存储中获取或初始化隐藏列表
    let hideList = GM_getValue('hideList', DEFAULT_HIDE_LIST);

    // 定义隐藏广告函数
    function hideAds() {
        hideList.forEach(item => {
            try {
                document.querySelectorAll(item).forEach(ad => {
                    ad.style.display = 'none';
                });
            } catch (e) {
                console.error('Error hiding ads with selector:', item, e);
            }
        });
    }

    // 初始执行隐藏
    hideAds();

    // 创建MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                hideAds();
            }
        });
    });

    // 开始监听body及其子元素变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 添加自定义样式
    GM_addStyle(`
        /* 弹窗基础样式 */
        #adBlockCustomDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-width: 90%;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 999999;
            display: none;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            color: #333;
        }

        /* 弹窗头部 */
        #adBlockCustomDialog .dialog-header {
            padding: 16px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* 弹窗内容区域 */
        #adBlockCustomDialog .dialog-body {
            padding: 20px;
            overflow-y: auto;
            max-height: calc(80vh - 130px);
        }

        /* 弹窗底部 */
        #adBlockCustomDialog .dialog-footer {
            padding: 16px 20px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* 规则列表容器 */
        #adBlockCustomDialog .rule-list {
            margin-bottom: 20px;
        }

        /* 单个规则项 */
        #adBlockCustomDialog .rule-item {
            display: flex;
            margin-bottom: 10px;
            align-items: center;
            gap: 10px;
        }

        /* 规则输入框 */
        #adBlockCustomDialog .rule-item input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.15s;
        }

        #adBlockCustomDialog .rule-item input:focus {
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        /* 删除规则按钮 */
        #adBlockCustomDialog .rule-item button {
            padding: 10px 14px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.15s;
        }

        #adBlockCustomDialog .rule-item button:hover {
            background: #c82333;
        }

        /* 添加规则按钮 */
        #adBlockCustomDialog .add-rule-btn {
            padding: 10px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.15s;
        }

        #adBlockCustomDialog .add-rule-btn:hover {
            background: #218838;
        }

        /* 关闭按钮 */
        #adBlockCustomDialog .dialog-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6c757d;
            padding: 0;
            line-height: 1;
        }

        #adBlockCustomDialog .dialog-close:hover {
            color: #495057;
        }

        /* 通用按钮样式 */
        #adBlockCustomDialog .btn {
            padding: 10px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.15s;
        }

        /* 主要按钮（保存） */
        #adBlockCustomDialog .btn-primary {
            background: #007bff;
            color: white;
        }

        #adBlockCustomDialog .btn-primary:hover {
            background: #0069d9;
        }

        /* 次要按钮（取消） */
        #adBlockCustomDialog .btn-secondary {
            background: #6c757d;
            color: white;
        }

        #adBlockCustomDialog .btn-secondary:hover {
            background: #5a6268;
        }

        /* 危险按钮（重置） */
        #adBlockCustomDialog .btn-danger {
            background: #dc3545;
            color: white;
        }

        #adBlockCustomDialog .btn-danger:hover {
            background: #c82333;
        }

        /* 按钮组 */
        #adBlockCustomDialog .btn-group {
            display: flex;
            gap: 10px;
            height: fit-content;
        }

        /* 遮罩层 */
        #adBlockOverlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999998;
            display: none;
        }
    `);

    // 创建自定义弹窗
    function createCustomDialog() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'adBlockOverlay';

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.id = 'adBlockCustomDialog';

        // 对话框头部
        const header = document.createElement('div');
        header.className = 'dialog-header';
        header.innerHTML = `
            <span>广告屏蔽规则管理</span>
            <button class="dialog-close" aria-label="关闭">&times;</button>
        `;

        // 对话框主体
        const body = document.createElement('div');
        body.className = 'dialog-body';

        // 规则列表容器
        const ruleList = document.createElement('div');
        ruleList.className = 'rule-list';

        // 对话框底部
        const footer = document.createElement('div');
        footer.className = 'dialog-footer';

        // 创建按钮组（右侧按钮）
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        // 添加规则按钮（现在在footer中）
        const addButton = document.createElement('button');
        addButton.className = 'add-rule-btn';
        addButton.textContent = '+ 添加新规则';

        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.id = 'cancelChanges';
        cancelBtn.textContent = '取消';

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary';
        saveBtn.id = 'saveRules';
        saveBtn.textContent = '保存';

        // 重置按钮（左侧）
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn btn-danger';
        resetBtn.id = 'resetRules';
        resetBtn.textContent = '重置为默认';

        // 组装按钮组
        btnGroup.appendChild(addButton);
        btnGroup.appendChild(cancelBtn);
        btnGroup.appendChild(saveBtn);

        // 组装footer
        footer.appendChild(resetBtn);
        footer.appendChild(btnGroup);

        // 组装对话框
        body.appendChild(ruleList);
        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // 关闭按钮事件
        header.querySelector('.dialog-close').addEventListener('click', closeDialog);
        overlay.addEventListener('click', closeDialog);

        // 添加规则按钮事件
        addButton.addEventListener('click', addNewRuleField);

        // 底部按钮事件
        resetBtn.addEventListener('click', resetToDefault);
        cancelBtn.addEventListener('click', closeDialog);
        saveBtn.addEventListener('click', saveRules);

        // 填充现有规则
        populateRuleList();

        // 显示对话框
        dialog.style.display = 'block';
        overlay.style.display = 'block';

        // 填充规则列表
        function populateRuleList() {
            ruleList.innerHTML = '';
            hideList.forEach((rule, index) => {
                addRuleField(rule, index);
            });
        }

        // 添加规则输入框
        function addRuleField(rule = '', index = null) {
            const ruleItem = document.createElement('div');
            ruleItem.className = 'rule-item';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = rule;
            input.placeholder = '输入CSS选择器 (如 .ad-banner)';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '删除';

            ruleItem.appendChild(input);
            ruleItem.appendChild(removeBtn);
            ruleList.appendChild(ruleItem);

            // 删除按钮事件
            removeBtn.addEventListener('click', () => {
                ruleList.removeChild(ruleItem);
            });
        }

        // 添加新规则输入框
        function addNewRuleField() {
            addRuleField();
        }

        // 重置为默认规则
        function resetToDefault() {
            if (confirm('确定要重置为默认规则吗？这将丢失所有自定义规则。')) {
                hideList = [...DEFAULT_HIDE_LIST];
                populateRuleList();
            }
        }

        // 保存规则
        function saveRules() {
            const inputs = ruleList.querySelectorAll('input');
            const newRules = [];

            inputs.forEach(input => {
                const value = input.value.trim();
                if (value) {
                    newRules.push(value);
                }
            });

            if (newRules.length === 0) {
                alert('至少需要一条规则！');
                return;
            }

            hideList = newRules;
            GM_setValue('hideList', hideList);
            setTimeout(()=>{
                location.reload()
            }, 500)
        }

        // 关闭对话框
        function closeDialog() {
            dialog.style.display = 'none';
            overlay.style.display = 'none';
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        }
    }

    // 注册菜单命令
    if (window.self === window.top) { // 只在主窗口中注册菜单
        GM_registerMenuCommand("管理广告屏蔽规则", createCustomDialog);
    }
})();