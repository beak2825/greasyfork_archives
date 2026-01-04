// ==UserScript==
// @name         亚洲聚水潭网站自动执行脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  拦截并修改亚洲聚水潭网站的AJAX请求，添加下载所有数据功能
// @author       You
// @match        https://asia-web.jsterp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535630/%E4%BA%9A%E6%B4%B2%E8%81%9A%E6%B0%B4%E6%BD%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/535630/%E4%BA%9A%E6%B4%B2%E8%81%9A%E6%B0%B4%E6%BD%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建原始的XMLHttpRequest对象
    const originalXHR = window.XMLHttpRequest;

    // 重写XMLHttpRequest
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // 重写open方法
        xhr.open = function() {
            this.method = arguments[0];
            this.url = arguments[1];
            return originalOpen.apply(this, arguments);
        };

        // 重写send方法
        xhr.send = function() {
            const originalOnReadyStateChange = this.onreadystatechange;

            this.onreadystatechange = function() {
                if (this.readyState === 4) {
                    // 检查是否是目标URL
                    if (this.url && (this.url.includes('/scm/distributor/LoadFInout') || this.url.includes('/scm/distributor/PageLoadShopSku'))) {
                        try {
                            // 解析响应
                            const response = JSON.parse(this.responseText);

                            // 修改PageSizes数组
                            if (response.data_page_ && response.data_page_.PageSizes) {
                                response.data_page_.PageSizes = [500, 1000, 5000, 10000];

                                // 替换响应
                                Object.defineProperty(this, 'responseText', {
                                    get: function() {
                                        return JSON.stringify(response);
                                    }
                                });

                                console.log('已修改响应的PageSizes为[500, 1000, 5000, 10000]，URL: ' + this.url);
                            }
                        } catch (e) {
                            console.error('修改响应时出错:', e);
                        }
                    }
                }

                // 调用原始的onreadystatechange
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };

            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // 添加下载所有数据的按钮
    function addDownloadAllButton() {
        // 等待页面加载完成
        setTimeout(() => {
            const toolbarSelector = "#app > div.j-main.j-main-oScreen > div.j-table-toolbar > i";
            const toolbar = document.querySelector(toolbarSelector);

            if (toolbar) {
                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Download All';
                downloadButton.style.marginLeft = '10px';
                downloadButton.style.padding = '5px 10px';
                downloadButton.style.backgroundColor = '#1890ff';
                downloadButton.style.color = 'white';
                downloadButton.style.border = 'none';
                downloadButton.style.borderRadius = '4px';
                downloadButton.style.cursor = 'pointer';

                toolbar.parentNode.insertBefore(downloadButton, toolbar.nextSibling);

                downloadButton.addEventListener('click', downloadAllData);
                console.log('已添加下载按钮');
            } else {
                console.log('未找到工具栏，无法添加下载按钮');
            }
        }, 2000);
    }

    // 下载所有数据的函数
    async function downloadAllData() {
        try {
            // 显示加载提示
            const loadingDiv = document.createElement('div');
            loadingDiv.style.position = 'fixed';
            loadingDiv.style.top = '50%';
            loadingDiv.style.left = '50%';
            loadingDiv.style.transform = 'translate(-50%, -50%)';
            loadingDiv.style.padding = '20px';
            loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            loadingDiv.style.color = 'white';
            loadingDiv.style.borderRadius = '5px';
            loadingDiv.style.zIndex = '9999';
            loadingDiv.textContent = '正在下载数据，请稍候...';
            document.body.appendChild(loadingDiv);

            // 获取第一页数据，了解总页数
            const firstPageResponse = await fetchPageData(1, 10000);
            const totalPages = firstPageResponse.data_page_.PageCount;
            const totalItems = firstPageResponse.data_page_.DataCount;

            loadingDiv.textContent = `总共 ${totalItems} 条数据，${totalPages} 页，正在下载...`;

            // 收集所有数据
            let allRows = [];
            let columns = [];

            if (firstPageResponse.data_ && firstPageResponse.data_.rows && firstPageResponse.data_.cols) {
                allRows = allRows.concat(firstPageResponse.data_.rows);
                columns = firstPageResponse.data_.cols;
            }

            // 获取剩余页面的数据
            for (let page = 2; page <= totalPages; page++) {
                loadingDiv.textContent = `正在下载第 ${page}/${totalPages} 页...`;
                const pageResponse = await fetchPageData(page, 10000);
                if (pageResponse.data_ && pageResponse.data_.rows) {
                    allRows = allRows.concat(pageResponse.data_.rows);
                }
                // 添加小延迟，避免请求过快
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 转换为CSV
            const csv = convertToCSV(allRows, columns);

            // 下载CSV文件
            downloadCSV(csv, `商品数据_${new Date().toISOString().slice(0, 10)}.csv`);

            // 移除加载提示
            document.body.removeChild(loadingDiv);

        } catch (error) {
            console.error('下载数据时出错:', error);
            alert('下载数据时出错: ' + error.message);
        }
    }

    // 获取指定页面的数据
    async function fetchPageData(pageIndex, pageSize) {
        // 构建请求体
        const requestBody = {
            "sku_id": "",
            "item_id": "",
            "sku_name": "",
            "SearchList": {"Items": []},
            "DataPage": {
                "PageSize": pageSize,
                "PageSizes": [500, 1000, 5000, 10000],
                "IsFirst": pageIndex === 1,
                "IsLast": false,
                "PageCount": 1,
                "PageIndex": pageIndex,
                "DataCount": 0,
                "SkipCount": (pageIndex - 1) * pageSize
            }
        };

        // 发送请求
        const response = await fetch("https://asia-web.jsterp.com/scm/distributor/PageLoadShopSku", {
            method: "POST",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // 将数据转换为CSV格式
    function convertToCSV(rows, columns) {
        // 添加表头
        let csv = columns.join(',') + '\n';

        // 添加数据行
        rows.forEach(row => {
            const formattedRow = row.map(cell => {
                // 处理包含逗号、引号或换行符的单元格
                if (cell === null || cell === undefined) {
                    return '';
                }

                const cellStr = String(cell);
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
            });

            csv += formattedRow.join(',') + '\n';
        });

        return csv;
    }

    // 下载CSV文件
    function downloadCSV(csv, filename) {
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 页面加载完成后添加按钮
    window.addEventListener('load', addDownloadAllButton);

    // 监听URL变化，在页面切换时也添加按钮
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            addDownloadAllButton();
        }
    }).observe(document, { subtree: true, childList: true });

    console.log('亚洲聚水潭网站自动执行脚本已加载');
})();
