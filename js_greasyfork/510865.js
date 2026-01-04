// ==UserScript==
// @name         Welocalize Offer Tool
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  check and download offers from welocalize, with collapsible catBreakDown and reordered columns
// @match        https://junction.welocalize.com/vendor-portal/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510865/Welocalize%20Offer%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/510865/Welocalize%20Offer%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取认证令牌的函数
    function getTokens() {
        const apiKey = unsafeWindow.API_KEY;
        const jwtToken = unsafeWindow.jwt;
        return { apiKey, jwtToken };
    }

    // 检查更新
    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/510865/Welocalize%20Offer%20Tool.meta.js",
            onload: function (response) {
                const latestVersion = /@version\s+([0-9.]+)/.exec(response.responseText)[1];
                const currentVersion = GM_info.script.version;
                if (latestVersion > currentVersion) {
                    alert("Welocalize Offer Tool 有新版本可用: " + latestVersion + "\n请点击OK更新");
                    window.location.href = "https://greasyfork.org/en/scripts/510865-welocalize-offer-tool";
                }
            },
            onerror: function (error) {
                console.error('Error checking for updates:', error);
            }
        });
    }

    GM_addStyle(`
        #offerViewerContainer {
            position: fixed;
            top: 50px;
            right: 60px;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
            background: #ffffff;
            color: #333333;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        #contentContainer {
            position: relative;
            height: calc(100vh - 150px);
            overflow-y: auto;
        }
        #offerViewerContainer.expanded {
            width: 90%;
            max-width: none;
        }
        #offerViewerContainer table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border: 1px solid #e0e0e0;
            margin-top: 10px;
            font-size: 12px;
        }
        #offerViewerContainer th, #offerViewerContainer td {
            border: 1px solid #e0e0e0;
            padding: 6px;
            text-align: left;
        }
        #offerViewerContainer th {
            background-color: #f5f5f5;
            font-weight: bold;
            color: #333333;
        }
        #offerViewerContainer tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        #buttonContainer {
            position: sticky;
            top: 0;
            background: white;
            z-index: 1000;
            padding: 10px 0;
            margin-bottom: 15px;
        }
        #buttonContainer button, #expandButton, #collapseButton, #toggleCatBreakdownBtn {
            padding: 8px 12px;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
            color: #333333;
            background-color: #f0f0f0;
            transition: background-color 0.3s ease;
        }
        #buttonContainer button:hover, #expandButton:hover, #collapseButton:hover, #toggleCatBreakdownBtn:hover {
            background-color: #e0e0e0;
        }
        #progressBar {
            width: 100%;
            margin-bottom: 15px;
            border-radius: 4px;
            overflow: hidden;
            background-color: #f0f0f0;
        }
        #progressBar .progress {
            width: 0%;
            height: 24px;
            text-align: center;
            line-height: 24px;
            font-weight: bold;
            color: #333333;
            background-color: #e0e0e0;
            transition: width 0.3s ease;
        }
        .hidden-column {
            display: none;
        }
        #toggleCatBreakdownBtn {
            margin-bottom: 10px;
        }
        .expand-column {
            max-width: 0;
            opacity: 0;
            transition: max-width 0.5s ease, opacity 0.5s ease;
            overflow: hidden;
            white-space: nowrap;
        }
        .expand-column.expanded {
            max-width: 200px;
            opacity: 1;
        }
    `);


    // 发送 API 请求
    function sendRequest(url) {
        const { apiKey, jwtToken } = getTokens();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "accept": "*/*",
                    "content-type": "application/json",
                    "x-api-key": apiKey,
                    "x-pantheon-auth": jwtToken
                },
                onload: function (response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject('请求失败: ' + response.statusText);
                    }
                },
                onerror: function (error) {
                    reject('请求错误: ' + error);
                }
            });
        });
    }

    // 获取所有报价数据，增加分页支持
    async function fetchAllOffers(updateProgress) {
        const baseUrls = [
            "https://hypnos.welocalize.tools/v2/offer/me?%24limit=25&%24offset=0&%24order_by=dueDate&%24order_dir=desc",
            "https://hypnos.welocalize.tools/v2/offer/available?%24limit=25&%24offset=0&%24order_by=dueDate&%24order_dir=desc"
        ];

        try {
            updateProgress(0, '正在初始化...');
            let allOffers = [];

            for (const baseUrl of baseUrls) {
                // 获取第一页数据
                const firstPage = await sendRequest(baseUrl);
                const totalCount = firstPage.meta.count;
                const limit = 25;
                const totalPages = Math.ceil(totalCount / limit);

                // 生成所有分页URL
                const pageUrls = [];
                for (let offset = 0; offset < totalCount; offset += limit) {
                    const newUrl = baseUrl.replace(/%24offset=\d+/, `%24offset=${offset}`);
                    pageUrls.push(newUrl);
                }

                // 获取所有分页数据
                updateProgress(10, `正在获取${baseUrl.includes('/me?') ? '我的' : '可用'}报价 (0/${totalPages})...`);
                const responses = await Promise.all(pageUrls.map((url, index) =>
                    sendRequest(url).then(res => {
                        updateProgress(10 + (40 * (index + 1) / pageUrls.length),
                            `正在获取${baseUrl.includes('/me?') ? '我的' : '可用'}报价 (${index + 1}/${totalPages})...`);
                        return res;
                    })
                ));
                allOffers = allOffers.concat(responses.flatMap(r => r.data));
            }

            // 获取详细信息
            updateProgress(50, '正在获取详细信息...');
            const detailedOffers = await Promise.all(allOffers.map((offer, index) =>
                sendRequest(`https://hypnos.welocalize.tools/v1/task/${offer.taskId}?%24include=parentSequence%2Cproject%2CtaskDetails%2CclientServiceItem`)
                    .then(details => {
                        const progress = 50 + ((index + 1) / allOffers.length * 50);
                        updateProgress(progress, `正在处理 ${index + 1}/${allOffers.length}`);
                        return { ...offer, details };
                    })
            ));

            updateProgress(100, '数据获取完成');
            return detailedOffers;
        } catch (error) {
            console.error('error fetching offers', error);
            alert('获取报价失败，请联系IT部门');
            return [];
        }
    }

    function displayOffers(offers) {
        offers.sort((a, b) => a.projectName.localeCompare(b.projectName));

        const tableContainer = document.getElementById('offerTableContainer');
        let tableHTML = '<button id="toggleCatBreakdownBtn">显示 Polyglot CAT 明细</button>';
        tableHTML += '<table><thead><tr>';

        // Fixed columns
        const fixedColumns = [
            'No.',
            'Task',
            'Project Name',
            'Target Language',
            'Due Date',
            'Project Reference ID'
        ];

        // Add fixed columns first
        fixedColumns.forEach(column => {
            tableHTML += `<th>${column}</th>`;
        });

        // Get all unique catBreakDown names
        const catBreakDownNames = new Set();
        offers.forEach(offer => {
            if (offer.details.meta && offer.details.meta.catBreakDown) {
                offer.details.meta.catBreakDown.forEach(breakdown => {
                    breakdown.breakDowns.forEach((item, index) => {
                        if (index === 0) {
                            catBreakDownNames.add(item.name);
                        } else {
                            catBreakDownNames.add(item.name + '_hidden');
                        }
                    });
                });
            }
        });

        // Add catBreakDown columns
        catBreakDownNames.forEach(name => {
            const className = name.endsWith('_hidden') ? 'class="expand-column"' : '';
            tableHTML += `<th ${className}>${name.replace('_hidden', '')}</th>`;
        });

        // Predefined label order
        const orderedLabels = ['New Words', '75% Match', '85% Match', '95% Match', '100% Match', 'Repetitions', 'Machine Translated', 'ICE Match'];

        // Get all unique taskDetails labels
        const allLabels = new Set();
        offers.forEach(offer => {
            offer.details.data.taskDetails.forEach(detail => {
                allLabels.add(detail.label);
            });
        });

        // Add predefined labels
        orderedLabels.forEach(label => {
            if (allLabels.has(label)) {
                tableHTML += `<th>${label}</th>`;
                allLabels.delete(label);
            }
        });

        // Add remaining labels
        allLabels.forEach(label => {
            tableHTML += `<th>${label}</th>`;
        });

        tableHTML += '</tr></thead><tbody>';

        offers.forEach((offer, index) => {
            tableHTML += '<tr>';

            // Add fixed column data first
            tableHTML += `
                <td>${index + 1}</td>
                <td>${offer.taskLabel}</td>
                <td>${offer.projectName}</td>
                <td>${offer.targetLocale}</td>
                <td>${new Date(offer.dueDate).toLocaleString()}</td>
                <td>${offer.clientRefId}</td>
            `;

            // Add catBreakDown data
            catBreakDownNames.forEach(name => {
                let value = '';
                if (offer.details.meta && offer.details.meta.catBreakDown) {
                    offer.details.meta.catBreakDown.forEach(breakdown => {
                        const itemName = name.replace('_hidden', '');
                        const item = breakdown.breakDowns.find(i => i.name === itemName);
                        if (item) {
                            value = item.quantity;
                        }
                    });
                }
                const className = name.endsWith('_hidden') ? 'class="expand-column"' : '';
                tableHTML += `<td ${className}>${value}</td>`;
            });

            // Add taskDetails data
            orderedLabels.forEach(label => {
                const detail = offer.details.data.taskDetails.find(d => d.label === label);
                const value = detail ? detail.unitQuantity : '';
                tableHTML += `<td>${value}</td>`;
            });

            // Add remaining taskDetails data
            allLabels.forEach(label => {
                const detail = offer.details.data.taskDetails.find(d => d.label === label);
                const value = detail ? detail.unitQuantity : '';
                tableHTML += `<td>${value}</td>`;
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        tableHTML += `<p>总报价数：${offers.length}</p>`;
        tableContainer.innerHTML = tableHTML;

        // Add event listener for the toggle button
        document.getElementById('toggleCatBreakdownBtn').addEventListener('click', toggleCatBreakdown);
    }

    // 导出到 Excel
    function exportToExcel() {
        const table = document.querySelector('#offerTableContainer table');
        const wb = XLSX.utils.table_to_book(table, { sheet: "offers" });
        XLSX.writeFile(wb, 'welocalize_offers.xlsx');
    }

    // 更新进度条
    function updateProgress(percentage, message) {
        const progressBar = document.getElementById('progressBar');
        const progress = progressBar.querySelector('.progress');
        progress.style.width = `${percentage}%`;
        progress.textContent = message;
    }

    function toggleCatBreakdown() {
        const hiddenColumns = document.querySelectorAll('.expand-column');
        const button = document.getElementById('toggleCatBreakdownBtn');
        if (button.textContent === '显示 Polyglot CAT 明细') {
            hiddenColumns.forEach(column => {
                column.classList.add('expanded');
            });
            button.textContent = '隐藏 Polyglot CAT 明细';
        } else {
            hiddenColumns.forEach(column => {
                column.classList.remove('expanded');
            });
            button.textContent = '显示 Polyglot CAT 明细';
        }
    }

    // 主函数
    async function main() {
        try {
            document.getElementById('offerTableContainer').innerHTML = '';
            const offers = await fetchAllOffers(updateProgress);
            displayOffers(offers);
        } catch (error) {
            console.error('Error:', error);
            alert('Error running script, please contact IT');
        }
    }

    // 创建 UI 元素
    function createUI() {
        const container = document.createElement('div');
        container.id = 'offerViewerContainer';
        container.innerHTML = `
            <button id="expandButton">展开操作界面</button>
            <div id="contentContainer" style="display: none;">
                <div id="buttonContainer">
                    <button id="fetchOffersButton">获取数据</button>
                    <button id="exportButton">导出到 Excel</button>
                    <button id="collapseButton">收起操作界面</button>
                </div>
                <div id="progressBar"><div class="progress"></div></div>
                <div id="offerTableContainer"></div>
            </div>
        `;
        document.body.appendChild(container);

        // 添加事件监听器
        document.getElementById('expandButton').addEventListener('click', () => {
            document.getElementById('expandButton').style.display = 'none';
            document.getElementById('contentContainer').style.display = 'block';
        });
        document.getElementById('collapseButton').addEventListener('click', () => {
            document.getElementById('expandButton').style.display = 'block';
            document.getElementById('contentContainer').style.display = 'none';
        });
        document.getElementById('fetchOffersButton').addEventListener('click', main);
        document.getElementById('exportButton').addEventListener('click', exportToExcel);
    }

    // 页面加载后初始化脚本
    window.addEventListener('load', createUI);
    checkForUpdates();
})();