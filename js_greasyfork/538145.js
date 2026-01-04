// ==UserScript==
// @name         诚誉智瑞管理
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  深度分析数据，导出表格，方便使用
// @author       Bor1s
// @match        https://os.chengyuzhirui.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/538145/%E8%AF%9A%E8%AA%89%E6%99%BA%E7%91%9E%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/538145/%E8%AF%9A%E8%AA%89%E6%99%BA%E7%91%9E%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
    // 创建主按钮
    const mainButton = document.createElement('button');
    mainButton.textContent = '数据获取';
    mainButton.style.position = 'fixed';
    mainButton.style.bottom = '20px';
    mainButton.style.right = '20px';
    mainButton.style.zIndex = '9999';
    mainButton.style.padding = '10px 15px';
    mainButton.style.backgroundColor = '#4CAF50';
    mainButton.style.color = 'white';
    mainButton.style.border = 'none';
    mainButton.style.borderRadius = '5px';
    mainButton.style.cursor = 'pointer';
    document.body.appendChild(mainButton);
 
    // 创建弹出框
    const popup = document.createElement('div');
    popup.style.display = 'none';
    popup.style.position = 'fixed';
    popup.style.bottom = '70px';
    popup.style.right = '20px';
    popup.style.width = '400px';
    popup.style.maxHeight = '200px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '5px';
    popup.style.padding = '15px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    popup.style.zIndex = '9998';
    popup.style.overflow = 'auto';
    document.body.appendChild(popup);
 
    // 创建控制按钮容器
    const controlButtons = document.createElement('div');
    controlButtons.style.display = 'flex';
    //controlButtons.style.justifyContent = 'center';
    controlButtons.style.marginBottom = '15px';
    popup.appendChild(controlButtons);
 
    // 创建开始按钮
    const startButton = document.createElement('button');
    startButton.textContent = '开始';
    startButton.style.padding = '8px 15px';
    startButton.style.margin = '10px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    controlButtons.appendChild(startButton);
 
    // 创建暂停按钮
    const pauseButton = document.createElement('button');
    pauseButton.textContent = '暂停';
    pauseButton.style.padding = '8px 15px';
    pauseButton.style.margin = '10px';
    pauseButton.style.backgroundColor = '#f39c12';
    pauseButton.style.color = 'white';
    pauseButton.style.border = 'none';
    pauseButton.style.borderRadius = '5px';
    pauseButton.style.cursor = 'pointer';
    pauseButton.disabled = true;
    controlButtons.appendChild(pauseButton);
 
    // 创建导出按钮
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出';
    exportButton.style.padding = '8px 15px';
    exportButton.style.backgroundColor = '#3498db';
    exportButton.style.color = 'white';
    exportButton.style.margin = '10px';
    exportButton.style.border = 'none';
    exportButton.style.borderRadius = '5px';
    exportButton.style.cursor = 'pointer';
    exportButton.disabled = true;
    controlButtons.appendChild(exportButton);
 
    // 创建进度条
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '98%';
    progressContainer.style.height = '20px';
    progressContainer.style.backgroundColor = '#f1f1f1';
    progressContainer.style.borderRadius = '10px';
    progressContainer.style.marginBottom = '15px';
    popup.appendChild(progressContainer);
 
    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#4CAF50';
    progressBar.style.borderRadius = '10px';
    progressBar.style.transition = 'width 0.3s';
    progressContainer.appendChild(progressBar);
 
    // 创建数据列表
    const dataList = document.createElement('div');
    dataList.style.width = '100%';
    dataList.style.maxHeight = '300px';
    dataList.style.overflow = 'auto';
    dataList.style.border = '1px solid #ddd';
    dataList.style.borderRadius = '5px';
    dataList.style.padding = '10px';
    //popup.appendChild(dataList);
 
    // 创建状态信息
    const statusInfo = document.createElement('div');
    statusInfo.style.marginTop = '10px';
    statusInfo.style.fontSize = '12px';
    statusInfo.style.color = '#666';
    popup.appendChild(statusInfo);
 
    // 存储数据
    let allData = [];
    let isRunning = false;
    let currentPage = 1;
    let totalPages = 0;
    let currentIndex = 0;
 
    // 主按钮点击事件
    mainButton.addEventListener('click', function() {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });
 
    // 开始按钮点击事件
    startButton.addEventListener('click', function() {
        if (isRunning) return;
 
        isRunning = true;
        startButton.disabled = true;
        pauseButton.disabled = false;
        exportButton.disabled = true;
        allData = [];
        currentPage = 1;
        totalPages = 0;
        currentIndex = 0;
        //dataList.innerHTML = '';
        statusInfo.textContent = '正在获取数据...';
 
        fetchFirstPage();
    });
 
    // 暂停按钮点击事件
    pauseButton.addEventListener('click', function() {
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
        statusInfo.textContent = '已暂停';
    });
 
    // 导出按钮点击事件
    exportButton.addEventListener('click', function() {
        exportToExcel();
    });
 
    // 获取第一页数据
    function fetchFirstPage() {
        const token = JSON.parse(localStorage.token);
 
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://server.chengyuzhirui.com/osapi/Cases/casesSelf?page=1&perPage=10&case_status=0&list_type=2',
            url: 'https://server.chengyuzhirui.com/osapi/Cases/casesSelf?page=1&perPage=100&case_status=0&list_type=2',
            headers: {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'token': token,
                'x-requested-with': 'XMLHttpRequest'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    totalPages = data.data.pages;
                    processPageData(data.data.data);
 
                    if (currentPage < totalPages && isRunning) {
                        currentPage++;
                        //fetchAdditionalInfo();
                        fetchNextPage();
                    } else {
                        fetchAdditionalInfo();
                    }
                } else {
                    handleError(response);
                }
            },
            onerror: handleError
        });
    }
 
    // 获取下一页数据
    function fetchNextPage() {
        const token = JSON.parse(localStorage.token);
 
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://server.chengyuzhirui.com/osapi/Cases/casesSelf?page=${currentPage}&perPage=100&case_status=0&list_type=2`,
            headers: {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'token': token,
                'x-requested-with': 'XMLHttpRequest'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    processPageData(data.data.data);
 
                    // 更新进度
                    progressBar.style.width = `${((currentPage - 1) / totalPages) * 100}%`;
                    statusInfo.textContent = `正在获取基础数据: 第 ${currentPage} 页/共 ${totalPages} 页`;
 
                    if (currentPage < totalPages && isRunning) {
                        currentPage++;
                        fetchNextPage();
                    } else {
                        fetchAdditionalInfo();
                    }
                } else {
                    handleError(response);
                }
            },
            onerror: handleError
        });
    }
 
    // 处理页面数据
    function processPageData(pageData) {
        pageData.forEach(item => {
            allData.push({
                id: item.id,
                case_name: item.case_name,
                case_idcard: item.case_idcard,
                overdue_days: item.overdue_days,
                last_capital: item.last_capital,
                amount_payable: item.amount_payable,
                case_phone: item.case_phone,
                last_repay_time: formatDate(item.last_repay_time),
                address: '',
                thirdPartyContacts: ''
            });
        });
 
        // 更新列表显示
        //updateDataList();
    }
 
    // 获取额外信息（地址和第三方联系人）
    function fetchAdditionalInfo() {
        if (currentIndex >= allData.length) {
            finishFetching();
            return;
        }
 
        const item = allData[currentIndex];
        const token = JSON.parse(localStorage.token);
 
        // 获取地址信息
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://server.chengyuzhirui.com/osapi/Cases/caseInfo?case_id=${item.id}`,
            headers: {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'token': token,
                'x-requested-with': 'XMLHttpRequest'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    item.address = data.data.data.company_address;
                    // console.log(item.address)
                    // console.log(allData)
 
                    // 获取第三方联系人信息
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://server.chengyuzhirui.com/osapi/Overdue/contacts?is_page=0&case_id=${item.id}`,
                        headers: {
                            'accept': '*/*',
                            'accept-language': 'zh-CN,zh;q=0.9',
                            'cache-control': 'no-cache',
                            'pragma': 'no-cache',
                            'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
                            'sec-ch-ua-mobile': '?0',
                            'sec-ch-ua-platform': '"Windows"',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-site',
                            'token': token,
                            'x-requested-with': 'XMLHttpRequest'
                        },
                        onload: function(response) {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                const contacts = data.data.map(contact => `${contact.contacts_name}+${contact.relation}+${contact.contacts_phone}`).join('\n');
                                item.thirdPartyContacts = contacts;
                            } else {
                                handleError(response);
                            }
 
                            currentIndex++;
                            progressBar.style.width = `${(currentIndex / allData.length) * 100}%`;
                            statusInfo.textContent = `正在获取额外信息: ${currentIndex}/${allData.length}`;
 
                            if (isRunning) {
                                //updateDataList();
                                fetchAdditionalInfo();
                            } else {
                                finishFetching();
                            }
                        },
                        onerror: handleError
                    });
                } else {
                    handleError(response);
                }
            },
            onerror: handleError
        });
    }
 
    // 更新数据列表显示
    function updateDataList() {
        dataList.innerHTML = '';
 
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
 
        // 创建表头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['ID', '姓名', '身份证号', '逾期天数', '逾期本金', '总欠款', '手机号', '逾期开始日', '地址', '第三方联系人'];
 
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.padding = '8px';
            th.style.borderBottom = '1px solid #ddd';
            th.style.textAlign = 'left';
            headerRow.appendChild(th);
        });
 
        thead.appendChild(headerRow);
        table.appendChild(thead);
 
        // 创建表体
        const tbody = document.createElement('tbody');
 
        allData.forEach(item => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #eee';
 
            const cells = [
                item.id,
                item.case_name,
                item.case_idcard,
                item.overdue_days,
                item.last_capital,
                item.amount_payable,
                item.case_phone,
                item.last_repay_time,
                item.address,
                item.thirdPartyContacts
            ];
 
            cells.forEach(cellText => {
                const td = document.createElement('td');
                td.textContent = cellText;
                td.style.padding = '8px';
                row.appendChild(td);
            });
 
            tbody.appendChild(row);
        });
 
        table.appendChild(tbody);
        dataList.appendChild(table);
    }
 
    // 完成数据获取
    function finishFetching() {
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
        exportButton.disabled = false;
        progressBar.style.width = '100%';
        statusInfo.textContent = `数据获取完成，共获取 ${allData.length} 条记录`;
    }
 
    // 处理错误
    function handleError(response) {
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
        statusInfo.textContent = `错误: ${response.status} ${response.statusText}`;
        console.error('Error:', response);
    }
 
    // 格式化日期
    function formatDate(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
 
    // 导出为Excel
    function exportToExcel() {
        if (allData.length === 0) {
            statusInfo.textContent = '没有数据可导出';
            return;
        }
 
        try {
            // 创建工作簿
            const wb = XLSX.utils.book_new();
 
            // 创建工作表数据
            const wsData = [
                ['ID', '姓名', '身份证号', '逾期天数', '逾期本金', '总欠款', '手机号', '逾期开始日', '地址', '第三方联系人'],
                ...allData.map(item => [
                    item.id,
                    item.case_name,
                    item.case_idcard,
                    item.overdue_days,
                    item.last_capital,
                    item.amount_payable,
                    item.case_phone,
                    item.last_repay_time,
                    item.address,
                    item.thirdPartyContacts
                ])
            ];
 
            // 创建工作表
            const ws = XLSX.utils.aoa_to_sheet(wsData);
 
            // 将工作表添加到工作簿
            XLSX.utils.book_append_sheet(wb, ws, '数据导出');
 
            // 生成Excel文件
            const wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                type: 'array',
                bookSST: true  // 提高大文件性能
            });
 
            // 创建Blob
            const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
 
            // 创建文件名
            const now = new Date();
            const fileName = `数据导出_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.xlsx`;
 
            // 使用原生方法下载
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
 
            // 清理资源
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                statusInfo.textContent = '数据导出成功';
            }, 100);
 
        } catch (error) {
            console.error('导出失败:', error);
            statusInfo.textContent = `导出失败: ${error.message || error}`;
        }
    }
})();