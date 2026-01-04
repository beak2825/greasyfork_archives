// ==UserScript==
// @name         油猴5-IMMS原液各检项状态+中键打开
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  获取前N个批号并显示检项状态，抗原检项状态3/5时自动提取数值+温度（格式：数值/温度℃，缺失显示--），中键点击打开
// @author       Your Name
// @match        http://192.168.100.113/pcis/a/index*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536496/%E6%B2%B9%E7%8C%B45-IMMS%E5%8E%9F%E6%B6%B2%E5%90%84%E6%A3%80%E9%A1%B9%E7%8A%B6%E6%80%81%2B%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/536496/%E6%B2%B9%E7%8C%B45-IMMS%E5%8E%9F%E6%B6%B2%E5%90%84%E6%A3%80%E9%A1%B9%E7%8A%B6%E6%80%81%2B%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container = null;
    let batchesVisible = false;
    const ANTIGEN_ITEM_ID = '1405133716198105088'; // 抗原检项唯一标识
    const GET_ITEM_URL = 'http://192.168.100.113/pcis/a/lims/limsRecord/getItem'; // 抗原数值接口

    // 主按钮
    const mainButton = document.createElement('button');
    mainButton.textContent = '近xxxxx批原液';
    mainButton.style.position = 'fixed';
    mainButton.style.width = '130px';
    mainButton.style.top = '86px';
    mainButton.style.left = '798px';
    mainButton.style.zIndex = '3000';
    mainButton.classList.add("effect5");

    // 显示/隐藏切换按钮
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '+';
    toggleButton.style.position = 'fixed';
    toggleButton.style.width = '25px';
    toggleButton.style.height = '25px';
    toggleButton.style.top = '86px';
    toggleButton.style.left = `${parseInt(mainButton.style.left) - 25}px`;
    toggleButton.style.zIndex = '3000';
    toggleButton.classList.add("effect5");
    toggleButton.addEventListener('click', toggleBatches);

    // 数量输入框
    const inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.value = '4';
    inputBox.min = '1';
    inputBox.max = '50';
    inputBox.style.position = 'fixed';
    inputBox.style.top = '86px';
    inputBox.style.left = `${parseInt(mainButton.style.left) + 33}px`;
    inputBox.style.width = '35px';
    inputBox.style.height = '25px';
    inputBox.style.zIndex = '3000';
    inputBox.style.borderRadius = '5px';
    inputBox.style.border = '1px solid #ccc';
    inputBox.style.textAlign = 'center';

    // 检项按钮容器
    const inspectionContainer = document.createElement('div');
    inspectionContainer.style.position = 'fixed';
    inspectionContainer.style.top = '86px';
    inspectionContainer.style.left = `${parseInt(mainButton.style.left) + 130}px`;
    inspectionContainer.style.display = 'flex';
    inspectionContainer.style.flexDirection = 'row';
    inspectionContainer.style.alignItems = 'center';
    inspectionContainer.style.zIndex = '3000';

    // 检项映射表（含宽度配置）
    const inspectionMapping = [
        { id: '0', simplified: '无菌', detailed: '无菌检查', itemId: '1405133052315279360', width: '50px' },
        { id: '1', simplified: 'DNA', detailed: 'Vero细胞DNA残留', itemId: '1405134137935372288', width: '50px' },
        { id: '2', simplified: '蛋白', detailed: '蛋白质含量', itemId: '1405133396415979520', width: '50px' },
        { id: '3', simplified: '抗原', detailed: '抗原含量', itemId: '1405133716198105088', width: '100px' } // 抗原列加宽到100px
    ];

    // 添加检项标题按钮（按映射表设置宽度）
    inspectionMapping.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item.simplified;
        button.style.width = item.width; // 应用自定义宽度
        button.style.height = '25px';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#f0f0f0';
        button.style.cursor = 'default';
        button.style.boxShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        button.style.margin = '0';
        inspectionContainer.appendChild(button);
    });

    // 挂载页面控件
    document.body.appendChild(toggleButton);
    document.body.appendChild(mainButton);
    document.body.appendChild(inputBox);
    document.body.appendChild(inspectionContainer);

    // 切换批号容器显示状态
    function toggleBatches() {
        if (!container) return;
        batchesVisible = !batchesVisible;
        toggleButton.textContent = batchesVisible ? '-' : '+';
        container.style.display = batchesVisible ? 'flex' : 'none';
    }

    // 复制到剪贴板（保持原样）
    function copyToClipboard(text) {
        GM_setClipboard(text);
        const tooltip = document.createElement('div');
        tooltip.textContent = `已复制: ${text}`;
        tooltip.style.cssText = `
            position: fixed;
            padding: 5px 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 3px;
            z-index: 9999;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s;
        `;
        document.body.appendChild(tooltip);
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }, 1000);
    }

    // 获取抗原数值 + 温度（核心修改：缺失显示--）
    function fetchAntigenValueByApi(antigenButton, opStatus) {
        const recordId = antigenButton.dataset.recordId;
        const sampleId = antigenButton.dataset.sampleId;
        const itemId = antigenButton.dataset.itemId;

        const postData = JSON.stringify({
            recordId: recordId,
            allowSign: false,
            sampleId: sampleId,
            itemId: itemId
        });

        GM_xmlhttpRequest({
            method: 'POST',
            url: GET_ITEM_URL,
            data: postData,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie,
                'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function(response) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    const data = jsonResponse.data || {};
                    let antigenValue = '--'; // 默认缺失显示--
                    let temperatureValue = '--'; // 默认缺失显示--

                    // 提取抗原数值（sk_sk2num_166）：有效数值则替换，否则保持--
                    if (
                        data.steps && Array.isArray(data.steps) && data.steps.length > 0 &&
                        data.steps[0].value && typeof data.steps[0].value === 'object' &&
                        data.steps[0].value.data &&
                        data.steps[0].value.data.sk_sk2num_166 &&
                        typeof data.steps[0].value.data.sk_sk2num_166.value === 'string' &&
                        !isNaN(parseFloat(data.steps[0].value.data.sk_sk2num_166.value.trim()))
                    ) {
                        antigenValue = data.steps[0].value.data.sk_sk2num_166.value.trim();
                    }

                    // 提取温度数值（sk2num_987，环境温度）：有效数值则替换，否则保持--
                    if (
                        data.steps && Array.isArray(data.steps) && data.steps.length > 0 &&
                        data.steps[0].value && typeof data.steps[0].value === 'object' &&
                        data.steps[0].value.data &&
                        data.steps[0].value.data.sk2num_987 && // 温度字段标识
                        typeof data.steps[0].value.data.sk2num_987.value === 'string' &&
                        !isNaN(parseFloat(data.steps[0].value.data.sk2num_987.value.trim()))
                    ) {
                        temperatureValue = data.steps[0].value.data.sk2num_987.value.trim();
                    }

                    // 格式化显示：数值/温度℃（缺失时显示--）
                    const displayText = `${antigenValue}/${temperatureValue}℃`;

                    // 更新按钮显示和样式
                    antigenButton.textContent = displayText;
                    antigenButton.style.backgroundColor = opStatus === '3' ? '#ffe082' : '#a5d6a7';

                } catch (error) {
                    console.error('解析抗原+温度数值失败:', error);
                    antigenButton.textContent = '--/--℃'; // 异常时显示双--
                    antigenButton.style.backgroundColor = opStatus === '3' ? '#ffe082' : '#a5d6a7';
                }
            },
            onerror: function(error) {
                console.error('请求抗原接口失败:', error);
                antigenButton.textContent = '--/--℃'; // 超时/失败时显示双--
                antigenButton.style.backgroundColor = opStatus === '3' ? '#ffe082' : '#a5d6a7';
            }
        });
    }

    // 获取原液列表（保持原样，抗原按钮宽度100px）
    function sendPostRequest(n) {
        const count = Math.min(parseInt(n), 50);

        const url = 'http://192.168.100.113/pcis/a/lims/sampling/limsTestOrderManual/listData';
        const data = 'reqOrgOffice.officeName=%E7%8B%82%E7%8A%AC%E7%96%AB%E8%8B%97%E5%8E%9F%E6%B6%B2%E8%BD%A6%E9%97%B4&reqOrg=SDJN01001&materielName=%E5%8E%9F%E6%B6%B2&pageNo=1&pageSize=50&orderBy=a.req_date+desc';
        const head = { 'Content-Type': 'application/x-www-form-urlencoded' };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: data,
            headers: head,
            onload: function(response) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    if (jsonResponse && jsonResponse.list && Array.isArray(jsonResponse.list)) {
                        const items = jsonResponse.list.slice(0, count);

                        if (container) document.body.removeChild(container);

                        container = document.createElement('div');
                        container.style.position = 'fixed';
                        container.style.top = `${parseInt(mainButton.style.top) + 25}px`;
                        container.style.left = mainButton.style.left;
                        container.style.zIndex = '3000';
                        container.style.display = 'flex';
                        container.style.flexDirection = 'column';

                        batchesVisible = true;
                        toggleButton.textContent = '-';

                        items.forEach(item => {
                            const batchRow = document.createElement('div');
                            batchRow.style.display = 'flex';
                            batchRow.style.alignItems = 'center';

                            // 批号按钮
                            const batchText = document.createElement('button');
                            batchText.textContent = item.ownBatch;
                            batchText.classList.add("effect5");
                            batchText.style.width = '130px';
                            batchText.disabled = false;
                            batchText.addEventListener('click', () => copyToClipboard(item.ownBatch + '原液'));
                            batchRow.appendChild(batchText);

                            // 检项状态按钮（按映射表设置宽度）
                            const statusButtons = [];
                            inspectionMapping.forEach(mappingItem => {
                                const statusButton = document.createElement('button');
                                statusButton.textContent = '加载';
                                statusButton.classList.add('status-btn');
                                statusButton.style.width = mappingItem.width; // 应用自定义宽度（抗原100px）
                                statusButton.style.height = '25px';
                                statusButton.style.backgroundColor = '#eaeaea';
                                statusButton.dataset.batch = item.ownBatch;
                                statusButton.dataset.itemId = mappingItem.itemId;
                                statusButton.dataset.id = item.id;
                                statusButton.dataset.recordId = item.id;
                                statusButton.dataset.sampleId = '';

                                // 中键打开详情
                                statusButton.addEventListener('mouseup', (event) => {
                                    if (event.button === 1) {
                                        const button = event.currentTarget;
                                        window.open(`http://192.168.100.113/pcis/a/dist/index.html#/lims/show?readonly=false&id=${button.dataset.id}&itemId=${button.dataset.itemId}`);
                                    }
                                });

                                statusButtons.push(statusButton);
                                batchRow.appendChild(statusButton);
                            });

                            container.appendChild(batchRow);
                            fetchInspectionStatus(item, statusButtons);
                        });

                        document.body.appendChild(container);
                    }
                } catch (error) {
                    console.error('解析JSON失败:', error);
                    alert('解析JSON失败');
                }
            },
            onerror: function(response) {
                console.error('请求失败:', response);
                alert('请求失败');
            }
        });
    }

    // 获取检项状态（保持原样）
    function fetchInspectionStatus(item, statusButtons) {
        const id = item.id;
        const url = 'http://192.168.100.113/pcis/a/lims/inspectiontask/listData';
        const data = `inspectionId=${id}&inspectionItem=&startTimeRange=&_search=false&pageSize=-1&pageNo=1&orderBy=&sord=asc`;
        const head = { 'Content-Type': 'application/x-www-form-urlencoded' };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: data,
            headers: head,
            onload: function(response) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    const itemMapping = {};
                    inspectionMapping.forEach((item, index) => {
                        itemMapping[item.detailed] = index;
                    });

                    // 提取sampleId
                    let sampleId = '';
                    if (jsonResponse.list && Array.isArray(jsonResponse.list) && jsonResponse.list.length > 0) {
                        const firstRow = jsonResponse.list[0];
                        sampleId = firstRow.sampleId || firstRow.sampleNo || firstRow.sampleIdStr || firstRow.sample_id || firstRow.sampId || '';
                    }

                    if (jsonResponse.list && Array.isArray(jsonResponse.list)) {
                        jsonResponse.list.forEach(row => {
                            const itemName = row.inspectionItem;
                            const opStatus = row.opStatus;

                            if (itemName in itemMapping) {
                                const index = itemMapping[itemName];
                                const button = statusButtons[index];

                                if (button) {
                                    // 非抗原检项
                                    if (button.dataset.itemId !== ANTIGEN_ITEM_ID) {
                                        button.textContent = opStatus || '未知';
                                        button.style.backgroundColor = getOpStatusColor(opStatus);
                                    }
                                    // 抗原检项：状态3或5时提取数值+温度
                                    else if (opStatus === '5' || opStatus === '3') {
                                        button.dataset.sampleId = sampleId;
                                        if (sampleId) {
                                            button.textContent = '获取中';
                                            button.style.backgroundColor = opStatus === '3' ? '#ffe082' : '#a5d6a7';
                                            fetchAntigenValueByApi(button, opStatus);
                                        } else {
                                            button.textContent = '--/--℃'; // 无样本ID时显示双--
                                            button.style.backgroundColor = opStatus === '3' ? '#ffe082' : '#a5d6a7';
                                        }
                                    }
                                    // 抗原检项其他状态
                                    else {
                                        button.textContent = opStatus || '未知';
                                        button.style.backgroundColor = getOpStatusColor(opStatus);
                                    }
                                }
                            }
                        });
                    }
                } catch (error) {
                    console.error(`解析ID ${id}的数据失败：`, error);
                }
            },
            onerror: function(response) {
                console.error(`请求ID ${id}的数据失败:`, response);
            }
        });
    }

    // 状态颜色映射（保持原样）
    function getOpStatusColor(opStatus) {
        switch (opStatus) {
            case '5': return '#a5d6a7'; // 绿色
            case '3': return '#ffe082'; // 黄色
            case '1': return '#eaeaea'; // 灰色
            default: return '#eaeaea'; // 默认灰色
        }
    }

    // 主按钮点击事件（保持原样）
    mainButton.addEventListener('click', () => {
        const n = inputBox.value;
        if (!n || isNaN(n) || parseInt(n) <= 0) {
            alert('请输入有效的数量');
            return;
        }
        sendPostRequest(n);
    });

    // 自定义样式（保持原样）
    const style = document.createElement('style');
    style.textContent = `
        .effect5 {
            cursor: pointer;
            width: auto;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid pink;
            border-radius: 5px;
            box-shadow: 2px 2px 2px rgba(255,192,203,.4);
            background-color:rgba(250, 235, 235,1);
            padding: 0 10px;
        }
        .status-btn {
            height: 25px;
            border-radius: 5px;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            margin: 0;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden; /* 防止文本溢出 */
            text-overflow: ellipsis; /* 溢出时显示省略号 */
            white-space: nowrap; /* 禁止换行 */
        }
    `;
    document.head.appendChild(style);
})();