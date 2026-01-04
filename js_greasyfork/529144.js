// ==UserScript==
// @name         京东订单发票批量获取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取京东我的订单页面中的所有 发票PDF链接 
// @author       Your name
// @license      MIT
// @match        https://order.jd.com/center/list.action*
// @connect      jd.com
// @connect      *
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529144/%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95%E5%8F%91%E7%A5%A8%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529144/%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95%E5%8F%91%E7%A5%A8%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储所有发票链接
    let invoiceUrls = [];

    // 添加样式
    GM_addStyle(`
        #downloadInvoiceBtn {
            position: fixed;
            right: 20px;
            top: 20px;
            padding: 10px 20px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
        }
        #downloadInvoiceBtn:hover {
            background-color: #1976D2;
        }
        .confirm-dialog {
            position: fixed;
            right: 20px;
            top: 80px;
            padding: 20px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            display: none;
        }
        .confirm-dialog button {
            margin: 10px 5px 0;
            padding: 5px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .confirm-dialog .confirm, .confirm-dialog .cancel {
            background-color: #2196F3;
            color: white;
        }
        .confirm-dialog .confirm:hover, .confirm-dialog .cancel:hover {
            background-color: #1976D2;
        }
        #downloadProgress {
            position: fixed;
            right: 20px;
            top: 80px;
            padding: 20px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            display: none;
            min-width: 300px;
        }
    `);

    // 创建下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'downloadInvoiceBtn';
    downloadBtn.textContent = '获取发票链接';
    document.body.appendChild(downloadBtn);

    // 创建确认对话框
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'confirm-dialog';
    confirmDialog.innerHTML = `
        <p>开始获取所有发票链接，期间请不要进行任何操作，确定开始吗？</p>
        <button class="confirm">确定</button>
        <button class="cancel">取消</button>
    `;
    document.body.appendChild(confirmDialog);

    // 创建进度提示
    const progressDiv = document.createElement('div');
    progressDiv.id = 'downloadProgress';
    document.body.appendChild(progressDiv);

    // 延时函数
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 更新进度
    function updateProgress(text) {
        progressDiv.style.display = 'block';
        progressDiv.innerHTML = `<div>${text}</div>`;
    }

    // 等待元素出现
    function waitForElement(selectors, timeout = 30000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            function checkElement() {
                // 尝试多个选择器
                for (const selector of Array.isArray(selectors) ? selectors : [selectors]) {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        return;
                    }
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`等待元素超时: ${selectors}`));
                } else {
                    setTimeout(checkElement, 500);
                }
            }
            
            checkElement();
        });
    }

    // 检查是否没有订单
    function checkNoOrders() {
        // 检查是否有空订单提示
        const emptySelectors = [
            '.empty-box',
            '.order-empty',
            '#order-list:empty',
            '.order-list:empty',
            '.orderList:empty',
            '.tb-void'
        ];
        
        if (emptySelectors.some(selector => document.querySelector(selector))) {
            return true;
        }

        // 检查页面文本
        if (document.body.textContent.includes('最近没有下过订单')) {
            return true;
        }

        // 检查订单列表是否为空
        const orderItems = getOrderItems();
        return orderItems.length === 0;
    }

    // 等待页面加载完成
    async function waitForPageLoad() {
        const orderSelectors = [
            'table.td-void',           // 京东订单表格
            '#tb-order',               // 京东订单表格ID
            '.order-tb',               // 京东订单表格类
            '.tr-th',                  // 京东订单表头
            '#orderList',              // 京东订单列表ID
            '.order-list',             // 订单列表类
            '.order-tb tbody tr'       // 订单行
        ];

        try {
            console.log('等待页面加载...');
            
            // 首先等待任意一个选择器出现
            await waitForElement(orderSelectors);
            
            // 额外等待以确保内容完全加载
            await sleep(3000);
            
            // 再次检查是否有订单项
            const items = getOrderItems();
            if (items.length > 0) {
                console.log('页面加载完成，找到', items.length, '个订单');
                return true;
            }
            
            console.log('页面已加载，但未找到订单项');
            return false;
        } catch (error) {
            console.error('页面加载超时:', error);
            return false;
        }
    }

    // 获取订单列表
    function getOrderItems() {
        // 直接使用京东订单页面的主要选择器
        const items = Array.from(document.querySelectorAll('.order-tb tbody tr:not(.tr-th)')).filter(item => {
            return !item.classList.contains('tr-th') && 
                   item.textContent.trim() !== '' &&
                   !item.classList.contains('thead');
        });
        
        console.log('找到订单数量:', items.length);
        return items;
    }

    // 获取订单号
    function getOrderNumber(orderItem) {
        const numberElement = orderItem.querySelector('.number a');
        if (numberElement) {
            const text = numberElement.textContent.trim();
            console.log('订单号文本:', text);
            return text;
        }
        return '未知订单';
    }

    // 获取发票链接
    async function getInvoiceUrl(href, orderNumber) {
        try {
            updateProgress(`正在获取订单 ${orderNumber} 的发票链接...`);
            console.log('处理发票链接:', href);
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: href.startsWith('http') ? href : 'https:' + href,
                    headers: {
                        'Referer': 'https://order.jd.com/',
                        'User-Agent': navigator.userAgent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    },
                    timeout: 30000,
                    onload: function(response) {
                        try {
                            console.log('获取到发票页面，正在解析...');
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            
                            // 查找下载链接
                            const downloadLink = doc.querySelector('a.download-trigger.mr10');
                            if (downloadLink) {
                                const pdfUrl = downloadLink.href || downloadLink.getAttribute('href');
                                if (pdfUrl) {
                                    console.log('找到PDF下载链接:', pdfUrl);
                                    // 保存订单号和PDF链接
                                    invoiceUrls.push({
                                        orderNumber: orderNumber,
                                        url: pdfUrl.startsWith('http') ? pdfUrl : 'https:' + pdfUrl
                                    });
                                    updateProgress(`已获取订单 ${orderNumber} 的发票链接`);
                                } else {
                                    console.log('下载链接为空');
                                }
                            } else {
                                console.log('未找到下载链接元素');
                                // 输出页面内容以便调试
                                console.log('页面内容:', response.responseText.substring(0, 1000));
                            }
                            resolve();
                        } catch (error) {
                            console.error('解析发票页面失败:', error);
                            resolve();
                        }
                    },
                    onerror: function(error) {
                        console.error('请求失败:', error);
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error('获取发票链接出错:', error);
        }
    }

    // 处理单个页面
    async function processPage() {
        try {
            updateProgress('正在处理当前页面的订单...');
            console.log('处理页面:', window.location.href);

            // 等待3秒确保页面完全加载
            await sleep(3000);

            // 获取所有订单项
            const orderItems = getOrderItems();
            if (orderItems.length === 0) {
                alert('未找到订单项');
                return;
            }

            // 处理每个订单
            for (const orderItem of orderItems) {
                try {
                    const orderNumber = getOrderNumber(orderItem);
                    console.log('处理订单:', orderNumber);

                    // 查找发票链接
                    const links = orderItem.querySelectorAll('a');
                    let invoiceLink = null;

                    for (const link of links) {
                        const text = link.textContent.trim();
                        const href = link.getAttribute('href');
                        
                        if (text.includes('发票') && href) {
                            console.log('找到发票页面链接:', href);
                            invoiceLink = href;
                            break;
                        }
                    }

                    if (invoiceLink) {
                        await getInvoiceUrl(invoiceLink, orderNumber);
                        // 每个请求之间等待2秒，避免请求过快
                        await sleep(2000);
                    } else {
                        console.log(`订单 ${orderNumber} 未找到发票链接`);
                    }
                } catch (error) {
                    console.error('处理订单出错:', error);
                    continue;
                }
            }

            // 生成CSV格式的内容
            if (invoiceUrls.length > 0) {
                const csvContent = ['订单号,发票PDF下载链接'];
                invoiceUrls.forEach(item => {
                    csvContent.push(`${item.orderNumber},${item.url}`);
                });
                
                GM_setClipboard(csvContent.join('\n'));
                alert(`成功获取 ${invoiceUrls.length} 个发票PDF下载链接！\n\n链接已复制到剪贴板。`);
            } else {
                alert('未找到任何发票下载链接，请确保订单中包含可下载的发票。');
            }

        } catch (error) {
            console.error('处理页面失败:', error);
            alert('处理过程中出现错误，请查看控制台获取详细信息。');
        } finally {
            progressDiv.style.display = 'none';
        }
    }

    // 主函数
    async function startCollection() {
        invoiceUrls = []; // 清空链接列表
        confirmDialog.style.display = 'none';
        progressDiv.style.display = 'block';
        await processPage();
    }

    // 事件监听
    downloadBtn.addEventListener('click', () => {
        confirmDialog.style.display = 'block';
    });

    confirmDialog.querySelector('.confirm').addEventListener('click', () => {
        startCollection();
    });

    confirmDialog.querySelector('.cancel').addEventListener('click', () => {
        confirmDialog.style.display = 'none';
    });
})(); 