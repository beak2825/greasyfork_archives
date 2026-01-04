// ==UserScript==
// @name         一键账号切换管理助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  网页账号一键切换、分类管理、导入导出，右下角悬浮按钮入口，极简易用！
// @author       L的极客工坊
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540574/%E4%B8%80%E9%94%AE%E8%B4%A6%E5%8F%B7%E5%88%87%E6%8D%A2%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540574/%E4%B8%80%E9%94%AE%E8%B4%A6%E5%8F%B7%E5%88%87%E6%8D%A2%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 本地存储Key
    const STORAGE_KEY = 'tm_account_manager_data';

    // 全局防抖变量，防止重复自动登录
    let autoLoginInProgress = false;
    let autoLoginDone = false; // 新增：已自动登录标志

    // 初始化本地存储结构（如无则创建）
    function initStorage() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            const defaultData = [
                {
                    group: '默认分组',
                    accounts: []
                }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        }
    }

    // 获取账号数据
    function getAccountData() {
        const data = localStorage.getItem(STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // 保存账号数据
    function setAccountData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 创建悬浮按钮（支持拖动与点击分离，缩小尺寸）
    function createFloatingButton() {
        const btn = document.createElement('div');
        btn.id = 'tm-account-manager-btn';
        btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="8" fill="#fff"/><path d="M12 7.5L7 12h1.5v4h3v-2h1v2h3v-4H17l-5-4.5z" fill="#1A73E8"/></svg>';
        // 读取上次拖动位置
        let pos = localStorage.getItem('tm_account_manager_btn_pos');
        let right = 24, bottom = 24;
        if (pos) {
            try {
                const p = JSON.parse(pos);
                right = p.right; bottom = p.bottom;
            } catch (e) {}
        }
        btn.style.position = 'fixed';
        btn.style.right = right + 'px';
        btn.style.bottom = bottom + 'px';
        btn.style.width = '48px';
        btn.style.height = '48px';
        btn.style.background = 'linear-gradient(135deg, #2563eb 60%, #60a5fa 100%)';
        btn.style.color = '#fff';
        btn.style.borderRadius = '50%';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.fontSize = '24px';
        btn.style.cursor = 'pointer';
        btn.style.zIndex = '100002';
        btn.style.boxShadow = '0 4px 24px rgba(30,64,175,0.18)';
        btn.title = '账号管理';
        btn.style.transition = 'box-shadow 0.2s';
        btn.onmouseenter = () => {
            btn.style.boxShadow = '0 8px 32px rgba(30,64,175,0.28)';
        };
        btn.onmouseleave = () => {
            btn.style.boxShadow = '0 4px 24px rgba(30,64,175,0.18)';
        };
        // 拖动与点击分离
        let dragging = false, startX = 0, startY = 0, startRight = 0, startBottom = 0, moved = false;
        btn.onmousedown = function(e) {
            dragging = true;
            moved = false;
            startX = e.clientX;
            startY = e.clientY;
            startRight = parseInt(btn.style.right);
            startBottom = parseInt(btn.style.bottom);
            document.body.style.userSelect = 'none';
        };
        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
            let newRight = startRight - dx;
            let newBottom = startBottom - dy;
            // 限制在窗口内
            newRight = Math.max(0, Math.min(window.innerWidth - 48, newRight));
            newBottom = Math.max(0, Math.min(window.innerHeight - 48, newBottom));
            btn.style.right = newRight + 'px';
            btn.style.bottom = newBottom + 'px';
        });
        document.addEventListener('mouseup', function(e) {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
                // 保存位置
                localStorage.setItem('tm_account_manager_btn_pos', JSON.stringify({
                    right: parseInt(btn.style.right),
                    bottom: parseInt(btn.style.bottom)
                }));
                // 只有非拖动才算点击，弹出面板
                if (!moved) {
                    showPanelNearBtn();
                }
            }
        });
        document.body.appendChild(btn);
        btn.onclick = function() {
            let panel = document.getElementById('tm-account-manager-panel');
            if (!panel) {
                panel = createPanel(btn);
            } else {
                panel.style.display = 'block';
            }
        };
        return btn;
    }

    // 账号管理面板跟随按钮弹出（只点击弹出，点击关闭按钮才关闭）
    function showPanelNearBtn() {
        const panel = document.getElementById('tm-account-manager-panel');
        const btn = document.getElementById('tm-account-manager-btn');
        if (!panel || !btn) return;
        panel.style.display = 'block';
        // 定位面板到按钮附近
        setTimeout(() => {
            const btnRect = btn.getBoundingClientRect();
            const panelRect = panel.getBoundingClientRect();
            let left = btnRect.left + btnRect.width / 2 - panelRect.width / 2;
            let top = btnRect.top - panelRect.height - 18;
            if (top < 20) top = btnRect.bottom + 18;
            if (left < 8) left = 8;
            if (left + panelRect.width > window.innerWidth - 8) left = window.innerWidth - panelRect.width - 8;
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.right = '';
            panel.style.bottom = '';
            // 保证无论如何都显示弹窗
            panel.style.visibility = 'visible';
        }, 0);
    }

    // 修改面板创建逻辑，去除所有悬浮/移出自动关闭逻辑
    function createPanel(btn) {
        const panel = document.createElement('div');
        panel.id = 'tm-account-manager-panel';
        panel.style.position = 'fixed';
        panel.style.width = '420px';
        panel.style.maxWidth = '90vw';
        panel.style.maxHeight = '80vh';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.height = 'auto';
        panel.style.zIndex = '100000';
        panel.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif';
        panel.style.transition = 'opacity 0.2s, transform 0.2s';
        panel.style.boxShadow = '0 8px 32px rgba(30,64,175,0.18)';
        panel.style.borderRadius = '20px';
        panel.style.background = '#fff';
        panel.style.padding = '28px 28px 18px 28px';
        panel.style.visibility = 'hidden'; // 先隐藏，定位后再显示
        document.body.appendChild(panel);
        panel.innerHTML = `
            <div style="flex:none;font-size:22px;font-weight:700;margin-bottom:18px;color:#2563eb;letter-spacing:1px;">账号管理</div>
            <button id="tm-close-panel" class="tm-btn" style="position:absolute;top:18px;right:18px;background:transparent;color:#2563eb;font-size:22px;padding:0 10px;line-height:1;box-shadow:none;z-index:10001;">×</button>
            <div style="flex:none;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                <div id="tm-group-select-wrap" style="position:relative;display:inline-block;"></div>
                <button id="tm-add-group" class="tm-btn">新建分组</button>
            </div>
            <input id="tm-search-account" placeholder="搜索账号/备注" style="flex:none;width:100%;margin-bottom:12px;padding:8px 14px;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;outline:none;box-sizing:border-box;" />
            <div id="tm-account-list" style="flex:1 1 auto;margin-bottom:12px;min-height:40px;max-height:35vh;overflow-y:auto;"></div>
            <div style="flex:none;margin-top:12px;display:flex;gap:14px;justify-content:center;align-items:center;background:#fff;z-index:2;">
                <button id="tm-add-account" class="tm-btn tm-btn-main">添加账号</button>
                <button id="tm-export-account" class="tm-btn">导出账号</button>
                <button id="tm-import-account" class="tm-btn">导入账号</button>
                <input type="file" id="tm-import-file" accept="application/json" style="display:none;" />
            </div>
            <div id="tm-account-form-modal" style="display:none;"></div>
        `;
        // 美化按钮样式
        const style = document.createElement('style');
        style.innerHTML = `
        .tm-btn {
            background: #f3f4f6;
            color: #2563eb;
            border: none;
            border-radius: 8px;
            padding: 6px 16px;
            font-size: 15px;
            margin: 0 2px;
            cursor: pointer;
            transition: background 0.18s, color 0.18s;
        }
        .tm-btn:hover {
            background: #2563eb;
            color: #fff;
        }
        .tm-btn-main {
            background: linear-gradient(90deg, #2563eb 60%, #60a5fa 100%);
            color: #fff;
            font-weight: 600;
        }
        .tm-btn-main:hover {
            background: #1d4ed8;
        }
        #tm-account-manager-panel table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 6px;
            font-size: 15px;
        }
        #tm-account-manager-panel th {
            color: #2563eb;
            font-weight: 600;
            background: #f1f5f9;
            border-radius: 6px;
            padding: 6px 0;
        }
        #tm-account-manager-panel td {
            background: #f9fafb;
            border-radius: 6px;
            padding: 6px 0;
        }
        #tm-account-manager-panel tr {
            margin-bottom: 4px;
        }
        `;
        document.head.appendChild(style);
        // 关闭按钮依然可用
        panel.querySelector('#tm-close-panel').onclick = () => {
            panel.style.display = 'none';
        };
        // 新建分组弹窗（自定义卡片风格）
        function showAddGroupModal(onConfirm) {
            // 防止重复弹窗
            if (document.getElementById('tm-add-group-modal')) return;
            const modal = document.createElement('div');
            modal.id = 'tm-add-group-modal';
            modal.style.position = 'fixed';
            modal.style.left = '0';
            modal.style.top = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.18)';
            modal.style.zIndex = '100003';
            modal.onclick = (e) => { e.stopPropagation(); };
            modal.innerHTML = `<div style="background:#fff;padding:28px 24px 20px 24px;border-radius:16px;box-shadow:0 8px 32px #aaa;max-width:340px;width:92vw;max-height:80vh;overflow-y:auto;position:fixed;display:flex;flex-direction:column;align-items:center;z-index:100004;top:50%;left:50%;transform:translate(-50%,-50%);">
                <div style="font-size:18px;font-weight:700;margin-bottom:18px;color:#2563eb;letter-spacing:1px;">新建分组</div>
                <input id="tm-group-name-input" placeholder="请输入新分组名称" style="width:95%;padding:10px 12px;margin-bottom:18px;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;outline:none;" />
                <div style="display:flex;gap:16px;width:100%;justify-content:center;">
                    <button id="tm-confirm-add-group" style="background:linear-gradient(90deg,#2563eb 60%,#60a5fa 100%);color:#fff;font-weight:600;padding:8px 28px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">确定</button>
                    <button id="tm-cancel-add-group" style="background:#f3f4f6;color:#2563eb;padding:8px 28px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">取消</button>
                </div>
            </div>`;
            document.body.appendChild(modal);
            // 事件
            modal.querySelector('#tm-confirm-add-group').onclick = () => {
                const name = modal.querySelector('#tm-group-name-input').value.trim();
                if (!name) {
                    showToast('分组名称不能为空！');
                    return;
                }
                let data = getAccountData();
                if (data.find(g => g.group === name)) {
                    showToast('分组已存在！');
                    return;
                }
                onConfirm(name);
                document.body.removeChild(modal);
            };
            modal.querySelector('#tm-cancel-add-group').onclick = () => {
                document.body.removeChild(modal);
            };
        }
        // 新建分组按钮事件，替换prompt为自定义弹窗
        panel.querySelector('#tm-add-group').onclick = () => {
            showAddGroupModal((name) => {
                let data = getAccountData();
                data.push({ group: name, accounts: [] });
                setAccountData(data);
                renderGroupSelect();
            });
        };
        // 删除分组
        setTimeout(() => {
            selWrap.querySelectorAll('.tm-del-group-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const group = btn.closest('.tm-group-option').dataset.group;
                    if (group === '默认分组') return;
                    showConfirmModal(`确定要删除分组"${group}"及其所有账号吗？这些账号将转移到默认分组。`, () => {
                        let data = getAccountData();
                        const delGroupObj = data.find(g => g.group === group);
                        const defaultGroupObj = data.find(g => g.group === '默认分组');
                        if (delGroupObj && defaultGroupObj && delGroupObj.accounts.length > 0) {
                            for (let i = delGroupObj.accounts.length - 1; i >= 0; i--) {
                                defaultGroupObj.accounts.unshift(delGroupObj.accounts[i]);
                            }
                        }
                        data = data.filter(g => g.group !== group);
                        setAccountData(data);
                        // 切换到默认分组
                        const btnSel = panel.querySelector('#tm-group-select-btn');
                        if (btnSel) btnSel.dataset.group = '默认分组';
                        renderGroupSelect();
                    });
                };
                btn.title = '删除分组';
            });
        }, 0);
        // 添加账号
        panel.querySelector('#tm-add-account').onclick = () => {
            showAccountForm();
        };
        // 自定义分组下拉菜单
        function renderGroupSelect() {
            const selWrap = panel.querySelector('#tm-group-select-wrap');
            const data = getAccountData();
            let currentGroup = panel.querySelector('#tm-group-select-btn')?.dataset.group;
            if (!currentGroup || !data.find(g => g.group === currentGroup)) {
                currentGroup = data[0]?.group || '';
            }
            selWrap.innerHTML = `
                <button id="tm-group-select-btn" data-group="${currentGroup}" style="background:#e8f0fe;color:#2563eb;font-weight:600;padding:7px 28px 7px 16px;border:none;border-radius:8px;font-size:16px;cursor:pointer;box-shadow:0 1px 4px #e0e7ef;position:relative;">
                    <span>${currentGroup}</span>
                    <span style='position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:14px;'>▼</span>
                </button>
                <div id="tm-group-select-menu" style="display:none;position:absolute;top:110%;left:0;min-width:180px;max-height:190px;overflow-y:auto;background:#fff;border-radius:10px;box-shadow:0 4px 16px #cbd5e1;padding:6px 0;z-index:10010;">
                    ${data.map(g => `
                        <div class="tm-group-option" data-group="${g.group}" style="display:flex;align-items:center;justify-content:space-between;padding:8px 8px 8px 18px;font-size:15px;cursor:pointer;${g.group===currentGroup?'background:#2563eb;color:#fff;font-weight:600;':'color:#2563eb;'}border-radius:6px;margin:2px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;">
                            <span class="tm-group-name" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${g.group}</span>
                            ${g.group!=='默认分组'?'<span class="tm-del-group-btn" title="删除分组" style="margin-left:16px;color:#e11d48;font-size:16px;cursor:pointer;user-select:none;position:relative;z-index:2;">×</span>':''}
                        </div>
                    `).join('')}
                </div>
            `;
            // 事件：点击按钮弹出菜单
            const btn = panel.querySelector('#tm-group-select-btn');
            const menu = panel.querySelector('#tm-group-select-menu');
            btn.onclick = (e) => {
                e.stopPropagation();
                if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                    return;
                }
                menu.style.display = 'block';
                // 只绑定一次
                function hideMenu(e) {
                    if (!menu.contains(e.target) && e.target !== btn) {
                        menu.style.display = 'none';
                        document.removeEventListener('click', hideMenu, true);
                    }
                }
                setTimeout(() => {
                    document.addEventListener('click', hideMenu, true);
                }, 0);
            };
            menu.onclick = (e) => { e.stopPropagation(); };
            // 事件：点击分组名切换分组（不包括删除按钮）
            menu.querySelectorAll('.tm-group-option').forEach(opt => {
                opt.querySelector('.tm-group-name').onclick = (e) => {
                    e.stopPropagation();
                    btn.dataset.group = opt.dataset.group;
                    renderGroupSelect();
                    renderAccountList();
                    menu.style.display = 'none';
                };
            });
            // 删除分组按钮事件
            menu.querySelectorAll('.tm-del-group-btn').forEach(btnDel => {
                btnDel.onclick = (e) => {
                    e.stopPropagation();
                    const group = btnDel.closest('.tm-group-option').dataset.group;
                    if (group === '默认分组') return;
                    showConfirmModal(`确定要删除分组"${group}"及其所有账号吗？这些账号将转移到默认分组。`, () => {
                        let data = getAccountData();
                        const delGroupObj = data.find(g => g.group === group);
                        const defaultGroupObj = data.find(g => g.group === '默认分组');
                        if (delGroupObj && defaultGroupObj && delGroupObj.accounts.length > 0) {
                            for (let i = delGroupObj.accounts.length - 1; i >= 0; i--) {
                                defaultGroupObj.accounts.unshift(delGroupObj.accounts[i]);
                            }
                        }
                        data = data.filter(g => g.group !== group);
                        setAccountData(data);
                        // 切换到默认分组
                        const btnSel = panel.querySelector('#tm-group-select-btn');
                        if (btnSel) btnSel.dataset.group = '默认分组';
                        renderGroupSelect();
                    });
                };
                btnDel.title = '删除分组';
            });
            // 每次分组渲染后都自动刷新账号列表
            renderAccountList();
        }
        // 搜索框输入时刷新账号列表
        panel.querySelector('#tm-search-account').addEventListener('input', () => renderAccountList());
        // 渲染账号列表，登录后禁用切换按钮并显示"已登录"
        function renderAccountList() {
            const sel = panel.querySelector('#tm-group-select-wrap');
            const group = sel.querySelector('#tm-group-select-btn').dataset.group;
            const data = getAccountData();
            const groupObj = data.find(g => g.group === group);
            const listDiv = panel.querySelector('#tm-account-list');
            const searchVal = panel.querySelector('#tm-search-account')?.value.trim().toLowerCase() || '';
            let accounts = groupObj ? groupObj.accounts : [];
            if (searchVal) {
                accounts = accounts.filter(acc =>
                    acc.username.toLowerCase().includes(searchVal) ||
                    (acc.remark && acc.remark.toLowerCase().includes(searchVal))
                );
            }
            if (!groupObj || accounts.length === 0) {
                listDiv.innerHTML = '<div style="color:#888;">暂无账号，请添加。</div>';
                return;
            }
            let html = `<div style="max-height:35vh;overflow-y:auto;display:flex;flex-direction:column;gap:10px;">`;
            accounts.forEach((acc, idx) => {
                html += `<div class="tm-account-card" style="background:#f9fafb;border-radius:12px;box-shadow:0 2px 8px #e0e7ef;padding:12px 16px;display:flex;align-items:center;gap:12px;justify-content:space-between;">
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;color:#2563eb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${acc.username}</div>
                        <div style="font-size:13px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${acc.remark || ''}</div>
                    </div>
                    <div style="display:flex;gap:6px;">
                        <button data-idx="${idx}" class="tm-login-account tm-btn tm-btn-main" style="padding:4px 12px;font-size:14px;">切换/登录</button>
                        <button data-idx="${idx}" class="tm-edit-account tm-btn" style="padding:4px 10px;font-size:14px;">编辑</button>
                        <button data-idx="${idx}" class="tm-del-account tm-btn" style="padding:4px 10px;font-size:14px;">删除</button>
                    </div>
                </div>`;
            });
            html += `</div>`;
            listDiv.innerHTML = html;
            // 切换/登录账号，点击后只禁用当前按钮，登录成功后刷新
            listDiv.querySelectorAll('.tm-login-account').forEach(btn => {
                btn.onclick = function() {
                    // 只禁用当前按钮，防止重复点击
                    this.disabled = true;
                    const idx = parseInt(this.dataset.idx);
                    const sel = panel.querySelector('#tm-group-select-wrap');
                    const group = sel.querySelector('#tm-group-select-btn').dataset.group;
                    const data = getAccountData();
                    const acc = data.find(g => g.group === group).accounts[idx];
                    handleSwitchLogin(acc);
                };
            });
            // 编辑账号
            listDiv.querySelectorAll('.tm-edit-account').forEach(btn => {
                btn.onclick = function() {
                    showAccountForm(parseInt(this.dataset.idx));
                };
            });
            // 删除账号
            listDiv.querySelectorAll('.tm-del-account').forEach(btn => {
                btn.onclick = function() {
                    const idx = parseInt(this.dataset.idx);
                    showConfirmModal('确定要删除该账号吗？', () => {
                        let data = getAccountData();
                        const groupObj = data.find(g => g.group === group);
                        groupObj.accounts.splice(idx, 1);
                        setAccountData(data);
                        renderGroupSelect();
                    });
                };
            });
            // 账号列表区样式优化
            const accountListDiv = panel.querySelector('#tm-account-list');
            if (accountListDiv) {
                accountListDiv.style.maxHeight = '35vh';
                accountListDiv.style.overflowY = 'auto';
            }
        }
        // 新增/编辑账号弹窗支持分组选择
        function showAccountForm(editIdx) {
            const modal = panel.querySelector('#tm-account-form-modal');
            modal.style.display = 'block';
            modal.style.position = 'fixed';
            modal.style.left = '0';
            modal.style.top = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.18)';
            modal.style.zIndex = '100001';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.onclick = (e) => { e.stopPropagation(); };
            const data = getAccountData();
            // 当前分组
            const sel = panel.querySelector('#tm-group-select-wrap');
            const currentGroup = sel.querySelector('#tm-group-select-btn')?.dataset.group || '';
            // 弹窗内容，顶部分组选择，表单包裹input，标准name/auto属性
            modal.innerHTML = `<div id="tm-acc-modal-card" style="background:#fff;padding:28px 24px 20px 24px;border-radius:16px;box-shadow:0 8px 32px #aaa;max-width:340px;width:92vw;max-height:80vh;overflow-y:auto;display:flex;flex-direction:column;align-items:center;z-index:100003;">
                <div style="font-size:18px;font-weight:700;margin-bottom:18px;color:#2563eb;letter-spacing:1px;">${editIdx !== undefined ? '编辑账号' : '添加账号'}</div>
                <form id="tm-acc-form" autocomplete="on" style="width:100%;display:flex;flex-direction:column;align-items:center;">
                    <div style="width:95%;margin-bottom:14px;">
                        <div style="position:relative;display:inline-block;width:100%;">
                            <button id="tm-acc-group-select-btn" data-group="${currentGroup}" style="background:#e8f0fe;color:#2563eb;font-weight:600;padding:7px 28px 7px 16px;border:none;border-radius:8px;font-size:15px;cursor:pointer;box-shadow:0 1px 4px #e0e7ef;position:relative;width:100%;text-align:left;">
                                <span>${currentGroup}</span>
                                <span style='position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:13px;'>▼</span>
                            </button>
                            <div id="tm-acc-group-select-menu" style="display:none;position:absolute;top:110%;left:0;min-width:120px;background:#fff;border-radius:10px;box-shadow:0 4px 16px #cbd5e1;padding:6px 0;z-index:10010;width:100%;">
                                ${data.map(g => `<div class="tm-acc-group-option" data-group="${g.group}" style="padding:8px 18px;font-size:15px;cursor:pointer;${g.group===currentGroup?'background:#2563eb;color:#fff;font-weight:600;':'color:#2563eb;'}border-radius:6px;margin:2px 6px;">${g.group}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                    <input id="tm-acc-username" name="username" autocomplete="username" placeholder="用户名" style="width:95%;padding:10px 12px;margin-bottom:14px;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;outline:none;" />
                    <div style="position:relative;width:95%;margin-bottom:14px;">
                        <input id="tm-acc-password" name="password" autocomplete="current-password" placeholder="密码" type="password" style="width:100%;padding:10px 36px 10px 12px;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;outline:none;" />
                        <span id="tm-toggle-pw" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:18px;cursor:pointer;color:#2563eb;user-select:none;">👁</span>
                    </div>
                    <input id="tm-acc-remark" placeholder="备注(可选)" style="width:95%;padding:10px 12px;margin-bottom:18px;border-radius:8px;border:1px solid #e5e7eb;font-size:15px;outline:none;" />
                    <div style="display:flex;gap:16px;width:100%;justify-content:center;">
                        <button id="tm-save-account" type="button" style="background:linear-gradient(90deg,#2563eb 60%,#60a5fa 100%);color:#fff;font-weight:600;padding:8px 28px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">保存</button>
                        <button id="tm-cancel-account" type="button" style="background:#f3f4f6;color:#2563eb;padding:8px 28px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">取消</button>
                    </div>
                </form>
            </div>`;
            // 密码显示/隐藏切换逻辑
            setTimeout(() => {
                const pwInput = modal.querySelector('#tm-acc-password');
                const toggleBtn = modal.querySelector('#tm-toggle-pw');
                if (pwInput && toggleBtn) {
                    toggleBtn.onclick = function() {
                        if (pwInput.type === 'password') {
                            pwInput.type = 'text';
                            toggleBtn.textContent = '🙈';
                        } else {
                            pwInput.type = 'password';
                            toggleBtn.textContent = '👁';
                        }
                    };
                }
            }, 0);
            // 分组下拉交互
            const groupBtn = modal.querySelector('#tm-acc-group-select-btn');
            const groupMenu = modal.querySelector('#tm-acc-group-select-menu');
            groupBtn.onclick = (e) => {
                e.stopPropagation();
                groupMenu.style.display = groupMenu.style.display === 'block' ? 'none' : 'block';
            };
            groupMenu.querySelectorAll('.tm-acc-group-option').forEach(opt => {
                opt.onclick = (e) => {
                    e.stopPropagation();
                    groupBtn.dataset.group = opt.dataset.group;
                    groupBtn.querySelector('span').textContent = opt.dataset.group;
                    groupMenu.style.display = 'none';
                };
            });
            document.addEventListener('click', function hideMenu(e) {
                if (!groupMenu.contains(e.target) && e.target !== groupBtn) {
                    groupMenu.style.display = 'none';
                    document.removeEventListener('click', hideMenu);
                }
            });
            // 如果是编辑，填充原数据
            if (editIdx !== undefined) {
                const sel = panel.querySelector('#tm-group-select-wrap');
                const group = sel.querySelector('#tm-group-select-btn').dataset.group;
                const data = getAccountData();
                const acc = data.find(g => g.group === group).accounts[editIdx];
                modal.querySelector('#tm-acc-username').value = acc.username;
                modal.querySelector('#tm-acc-password').value = acc.password;
                modal.querySelector('#tm-acc-remark').value = acc.remark || '';
                groupBtn.dataset.group = group;
                groupBtn.querySelector('span').textContent = group;
            }
            // 保存账号，支持分组切换
            modal.querySelector('#tm-save-account').onclick = (e) => {
                e.stopPropagation();
                const username = modal.querySelector('#tm-acc-username').value.trim();
                const password = modal.querySelector('#tm-acc-password').value.trim();
                const remark = modal.querySelector('#tm-acc-remark').value.trim();
                const selGroup = groupBtn.dataset.group;
                if (!username || !password) {
                    showToast('用户名和密码不能为空！');
                    return;
                }
                let data = getAccountData();
                // 如果是编辑，支持跨分组移动
                if (editIdx !== undefined) {
                    // 先找到原分组并删除账号
                    const oldSel = panel.querySelector('#tm-group-select-wrap');
                    const oldGroup = oldSel.querySelector('#tm-group-select-btn').dataset.group;
                    const oldGroupObj = data.find(g => g.group === oldGroup);
                    const acc = oldGroupObj.accounts.splice(editIdx, 1)[0];
                    // 添加到新分组
                    const newGroupObj = data.find(g => g.group === selGroup);
                    newGroupObj.accounts.unshift({ username, password, remark });
                } else {
                    // 新增账号到选中分组
                    const groupObj = data.find(g => g.group === selGroup);
                    groupObj.accounts.unshift({ username, password, remark });
                }
                setAccountData(data);
                modal.style.display = 'none';
                renderGroupSelect();
            };
            // 取消
            modal.querySelector('#tm-cancel-account').onclick = (e) => {
                e.stopPropagation();
                modal.style.display = 'none';
            };
        }
        // 替换原select为自定义下拉
        panel.querySelector('#tm-group-select-wrap').innerHTML = '';
        renderGroupSelect();
        // 导出账号
        panel.querySelector('#tm-export-account').onclick = () => {
            const data = getAccountData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '账号数据备份.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        // 导入账号
        panel.querySelector('#tm-import-account').onclick = () => {
            panel.querySelector('#tm-import-file').click();
        };
        // 处理文件选择
        panel.querySelector('#tm-import-file').onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const data = JSON.parse(evt.target.result);
                    // 校验数据结构
                    if (!Array.isArray(data)) throw new Error('数据不是数组');
                    for (const group of data) {
                        if (typeof group.group !== 'string' || !Array.isArray(group.accounts)) throw new Error('分组结构错误');
                        for (const acc of group.accounts) {
                            if (typeof acc.username !== 'string' || typeof acc.password !== 'string') throw new Error('账号结构错误');
                        }
                    }
                    if (confirm('导入账号将覆盖现有数据，确定继续吗？')) {
                        setAccountData(data);
                        renderGroupSelect();
                    }
                } catch (err) {
                }
            };
            reader.readAsText(file);
            // 清空文件选择
            e.target.value = '';
        };
        // 浮动提示（toast）
        function showToast(msg) {
            let toast = document.getElementById('tm-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'tm-toast';
                toast.style.position = 'fixed';
                toast.style.right = '40px';
                toast.style.bottom = '120px';
                toast.style.background = 'rgba(37,99,235,0.97)';
                toast.style.color = '#fff';
                toast.style.padding = '14px 28px';
                toast.style.borderRadius = '12px';
                toast.style.fontSize = '16px';
                toast.style.boxShadow = '0 4px 24px rgba(30,64,175,0.18)';
                toast.style.zIndex = '100001';
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s';
                document.body.appendChild(toast);
            }
            toast.textContent = msg;
            toast.style.opacity = '1';
            setTimeout(() => {
                toast.style.opacity = '0';
            }, 2000);
        }
        // 自动填充表单并尝试登录（增强事件模拟+调试日志）
        function autoLogin(username, password, userSelector, passSelector, loginBtnSelector) {
            // 优先用自定义选择器
            let userInput = null;
            let passInput = null;
            if (userSelector) userInput = document.querySelector(userSelector);
            if (passSelector) passInput = document.querySelector(passSelector);
            // 如果没自定义，走默认智能匹配
            if (!userInput) {
                const userSelectors = [
                    'input[name*=user]', 'input[name*=email]', 'input[name*=login]',
                    'input[id*=user]', 'input[id*=email]', 'input[id*=login]',
                    'input[type=email]', 'input[type=text]'
                ];
                for (const sel of userSelectors) {
                    userInput = document.querySelector(sel);
                    if (userInput) break;
                }
            }
            if (!passInput) {
                const passSelectors = [
                    'input[name*=pass]', 'input[id*=pass]', 'input[type=password]'
                ];
                for (const sel of passSelectors) {
                    passInput = document.querySelector(sel);
                    if (passInput) break;
                }
            }
            if (!userInput || !passInput) {
                showToast('未找到登录表单，请检查选择器或手动输入！');
                console.warn('[账号助手] 未找到输入框', { userInput, passInput });
                return;
            }
            // 填充账号密码并触发多种事件，兼容前端框架
            function triggerInputEvents(input, value) {
                input.focus();
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
                input.dispatchEvent(new Event('compositionend', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'a' }));
            }
            triggerInputEvents(userInput, username);
            triggerInputEvents(passInput, password);
            console.log('[账号助手] 已填充账号密码', { username, password });
            // 尝试自动点击登录按钮，触发多种事件
            setTimeout(() => {
                let loginBtn = null;
                if (loginBtnSelector) {
                    loginBtn = document.querySelector(loginBtnSelector);
                }
                if (!loginBtn) {
                    // 默认智能匹配
                    const loginBtnSelectors = [
                        'button[type=submit]', 'input[type=submit]',
                        'button', 'input[type=button]', '.login-btn', '[class*=login]', '[id*=login]'
                    ];
                    for (const sel of loginBtnSelectors) {
                        const btns = Array.from(document.querySelectorAll(sel));
                        loginBtn = btns.find(b => b.offsetParent !== null && !b.disabled && /登录|login|sign in|submit/i.test((b.textContent || b.value || '')));
                        if (loginBtn) break;
                    }
                }
                // 终极适配：在密码框上触发回车事件，兼容Vue @keyup.enter.native="login"
                if (passInput) {
                    const enterDown = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 });
                    const enterUp = new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 });
                    passInput.dispatchEvent(enterDown);
                    passInput.dispatchEvent(enterUp);
                    console.log('[账号助手] 已在密码框触发回车事件，兼容Vue登录');
                }
                if (loginBtn) {
                    // 触发多种事件模拟真实点击
                    const events = [
                        'pointerdown', 'mousedown', 'touchstart',
                        'pointerup', 'mouseup', 'touchend', 'click'
                    ];
                    for (const evt of events) {
                        loginBtn.dispatchEvent(new Event(evt, { bubbles: true, cancelable: true }));
                    }
                    loginBtn.focus();
                    console.log('[账号助手] 已模拟点击登录按钮', loginBtn);
                    // 高亮登录按钮（不再toast提示）
                    loginBtn.style.boxShadow = '0 0 0 3px #2563eb, 0 4px 24px rgba(30,64,175,0.18)';
                    loginBtn.style.transition = 'box-shadow 0.3s';
                    setTimeout(() => {
                        loginBtn.style.boxShadow = '';
                    }, 2000);
                } else {
                    // 如果找不到登录按钮，尝试提交表单
                    const form = userInput.form || passInput.form;
                    if (form) {
                        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                        form.submit();
                        showToast('已自动填充并提交表单，如未跳转请检查选择器或手动点击登录');
                        console.warn('[账号助手] 找不到登录按钮，已尝试提交表单', form);
                    } else {
                        showToast('已填充账号密码，请手动点击登录！');
                        console.warn('[账号助手] 找不到登录按钮和表单');
                    }
                }
            }, 500);
        }
        // 判断当前是否在登录页（可根据实际项目调整）
        function isLoginPage() {
            return location.pathname.includes('/login') || location.hash.includes('/login');
        }

        // 账号切换并自动登录的主逻辑（修复无限登录问题）
        function handleSwitchLogin(acc) {
            if (isLoginPage()) {
                localStorage.removeItem('tm_account_manager_pending_login');
                if (!autoLoginInProgress && !autoLoginDone) {
                    autoLoginInProgress = true;
                    autoLogin(acc.username, acc.password, acc.userSelector, acc.passSelector, acc.loginBtnSelector);
                    setTimeout(() => {
                        if (typeof renderGroupSelect === 'function') renderGroupSelect();
                    }, 1000);
                }
            } else {
                localStorage.setItem('tm_account_manager_pending_login', JSON.stringify(acc));
                autoLoginInProgress = false;
                autoLoginDone = false;
                if (location.hash) {
                    location.hash = '#/login';
                } else {
                    location.pathname = '/login';
                }
            }
        }

        // 登录页加载时自动检测并登录（持续监听表单出现，彻底兼容SPA，且杜绝无限登录）
        function tryAutoLoginFromPending() {
            if (!isLoginPage()) return;
            const pending = localStorage.getItem('tm_account_manager_pending_login');
            if (pending && !autoLoginInProgress && !autoLoginDone) {
                autoLoginInProgress = true;
                let tried = false;
                function isLoggedIn() {
                    // 1. URL hash中出现?menu=，判定为已登录
                    if (window.location.hash.includes('?menu=')) {
                        // 自动关闭账号管理面板
                        const panel = document.getElementById('tm-account-manager-panel');
                        if (panel) panel.style.display = 'none';
                        // 登录成功后只刷新账号列表
                        setTimeout(() => { if (typeof renderGroupSelect === 'function') renderGroupSelect(); }, 500);
                        autoLoginInProgress = false;
                        autoLoginDone = true;
                        localStorage.removeItem('tm_account_manager_pending_login');
                        return true;
                    }
                    // 2. URL不再是登录页
                    if (!isLoginPage()) {
                        autoLoginInProgress = false;
                        autoLoginDone = true;
                        localStorage.removeItem('tm_account_manager_pending_login');
                        setTimeout(() => { if (typeof renderGroupSelect === 'function') renderGroupSelect(); }, 500);
                        return true;
                    }
                    // 3. 输入框消失
                    if (!document.querySelector('input[type="text"], input[type="password"]')) {
                        autoLoginInProgress = false;
                        autoLoginDone = true;
                        localStorage.removeItem('tm_account_manager_pending_login');
                        setTimeout(() => { if (typeof renderGroupSelect === 'function') renderGroupSelect(); }, 500);
                        return true;
                    }
                    return false;
                }
                function checkAndLogin() {
                    if (isLoggedIn()) {
                        observer.disconnect();
                        clearInterval(interval);
                        return;
                    }
                    if (tried) return;
                    const acc = JSON.parse(pending);
                    let userInput = acc.userSelector ? document.querySelector(acc.userSelector) : document.getElementById('loginName') || document.querySelector('input[type="text"]');
                    let passInput = acc.passSelector ? document.querySelector(acc.passSelector) : document.querySelector('input[type="password"]');
                    if (userInput && passInput) {
                        tried = true;
                        autoLogin(acc.username, acc.password, acc.userSelector, acc.passSelector, acc.loginBtnSelector);
                    }
                }
                const observer = new MutationObserver(() => {
                    checkAndLogin();
                });
                observer.observe(document.body, { childList: true, subtree: true });
                const interval = setInterval(() => {
                    checkAndLogin();
                }, 500);
                setTimeout(() => {
                    observer.disconnect();
                    clearInterval(interval);
                    autoLoginInProgress = false;
                }, 10000);
            }
        }
        // 监听路由变化，进入登录页时自动检测
        window.addEventListener('hashchange', tryAutoLoginFromPending);
        window.addEventListener('popstate', tryAutoLoginFromPending);
        // 自适应方向弹窗+兜底居中
        setTimeout(() => {
            const btnRect = btn.getBoundingClientRect();
            const margin = 16;
            const panelWidth = panel.offsetWidth;
            const panelHeight = panel.offsetHeight;
            const isLeft = btnRect.left < window.innerWidth / 2;
            const isTop = btnRect.top < window.innerHeight / 2;
            let left, top;
            // 横向优先
            if (isLeft && btnRect.right + panelWidth + margin < window.innerWidth) {
                left = btnRect.right + margin;
            } else if (!isLeft && btnRect.left - panelWidth - margin > 0) {
                left = btnRect.left - panelWidth - margin;
            } else {
                left = Math.max(margin, window.innerWidth / 2 - panelWidth / 2);
            }
            // 纵向优先
            if (!isTop && btnRect.top - panelHeight - margin > 0) {
                top = btnRect.top - panelHeight - margin;
            } else if (isTop && btnRect.bottom + panelHeight + margin < window.innerHeight) {
                top = btnRect.bottom + margin;
            } else {
                top = Math.max(margin, window.innerHeight / 2 - panelHeight / 2);
            }
            // 检查是否超出屏幕，超出则兜底居中
            let needCenter = false;
            if (left < 0 || left + panelWidth > window.innerWidth || top < 0 || top + panelHeight > window.innerHeight) {
                needCenter = true;
            }
            if (needCenter) {
                left = window.innerWidth / 2 - panelWidth / 2;
                top = window.innerHeight / 2 - panelHeight / 2;
                panel.style.transform = 'translate(0, 0)';
            } else {
                panel.style.transform = '';
            }
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.right = 'unset';
            panel.style.bottom = 'unset';
            panel.style.visibility = 'visible';
        }, 0);
        // 初始化渲染
        renderGroupSelect();
        return panel;
    }

    // 通用美观确认弹窗
    function showConfirmModal(msg, onConfirm) {
        if (document.getElementById('tm-confirm-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-confirm-modal';
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.18)';
        modal.style.zIndex = '100003';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.innerHTML = `
            <div style="background:#fff;padding:28px 24px 20px 24px;border-radius:16px;box-shadow:0 8px 32px #aaa;max-width:340px;width:92vw;display:flex;flex-direction:column;align-items:center;">
                <div style="font-size:17px;font-weight:600;margin-bottom:18px;color:#2563eb;">${msg}</div>
                <div style="display:flex;gap:16px;width:100%;justify-content:center;">
                    <button id="tm-confirm-ok" style="background:linear-gradient(90deg,#2563eb 60%,#60a5fa 100%);color:#fff;font-weight:600;padding:8px 28px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">确定</button>
                    <button id="tm-confirm-cancel" style="background:#f3f4f6;color:#2563eb;padding:8px 28px;border:none;border-radius:8px;font-size:16px;cursor:pointer;">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#tm-confirm-ok').onclick = () => {
            document.body.removeChild(modal);
            onConfirm();
        };
        modal.querySelector('#tm-confirm-cancel').onclick = () => {
            document.body.removeChild(modal);
        };
    }

    // 初始化
    function init() {
        if (document.getElementById('tm-account-manager-btn')) return;
        initStorage();
        createFloatingButton();
    }

    // 兼容SPA：页面加载和路由变化都初始化
    init();
    window.addEventListener('hashchange', init);

})(); 