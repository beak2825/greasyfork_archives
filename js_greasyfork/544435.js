// ==UserScript==
// @name 巨量引擎优化助手
// @namespace https://kuiwaiwai.com/
// @version 1.1
// @description 提供账户信息快速复制、项目/计划ID批量复制、账户备注批量修改等功能
// @author kuiwaiwai
// @license Apache License 2.0
// @match *://business.oceanengine.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @grant GM_notification
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/544435/%E5%B7%A8%E9%87%8F%E5%BC%95%E6%93%8E%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544435/%E5%B7%A8%E9%87%8F%E5%BC%95%E6%93%8E%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const CONFIG_KEYS = Object.freeze({
        ACCOUNT_COPY: 'accountCopy',
        ID_BATCH_COPY: 'idBatchCopy',
        ACCOUNT_FORMAT: 'accountFormat',
        REMOVE_VIEW_BUTTON: 'removeViewButton'
    });
    const DEFAULT_CONFIG = Object.freeze({
        [CONFIG_KEYS.ACCOUNT_COPY]: true,
        [CONFIG_KEYS.ID_BATCH_COPY]: true,
        [CONFIG_KEYS.ACCOUNT_FORMAT]: 'name_id',
        [CONFIG_KEYS.REMOVE_VIEW_BUTTON]: false
    });
    const config = {};
    let currentPage = '';
    // 页面类型检测
    function detectPageType(path = location.pathname) {
        if (/\/account-manage\/ad\/bidding\/superior\/account/.test(path))
            return 'account';
        if (/\/account-manage\/ad\/bidding\/superior\/project/.test(path))
            return 'project';
        if (/\/account-manage\/ad\/bidding\/superior\/promotion/.test(path))
            return 'promotion';
        return 'unknown';
    }
    // 主函数初始化
    function init() {
        initConfig();
        createButtonStyles();
        GM_registerMenuCommand('打开设置', showSettings);
        GM_registerMenuCommand('账户备注批量修改', showRemarkBulkEdit);
        // 初始页面类型检测
        currentPage = detectPageType();
        // 首次加载执行
        initPageFunctions();
        // 启动SPA路由监听
        startRoutingObserver();
    }
    function initConfig() {
        Object.keys(DEFAULT_CONFIG).forEach(key => {
            config[key] = GM_getValue(key) ?? DEFAULT_CONFIG[key];
        });
    }
    function showMessage(message, type = 'success') {
        const existing = document.getElementById('okee-message');
        if (existing) existing.remove();
        const container = document.createElement('div');
        container.id = 'okee-message';
        container.className = `ovui-message ovui-message--${type}`;
        const content = document.createElement('div');
        content.className = 'ovui-message__content';
        const iconPath = type === 'success' ?
              'M24 46C11.85 46 2 36.15 2 24S11.85 2 24 2s22 9.85 22 22-9.85 22-22 22zm-2.483-18.868l-5.103-5.103a2 2 0 0 0-2.828 2.829l6.516 6.516a2 2 0 0 0 2.829 0l11.96-11.96a2 2 0 0 0-2.829-2.828L21.517 27.132z' :
        'M24 2C12.32 2 2 12.32 2 24s10.32 22 22 22 22-10.32 22-22S35.68 2 24 2zm9.414 25.414l-4.55 4.55a2 2 0 0 1-2.828 0l-4.55-4.55a2 2 0 1 1 2.828-2.828L24 26.172l4.136-4.136a2 2 0 0 1 2.828 2.828l-4.55 4.55z';
        content.innerHTML = `
            <div class="ovui-icon ovui-message__icon">
                <svg viewBox="0 0 48 48" width="1em" height="1em" fill="currentColor">
                    <path fill-rule="nonzero" d="${iconPath}"></path>
                </svg>
            </div>
            <span class="ovui-message__text">${message}</span>
        `;
        container.appendChild(content);
        document.body.appendChild(container);
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0px)';
        }, 10);
        setTimeout(() => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(-30px)';
            setTimeout(() => container.remove(), 500);
        }, 1500);
    }
    function createButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #okee-message {
                z-index: 99999;
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-30px);
                opacity: 0;
                transition: opacity 0.5s ease, transform 0.5s ease;
                pointer-events: none;
            }
            .ovui-message__content {
                pointer-events: auto;
                min-width: 120px;
                text-align: center;
            }
            #batch-copy-btn {
                position: fixed;
                bottom: 40px;
                right: 40px;
                z-index: 9999;
                background: #4285f4;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: all 0.2s ease;
            }
            #batch-copy-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                background: #3367d6;
            }
            #batch-copy-btn:active {
                transform: translateY(1px);
            }
            #batch-copy-btn.hidden {
                display: none;
            }
            #batch-copy-project-btn {
                position: fixed;
                bottom: 40px;
                right: 40px;
                z-index: 9999;
                background: #52c41a;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                cursor: pointer;
                font-size: 10px;
                font-weight: bold;
                transition: all 0.2s ease;
            }
            #batch-copy-project-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                background: #389e0d;
            }
            #batch-copy-project-btn:active {
                transform: translateY(1px);
            }
            #batch-copy-project-btn.hidden {
                display: none;
            }
            .okee-copy-btn {
                cursor: pointer;
                margin-right: 12px;
                color: #262626;
                white-space: nowrap;
            }
            .okee-copy-btn:hover {
                color: #1890ff;
            }
            .remark-edit-btn {
                display: inline-block;
                padding: 8px 16px;
                margin: 5px;
                border: none;
                border-radius: 4px;
                background-color: #4285f4;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .remark-edit-btn:hover {
                background-color: #3367d6;
            }
            .remark-edit-btn:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
    // 新增：移除查看按钮功能
    function removeViewButtons() {
        if (!config[CONFIG_KEYS.REMOVE_VIEW_BUTTON] || currentPage !== 'account') return;
        // 查找所有包含"查看"文本的按钮
        const viewButtons = document.querySelectorAll('button, span');
        viewButtons.forEach(element => {
            if (element.textContent.includes('查看') && !element.dataset.okeeProcessed) {
                element.remove();
                element.dataset.okeeProcessed = 'true';
            }
        });
    }
    function setupAccountCopy() {
        if (!config[CONFIG_KEYS.ACCOUNT_COPY] || currentPage !== 'account') return;
        const addCopyButtons = (elements) => {
            elements.forEach(element => {
                if (!element || element.querySelector('.okee-copy-btn') || !element.textContent.includes('数据')) return;
                const actionContainer = element.closest('div.flex.items-center');
                if (!actionContainer || actionContainer.querySelector('.okee-copy-btn')) return;
                const copyBtn = document.createElement('span');
                copyBtn.className = 'okee-copy-btn group-hover:text-skyBlue-6';
                copyBtn.textContent = '复制';
                copyBtn.dataset.okeeProcessed = 'true';
                copyBtn.addEventListener('click', event => {
                    event.stopPropagation();
                    event.preventDefault();
                    const row = element.closest('tr');
                    const nameEl = row.querySelector('.name.truncate, .account-name');
                    const idEl = row.querySelector('.id.text-gray-9, .account-id');
                    if (!nameEl || !idEl) {
                        showMessage('账户信息获取失败', 'error');
                        return;
                    }
                    const name = nameEl.textContent.trim();
                    const id = idEl.textContent.trim().replace('ID：', '');
                    const format = config[CONFIG_KEYS.ACCOUNT_FORMAT];
                    const accountInfo = format === 'id_name' ? `${id}\t${name}` : `${name}\t${id}`;
                    navigator.clipboard.writeText(accountInfo)
                        .then(() => showMessage('账户信息复制成功'))
                        .catch(() => showMessage('复制失败，请重试', 'error'));
                });
                if (element.parentNode === actionContainer) {
                    element.insertAdjacentElement('beforebegin', copyBtn);
                } else {
                    actionContainer.insertBefore(copyBtn, actionContainer.firstChild);
                }
            });
        };
        // 初始处理
        const initialButtons = document.querySelectorAll('.cursor-pointer.mr-12.group-hover\\:text-skyBlue-6');
        addCopyButtons(Array.from(initialButtons));
        // 观察动态加载内容
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    const newButtons = [];
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const actionButtons = node.querySelectorAll ?
                                  node.querySelectorAll('.cursor-pointer.mr-12.group-hover\\:text-skyBlue-6') : [];
                            newButtons.push(...Array.from(actionButtons));
                            const actionContainers = node.querySelectorAll ?
                                  node.querySelectorAll('div.flex.items-center') : [];
                            actionContainers.forEach(container => {
                                if (!container || container.querySelector('.okee-copy-btn')) return;
                                const buttons = container.querySelectorAll('.cursor-pointer.mr-12.group-hover\\:text-skyBlue-6');
                                if (buttons.length) {
                                    newButtons.push(...Array.from(buttons));
                                }
                            });
                        }
                    });
                    addCopyButtons(newButtons);
                    removeViewButtons(); // 处理新添加的元素
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }
    function manageBatchCopyButton() {
        const shouldShow = config[CONFIG_KEYS.ID_BATCH_COPY] &&
              (currentPage === 'project' || currentPage === 'promotion');
        let button = document.getElementById('batch-copy-btn');
        // 确保按钮存在
        if (!button && shouldShow) {
            button = document.createElement('button');
            button.id = 'batch-copy-btn';
            button.textContent = '复制ID';
            document.body.appendChild(button);
            button.addEventListener('click', async () => {
                const idElements = document.querySelectorAll('.id.text-gray-9');
                if (!idElements.length) {
                    showMessage('未找到ID', 'error');
                    return;
                }
                const ids = Array.from(idElements).map(el =>
                                                       el.textContent.replace('ID：', '').trim()
                                                      ).filter(Boolean);
                try {
                    await navigator.clipboard.writeText(ids.join(','));
                    showMessage(`成功复制${ids.length}个ID`);
                } catch {
                    showMessage('复制失败，请重试', 'error');
                }
            });
        }
        // 更新按钮显示状态
        if (button) {
            button.classList.toggle('hidden', !shouldShow);
        }
        // 处理推广页的额外按钮和位置调整
        if (shouldShow && currentPage === 'promotion') {
            // 调整原有按钮位置到上方
            if (button) {
                button.style.bottom = '90px';
            }
            // 创建或显示项目ID复制按钮
            let projectButton = document.getElementById('batch-copy-project-btn');
            if (!projectButton) {
                projectButton = document.createElement('button');
                projectButton.id = 'batch-copy-project-btn';
                projectButton.textContent = '复制项目ID';
                document.body.appendChild(projectButton);
                projectButton.addEventListener('click', async () => {
                    const idElements = document.querySelectorAll('.text-gray-9.truncate:not(.id)');
                    if (!idElements.length) {
                        showMessage('未找到项目ID', 'error');
                        return;
                    }
                    const ids = Array.from(idElements).map(el =>
                                                           el.textContent.replace('ID：', '').trim()
                                                          ).filter(Boolean);
                    try {
                        await navigator.clipboard.writeText(ids.join(','));
                        showMessage(`成功复制${ids.length}个项目ID`);
                    } catch {
                        showMessage('复制失败，请重试', 'error');
                    }
                });
            }
            projectButton.classList.toggle('hidden', false);
        } else {
            // 恢复原有按钮位置
            if (button) {
                button.style.bottom = '40px';
            }
            // 隐藏项目ID按钮
            const projectButton = document.getElementById('batch-copy-project-btn');
            if (projectButton) {
                projectButton.classList.toggle('hidden', true);
            }
        }
    }
    function startRoutingObserver() {
        let lastPath = location.pathname;
        const checkForRouteChange = () => {
            if (location.pathname === lastPath) return;
            lastPath = location.pathname;
            currentPage = detectPageType();
            initPageFunctions();
        };
        // 初始启动
        const pathObserver = new MutationObserver(checkForRouteChange);
        pathObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: false
        });
        // 同时监听 popstate 事件
        window.addEventListener('popstate', checkForRouteChange);
        // 10秒后减少检查频率
        setTimeout(() => {
            pathObserver.disconnect();
            // 切换到轻量级监听
            const lightObserver = new MutationObserver(() => {
                if (location.pathname !== lastPath) {
                    checkForRouteChange();
                }
            });
            lightObserver.observe(document.querySelector('title'), {
                characterData: true,
                subtree: true
            });
        }, 10000);
    }
    function initPageFunctions() {
        setupAccountCopy();
        manageBatchCopyButton();
        removeViewButtons();
    }
    function showSettings() {
        Swal.fire({
            title: '巨量引擎优化助手设置',
            html: `
                <div class="okee-settings">
                    <label style="display: block; margin-bottom: 15px;">
                        <input type="checkbox" id="account-copy" ${config[CONFIG_KEYS.ACCOUNT_COPY] ? 'checked' : ''}>
                        启用账户信息复制功能
                    </label>
                    <div class="format-options" style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px;">
                            <input type="radio" name="format" value="name_id" ${config[CONFIG_KEYS.ACCOUNT_FORMAT] === 'name_id' ? 'checked' : ''}>
                            名称在前 ID在后
                        </label>
                        <label style="display: block;">
                            <input type="radio" name="format" value="id_name" ${config[CONFIG_KEYS.ACCOUNT_FORMAT] === 'id_name' ? 'checked' : ''}>
                            ID在前 名称在后
                        </label>
                    </div>
                    <label style="display: block; margin-bottom: 15px;">
                        <input type="checkbox" id="id-batch-copy" ${config[CONFIG_KEYS.ID_BATCH_COPY] ? 'checked' : ''}>
                        启用批量复制ID功能
                    </label>
                    <!-- 新增：移除查看按钮选项 -->
                    <label style="display: block; margin-bottom: 15px;">
                        <input type="checkbox" id="remove-view-button" ${config[CONFIG_KEYS.REMOVE_VIEW_BUTTON] ? 'checked' : ''}>
                        移除账户页的查看按钮
                    </label>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            width: '550px',
            preConfirm: () => ({
                accountCopy: document.getElementById('account-copy').checked,
                idBatchCopy: document.getElementById('id-batch-copy').checked,
                format: document.querySelector('input[name="format"]:checked').value,
                removeViewButton: document.getElementById('remove-view-button').checked
            })
        }).then(result => {
            if (!result.isConfirmed) return;
            const { accountCopy, idBatchCopy, format, removeViewButton } = result.value;
            GM_setValue(CONFIG_KEYS.ACCOUNT_COPY, accountCopy);
            GM_setValue(CONFIG_KEYS.ID_BATCH_COPY, idBatchCopy);
            GM_setValue(CONFIG_KEYS.ACCOUNT_FORMAT, format);
            GM_setValue(CONFIG_KEYS.REMOVE_VIEW_BUTTON, removeViewButton);
            Object.assign(config, {
                [CONFIG_KEYS.ACCOUNT_COPY]: accountCopy,
                [CONFIG_KEYS.ID_BATCH_COPY]: idBatchCopy,
                [CONFIG_KEYS.ACCOUNT_FORMAT]: format,
                [CONFIG_KEYS.REMOVE_VIEW_BUTTON]: removeViewButton
            });
            showMessage('设置已保存');
            initPageFunctions();
        });
    }
    // 账户备注批量修改功能 ======================================================== 测试中
    // 获取当前页面的所有账户信息
    function getAccountData() {
        const accounts = [];
        document.querySelectorAll('tr').forEach(row => {
            const idElement = row.querySelector('.id.text-gray-9');
            const remarkElement = row.querySelector('[data-e2e="bp_superior_promotion_remark_edit"]');
            if (idElement && remarkElement) {
                const accountId = idElement.textContent.replace('ID：', '').trim();
                const currentRemark = remarkElement.textContent.trim();
                accounts.push({
                    id: accountId,
                    remark: currentRemark,
                    element: row
                });
            }
        });
        return accounts;
    }
    // 从cookie中获取csrftoken
    function getCsrfToken() {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        return match ? match[1] : null;
    }
    // 发送备注修改请求
    async function sendRemarkUpdate(accountId, remark) {
        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            throw new Error('CSRF token未找到');
        }
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
            const response = await fetch(
                'https://business.oceanengine.com/nbs/api/bm/promotion/edit_account_remark',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-csrftoken': csrfToken
                    },
                    body: JSON.stringify({
                        account_id: accountId,
                        remark: remark
                    }),
                    credentials: 'include',
                    signal: controller.signal
                }
            );
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            throw new Error(`请求失败: ${error.message}`);
        }
    }
    // 显示批量编辑界面
    function showRemarkBulkEdit() {
        if (currentPage !== 'account') {
            showMessage('请在账户列表中使用此功能', 'error');
            return;
        }
        const accounts = getAccountData();
        if (accounts.length === 0) {
            showMessage('未找到账户数据', 'error');
            return;
        }
        Swal.fire({
            title: '账户备注批量编辑',
            html: `
                <div style="max-height: 60vh; overflow-y: auto;">
                    <p style="font-size: 16px; margin-bottom: 20px;">当前发现 <b>${accounts.length}</b> 个账户</p>
                    <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0; font-size: 15px;">选择操作类型:</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                            <p><button id="remove-all-remark" class="remark-edit-btn" style="background: #ff4d4f;">移除所有备注</button>
                            <button id="set-all-remark" class="remark-edit-btn" style="background: #1890ff;">修改所有备注</button></p>
                            <p><button id="add-show-remark" class="remark-edit-btn" style="background: #52c41a;">添加剧目备注</button>
                            <button id="remove-show-remark" class="remark-edit-btn" style="background: #faad14;">移除剧目备注</button></p>
                            <p><button id="custom-batch-remark" class="remark-edit-btn" style="background: #722ed1;">自定义批量修改</button></p>
                        </div>
                        <div id="action-description" style="color: #666; font-size: 13px; margin-bottom: 5px;">
                            请从上方选择一个操作
                        </div>
                    </div>
                    <div id="remark-form" style="display: none; margin-top: 15px;">
                        <h3 style="margin-top: 0; font-size: 15px; margin-bottom: 10px;">操作详情</h3>
                        <input type="text" id="show-name" placeholder="请输入剧目名称" style="padding: 10px; width: 100%; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px;">
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="cancel-action" class="remark-edit-btn" style="background: #8c8c8c;">取消</button>
                            <button id="confirm-action" class="remark-edit-btn" style="background: #1890ff;">确认执行</button>
                        </div>
                    </div>
                    <div style="margin-top: 20px; text-align: center;">
                        <button id="global-cancel" class="remark-edit-btn" style="background-color: #cccccc; width: 100px;">关闭</button>
                    </div>
                </div>
            `,
            width: '650px',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                // 操作按钮事件
                document.getElementById('remove-all-remark').addEventListener('click', () => {
                    showConfirmForRemove(accounts);
                });
                document.getElementById('set-all-remark').addEventListener('click', () => {
                    resetRemarkForm();
                    document.getElementById('remark-form').style.display = 'block';
                    document.getElementById('action-description').innerHTML =
                        `将把所有账户的备注统一修改为指定内容`;
                    document.getElementById('show-name').placeholder = '请输入要设置的全新备注';
                    document.getElementById('show-name').focus();
                    setupFormHandler('set');
                });
                document.getElementById('add-show-remark').addEventListener('click', () => {
                    resetRemarkForm();
                    document.getElementById('remark-form').style.display = 'block';
                    document.getElementById('action-description').innerHTML =
                        `将在所有账户的<b>当前备注后面添加</b>新的剧目备注`;
                    document.getElementById('show-name').placeholder = '请输入要添加的剧目名称';
                    document.getElementById('show-name').focus();
                    setupFormHandler('add');
                });
                document.getElementById('remove-show-remark').addEventListener('click', () => {
                    resetRemarkForm();
                    document.getElementById('remark-form').style.display = 'block';
                    document.getElementById('action-description').innerHTML =
                        `将移除所有账户中包含的<b>指定剧目备注</b>`;
                    document.getElementById('show-name').placeholder = '请输入要移除的剧目名称';
                    document.getElementById('show-name').focus();
                    setupFormHandler('remove');
                });
                document.getElementById('custom-batch-remark').addEventListener('click', () => {
                    document.getElementById('remark-form').style.display = 'block';
                    document.getElementById('action-description').innerHTML =
                        `请输入要修改的账户ID列表（每行一个）和新的备注内容`;
                    document.getElementById('remark-form').innerHTML = `
                        <h3 style="margin-top: 0; font-size: 15px; margin-bottom: 10px;">操作详情</h3>
                        <textarea id="account-ids" placeholder="请输入账户ID，每行一个&#10;例如：&#10;123456789&#10;987654321" style="width: 100%; height: 120px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px; resize: vertical;"></textarea>
                        <input type="text" id="custom-remark" placeholder="请输入新的备注" style="padding: 10px; width: 100%; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px;">
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="cancel-action" class="remark-edit-btn" style="background: #8c8c8c;">取消</button>
                            <button id="confirm-action" class="remark-edit-btn" style="background: #1890ff;">确认执行</button>
                        </div>
                    `;
                    document.getElementById('account-ids').focus();
                    setupFormHandler('custom');
                });
                // 一级取消按钮事件
                document.getElementById('global-cancel').addEventListener('click', () => {
                    Swal.close();
                });
            }
        });
    }
    function setupFormHandler(actionType) {
        const confirmBtn = document.getElementById('confirm-action');
        const cancelBtn = document.getElementById('cancel-action');
        cancelBtn.addEventListener('click', () => {
            document.getElementById('remark-form').style.display = 'none';
            document.getElementById('action-description').innerHTML = '请从上方选择一个操作';
        });
        confirmBtn.onclick = () => {
            // 获取用户输入
            let inputValue = '';
            if (actionType === 'custom') {
                const idsText = document.getElementById('account-ids').value.trim();
                const remark = document.getElementById('custom-remark').value.trim();
                if (!idsText || !remark) {
                    showMessage('请输入账户ID列表和备注内容', 'error');
                    return;
                }
                const accountIds = idsText.split('\n').map(id => id.trim()).filter(id => id);
                if (accountIds.length === 0) {
                    showMessage('请输入有效的账户ID列表', 'error');
                    return;
                }
                Swal.close();
                // 自定义批量修改二次确认
                Swal.fire({
                    title: `确认要修改备注吗？`,
                    html: `将把<strong>${accountIds.length}</strong>个账户的备注<br>统一修改为"${remark}"`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '确定修改',
                    cancelButtonText: '取消'
                }).then(result => {
                    if (result.isConfirmed) {
                        processCustomBatchRemark(accountIds, remark);
                    }
                });
                return;
            } else {
                inputValue = document.getElementById('show-name').value.trim();
                if (!inputValue) {
                    showMessage('请输入备注内容', 'error');
                    return;
                }
            }
            const accounts = getAccountData();
            if (accounts.length === 0) {
                showMessage('未找到账户数据', 'error');
                return;
            }
            Swal.close();
            // 根据操作类型调用不同函数
            if (actionType === 'add') {
                processAddShowRemark(inputValue);
            } else if (actionType === 'remove') {
                // 移除剧目二次确认
                Swal.fire({
                    title: `确认要移除"${inputValue}"吗？`,
                    html: `将从<strong>${accounts.length}</strong>个账户中移除所有包含该名称的剧目备注`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '确定移除',
                    cancelButtonText: '再想想'
                }).then(result => {
                    if (result.isConfirmed) {
                        processRemoveShowRemark(inputValue);
                    }
                });
            } else if (actionType === 'set') {
                // 修改所有备注二次确认
                Swal.fire({
                    title: `确认要修改所有备注吗？`,
                    html: `将把<strong>${accounts.length}</strong>个账户的备注<br>统一修改为"${inputValue}"`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '确定修改',
                    cancelButtonText: '取消'
                }).then(result => {
                    if (result.isConfirmed) {
                        processSetAllRemarks(inputValue);
                    }
                });
            }
        };
    }
    // 处理自定义批量修改备注操作
    async function processCustomBatchRemark(accountIds, newRemark) {
        const progressSwal = showProgressDialog(accountIds.length, '正在修改备注...');
        let successCount = 0;
        let failedAccounts = [];
        for (let i = 0; i < accountIds.length; i++) {
            const accountId = accountIds[i];
            try {
                progressSwal.update({
                    html: getProgressHTML(accountId, i + 1, accountIds.length, '修改备注')
                });
                const response = await sendRemarkUpdate(accountId, newRemark);
                if (response && response.code === 0) {
                    successCount++;
                } else {
                    failedAccounts.push({
                        id: accountId,
                        error: response ? response.message : '未知错误'
                    });
                }
            } catch (error) {
                failedAccounts.push({
                    id: accountId,
                    error: error.message
                });
            }
            // 避免请求频率过高
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        progressSwal.close();
        // 显示最终结果
        if (failedAccounts.length > 0) {
            showFinalResult(accountIds.length, successCount, failedAccounts, '自定义修改操作');
        } else {
            showMessage(`成功修改了 ${successCount} 个账户的备注`);
        }
    }
    // 移除所有备注的二次确认
    function showConfirmForRemove(accounts) {
        Swal.fire({
            title: '⚠️ 确定要移除所有备注吗？',
            html: `此操作将从当前<strong>${accounts.length}</strong>个账户中<br>永久移除所有备注，不可恢复！`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '确定移除',
            cancelButtonText: '取消',
            confirmButtonColor: '#ff4d4f'
        }).then(result => {
            if (result.isConfirmed) {
                processRemoveAllRemarks(accounts);
            }
        });
    }
    // 处理移除所有备注操作
    async function processRemoveAllRemarks(accounts) {
        const progressSwal = showProgressDialog(accounts.length, '正在移除备注...');
        let successCount = 0;
        let failedAccounts = [];
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            try {
                progressSwal.update({
                    html: getProgressHTML(account.id, i + 1, accounts.length, '移除所有备注')
                });
                const response = await sendRemarkUpdate(account.id, '');
                if (response && response.code === 0) {
                    successCount++;
                    // 更新UI
                    const nameElement = account.element.querySelector('.oc-typography-span-normal') || account.element;
                    if (nameElement) {
                        nameElement.textContent = '';
                    }
                } else {
                    failedAccounts.push({
                        id: account.id,
                        error: response ? response.message : '未知错误'
                    });
                }
            } catch (error) {
                failedAccounts.push({
                    id: account.id,
                    error: error.message
                });
            }
            // 避免请求频率过高
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        progressSwal.close();
        // 显示最终结果
        if (failedAccounts.length > 0) {
            showFinalResult(accounts.length, successCount, failedAccounts, '移除操作');
        } else {
            showMessage(`成功移除了 ${successCount} 个账户的备注`);
        }
    }
    // 处理修改所有备注操作
    async function processSetAllRemarks(newRemark) {
        const accounts = getAccountData();
        const progressSwal = showProgressDialog(accounts.length, '正在修改备注...');
        let successCount = 0;
        let failedAccounts = [];
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            try {
                progressSwal.update({
                    html: getProgressHTML(account.id, i + 1, accounts.length, '修改备注')
                });
                const response = await sendRemarkUpdate(account.id, newRemark);
                if (response && response.code === 0) {
                    successCount++;
                    // 更新UI
                    const nameElement = account.element.querySelector('.oc-typography-span-normal') || account.element;
                    if (nameElement) {
                        nameElement.textContent = newRemark;
                    }
                } else {
                    failedAccounts.push({
                        id: account.id,
                        error: response ? response.message : '未知错误'
                    });
                }
            } catch (error) {
                failedAccounts.push({
                    id: account.id,
                    error: error.message
                });
            }
            // 避免请求频率过高
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        progressSwal.close();
        // 显示最终结果
        if (failedAccounts.length > 0) {
            showFinalResult(accounts.length, successCount, failedAccounts, '修改操作');
        } else {
            showMessage(`成功修改了 ${successCount} 个账户的备注`);
        }
    }
    // 处理添加剧目备注操作
    async function processAddShowRemark(showName) {
        const accounts = getAccountData();
        const progressSwal = showProgressDialog(accounts.length, '正在添加剧目备注...');
        let successCount = 0;
        let failedAccounts = [];
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            const currentRemark = account.remark || '';
            try {
                progressSwal.update({
                    html: getProgressHTML(account.id, i + 1, accounts.length, '添加剧目备注')
                });
                // 处理备注格式
                let newRemark = '';
                if (currentRemark === '') {
                    newRemark = showName;
                } else {
                    // 使用trim()避免多余空格
                    newRemark = `${currentRemark.trim()}/${showName.trim()}`;
                }
                const response = await sendRemarkUpdate(account.id, newRemark);
                if (response && response.code === 0) {
                    successCount++;
                    // 更新UI
                    const nameElement = account.element.querySelector('.oc-typography-span-normal') || account.element;
                    if (nameElement) {
                        nameElement.textContent = newRemark;
                    }
                } else {
                    failedAccounts.push({
                        id: account.id,
                        error: response ? response.message : '未知错误'
                    });
                }
            } catch (error) {
                failedAccounts.push({
                    id: account.id,
                    error: error.message
                });
            }
            // 避免请求频率过高
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        progressSwal.close();
        // 显示最终结果
        if (failedAccounts.length > 0) {
            showFinalResult(accounts.length, successCount, failedAccounts, '添加操作');
        } else {
            showMessage(`成功为 ${successCount} 个账户添加了剧目备注`);
        }
    }
    // 处理移除剧目备注操作
    async function processRemoveShowRemark(showName) {
        const accounts = getAccountData();
        const progressSwal = showProgressDialog(accounts.length, '正在移除剧目备注...');
        let successCount = 0;
        let notFoundCount = 0;
        let failedAccounts = [];
        // 统一转换为小写比较，不区分大小写
        const targetShowName = showName.trim().toLowerCase();
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            let currentRemark = account.remark || '';
            try {
                progressSwal.update({
                    html: getProgressHTML(account.id, i + 1, accounts.length, '移除剧目备注')
                });
                if (currentRemark.trim() === '') {
                    notFoundCount++;
                    continue;
                }
                // 1. 解析备注结构
                const parts = currentRemark.split('/').map(p => p.trim());
                let prefix = '';
                let shows = [];
                let connector = '-'; // 默认使用"-"连接
                // 检查第一部分是否有连接符
                const firstPart = parts[0];
                if (firstPart.includes('-')) {
                    connector = '-';
                    const prefixParts = firstPart.split('-');
                    // 最后一个可能是剧目，前面的都是前缀
                    if (prefixParts.length > 1) {
                        prefix = prefixParts.slice(0, -1).join(connector);
                        shows = [prefixParts[prefixParts.length -1], ...parts.slice(1)];
                    } else {
                        shows = parts;
                    }
                }
                else if (firstPart.includes('+')) {
                    connector = '+';
                    const prefixParts = firstPart.split('+');
                    if (prefixParts.length > 1) {
                        prefix = prefixParts.slice(0, -1).join(connector);
                        shows = [prefixParts[prefixParts.length -1], ...parts.slice(1)];
                    } else {
                        shows = parts;
                    }
                }
                else {
                    // 没有连接符，全部都是剧目
                    shows = parts;
                }
                // 2. 查找要移除的剧目（不区分大小写）
                const foundIndex = shows.findIndex(
                    part => part.toLowerCase() === targetShowName
                );
                if (foundIndex === -1) {
                    notFoundCount++;
                    continue;
                }
                // 3. 移除匹配的剧目
                shows.splice(foundIndex, 1);
                // 4. 重新构建备注
                let newRemark = '';
                if (prefix) {
                    // 有前缀的情况
                    if (shows.length === 0) {
                        // 没有剩余剧目，只保留前缀
                        newRemark = prefix;
                    }
                    else {
                        // 将第一个剧目用连接符连接，其余的用"/"连接
                        newRemark = prefix + connector + shows[0];
                        if (shows.length > 1) {
                            newRemark += '/' + shows.slice(1).join('/');
                        }
                    }
                }
                else {
                    // 没有前缀，直接连接
                    newRemark = shows.join('/');
                }
                // 5. 发送更新请求
                const response = await sendRemarkUpdate(account.id, newRemark);
                if (response && response.code === 0) {
                    successCount++;
                    // 更新UI
                    const nameElement = account.element.querySelector('.oc-typography-span-normal') || account.element;
                    if (nameElement) {
                        nameElement.textContent = newRemark;
                    }
                }
                else {
                    failedAccounts.push({
                        id: account.id,
                        error: response ? response.message : '未知错误'
                    });
                }
            }
            catch (error) {
                failedAccounts.push({
                    id: account.id,
                    error: error.message
                });
            }
            // 避免请求频率过高
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        progressSwal.close();
        // 显示最终结果
        if (successCount === 0 && notFoundCount === accounts.length) {
            showMessage(`未找到任何包含"${showName}"的剧目备注`, 'warning');
        }
        else if (successCount > 0) {
            showDetailedResult({
                title: '移除剧目备注完成',
                total: accounts.length,
                success: successCount,
                notFound: notFoundCount,
                failed: failedAccounts.length,
                operation: `移除剧目: ${showName}`
            });
        }
        else {
            showMessage(`未能移除任何剧目备注`, 'error');
        }
    }
    // 显示详细的进度HTML
    function getProgressHTML(accountId, current, total, action) {
        const progress = Math.round((current / total) * 100);
        return `
            <div style="text-align: center;">
                <h3>${action}</h3>
                <p>处理账户: <b>${accountId}</b></p>
                <p>${current}/${total} (${progress}%)</p>
                <div style="margin: 15px 0; background: #eee; height: 8px; border-radius: 4px;">
                    <div style="height: 100%; width: ${progress}%; background: #1890ff; border-radius: 4px;"></div>
                </div>
            </div>
        `;
    }
    // 显示最终结果弹窗
    function showFinalResult(total, success, failedAccounts, operation) {
        const failedCount = failedAccounts.length;
        const message = `
            <div style="line-height: 1.8;">
                <p>${operation}完成：</p>
                <p><b>${success}/${total}</b> 个账户成功处理</p>
                ${failedCount > 0 ? `<p><b style="color:#ff4d4f">${failedCount}</b> 个账户处理失败</p>` : ''}
            </div>
        `;
        if (failedCount === 0) {
            Swal.fire({
                title: '操作成功',
                html: message,
                icon: 'success',
                confirmButtonText: '确定'
            });
        } else {
            // 创建错误信息详情
            let errorDetails = '<div style="max-height: 150px; overflow-y: auto; margin-top: 15px;">';
            errorDetails += '<table style="width:100%;border-collapse:collapse;">';
            errorDetails += '<tr style="background:#f5f5f5;"><th style="padding:8px;text-align:left;">账户ID</th><th style="padding:8px;text-align:left;">错误信息</th></tr>';
            failedAccounts.forEach(acc => {
                errorDetails += `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${acc.id}</td>`;
                errorDetails += `<td style="padding:8px;border-bottom:1px solid #eee;">${acc.error}</td></tr>`;
            });
            errorDetails += '</table></div>';
            Swal.fire({
                title: '操作结果',
                html: message + errorDetails,
                icon: 'warning',
                confirmButtonText: '确定',
                width: '700px'
            });
        }
    }
    // 显示详细结果
    function showDetailedResult(data) {
        Swal.fire({
            title: data.title,
            html: `
                <div style="text-align: center; padding: 20px;">
                    <div style="display: flex; justify-content: space-around; margin-bottom: 25px;">
                        <div>
                            <div style="font-size: 40px; font-weight: bold; color: #52c41a;">${data.success}</div>
                            <div>成功</div>
                        </div>
                        <div>
                            <div style="font-size: 40px; font-weight: bold; color: #1890ff;">${data.notFound}</div>
                            <div>未找到</div>
                        </div>
                        <div>
                            <div style="font-size: 40px; font-weight: bold; color: ${data.failed > 0 ? '#ff4d4f' : '#333'};">${data.failed}</div>
                            <div>失败</div>
                        </div>
                    </div>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; text-align: left;">
                        <div>共处理: <b>${data.total}</b> 个账户</div>
                        <div style="margin-top: 5px;">完成比例: <b>${Math.round(((data.success + data.notFound) / data.total) * 100)}%</b></div>
                    </div>
                </div>
            `,
            confirmButtonText: '确定',
            width: '600px'
        });
    }
    // 显示进度对话框
    function showProgressDialog(total, title) {
        return Swal.fire({
            title: title,
            html: getProgressHTML('--', 0, total, '初始化'),
            width: 450,
            showConfirmButton: false,
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
    }
    function resetRemarkForm() {
        const remarkForm = document.getElementById('remark-form');
        remarkForm.innerHTML = `
        <h3 style="margin-top: 0; font-size: 15px; margin-bottom: 10px;">操作详情</h3>
        <input type="text" id="show-name" placeholder="请输入剧目名称"
               style="padding: 10px; width: 100%; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px;">
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="cancel-action" class="remark-edit-btn" style="background: #8c8c8c;">取消</button>
            <button id="confirm-action" class="remark-edit-btn" style="background: #1890ff;">确认执行</button>
        </div>
    `;
    }
    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();