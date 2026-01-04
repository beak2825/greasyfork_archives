// ==UserScript==
// @name         Nodeloc 帖子增强工具
// @author       流浪开发者
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  性能优化，交互体验再升级！在Nodeloc帖子列表和详情页添加“已读”、“隐藏”、“高亮”、“置顶”功能（置顶支持自定义标题），并提供一个带“不再提示”选项的美观、流畅、高效的记录管理中心。
// @match        https://www.nodeloc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodeloc.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546606/Nodeloc%20%E5%B8%96%E5%AD%90%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546606/Nodeloc%20%E5%B8%96%E5%AD%90%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY_HIDE = 'tm_config_dont_ask_hide';
    const CONFIG_KEY_DELETE = 'tm_config_dont_ask_delete';

    // --- 菜单命令 ---
    GM_registerMenuCommand('重置“隐藏不再提示”', () => {
        GM_setValue(CONFIG_KEY_HIDE, false);
        alert('“隐藏帖子不再提示”的设置已重置。');
    });
    GM_registerMenuCommand('重置“删除不再提示”', () => {
        GM_setValue(CONFIG_KEY_DELETE, false);
        alert('“删除记录不再提示”的设置已重置。');
    });
    // v3.0: 新增清空数据命令
    GM_registerMenuCommand('清除所有帖子记录', () => {
        if (confirm('您确定要清除所有“已读”、“隐藏”、“高亮”、“置顶”记录吗？此操作不可撤销。')) {
            dataManager.clearAll();
        }
    });


    // --- 样式定义 ---
    GM_addStyle(`
        /* 基础样式 */
        .topic-list-item.tm-read .title { color: #888 !important; }
        body.dark .topic-list-item.tm-read .title { color: #666 !important; }
        .topic-list-item.tm-read .topic-excerpt, .topic-list-item.tm-read .badge-category, .topic-list-item.tm-read .posters { opacity: 0.6; }
        .topic-list-item.tm-highlight { background-color: #fef8e0 !important; }
        body.dark .topic-list-item.tm-highlight { background-color: #4a412a !important; }
        .tm-controls { display: flex; gap: 10px; margin-top: 8px; align-items: center; flex-wrap: wrap; }
        .tm-btn { background: none; border: 1px solid #ccc; border-radius: 4px; padding: 2px 6px; font-size: 12px; cursor: pointer; transition: background-color 0.2s, color 0.2s; white-space: nowrap; }
        body.dark .tm-btn { border-color: #555; color: #ddd; }
        .tm-btn:hover { background-color: #e9e9e9; }
        body.dark .tm-btn:hover { background-color: #333; }
        .tm-btn.active { background-color: #007bff; color: white; border-color: #007bff; }
        body.dark .tm-btn.active { background-color: #009966; border-color: #009966; }
        .tm-btn.tm-btn-read.active { background-color: #f0f0f0; color: #888; border-color: #ddd; }
        body.dark .tm-btn.tm-btn-read.active { background-color: #3a3a3a; color: #777; border-color: #555; }
        .tm-btn.tm-btn-danger { border-color: #dc3545; color: #dc3545; }
        .tm-btn.tm-btn-danger:hover { background-color: #dc3545; color: white; }
        body.dark .tm-btn.tm-btn-danger { border-color: #a02a37; color: #e56d79; }
        body.dark .tm-btn.tm-btn-danger:hover { background-color: #a02a37; color: white; }
        .tm-btn[disabled] { cursor: not-allowed; opacity: 0.5; }

        /* 置顶容器 */
        #tm-pinned-container-wrapper { border: 1px solid var(--tertiary-300, #cde8e1); border-radius: 5px; margin-bottom: 15px; overflow: hidden; display: none; position: relative; z-index: 100; background: var(--secondary, #fff); }
        body.dark #tm-pinned-container-wrapper { border-color: #333; background: var(--secondary, #252525); }
        .tm-pinned-header { font-size: 14px; font-weight: bold; padding: 8px 12px; background-color: var(--tertiary-100, #f2fbf8); }
        body.dark .tm-pinned-header { background-color: #2c3e38; }

        /* 帖子详情页按钮 */
        .tm-topic-controls { display: flex; gap: 8px; margin-top: 10px; clear: both; align-items: center; }
        #topic-title .title-wrapper.tm-topic-title-read h1 a, #topic-title .title-wrapper.tm-topic-title-read h1 span { color: #888 !important; }
        body.dark #topic-title .title-wrapper.tm-topic-title-read h1 a, body.dark #topic-title .title-wrapper.tm-topic-title-read h1 span { color: #666 !important; }
        #topic-title .title-wrapper.tm-topic-title-highlight { background-color: #fef8e0; padding: 2px 5px; border-radius: 3px; }
        body.dark #topic-title .title-wrapper.tm-topic-title-highlight { background-color: #4a412a; }

        /* 记录管理与模态框 */
        #tm-records-btn { margin-left: 8px; }
        .tm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1001; display: flex; align-items: center; justify-content: center; }
        .tm-modal-content { background: #fff; padding: 20px; border-radius: 8px; width: 90%; max-width: 650px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        body.dark .tm-modal-content { background: #252525; color: #ddd; }
        .tm-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; flex-shrink: 0; }
        body.dark .tm-modal-header { border-bottom-color: #444; }
        .tm-modal-title { font-size: 18px; font-weight: bold; margin: 0; }
        .tm-modal-close { font-size: 24px; cursor: pointer; background: none; border: none; color: #888; padding: 0 5px; line-height: 1; }
        body.dark .tm-modal-close { color: #aaa; }
        .tm-modal-body { flex-grow: 1; overflow-y: auto; min-height: 0; }
        .tm-modal-footer { text-align: right; display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px; flex-shrink: 0; align-items: center; }
        .tm-tabs-container { display: flex; gap: 20px; margin-bottom: 15px; padding: 8px 4px 0; flex-wrap: wrap; border-bottom: 1px solid #eee; min-height: 40px; }
        body.dark .tm-tabs-container { border-bottom-color: #444; }
        .tm-modal-tab-btn { position: relative; background: none; border: none; border-bottom: 3px solid transparent; padding: 8px 4px; font-size: 14px; cursor: pointer; color: #555; margin-bottom: -1px; transition: all 0.2s; }
        body.dark .tm-modal-tab-btn { color: #aaa; }
        .tm-modal-tab-btn:hover:not(.active) { color: #111; }
        body.dark .tm-modal-tab-btn:hover:not(.active) { color: #eee; }
        .tm-modal-tab-btn.active { color: var(--tertiary, #007bff); border-bottom-color: var(--tertiary, #007bff); font-weight: bold; }
        body.dark .tm-modal-tab-btn.active { color: var(--tertiary, #009966); border-bottom-color: var(--tertiary, #009966); }
        .tm-tab-count { position: absolute; top: 0; right: 0; transform: translate(60%, -40%); background-color: #e45735; color: white; border-radius: 10px; padding: 1px 6px; font-size: 11px; font-weight: bold; line-height: 1.4; }
        body.dark .tm-tab-count { background-color: #c84a36; }
        .tm-confirm-title, .tm-custom-title-input { font-weight: bold; margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px; word-break: break-all; }
        body.dark .tm-confirm-title, body.dark .tm-custom-title-input { background-color: #333; border-color: #555; color: #ddd;}
        .tm-custom-title-input { width: 100%; border: 1px solid #ccc; box-sizing: border-box; }
        .tm-records-list { list-style: none; padding: 0; margin:0; transition: opacity 0.3s; }
        .tm-records-list.fade-out { opacity: 0; }
        .tm-records-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #f0f0f0; }
        body.dark .tm-records-item { border-bottom-color: #444; }
        .tm-records-item:last-child { border-bottom: none; }
        .tm-records-item a { text-decoration: none; color: var(--primary-high, #222); flex-grow: 1; margin-right: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        body.dark .tm-records-item a { color: var(--primary-high, #ddd); }
        .tm-records-item-controls { flex-shrink: 0; }
        .tm-records-item-controls button { margin-left: 8px; }
        .tm-empty-list-placeholder { color: #888; text-align: center; padding: 30px; font-style: italic; }
        .tm-dont-ask-again { margin-right: auto; font-size: 12px; color: #666; display: flex; align-items: center; }
        body.dark .tm-dont-ask-again { color: #999; }
        .tm-dont-ask-again input { margin-right: 5px; }
    `);

    /**
     * 数据管理器 (v3.0 性能重构)
     * - 将分散的 GM_Value 整合为单个 JSON 对象，大幅提升读写性能。
     * - 实现内存缓存和延迟保存，UI 操作更流畅。
     * - 内置从旧版数据格式到新格式的自动迁移程序。
     */
    const dataManager = {
        _data: {},
        _isDirty: false,
        _saveTimeout: null,
        STORAGE_KEY: 'nodeloc_enhancement_data',
        OLD_STORAGE_PREFIX: 'discourse_topic_',

        async load() {
            await this._migrateData();
            this._data = GM_getValue(this.STORAGE_KEY, {});
        },

        save() {
            clearTimeout(this._saveTimeout);
            if (!this._isDirty) return;
            this._saveTimeout = setTimeout(() => {
                GM_setValue(this.STORAGE_KEY, this._data);
                this._isDirty = false;
                Promise.resolve().then(uiManager.updateTabCounts);
            }, 500);
        },

        get(topicId) {
            return this._data[topicId] || {};
        },

        update(topicId, key, value) {
            this._data[topicId] = this._data[topicId] || {};
            this._data[topicId][key] = value;
            const data = this._data[topicId];
            const hasTrueValue = Object.keys(data).some(k => k !== 'title' && data[k]);
            if (!hasTrueValue && !data.title) {
                this.delete(topicId);
            } else {
                this._isDirty = true;
                this.save();
            }
        },

        delete(topicId) {
            delete this._data[topicId];
            this._isDirty = true;
            this.save();
        },

        clearAll() {
            this._data = {};
            this._isDirty = true;
            this.save();
            alert('所有帖子增强记录已被清除。');
            location.reload();
        },

        getAllData() {
            return Object.entries(this._data).map(([topicId, d]) => ({ topicId, ...d }));
        },

        async _migrateData() {
            const oldKeys = GM_listValues().filter(key => key.startsWith(this.OLD_STORAGE_PREFIX));
            if (oldKeys.length === 0) return;

            console.log(`Nodeloc Enhancer: Migrating ${oldKeys.length} old records to new format...`);
            alert(`Nodeloc 帖子增强工具：\n\n检测到旧版数据，将为您自动升级到新版存储格式以提升性能。该过程仅需一次，请稍候...`);

            const newData = GM_getValue(this.STORAGE_KEY, {});
            let migratedCount = 0;
            for (const key of oldKeys) {
                const topicId = key.replace(this.OLD_STORAGE_PREFIX, '');
                const oldData = GM_getValue(key, {});
                if (topicId && Object.keys(oldData).length > 0) {
                    newData[topicId] = { ...(newData[topicId] || {}), ...oldData };
                    migratedCount++;
                }
            }
            GM_setValue(this.STORAGE_KEY, newData);

            for (const key of oldKeys) {
                GM_deleteValue(key);
            }

            alert(`数据迁移完成！\n\n成功迁移了 ${migratedCount} 条记录。\n旧的存储数据已被移除以释放空间。\n页面将自动刷新。`);
            console.log(`Nodeloc Enhancer: Migration complete. ${migratedCount} records moved.`);
            location.reload();
        }
    };


    /**
     * UI 管理器
     */
    const uiManager = {
        createModal(id, title, bodyHtml, footerHtml = '') {
            document.getElementById(id)?.remove();
            const overlay = document.createElement('div');
            overlay.id = id;
            overlay.className = 'tm-modal-overlay';
            overlay.style.display = 'none';
            overlay.innerHTML = `<div class="tm-modal-content"><div class="tm-modal-header"><h2 class="tm-modal-title">${title}</h2><button class="tm-modal-close">&times;</button></div><div class="tm-modal-body">${bodyHtml}</div>${footerHtml ? `<div class="tm-modal-footer">${footerHtml}</div>` : ''}</div>`;
            document.body.appendChild(overlay);
            const close = () => { overlay.style.display = 'none'; overlay.remove(); };
            overlay.querySelector('.tm-modal-close').onclick = close;
            overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
            return overlay;
        },
        showConfirmation({ title, bodyHtml, onConfirm, confirmText = '确定', cancelText = '取消', confirmClass = 'active', showDontAskAgain = false, configKey = '' }) {
            let footer = `<button id="tm-confirm-cancel" class="tm-btn">${cancelText}</button><button id="tm-confirm-ok" class="tm-btn ${confirmClass}">${confirmText}</button>`;
            if (showDontAskAgain) {
                footer = `<label class="tm-dont-ask-again"><input type="checkbox" id="tm-dont-ask-checkbox">不再提示</label>` + footer;
            }
            const modal = this.createModal('tm-confirm-modal', title, bodyHtml, footer);
            modal.style.display = 'flex';
            const okButton = document.getElementById('tm-confirm-ok');
            const cancelButton = document.getElementById('tm-confirm-cancel');
            const checkbox = document.getElementById('tm-dont-ask-checkbox');
            const close = () => modal.remove();
            okButton.onclick = () => {
                if (showDontAskAgain && checkbox.checked) {
                    GM_setValue(configKey, true);
                }
                onConfirm();
                close();
            };
            cancelButton.onclick = close;
        },
        showPinModal(currentTitle, onConfirm) {
             const bodyHtml = `<p>您可以为这个置顶帖子设置一个自定义标题（可选）：</p><input type="text" id="tm-custom-title-input" class="tm-custom-title-input" value="${currentTitle.replace(/"/g, '&quot;')}">`;
            const footerHtml = `<button id="tm-confirm-cancel" class="tm-btn">取消</button><button id="tm-confirm-ok" class="tm-btn active">置顶</button>`;
            const modal = this.createModal('tm-pin-modal', '置顶帖子', bodyHtml, footerHtml);
            modal.style.display = 'flex';
            const titleInput = document.getElementById('tm-custom-title-input');
            const okButton = document.getElementById('tm-confirm-ok');
            const cancelButton = document.getElementById('tm-confirm-cancel');
            const close = () => modal.remove();
            okButton.onclick = () => { onConfirm(titleInput.value); close(); };
            cancelButton.onclick = close;
        },
        showRecordsModal() {
            const modal = this.createModal('tm-records-modal', '查看记录', `<div id="tm-tabs-container" class="tm-tabs-container"></div><ul id="tm-records-list-ul" class="tm-records-list"></ul>`);
            const tabsContainer = modal.querySelector('#tm-tabs-container');
            const listEl = modal.querySelector('#tm-records-list-ul');
            const tabConfigs = [ { key: 'hidden', label: '隐藏' }, { key: 'pinned', label: '置顶' }, { key: 'highlight', label: '高亮' }, { key: 'read', label: '已读' }];
            const populateList = (filterKey) => {
                listEl.classList.add('fade-out');
                setTimeout(() => {
                    listEl.innerHTML = '';
                    const allData = dataManager.getAllData();
                    const topics = allData.filter(item => item[filterKey]);
                    const currentTabConfig = tabConfigs.find(t => t.key === filterKey);
                    if (topics.length === 0) {
                        listEl.innerHTML = `<li class="tm-empty-list-placeholder">没有被标记为“${currentTabConfig.label}”的帖子。</li>`;
                    } else {
                        topics.forEach(({ topicId, title }) => {
                            const item = document.createElement('li');
                            item.className = 'tm-records-item';
                            item.innerHTML = `<a href="/t/${topicId}" target="_blank" title="${title}">${title || `帖子 #${topicId}`}</a><div class="tm-records-item-controls"><button class="tm-btn action-btn">取消${currentTabConfig.label}</button><button class="tm-btn tm-btn-danger delete-btn">删除记录</button></div>`;
                            item.querySelector('.action-btn').onclick = () => { dataManager.update(topicId, filterKey, false); this.updateTabCounts(); populateList(filterKey); document.querySelectorAll(`tr[data-topic-id="${topicId}"]`).forEach(row => features.applyRowStyles(row, dataManager.get(topicId))); };
                            item.querySelector('.delete-btn').onclick = () => {
                                const onConfirm = () => {
                                    dataManager.delete(topicId); this.updateTabCounts(); populateList(filterKey);
                                    const row = document.querySelector(`tr[data-topic-id="${topicId}"]`);
                                    if (row) {
                                        if (row.classList.contains('tm-injected')) { row.remove(); }
                                        else { features.applyRowStyles(row, {}); row.querySelector('.tm-controls')?.remove(); features.addControlsToRow(row, topicId); }
                                    }
                                };
                                if (GM_getValue(CONFIG_KEY_DELETE, false)) { onConfirm(); }
                                else { this.showConfirmation({ title: '确认删除记录', bodyHtml: `<p>您确定要永久删除此帖子的所有记录吗？此操作不可撤销。</p><div class="tm-confirm-title">${title || `帖子 #${topicId}`}</div>`, confirmText: '删除', confirmClass: 'tm-btn-danger', onConfirm, showDontAskAgain: true, configKey: CONFIG_KEY_DELETE }); }
                            };
                            listEl.appendChild(item);
                        });
                    }
                    listEl.classList.remove('fade-out');
                }, 150);
            };
            tabConfigs.forEach(tab => {
                const tabBtn = document.createElement('button');
                tabBtn.className = 'tm-modal-tab-btn';
                tabBtn.dataset.key = tab.key;
                tabBtn.innerHTML = `${tab.label}<span class="tm-tab-count" style="display:none;"></span>`;
                tabBtn.onclick = () => {
                    tabsContainer.querySelectorAll('.tm-modal-tab-btn').forEach(b => b.classList.remove('active'));
                    tabBtn.classList.add('active');
                    populateList(tab.key);
                };
                tabsContainer.appendChild(tabBtn);
            });
            this.updateTabCounts();
            modal.style.display = 'flex';
            tabsContainer.querySelector('button[data-key="hidden"]').click();
        },
        updateTabCounts() {
            const tabsContainer = document.getElementById('tm-tabs-container');
            if (!tabsContainer) return;
            const allData = dataManager.getAllData();
            tabsContainer.querySelectorAll('.tm-modal-tab-btn').forEach(tabBtn => {
                const key = tabBtn.dataset.key;
                const count = allData.filter(item => item[key]).length;
                const countEl = tabBtn.querySelector('.tm-tab-count');
                if (count > 0) { countEl.textContent = count; countEl.style.display = ''; }
                else { countEl.style.display = 'none'; }
            });
        },
        addManagementButton() {
            // Check if the button already exists to prevent duplicates
            if (document.getElementById('tm-records-btn')) return;

            // Find a reliable anchor point in the header, like the user menu icon container (#current-user)
            const currentUserLi = document.querySelector('.d-header .d-header-icons #current-user');

            if (currentUserLi) {
                // Create an LI element to wrap the button, ensuring correct HTML structure and styling within the UL
                const newLi = document.createElement('li');

                const btn = document.createElement('button');
                btn.id = 'tm-records-btn';
                btn.className = 'btn no-text btn-icon icon btn-flat';
                btn.title = '查看记录';
                btn.innerHTML = `<svg class="fa d-icon d-icon-list-ul svg-icon svg-string" aria-hidden="true"><use href="#list-ul"></use></svg>`;
                btn.onclick = () => this.showRecordsModal();

                // Append the button to the new list item
                newLi.appendChild(btn);

                // Insert the new list item before the user menu list item
                currentUserLi.parentNode.insertBefore(newLi, currentUserLi);
            }
        }
    };

    /**
     * 核心功能模块
     */
    const features = {
        _createListButton(text, key, topicId, row) {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.className = 'tm-btn';
            if (key === 'read') btn.classList.add('tm-btn-read');
            btn.dataset.key = key;

            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const currentData = dataManager.get(topicId);
                const isCurrentlyActive = !!currentData[key];
                const title = row.querySelector('a.title')?.textContent.trim() || currentData.title || `帖子 #${topicId}`;

                if (key === 'pinned' && !isCurrentlyActive) {
                    uiManager.showPinModal(currentData.title || title, (newTitle) => {
                        dataManager.update(topicId, 'pinned', true);
                        dataManager.update(topicId, 'title', newTitle || title);
                        this.applyRowStyles(row, dataManager.get(topicId));
                    });
                    return;
                }

                if (key === 'hidden' && !isCurrentlyActive) {
                    if (!currentData.title) dataManager.update(topicId, 'title', title);
                    const onConfirm = () => {
                        dataManager.update(topicId, key, true);
                        this.applyRowStyles(row, dataManager.get(topicId));
                    };
                    if (GM_getValue(CONFIG_KEY_HIDE, false)) { onConfirm(); }
                    else { uiManager.showConfirmation({ title: '确认隐藏', bodyHtml: `<p>您确定要隐藏这个帖子吗？<br>您可以在记录管理中心找到并恢复它。</p><div class="tm-confirm-title">${title}</div>`, onConfirm, showDontAskAgain: true, configKey: CONFIG_KEY_HIDE }); }
                    return;
                }

                const isActive = !isCurrentlyActive;
                dataManager.update(topicId, key, isActive);
                this.applyRowStyles(row, dataManager.get(topicId));
            });
            return btn;
        },

        _createControls(topicId, row) {
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'tm-controls';
            controlsContainer.append( this._createListButton('已读', 'read', topicId, row), this._createListButton('高亮', 'highlight', topicId, row), this._createListButton('置顶', 'pinned', topicId, row), this._createListButton('隐藏', 'hidden', topicId, row) );
            return controlsContainer;
        },

        addControlsToRow(row, topicId) {
            if (!row || !topicId || row.querySelector('.tm-controls')) return;
            const targetCell = row.querySelector('td.main-link');
            if (targetCell) {
                const titleText = targetCell.querySelector('a.title')?.textContent.trim();
                if (titleText && !dataManager.get(topicId).title) {
                    dataManager.update(topicId, 'title', titleText);
                }
                targetCell.appendChild(this._createControls(topicId, row));
            }
        },

        applyRowStyles(row, data) {
            row.classList.toggle('tm-read', !!data.read);
            row.classList.toggle('tm-highlight', !!data.highlight);
            row.style.display = data.hidden ? 'none' : '';

            const pinnedContainerWrapper = document.getElementById('tm-pinned-container-wrapper');
            const pinnedBody = pinnedContainerWrapper?.querySelector('.topic-list-body');
            const topicListBody = document.querySelector('table.topic-list:not(#tm-pinned-container-wrapper table) tbody.topic-list-body');

            if (data.pinned && !data.hidden) {
                if (pinnedBody && row.parentElement !== pinnedBody) pinnedBody.prepend(row);
                const titleLink = row.querySelector('a.title');
                if (titleLink) titleLink.textContent = data.title || `帖子 #${row.dataset.topicId}`;
            } else {
                if (pinnedBody && row.parentElement === pinnedBody) {
                    if (row.classList.contains('tm-injected')) row.remove();
                    else topicListBody?.prepend(row);
                }
            }

            if(pinnedContainerWrapper && pinnedBody) {
                const hasVisiblePinnedItems = pinnedBody.querySelector('tr:not([style*="display: none"])');
                pinnedContainerWrapper.style.display = hasVisiblePinnedItems ? 'block' : 'none';
            }

            row.querySelectorAll('.tm-controls .tm-btn').forEach(btn => {
                const key = btn.dataset.key;
                btn.classList.toggle('active', !!data[key]);
                if (key === 'pinned') btn.textContent = data.pinned ? '取消置顶' : '置顶';
                btn.disabled = !!(data.pinned && ['read', 'hidden'].includes(key));
            });
        },

        createInjectedRow(topicData) {
            const { topicId, title } = topicData;
            const row = document.createElement('tr');
            row.className = 'topic-list-item tm-injected tm-processed';
            row.dataset.topicId = topicId;
            const mainCell = document.createElement('td');
            mainCell.className = 'main-link topic-list-data';
            mainCell.colSpan = 5;
            const titleLink = document.createElement('a');
            titleLink.href = `/t/${topicId}`;
            titleLink.className = 'title raw-link raw-topic-link';
            titleLink.textContent = title || `帖子 #${topicId}`;
            const linkTopLine = document.createElement('span');
            linkTopLine.className = 'link-top-line';
            linkTopLine.appendChild(titleLink);
            mainCell.appendChild(linkTopLine);
            mainCell.appendChild(this._createControls(topicId, row));
            row.append(mainCell);
            return row;
        },

        processTopicList() {
            const listArea = document.getElementById('list-area');
            if (!listArea || !listArea.querySelector('table.topic-list')) return;
            const topicListBody = listArea.querySelector('table.topic-list tbody.topic-list-body');
            if (!topicListBody) return;

            // --- 1. 确保置顶容器存在 ---
            let pinnedContainerWrapper = document.getElementById('tm-pinned-container-wrapper');
            if (!pinnedContainerWrapper) {
                pinnedContainerWrapper = document.createElement('div');
                pinnedContainerWrapper.id = 'tm-pinned-container-wrapper';
                pinnedContainerWrapper.innerHTML = `<div class="tm-pinned-header">📌 置顶的帖子</div><table class="topic-list"><tbody class="topic-list-body"></tbody></table>`;
                const listContainer = topicListBody.closest('.topic-list');
                const targetNodeForInsertion = listArea.querySelector('.show-more') || listContainer;
                targetNodeForInsertion?.parentNode.insertBefore(pinnedContainerWrapper, targetNodeForInsertion);
            }

            // --- 2. 处理页面上可见的、未处理的行 ---
            document.querySelectorAll('tr.topic-list-item:not(.tm-processed)').forEach(row => {
                row.classList.add('tm-processed');
                const topicId = row.dataset.topicId;
                if (topicId) {
                    this.addControlsToRow(row, topicId);
                    this.applyRowStyles(row, dataManager.get(topicId));
                }
            });

            // --- 3. 高效处理置顶帖子 (核心性能优化) ---
            const pinnedBody = pinnedContainerWrapper?.querySelector('.topic-list-body');
            if (pinnedBody) {
                const pinnedTopics = dataManager.getAllData().filter(item => item.pinned && !item.hidden);

                // 一次性获取 DOM 中所有帖子的 ID
                const domTopicIds = new Set(Array.from(document.querySelectorAll('tr[data-topic-id]'), el => el.dataset.topicId));

                // 移除不再置顶的注入行
                pinnedBody.querySelectorAll('tr.tm-injected').forEach(injectedRow => {
                    if (!pinnedTopics.some(p => p.topicId === injectedRow.dataset.topicId)) {
                        injectedRow.remove();
                    }
                });

                // 仅注入当前页面不存在的置顶帖
                pinnedTopics.forEach(topicData => {
                    if (!domTopicIds.has(topicData.topicId)) {
                        const newRow = this.createInjectedRow(topicData);
                        pinnedBody.prepend(newRow);
                        this.applyRowStyles(newRow, dataManager.get(topicData.topicId));
                    }
                });

                const hasVisiblePinnedItems = pinnedBody.querySelector('tr:not([style*="display: none"])');
                pinnedContainerWrapper.style.display = hasVisiblePinnedItems ? 'block' : 'none';
            }
        },

        processSingleTopicView() {
            const topicContainer = document.getElementById('topic');
            const topicId = topicContainer?.dataset.topicId;
            const target = document.querySelector('#topic-title');
            if (!topicId || !target) return;

            target.querySelector('.tm-topic-controls')?.remove();

            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'tm-topic-controls';
            const topicTitleElement = target.querySelector('.title-wrapper');
            const updateTitleStyles = () => {
                if (!topicTitleElement) return;
                const data = dataManager.get(topicId);
                topicTitleElement.classList.toggle('tm-topic-title-read', !!data.read);
                topicTitleElement.classList.toggle('tm-topic-title-highlight', !!data.highlight);
            };

            const createTopicButton = (text, key) => {
                const btn = document.createElement('button');
                btn.className = 'tm-btn';
                if (key === 'read') btn.classList.add('tm-btn-read');
                btn.textContent = text;
                if (dataManager.get(topicId)[key]) btn.classList.add('active');
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const isActive = !dataManager.get(topicId)[key];
                    dataManager.update(topicId, key, isActive);
                    updateTitleStyles();
                    btn.classList.toggle('active', isActive);
                });
                return btn;
            };

            const titleText = topicTitleElement?.textContent.trim();
            if (titleText && !dataManager.get(topicId).title) {
                dataManager.update(topicId, 'title', titleText);
            }

            controlsContainer.append(createTopicButton('标记已读', 'read'), createTopicButton('高亮主题', 'highlight'));
            target.appendChild(controlsContainer);
            updateTitleStyles();
        }
    };

    /**
     * 主函数和监听器
     */
    function runAllFeatures() {
        uiManager.addManagementButton();
        if (document.getElementById('list-area')) {
            features.processTopicList();
        }
        if (document.getElementById('topic')) {
            features.processSingleTopicView();
        }
    }

    async function initialize() {
        // 关键步骤：加载所有数据到内存，并执行一次性迁移（如果需要）
        await dataManager.load();

        let debounceTimer;
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(runAllFeatures, 150);
        });

        const mainOutlet = document.getElementById('main-outlet');
        if (mainOutlet) {
            runAllFeatures(); // 首次运行
            observer.observe(mainOutlet, { childList: true, subtree: true });
        } else {
            // 兼容页面加载较慢的情况
            setTimeout(initialize, 300);
        }
    }

    // 启动脚本
    initialize();

})();