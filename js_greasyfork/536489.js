// ==UserScript==
// @name         油猴1-IMMS成品各检项状态+中键打开
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  获取前N个批号并显示检项状态，中键点击打开
// @author       Your Name
// @match        http://192.168.100.113/pcis/a/index*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536489/%E6%B2%B9%E7%8C%B41-IMMS%E6%88%90%E5%93%81%E5%90%84%E6%A3%80%E9%A1%B9%E7%8A%B6%E6%80%81%2B%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/536489/%E6%B2%B9%E7%8C%B41-IMMS%E6%88%90%E5%93%81%E5%90%84%E6%A3%80%E9%A1%B9%E7%8A%B6%E6%80%81%2B%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container = null;
    // 记录当前批号行的显示状态
    let batchesVisible = false;

    // 主按钮
    const mainButton = document.createElement('button');
    mainButton.textContent = '近xxxxx批成品';
    mainButton.style.position = 'fixed';
    mainButton.style.width = '130px';
    mainButton.style.top = '86px';
    mainButton.style.left = '40px';
    mainButton.style.zIndex = '3000';
    mainButton.classList.add("effect1");

    // 添加切换按钮（+/-）
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '+'; // 初始状态为+（批号未显示）
    toggleButton.style.position = 'fixed';
    toggleButton.style.width = '25px';
    toggleButton.style.height = '25px';
    toggleButton.style.top = '86px';
    toggleButton.style.left = `${parseInt(mainButton.style.left) - 25}px`;
    toggleButton.style.zIndex = '3000';
    toggleButton.classList.add("effect1");
    toggleButton.addEventListener('click', toggleBatches);

    // 数量输入框
    const inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.value = '15'; // 默认显示15
    inputBox.min = '1';
    inputBox.max = '50'; // 最多支持50批
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

    // 检项映射表（含 itemId）
    const inspectionMapping = [
        { id: '0', simplified: '鉴别', detailed: '鉴别试验', itemId: '00710' },
        { id: '1', simplified: '外观', detailed: '外观', itemId: '00711' },
        { id: '2', simplified: '渗透', detailed: '渗透压摩尔浓度', itemId: '00712' },
        { id: '3', simplified: 'pH值', detailed: 'pH值', itemId: '00713' },
        { id: '4', simplified: '水分', detailed: '水分', itemId: '00714' },
        { id: '5', simplified: '效价', detailed: '效价测定', itemId: '00715' },
        { id: '6', simplified: '热稳', detailed: '热稳定性试验', itemId: '00716' },
        { id: '7', simplified: '牛残', detailed: '牛血清白蛋白残留量', itemId: '00717' },
        { id: '8', simplified: '蛋残', detailed: 'Vero细胞蛋白质残留量', itemId: '00718' },
        { id: '9', simplified: '无菌', detailed: '无菌检查', itemId: '00719' },
        { id: '10', simplified: '异毒', detailed: '异常毒性检查', itemId: '00720' },
        { id: '11', simplified: '内毒', detailed: '细菌内毒素检查', itemId: '00721' }
    ];

    // 添加检项按钮
    inspectionMapping.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item.simplified;
        button.style.width = '50px';
        button.style.height = '25px';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#f0f0f0';
        button.style.cursor = 'default';
        button.style.boxShadow = '1px 1px 2px rgba(0, 0, 0, 0.1)';
        button.style.margin = '0';
        inspectionContainer.appendChild(button);
    });

    // 将控件加入页面
    document.body.appendChild(toggleButton);
    document.body.appendChild(mainButton);
    document.body.appendChild(inputBox);
    document.body.appendChild(inspectionContainer);

    // 切换批号行显示状态的函数（包括批号和所有按钮）
    function toggleBatches() {
        if (!container) return; // 没有数据时不执行

        batchesVisible = !batchesVisible;
        toggleButton.textContent = batchesVisible ? '-' : '+';

        // 显示或隐藏整个批号容器
        container.style.display = batchesVisible ? 'flex' : 'none';
    }

    // 复制功能函数
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

    function sendPostRequest(n) {
        const count = Math.min(parseInt(n), 50); // 最大不超过50

        const url = 'http://192.168.100.113/pcis/a/lims/sampling/limsTestOrderManual/listData';
        const data = 'reqCode=vp&pageNo=1&pageSize=50&reqOrgOffice.officeName=%E7%8B%82%E7%8A%AC%E8%8B%97%E5%88%B6%E5%89%82%E8%BD%A6%E9%97%B4&reqOrg=SDJN01002&orderBy=a.own_batch+desc';
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
                        const items = jsonResponse.list.slice(0, count); // 使用输入的数量

                        if (container) {
                            document.body.removeChild(container);
                        }

                        container = document.createElement('div');
                        container.style.position = 'fixed';
                        container.style.top = `${parseInt(mainButton.style.top) + 25}px`;
                        container.style.left = mainButton.style.left;
                        container.style.zIndex = '3000';
                        container.style.display = 'flex'; // 初始显示
                        container.style.flexDirection = 'column';

                        // 刷新后设置批号为显示状态
                        batchesVisible = true;
                        toggleButton.textContent = '-';

                        items.forEach(item => {
                            const batchRow = document.createElement('div');
                            batchRow.style.display = 'flex';
                            batchRow.style.alignItems = 'center';

                            // 批号按钮（可点击复制）
                            const batchText = document.createElement('button');
                            batchText.textContent = item.ownBatch;
                            batchText.classList.add("effect1");
                            batchText.style.width = '130px';
                            batchText.disabled = false; // 启用按钮以响应点击
                            batchText.addEventListener('click', function() {
                                copyToClipboard(item.ownBatch);
                            });
                            batchRow.appendChild(batchText);

                            // 状态按钮
                            const statusButtons = [];
                            inspectionMapping.forEach((mappingItem, index) => {
                                const statusButton = document.createElement('button');
                                statusButton.textContent = '加载';
                                statusButton.classList.add('status-btn');
                                statusButton.style.width = '50px';
                                statusButton.style.height = '25px';
                                statusButton.style.backgroundColor = '#eaeaea';
                                statusButton.dataset.batch = item.ownBatch;
                                statusButton.dataset.itemId = mappingItem.itemId;
                                statusButton.dataset.id = item.id;

                                // 绑定中键点击事件
                                statusButton.addEventListener('mouseup', function(event) {
                                    if (event.button === 1) { // 中键点击
                                        const itemId = this.dataset.itemId;
                                        window.open(`http://192.168.100.113/pcis/a/dist/index.html#/lims/show?readonly=false&id=${this.dataset.id}&itemId=${itemId}`);
                                    }
                                });

                                statusButtons.push(statusButton);
                                batchRow.appendChild(statusButton);
                            });

                            container.appendChild(batchRow);

                            // 请求检项状态
                            fetchInspectionStatus(item.id, statusButtons);
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

    function fetchInspectionStatus(id, statusButtons) {
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

                    if (jsonResponse.list && Array.isArray(jsonResponse.list)) {
                        jsonResponse.list.forEach(row => {
                            const itemName = row.inspectionItem;
                            const opStatus = row.opStatus;

                            if (itemName in itemMapping) {
                                const index = itemMapping[itemName];
                                if (statusButtons[index]) {
                                    statusButtons[index].textContent = opStatus || '未知';
                                    statusButtons[index].style.backgroundColor = getOpStatusColor(opStatus);
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

    function getOpStatusColor(opStatus) {
        switch (opStatus) {
            case '5':
                return '#a5d6a7'; // 绿色
            case '3':
                return '#ffe082'; // 黄色
            case '1':
                return '#eaeaea'; // 红色
            default:
                return '#eaeaea'; // 默认灰色
        }
    }

    // 点击主按钮触发查询
    mainButton.addEventListener('click', () => {
        const n = inputBox.value;
        if (!n || isNaN(n) || parseInt(n) <= 0) {
            alert('请输入有效的数量');
            return;
        }
        sendPostRequest(n);
    });

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .effect1 {
            cursor: pointer;
            width: auto; /* 自动宽度 */
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid pink;
            border-radius: 5px;
            box-shadow: 2px 2px 2px rgba(255,192,203,.4);
            background-color:rgba(250, 235, 235,1);
            padding: 0 10px; /* 增加一些内边距 */
        }
        .status-btn {
            width: 50px;
            height: 25px;
            border-radius: 5px;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            margin: 0;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;
    document.head.appendChild(style);
})();