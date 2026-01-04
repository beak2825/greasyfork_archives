// ==UserScript==
// @name         产品SPU/SKU/SKU货号/备货单/TEMU备货量查询-店小秘
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  在备货单号后添加按钮，点击显示对应的备货单号和SKC，支持快速响应，tr.header 出现时立即运行。
// @author       wk
// @match        https://www.dianxiaomi.com/pddkjInventory/index.htm*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523898/%E4%BA%A7%E5%93%81SPUSKUSKU%E8%B4%A7%E5%8F%B7%E5%A4%87%E8%B4%A7%E5%8D%95TEMU%E5%A4%87%E8%B4%A7%E9%87%8F%E6%9F%A5%E8%AF%A2-%E5%BA%97%E5%B0%8F%E7%A7%98.user.js
// @updateURL https://update.greasyfork.org/scripts/523898/%E4%BA%A7%E5%93%81SPUSKUSKU%E8%B4%A7%E5%8F%B7%E5%A4%87%E8%B4%A7%E5%8D%95TEMU%E5%A4%87%E8%B4%A7%E9%87%8F%E6%9F%A5%E8%AF%A2-%E5%BA%97%E5%B0%8F%E7%A7%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //----------------------------------------利用SKC查找SPU SKU等信息的函数-------------------------------------------
    // 创建一个提示框（隐藏状态）
    let toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.backgroundColor = '#4caf50';
    toast.style.color = '#fff';
    toast.style.fontSize = '14px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    toast.style.zIndex = 2000;
    document.body.appendChild(toast);
    
    // 显示提示框函数
    function showToast(message) {
        toast.innerText = message;
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }
    
    // 按钮点击事件逻辑
    async function handleButtonClick(SKC = '', Shipment_ID = '默认备货单号', orderID='') {
        // 获取URL的response并解析为文档
        if (SKC === '') {
            return;
        }
        
        const url = `https://www.dianxiaomi.com/pddkjProduct/pageList.htm?pageNo=1&pageSize=50&shopId=-1&shopGroupId=&searchType=4&searchValue=${SKC}&sortName=2&sortValue=0&dxmState=online&dxmOfflineState=&productSearchType=1&fullCid=&productStatus=active&quantityLift=&quantityRight=&advancedTime=1&timeLift=&timeRight=&priceLift=&priceRight=&advancedSearch=&commentType=0&commentContent=&productStateValue=&productType=`;
        
        let responseDocument;
        try {
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            responseDocument = parser.parseFromString(text, 'text/html');
        } catch (error) {
            console.error('获取SKC数据失败：', error);
            showToast('获取SKC数据失败');
            return;
        }
        
        // 获取data-id和货币单位
        const id =  responseDocument.querySelector("tr.content.lineContent").getAttribute("data-id");
        const currency = responseDocument.querySelector("input.currencyValueCode").getAttribute("value");
        const SPU = responseDocument.querySelectorAll("td.w400.minW200 div.m-left5.m-top5 span.limingcentUrlpic.gray-c")[0].innerText.trim();

        // 获取SPU信息
        const response = await fetch("https://www.dianxiaomi.com/pddkjProduct/getVariantByProductId.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: new URLSearchParams({ id: id }).toString() // 使用 URLSearchParams 进行 x-www-form-urlencoded 编码
        });
    
        let result = await response.json();
        result = result.data.map(item => ({
            spu: item.productId || SPU,
            skuId: item.productSkuId,
            skuCode: item.extCode,
            className: item.attrShow,
            price: `${currency} ${item.supplierPrice / 100}`, // 价格除以100
            SKC: item.productSkcId
        }));
        
        // 获取备货单详情
        const url_order_detail = `https://www.dianxiaomi.com/pddkjInventory/shipmentsDetail.json?id=${orderID}&type=2`;
        let data;
        try {
            const response = await fetch(url_order_detail);
            data = await response.json();
        } catch (error) {
            console.error('获取备货单详情失败：', error);
            showToast('获取备货单详情失败');
            return;
        }
        const packageSKUInfos = data.data.deliverOrderDetailInfos;
        
        // 先不向左合并（基于 在线产品全部SKU）了，只提供真正发货的sku，因为有时候 在线产品 没更新就导致信息确实无法匹配
        // // 向左合并 result 和 packageSKUInfos，by skuId 
        // let mergedResults = result.map(item => {
        //     const matchedB = packageSKUInfos.find(b => b.skuId === item.skuId);
        //     return {
        //         spu: item.spu,
        //         skuId: item.skuId,
        //         skuCode: item.skuCode,
        //         shipmentId: matchedB && matchedB.deliverSkuNum ? Shipment_ID : "",
        //         shipSkuNum: matchedB ? matchedB.deliverSkuNum : "",
        //         className: matchedB ? matchedB.className : item.className,
        //         price: item.price,
        //         SKC: item.SKC
        //     };
        // });

        // 向右合并 result 和 packageSKUInfos，by skuId 
        let mergedResults = packageSKUInfos.map(item => {
            const matchedB = result.find(b => b.skuId === item.skuId);
            return {
                spu: SPU,
                skuId: item.skuId,
                skuCode: item.extCode,
                shipmentId: Shipment_ID,
                shipSkuNum: item.deliverSkuNum,
                className: item.className,
                price: matchedB ? matchedB.price : "",
                SKC: SKC
            };
        });
        
        console.log(mergedResults);
        
        // 清除之前的表格（如果存在）
        let existingTable = document.getElementById('spuSkuTableContainer');
        if (existingTable) existingTable.remove();
        
        // 创建表格展示结果
        if (mergedResults.length > 0) {
            // 创建表格容器
            let container = document.createElement('div');
            container.id = 'spuSkuTableContainer';
            container.style.position = 'fixed';
            container.style.top = '50%';
            container.style.left = '65%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.zIndex = 1000;
            container.style.backgroundColor = '#fff';
            container.style.border = '1px solid #ddd';
            container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            container.style.borderRadius = '5px';
            container.style.padding = '10px';
            container.style.overflow = 'auto';
            
            // 点击容器外部关闭表格
            document.addEventListener("click", function (event) {
                if (!container.contains(event.target) && !event.target.classList.contains('show-details-button')) { //点击按钮不会关闭容器
                    container.style.display = "none";
                }
            });
            
            // 添加关闭按钮
            let closeButton = document.createElement('button');
            closeButton.innerText = '⊗';
            closeButton.style.display = 'block';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px'; // 将关闭按钮向表格外移
            closeButton.style.right = '5px'; // 同上，保持按钮不与表格内容重叠
            closeButton.style.padding = '5px 10px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.backgroundColor = 'transparent'; // 背景透明
            closeButton.style.color = 'red'; // 字体颜色为红色
            closeButton.style.border = 'none';
            closeButton.style.textShadow = '1px 1px 2px white'; // 仅添加字体阴影
            closeButton.style.fontSize = '16px'; // 字体大小更大
            closeButton.addEventListener('click', () => {
            container.remove();
            });
            container.appendChild(closeButton);

            // 创建表格
            let table = document.createElement('table');
            table.id = 'spuSkuTable';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.fontSize = '12px';

            // 表头
            let thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background-color: #f4f4f4; text-align: left;">
                    <th style="border: 1px solid #ddd; padding: 6px;">SPU</th>
                    <th style="border: 1px solid #ddd; padding: 6px;">SKU ID</th>
                    <th style="border: 1px solid #ddd; padding: 6px;">SKU货号</th>
                    <th style="border: 1px solid #ddd; padding: 6px;">备货单号</th>
                    <th style="border: 1px solid #ddd; padding: 6px;">TEMU备货量</th>
                    <th style="border: 1px solid #ddd; padding: 6px;">属性</th>
                    <th style="border: 1px solid #ddd; padding: 6px;">初次申报价格</th>
                    <th style="border: 1px solid #ddd; padding: 6px;">SKC</th>
                    <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">操作</th>
                    </tr>`;
            table.appendChild(thead);

            // 表格内容
            let tbody = document.createElement('tbody');
            mergedResults.forEach(item => {
                let row = document.createElement('tr');
                row.innerHTML = `
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.spu}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.skuId}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.skuCode}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.shipmentId}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.shipSkuNum}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.className}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.price}</td>
                    <td style="border: 1px solid #ddd; padding: 6px;">${item.SKC}</td>
                    <td style="border: 1px solid #ddd; padding: 6px; text-align: center;">
                        ${item.shipmentId ? `<button class="copyButton" style="padding: 4px 8px; cursor: pointer;">复制</button>` : ""}
                    </td>
                `;            
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // 添加表格到容器
            container.appendChild(table);

            // 添加容器到页面
            document.body.appendChild(container);
            
            // 为每个“选择复制”按钮绑定事件
            let copyButtons = document.querySelectorAll('.copyButton');
            copyButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    // 找到当前按钮所在的 <tr>
                    let row = button.closest('tr');

                    if (!row) return; // 避免意外情况

                    // 获取当前行的所有 <td> 并提取需要的值
                    let cells = row.querySelectorAll('td');
                    let text = [
                        cells[0]?.innerText.trim(),  // spu
                        cells[1]?.innerText.trim(),  // skuId
                        cells[2]?.innerText.trim(),  // skuCode
                        cells[3]?.innerText.trim(),  // shipmentId
                        cells[4]?.innerText.trim()   // shipSkuNum
                    ].join("\t");

                    // 创建一个隐藏的 textarea 用于复制
                    let textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    textarea.remove();

                    showToast('已复制 SPU | SKU ID | SKU 货号 | 备货单号 | TEMU 备货量！');
                });
            });
        } else {
            showToast("未找到任何SPU和SKU信息");
        }
    }


    //-------------------------------------给备货页面批量增加按钮并捆绑查找函数----------------------------------------
    let observer = null; // 用于存储当前的容器观察器
    
    // 处理表格内容
    function processTable() {
        const headers = document.querySelectorAll('tr.header');
        if (headers.length > 0) {
            console.log('找到 发货管理-表格 内容，开始添加按钮...');
            addButtonsToHeaders(headers);
        } else {
            console.log('未找到 发货管理-表格 内容。');
        }
    }

    // 在每个header行添加按钮
    function addButtonsToHeaders(headers) {
        headers.forEach(header => {
            // 提取备货单号
            const orderNumberElement = Array.from(header.querySelectorAll('span')).find(el => el.textContent.includes('订单号'))?.querySelector('span');
            if (!orderNumberElement) {
                console.log('未找到订单号元素。');
                return;
            }

            const orderNumber = orderNumberElement.innerText.trim();
            const orderIDElement = document.evaluate(".//input[@class='shipmentCheckBox']", header, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
            const orderID = orderIDElement.getAttribute('value');

            if (orderNumber) {
                // 检查是否已添加按钮
                if (header.querySelector('.show-details-button')) return;

                // 创建显示按钮
                const button = document.createElement('button');
                button.innerText = '显示SPU详情';
                button.className = 'show-details-button';
                button.style.marginLeft = '10px';
                button.style.cursor = 'pointer';

                // 按钮点击事件
                button.addEventListener('click', () => {
                    // 获取当前header对应的content行
                    const contentRow = header.nextElementSibling;
                    if (contentRow && contentRow.classList.contains('content')) {
                        // 提取SKC信息
                        const skcElement = document.evaluate(".//div[contains(text(),'SKC')]//span", contentRow, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0); //contentRow内部的span
                        const skc = skcElement ? skcElement.innerText.trim() : '未找到SKC';

                        // 显示备货单号和SKC
                        console.log(`备货单号: ${orderNumber}\nSKC: ${skc}`);
                        // 查找信息
                        handleButtonClick(skc,orderNumber,orderID);
                    } else {
                        console.log('未找到对应的SKC行！');
                    }
                });

                // 将按钮添加到备货单号后
                orderNumberElement.parentElement.appendChild(button);
            }
        });
    }

    // 监听 tr.header 的变化
    function observeHeaders() {
        const observer = new MutationObserver(() => {
            const title = document.querySelectorAll("li.moduleLiBox.in-active div")[0].textContent.trim();
            if (title === "发货管理") {
                console.log('编号查询 - 检测到 发货管理-tr.header 出现变化，处理表格...');
                processTable();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('编号查询 - 正在全局监听 发货管理-tr.header 的变化...');
    }

    // 启动脚本
    (function initialize() {
        console.log('编号查询 - 脚本初始化，立即检查并监听 tr.header...');
        processTable(); // 尝试立即处理表格
        observeHeaders(); // 开始监听 tr.header 的动态变化
    })();
})();
