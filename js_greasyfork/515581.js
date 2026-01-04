// ==UserScript==
// @name         EPIC游戏库存导出
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license PaperTiger
// @description  修复日期提取问题，精确提取EPIC游戏订单信息，基于HTML表格结构。
// @author       Paper Tiger
// @match         *://*.epicgames.com/account/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515581/EPIC%E6%B8%B8%E6%88%8F%E5%BA%93%E5%AD%98%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/515581/EPIC%E6%B8%B8%E6%88%8F%E5%BA%93%E5%AD%98%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

/* global XLSX */

(function() {
    'use strict';

    let isProcessing = false;
    let currentPage = 0;
    let allOrderData = [];
    let processedOrderIds = new Set(); // 用于跟踪已处理的订单ID

    function createExportButton() {
        const button = document.createElement('button');
        button.textContent = '开始导出';
        button.id = 'epic-export-btn';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '400px';
        button.style.zIndex = '99999';
        button.style.padding = '10px';
        button.style.backgroundColor = 'rgba(40, 167, 69, 1)';
        button.style.color = 'white';
        button.style.border = '2px solid red';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        // 创建进度显示区域
        const progressDiv = document.createElement('div');
        progressDiv.id = 'epic-progress';
        progressDiv.style.position = 'fixed';
        progressDiv.style.top = '50px';
        progressDiv.style.right = '400px';
        progressDiv.style.zIndex = '99999';
        progressDiv.style.padding = '10px';
        progressDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        progressDiv.style.color = 'white';
        progressDiv.style.borderRadius = '5px';
        progressDiv.style.display = 'none';
        progressDiv.style.maxWidth = '300px';
        document.body.appendChild(progressDiv);

        button.addEventListener('click', function() {
            if (!isProcessing) {
                isProcessing = true;
                button.textContent = '处理中...';
                button.disabled = true;
                allOrderData = []; // 清空之前的数据
                processedOrderIds.clear(); // 清空已处理的订单ID
                currentPage = 0;
                clickTransactions();
            }
        });
    }

    function updateProgress(message) {
        const progressDiv = document.getElementById('epic-progress');
        if (progressDiv) {
            progressDiv.style.display = 'block';
            progressDiv.innerHTML = message;
        }
    }

    function clickTransactions() {
        const transactionsButton = document.querySelector('#nav-link-transactions');
        if (transactionsButton) {
            transactionsButton.click();
            console.log('点击了交易按钮');
            updateProgress('正在加载交易页面...');
            // 等待页面加载后开始提取数据
            setTimeout(extractCurrentPageData, 2000);
        } else {
            console.log("找不到交易按钮。");
            updateProgress('找不到交易按钮，请确保在正确的页面上。');
            resetButton();
        }
    }

    function extractCurrentPageData() {
        currentPage++;
        updateProgress(`正在处理第 ${currentPage} 页...`);

        // 查找所有订单行 - 使用更精确的选择器
        const orderRows = document.querySelectorAll('tr[data-orderid]');
        console.log(`第 ${currentPage} 页找到 ${orderRows.length} 个订单`);

        let pageOrderCount = 0;
        orderRows.forEach((row, index) => {
            try {
                const orderData = extractOrderDataFromRow(row);
                if (orderData && orderData['订单ID']) {
                    // 检查订单ID是否已经处理过
                    if (!processedOrderIds.has(orderData['订单ID'])) {
                        processedOrderIds.add(orderData['订单ID']);
                        allOrderData.push(orderData);
                        pageOrderCount++;
                        console.log(`提取订单: ${orderData['订单ID']} - ${orderData['订单日期']} - ${orderData['游戏名称']} - ${orderData['付款金额']}`);
                    } else {
                        console.log(`跳过重复订单ID: ${orderData['订单ID']}`);
                    }
                } else {
                    console.warn(`第 ${index + 1} 个订单数据无效或缺少订单ID`);
                }
            } catch (error) {
                console.error(`提取第 ${index + 1} 个订单数据时出错:`, error);
            }
        });

        console.log(`第 ${currentPage} 页提取了 ${pageOrderCount} 个新订单，总计 ${allOrderData.length} 个订单`);

        // 检查是否有下一页
        setTimeout(checkNextPage, 1000);
    }

    function extractOrderDataFromRow(row) {
        try {
            // 获取订单ID - 确保从正确的属性获取
            const orderId = row.getAttribute('data-orderid');
            if (!orderId) {
                console.warn('订单行缺少data-orderid属性');
                return null;
            }

            // 获取订单信息单元格 (第二个td)
            const infoCell = row.querySelector('td:nth-child(2)');
            if (!infoCell) {
                console.warn('找不到订单信息单元格');
                return null;
            }

            // 提取日期 - 修复日期提取逻辑
            let orderDate = '';
            const mainDiv = infoCell.querySelector('.am-yd8sa2');
            if (mainDiv) {
                // 获取第一个文本节点，这应该是日期
                const firstChild = mainDiv.firstChild;
                if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                    orderDate = firstChild.textContent.trim();
                } else {
                    // 如果没有直接的文本节点，尝试其他方法
                    const dateText = mainDiv.textContent;
                    // 使用正则表达式提取日期格式
                    const dateMatch = dateText.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
                    if (dateMatch) {
                        orderDate = dateMatch[1];
                    }
                }
            }

            // 提取游戏名称 - 查找包含游戏名称的span元素
            let gameName = '';
            const gameNameElements = infoCell.querySelectorAll('.am-hoct6b');
            if (gameNameElements.length > 0) {
                gameName = gameNameElements[0].textContent.trim();
            }

            // 提取价格信息 - 查找包含"价格"文本的元素
            let price = '0.00';
            const priceElements = infoCell.querySelectorAll('.am-brjg0');
            for (let element of priceElements) {
                if (element.textContent.includes('价格')) {
                    const priceContainer = element.nextElementSibling;
                    if (priceContainer && priceContainer.classList.contains('am-1v0j95h')) {
                        const priceText = priceContainer.textContent.trim();
                        // 提取价格数字，处理 "¥0.00" 或 "- ¥0.00" 格式
                        const priceMatch = priceText.match(/[¥$]?([\d.,]+)/);
                        if (priceMatch) {
                            price = priceMatch[1];
                        }
                        break;
                    }
                }
            }

            // 提取商城信息
            let marketplace = '';
            for (let element of priceElements) {
                if (element.textContent.includes('商城')) {
                    const marketplaceContainer = element.nextElementSibling;
                    if (marketplaceContainer && marketplaceContainer.classList.contains('am-1v0j95h')) {
                        marketplace = marketplaceContainer.textContent.trim();
                        break;
                    }
                }
            }

            // 提取说明信息
            let description = '';
            for (let element of priceElements) {
                if (element.textContent.includes('说明')) {
                    const descContainer = element.nextElementSibling;
                    if (descContainer && descContainer.classList.contains('am-1v0j95h')) {
                        const descElement = descContainer.querySelector('.am-1rqw9bo');
                        if (descElement) {
                            description = descElement.textContent.trim();
                        }
                        break;
                    }
                }
            }

            // 验证数据完整性
            if (!orderId || !orderDate) {
                console.warn(`订单数据不完整: ID=${orderId}, 日期=${orderDate}`);
                return null;
            }

            // 调试信息
            console.log(`调试 - 订单ID: ${orderId}, 日期: "${orderDate}", 游戏: "${gameName}"`);

            return {
                '订单ID': orderId,
                '订单日期': orderDate,
                '游戏名称': gameName,
                '说明': description,
                '付款金额': price,
                '商城': marketplace,
                '页面': currentPage
            };
        } catch (error) {
            console.error('提取订单数据时出错:', error);
            return null;
        }
    }

    function checkNextPage() {
        const nextButton = document.querySelector('#next-btn');
        if (nextButton && !nextButton.disabled) {
            nextButton.click();
            console.log('点击了下一页按钮');
            updateProgress(`正在加载第 ${currentPage + 1} 页...`);
            // 等待页面加载后继续提取
            setTimeout(extractCurrentPageData, 2000);
        } else {
            console.log("没有更多页面可以加载。");
            updateProgress(`处理完成！共提取 ${allOrderData.length} 个唯一订单。正在生成Excel文件...`);
            // 等待最后一页数据完全加载
            setTimeout(exportData, 2000);
        }
    }

    function exportData() {
        if (allOrderData.length === 0) {
            alert('没有提取到任何订单数据，请检查页面是否正确加载。');
            resetButton();
            return;
        }

        console.log(`准备导出 ${allOrderData.length} 条唯一订单数据`);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(allOrderData);
        XLSX.utils.book_append_sheet(workbook, worksheet, '订单历史');
        XLSX.writeFile(workbook, `EPIC游戏订单历史_${new Date().toISOString().slice(0, 10)}.xlsx`);

        alert(`导出完成！共导出 ${allOrderData.length} 条唯一订单数据。`);
        resetButton();
    }

    function resetButton() {
        const button = document.getElementById('epic-export-btn');
        const progressDiv = document.getElementById('epic-progress');

        if (button) {
            button.textContent = '开始导出';
            button.disabled = false;
        }

        if (progressDiv) {
            progressDiv.style.display = 'none';
        }

        isProcessing = false;
    }

    createExportButton();
})();