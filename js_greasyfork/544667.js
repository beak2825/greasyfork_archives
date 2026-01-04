// ==UserScript==
// @name         快速提交安全规则
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  在页面加载完成后插入批量提交组件 (筛选时读取并显示SYN Proxy状态)
// @author       ludama
// @match        https://creatia.securelayer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544667/%E5%BF%AB%E9%80%9F%E6%8F%90%E4%BA%A4%E5%AE%89%E5%85%A8%E8%A7%84%E5%88%99.user.js
// @updateURL https://update.greasyfork.org/scripts/544667/%E5%BF%AB%E9%80%9F%E6%8F%90%E4%BA%A4%E5%AE%89%E5%85%A8%E8%A7%84%E5%88%99.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 将目标选择器提取为常量，方便维护
    const TARGET_BUTTON_SELECTOR = "#root > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.css-1o0cmyt > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-11.css-1cyiw8n > div > div.MuiGrid-root.MuiGrid-container.css-1d3bbye > div:nth-child(1) > h3";
    const MY_BUTTON_ID = 'my-quick-submit-button';
    const TARGET_PATH = '/goliath/prefix';

    class OwnerFilterComponent {
        constructor() {
            this.allData = [];
            this.ownerStats = {};
            this.chainData = [];
            this.modal = null;
            this.selectedIds = [];
            this.submitResults = {}; // 存储提交结果，统一管理所有操作的状态
            this.submitErrors = {}; // 存储提交错误信息
            this.observer = null;
        }

        init() {
            this.setupButton();
            this.observeNavigation();
        }

        isTargetPath() {
            return window.location.pathname === TARGET_PATH;
        }

        setupButton() {
            if (!this.isTargetPath()) {
                const myButton = document.getElementById(MY_BUTTON_ID);
                if (myButton) {
                    myButton.remove();
                }
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
                return;
            }

            if (document.getElementById(MY_BUTTON_ID)) {
                return;
            }

            if (!this.injectButton()) {
                this.waitForElement();
            }
        }

        waitForElement() {
            if (this.observer) return;

            const targetNode = document.body;
            const config = { childList: true, subtree: true };

            this.observer = new MutationObserver(() => {
                if (this.injectButton()) {
                    this.observer.disconnect();
                    this.observer = null;
                }
            });

            this.observer.observe(targetNode, config);
        }

        injectButton() {
            const targetElement = document.querySelector(TARGET_BUTTON_SELECTOR);
            if (targetElement) {
                const filterButton = document.createElement('button');
                filterButton.id = MY_BUTTON_ID;
                filterButton.className = 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary';
                filterButton.style.marginLeft = '10px';
                filterButton.innerHTML = '<span class="MuiButton-label">选择记录</span>';
                filterButton.addEventListener('click', () => this.handleFilterClick());
                targetElement.parentNode.insertBefore(filterButton, targetElement.nextSibling);
                return true;
            }
            return false;
        }

        observeNavigation() {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = (...args) => {
                originalPushState.apply(history, args);
                setTimeout(() => this.setupButton(), 0);
            };

            history.replaceState = (...args) => {
                originalReplaceState.apply(history, args);
                setTimeout(() => this.setupButton(), 0);
            };

            window.addEventListener('popstate', () => {
                setTimeout(() => this.setupButton(), 0);
            });
        }

        // --- 以下所有方法保持不变或有轻微修改 ---
        async handleFilterClick() {
            this.showLoadingModal();
            try {
                const result = await this.fetchAllDataAndOwners();
                this.allData = result.allData;
                this.ownerStats = result.ownerStats;
                this.chainData = await this.fetchChainData();
                this.showSelectionModal();
            } catch (error) {
                this.showErrorModal(error.message);
            }
        }

        async fetchAllDataAndOwners() {
            const baseUrl = 'https://api-creatia.securelayer.com/api/goliath/prefix';
            const length = 100;
            let allData = [];
            let ownerStats = {};
            const authData = JSON.parse(localStorage.getItem('auth'));
            const accessToken = authData?.access_token;
            if (!accessToken) {
                throw new Error('未找到有效的 access_token');
            }
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const firstResponse = await fetch(`${baseUrl}?draw=1754343870&start=0&length=${length}&filter[global]=`, { headers });
            if (!firstResponse.ok) {
                throw new Error(`HTTP error! status: ${firstResponse.status}`);
            }
            const firstData = await firstResponse.json();
            const recordsFiltered = firstData.recordsFiltered;
            const totalPages = Math.ceil(recordsFiltered / length);
            for (let page = 0; page < totalPages; page++) {
                const start = page * length;
                const response = await fetch(`${baseUrl}?draw=1754343870&start=${start}&length=${length}&filter[global]=`, { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                allData = allData.concat(data.data.map(item => ({
                    id: item.id,
                    owner: item.owner,
                    network: item.network || 'N/A'
                })));
                data.data.forEach(item => {
                    if (ownerStats[item.owner]) {
                        ownerStats[item.owner]++;
                    } else {
                        ownerStats[item.owner] = 1;
                    }
                });
            }
            return { allData, ownerStats };
        }

        async fetchChainData() {
            const baseUrl = 'https://api-creatia.securelayer.com/api/goliath/chain';
            const length = 100;
            let allChainData = [];
            const authData = JSON.parse(localStorage.getItem('auth'));
            const accessToken = authData?.access_token;
            if (!accessToken) {
                throw new Error('未找到有效的 access_token');
            }
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const firstResponse = await fetch(`${baseUrl}?draw=1754345735&start=0&length=${length}&filter[global]=`, { headers });
            if (!firstResponse.ok) {
                throw new Error(`HTTP error! status: ${firstResponse.status}`);
            }
            const firstData = await firstResponse.json();
            const recordsFiltered = firstData.recordsFiltered;
            const totalPages = Math.ceil(recordsFiltered / length);
            for (let page = 0; page < totalPages; page++) {
                const start = page * length;
                const response = await fetch(`${baseUrl}?draw=1754345735&start=${start}&length=${length}&filter[global]=`, { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                allChainData = allChainData.concat(data.data);
            }
            return allChainData;
        }

        showLoadingModal() {
            this.createModal(`
              <div style="text-align: center; padding: 40px;">
                <div>正在加载数据...</div>
                <div style="margin-top: 20px;">
                  <div class="loading-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
              </div>
            `);
            if (!document.getElementById('loading-spinner-style')) {
                const style = document.createElement('style');
                style.id = 'loading-spinner-style';
                style.innerHTML = `
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `;
                document.head.appendChild(style);
            }
        }

        showSelectionModal() {
            const owners = Object.keys(this.ownerStats);
            let ownerOptions = '<option value="all">显示所有数据</option>';
            owners.forEach(owner => {
                ownerOptions += `<option value="${owner}">Owner ${owner} (${this.ownerStats[owner]} 条记录)</option>`;
            });
            let chainOptions = '<option value="">请选择 Chain</option>';
            this.chainData.forEach(chain => {
                const displayName = chain.name ? `${chain.id} (${chain.name})` : chain.id;
                chainOptions += `<option value="${chain.id}">Chain ID: ${displayName}</option>`;
            });
            const modalContent = `
              <div style="padding: 20px; max-height: 80vh; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <h3 style="margin: 0;">选择记录</h3>
                  <button onclick="ownerFilterComponent.closeModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                  <div style="flex: 1;">
                    <label for="ownerSelect" style="display: block; margin-bottom: 8px; font-weight: 500;">选择 Owner:</label>
                    <select id="ownerSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                      ${ownerOptions}
                    </select>
                  </div>
                  <div style="flex: 1;">
                    <label for="chainSelect" style="display: block; margin-bottom: 8px; font-weight: 500;">目标 Chain (可选):</label>
                    <select id="chainSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
                      ${chainOptions}
                    </select>
                  </div>
                </div>
                <div style="margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px;">
                  <button id="filterButton" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">筛选</button>
                  <button id="selectAllButton" disabled style="background-color: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">全选</button>
                  <button id="deselectAllButton" disabled style="background-color: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">取消全选</button>
                  <button id="submitChainButton" disabled style="background-color: #8e44ad; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">提交Chain</button>
                  <button id="removeChainButton" disabled style="background-color: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">移除Chain</button>
                  <button id="enableSniproxyButton" disabled style="background-color: #16a085; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">开启SYN Proxy</button>
                  <button id="disableSniproxyButton" disabled style="background-color: #c0392b; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">关闭SYN Proxy</button>
                </div>
                <div id="selectionContainer" style="flex: 1; overflow: hidden;">
                  <div id="resultsInfo" style="margin-bottom: 10px; font-weight: 500;"></div>
                  <div id="checkboxListContainer" style="flex: 1; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px; min-height: 200px; max-height: 300px;">
                    <div id="checkboxList" style="display: flex; flex-direction: column; gap: 8px;">
                      <div style="color: #666; text-align: center; padding: 20px;">请选择 Owner 进行筛选</div>
                    </div>
                  </div>
                </div>
                <div id="submitProgress" style="display: none; margin-top: 15px; padding: 10px; border-radius: 4px; background-color: #f8f9fa;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div style="font-weight: 500;">操作进度:</div>
                    <div id="progressCount">0/0</div>
                  </div>
                  <div style="margin-bottom: 10px;">
                    <div id="statusProgressBar" style="width: 0%; height: 10px; background-color: #3498db; border-radius: 4px;"></div>
                  </div>
                  <div id="statusResults" style="text-align: center; margin-bottom: 10px;"></div>
                  <div id="errorList" style="display: none;">
                    <div style="font-weight: 500; margin-bottom: 5px;">失败列表:</div>
                    <ul id="errorListItems" style="max-height: 100px; overflow-y: auto; margin: 0; padding-left: 20px;"></ul>
                  </div>
                </div>
                <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                  <div id="selectedCount" style="font-weight: 500;"></div>
                  <div>
                    <button id="exportButton" disabled style="background-color: #27ae60; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">导出选中项</button>
                  </div>
                </div>
              </div>
            `;
            this.createModal(modalContent);
            document.getElementById('filterButton').addEventListener('click', () => {
                const selectedOwner = document.getElementById('ownerSelect').value;
                this.filterRecords(selectedOwner);
            });
            document.getElementById('submitChainButton').addEventListener('click', () => this.submitChain());
            document.getElementById('removeChainButton').addEventListener('click', () => this.removeChain());
            document.getElementById('enableSniproxyButton').addEventListener('click', () => this.toggleSniproxy(true));
            document.getElementById('disableSniproxyButton').addEventListener('click', () => this.toggleSniproxy(false));
            document.getElementById('exportButton').addEventListener('click', () => this.exportSelected());
        }

        /**
         * 筛选记录并获取SYN Proxy状态
         */
        async filterRecords(owner) {
            let filteredData = this.allData;
            if (owner && owner !== 'all') {
                filteredData = filteredData.filter(item => item.owner == owner);
            }

            const resultsInfo = document.getElementById('resultsInfo');
            const checkboxList = document.getElementById('checkboxList');
            resultsInfo.textContent = `找到 ${filteredData.length} 条记录${owner !== 'all' ? ` (Owner: ${owner})` : ''}`;

            if (filteredData.length === 0) {
                checkboxList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">没有找到匹配的记录</div>';
                this.disableAllActionButtons();
                return;
            }

            // 显示加载状态
            checkboxList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">正在获取 SYN Proxy 状态...</div>';
            this.disableAllActionButtons();

            const authData = JSON.parse(localStorage.getItem('auth'));
            const accessToken = authData?.access_token;
            if (!accessToken) {
                checkboxList.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">未找到 access_token，无法获取状态</div>';
                return;
            }
            const headers = { 'Authorization': `Bearer ${accessToken}` };

            try {
                // 批量获取所有筛选后记录的 flag
                const flagPromises = filteredData.map(item =>
                    fetch(`https://api-creatia.securelayer.com/api/goliath/prefix/${item.id}/flag`, { headers })
                        .then(res => {
                            if (!res.ok) return Promise.reject(`HTTP error! status: ${res.status}`);
                            return res.json();
                        })
                        .then(flagData => ({ ...item, flags: flagData }))
                        .catch(error => ({ ...item, flags: { synproxy: null, error: error }}))
                );

                const dataWithFlags = await Promise.all(flagPromises);
                this.renderRecordList(dataWithFlags);

            } catch (error) {
                checkboxList.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">获取状态时发生网络错误: ${error.message}</div>`;
                this.disableAllActionButtons();
            }
        }

        /**
         * 渲染带有SYN Proxy状态的记录列表
         * @param {Array} data - 包含 flags 信息的记录数组
         */
        renderRecordList(data) {
            const checkboxList = document.getElementById('checkboxList');
            let checkboxHtml = '';
            data.forEach(item => {
                let itemStyle = '';
                if (this.submitResults[item.id] === true) {
                    itemStyle = ' style="background-color: #d4edda; border-color: #c3e6cb;"';
                } else if (this.submitResults[item.id] === false) {
                    itemStyle = ' style="background-color: #f8d7da; border-color: #f5c6cb;"';
                }

                let synproxyStatusHtml = '';
                if (item.flags.error) {
                    synproxyStatusHtml = `<div><strong>SYN Proxy:</strong> <span style="color: #e74c3c; font-style: italic;">获取失败</span></div>`;
                } else if (item.flags.synproxy === true) {
                    synproxyStatusHtml = `<div><strong>SYN Proxy:</strong> <span style="color: #27ae60; font-weight: bold;">已开启</span></div>`;
                } else {
                    synproxyStatusHtml = `<div><strong>SYN Proxy:</strong> <span style="color: #7f8c8d;">已关闭</span></div>`;
                }

                checkboxHtml += `
                  <label${itemStyle} style="display: flex; align-items: flex-start; padding: 8px; border: 1px solid #eee; border-radius: 4px; gap: 10px;">
                    <input type="checkbox"
                           value="${item.id}"
                           data-owner="${item.owner}"
                           data-network="${item.network}"
                           style="margin-top: 2px; width: 18px; height: 18px; flex-shrink: 0;">
                    <div style="flex-grow: 1;">
                      <div><strong>ID:</strong> ${item.id}</div>
                      <div><strong>Owner:</strong> ${item.owner}</div>
                      <div><strong>Network:</strong> ${item.network}</div>
                      ${synproxyStatusHtml}
                    </div>
                  </label>
                `;
            });
            checkboxList.innerHTML = checkboxHtml;

            this.enableAllActionButtons();

            document.getElementById('selectAllButton').onclick = () => this.selectAll();
            document.getElementById('deselectAllButton').onclick = () => this.deselectAll();
            const checkboxes = checkboxList.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => this.updateSelectedCount());
            });
            this.updateSelectedCount();
        }

        disableAllActionButtons() {
            const buttons = ['selectAllButton', 'deselectAllButton', 'exportButton', 'submitChainButton', 'removeChainButton', 'enableSniproxyButton', 'disableSniproxyButton'];
            buttons.forEach(id => {
                const btn = document.getElementById(id);
                if(btn) btn.disabled = true;
            });
        }

        enableAllActionButtons() {
            const buttons = ['selectAllButton', 'deselectAllButton', 'exportButton', 'submitChainButton', 'removeChainButton', 'enableSniproxyButton', 'disableSniproxyButton'];
            buttons.forEach(id => {
                const btn = document.getElementById(id);
                if(btn) btn.disabled = false;
            });
        }


        updateSelectedCount() {
            const checkboxes = document.querySelectorAll('#checkboxList input[type="checkbox"]');
            this.selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
            const selectedCountElement = document.getElementById('selectedCount');
            if (selectedCountElement) {
                selectedCountElement.textContent = `已选择: ${this.selectedIds.length}/${checkboxes.length}`;
            }
        }

        selectAll() {
            const checkboxes = document.querySelectorAll('#checkboxList input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = true);
            this.updateSelectedCount();
        }

        deselectAll() {
            const checkboxes = document.querySelectorAll('#checkboxList input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            this.updateSelectedCount();
        }

        exportSelected() {
            const checkboxes = document.querySelectorAll('#checkboxList input[type="checkbox"]:checked');

            if (checkboxes.length === 0) {
                alert('请至少选择一项');
                return;
            }
            const selectedData = [];
            checkboxes.forEach(checkbox => {
                const id = checkbox.value;
                const owner = checkbox.dataset.owner;
                const network = checkbox.dataset.network;

                selectedData.push({
                    id: id,
                    owner: owner,
                    network: network
                });
            });
            const dataStr = JSON.stringify(selectedData, null, 2);
            const blob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `selected-records-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }

        async submitChain() {
            const selectedChainId = document.getElementById('chainSelect').value;
            if (!selectedChainId) {
                alert('请选择目标 Chain');
                return;
            }
            if (this.selectedIds.length === 0) {
                alert('请至少选择一项记录');
                return;
            }
            const authData = JSON.parse(localStorage.getItem('auth'));
            const accessToken = authData?.access_token;
            if (!accessToken) {
                alert('未找到有效的 access_token');
                return;
            }
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const submitData = {
                chain_id: selectedChainId,
                make_duplicate: false
            };
            await this.performBatchAction('PUT', `chain`, submitData, '提交');
        }

        async removeChain() {
            const selectedChainId = document.getElementById('chainSelect').value;
            if (!selectedChainId) {
                alert('请选择目标 Chain');
                return;
            }
            if (this.selectedIds.length === 0) {
                alert('请至少选择一项记录');
                return;
            }
            const authData = JSON.parse(localStorage.getItem('auth'));
            const accessToken = authData?.access_token;
            if (!accessToken) {
                alert('未找到有效的 access_token');
                return;
            }
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const submitData = { chain_id: selectedChainId };
            await this.performBatchAction('DELETE', `chain`, submitData, '移除');
        }

        /**
         * 开启或关闭 SYN Proxy
         * @param {boolean} enable - true为开启, false为关闭
         */
        async toggleSniproxy(enable) {
            if (this.selectedIds.length === 0) {
                alert('请至少选择一项记录');
                return;
            }

            const authData = JSON.parse(localStorage.getItem('auth'));
            const accessToken = authData?.access_token;
            if (!accessToken) {
                alert('未找到有效的 access_token');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            const actionName = enable ? '开启 SYN Proxy' : '关闭 SYN Proxy';
            const selectedRecordIds = this.selectedIds;
            let successCount = 0;
            const totalCount = selectedRecordIds.length;
            this.submitErrors = {};

            const submitProgress = document.getElementById('submitProgress');
            const statusResults = document.getElementById('statusResults');
            const errorList = document.getElementById('errorList');
            const errorListItems = document.getElementById('errorListItems');

            submitProgress.style.display = 'block';
            statusResults.innerHTML = `<div>正在${actionName}...</div>`;
            errorList.style.display = 'none';
            errorListItems.innerHTML = '';

            const updateProgress = (current, total) => {
                const progressCount = document.getElementById('progressCount');
                const progressBar = document.getElementById('statusProgressBar');
                const percentage = Math.round((current / total) * 100);
                if (progressCount && progressBar) {
                    progressCount.textContent = `${current}/${total}`;
                    progressBar.style.width = `${percentage}%`;
                }
            };

            const updateResults = (message) => {
                if (statusResults) {
                    statusResults.innerHTML = `<div>${message}</div>`;
                }
            };

            const showErrorList = () => {
                if (Object.keys(this.submitErrors).length > 0) {
                    errorList.style.display = 'block';
                    errorListItems.innerHTML = '';
                    for (const [id, error] of Object.entries(this.submitErrors)) {
                        const li = document.createElement('li');
                        li.textContent = `ID ${id}: ${error}`;
                        errorListItems.appendChild(li);
                    }
                } else {
                    errorList.style.display = 'none';
                }
            };

            setTimeout(async () => {
                for (let i = 0; i < totalCount; i++) {
                    const recordId = selectedRecordIds[i];
                    try {
                        const getResponse = await fetch(`https://api-creatia.securelayer.com/api/goliath/prefix/${recordId}/flag`, { headers });
                        if (!getResponse.ok) {
                            throw new Error(`GET Flag 失败: ${getResponse.statusText}`);
                        }
                        const flagData = await getResponse.json();

                        const putBody = {
                            inline: flagData.inline,
                            synproxy: enable,
                            heuristics: flagData.heuristics,
                            heuristics_level: flagData.heuristics_level,
                            fivem: flagData.fivem,
                            loose: flagData.loose
                        };

                        const putResponse = await fetch(`https://api-creatia.securelayer.com/api/goliath/prefix/${recordId}/flag`, {
                            method: 'PUT',
                            headers: headers,
                            body: JSON.stringify(putBody)
                        });

                        if (putResponse.ok) {
                            this.submitResults[recordId] = true;
                            successCount++;
                        } else {
                            const errorResult = await putResponse.json();
                            this.submitResults[recordId] = false;
                            this.submitErrors[recordId] = errorResult.detail || `PUT Flag 失败: ${putResponse.statusText}`;
                        }
                    } catch (error) {
                        this.submitResults[recordId] = false;
                        this.submitErrors[recordId] = error.message || '网络或未知错误';
                    }
                    updateProgress(i + 1, totalCount);
                }

                const message = `${actionName}完成: 成功 ${successCount}/${totalCount} 个记录`;
                updateResults(message);
                showErrorList();

                // 操作完成后，重新筛选以刷新状态和颜色
                const selectedOwner = document.getElementById('ownerSelect').value;
                await this.filterRecords(selectedOwner);
            }, 0);
        }


        async performBatchAction(method, action, body, actionName) {
            const authData = JSON.parse(localStorage.getItem('auth'));
            const accessToken = authData?.access_token;
            if (!accessToken) {
                alert('未找到有效的 access_token');
                return;
            }
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const submitProgress = document.getElementById('submitProgress');
            const statusResults = document.getElementById('statusResults');
            const errorList = document.getElementById('errorList');
            const errorListItems = document.getElementById('errorListItems');

            submitProgress.style.display = 'block';
            statusResults.innerHTML = `<div>正在${actionName}...</div>`;
            errorList.style.display = 'none';
            errorListItems.innerHTML = '';

            const selectedRecordIds = this.selectedIds;
            let successCount = 0;
            const totalCount = selectedRecordIds.length;
            this.submitErrors = {};

            const updateProgress = (current, total) => {
                const progressCount = document.getElementById('progressCount');
                const progressBar = document.getElementById('statusProgressBar');
                const percentage = Math.round((current / total) * 100);
                if (progressCount && progressBar) {
                    progressCount.textContent = `${current}/${total}`;
                    progressBar.style.width = `${percentage}%`;
                }
            };
            const updateResults = (success, total, message) => {
                if (statusResults) {
                    statusResults.innerHTML = `<div>${message}</div>`;
                }
            };
            const showErrorList = () => {
                if (Object.keys(this.submitErrors).length > 0) {
                    errorList.style.display = 'block';
                    errorListItems.innerHTML = '';
                    for (const [id, error] of Object.entries(this.submitErrors)) {
                        const li = document.createElement('li');
                        li.textContent = `ID ${id}: ${error}`;
                        errorListItems.appendChild(li);
                    }
                } else {
                    errorList.style.display = 'none';
                }
            };
            updateProgress(0, totalCount);
            for (let i = 0; i < selectedRecordIds.length; i++) {
                const recordId = selectedRecordIds[i];
                try {
                    const response = await fetch(`https://api-creatia.securelayer.com/api/goliath/prefix/${action}/${recordId}`, {
                        method: method,
                        headers: headers,
                        body: method === 'DELETE' && !Object.keys(body).length ? null : JSON.stringify(body)
                    });
                    if (response.ok) {
                        this.submitResults[recordId] = true;
                        successCount++;
                    } else {
                        this.submitResults[recordId] = false;
                        const result = await response.json();
                        this.submitErrors[recordId] = result.detail || '未知错误';
                    }
                } catch (error) {
                    this.submitResults[recordId] = false;
                    this.submitErrors[recordId] = error.message || '网络错误';
                }
                updateProgress(i + 1, totalCount);
            }
            const message = `${actionName}完成: 成功 ${successCount}/${totalCount} 个记录`;
            updateResults(successCount, totalCount, message);
            showErrorList();
            const selectedOwner = document.getElementById('ownerSelect').value;
            // 移除此处的重新筛选，因为这些操作不改变SYN状态，避免不必要的请求
            // await this.filterRecords(selectedOwner);
        }


        createModal(content) {
            if (this.modal) {
                document.body.removeChild(this.modal);
                this.modal = null;
            }
            this.modal = document.createElement('div');
            this.modal.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0,0,0,0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 10000;
            `;
            const modalDialog = document.createElement('div');
            modalDialog.style.cssText = `
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              max-width: 800px;
              width: 90%;
              max-height: 90%;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            `;
            modalDialog.innerHTML = content;
            this.modal.appendChild(modalDialog);
            document.body.appendChild(this.modal);
        }

        closeModal() {
            if (this.modal) {
                document.body.removeChild(this.modal);
                this.modal = null;
            }
        }

        showErrorModal(message) {
            const modalContent = `
              <div style="padding: 40px; text-align: center;">
                <div style="color: #e74c3c; font-size: 18px; margin-bottom: 20px;">错误</div>
                <div style="margin-bottom: 20px;">${message}</div>
                <button onclick="ownerFilterComponent.closeModal()"
                        style="background-color: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                  关闭
                </button>
              </div>
            `;
            this.createModal(modalContent);
        }
    }

    function initComponent() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        window.ownerFilterComponent = new OwnerFilterComponent();
        window.ownerFilterComponent.init();
    }

    initComponent();

})();