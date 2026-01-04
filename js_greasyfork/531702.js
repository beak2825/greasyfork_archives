// ==UserScript==
// @name         产品SPU/SKU/SKU货号/备货单/TEMU备货量查询-TEMU卖家中心
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  发货单列表：支持 紧急备货建议 和 普通备货建议；在备货单号后添加按钮，点击显示对应的备货单号信息，支持快速响应，页面变化自动响应。
// @author       wk
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-list
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531702/%E4%BA%A7%E5%93%81SPUSKUSKU%E8%B4%A7%E5%8F%B7%E5%A4%87%E8%B4%A7%E5%8D%95TEMU%E5%A4%87%E8%B4%A7%E9%87%8F%E6%9F%A5%E8%AF%A2-TEMU%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/531702/%E4%BA%A7%E5%93%81SPUSKUSKU%E8%B4%A7%E5%8F%B7%E5%A4%87%E8%B4%A7%E5%8D%95TEMU%E5%A4%87%E8%B4%A7%E9%87%8F%E6%9F%A5%E8%AF%A2-TEMU%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83.meta.js
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

    async function handleButtonClick_shippingList(deliveryOrderSn) {
        // deliveryOrderSn = 
        const mallId = localStorage.getItem('mall-info-id');

        const response_delivery = await fetch("https://seller.kuajingmaihuo.com/bgSongbird-api/supplier/deliverGoods/management/queryDeliveryOrderPackageDetailInfo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "mallid": mallId
            },
            body: JSON.stringify({
                deliveryOrderSn: deliveryOrderSn
            })
        });
        const dataJson_delivery = await response_delivery.json();
        console.log(dataJson_delivery);
        const Shipment_ID = dataJson_delivery.result.subPurchaseOrderSn;
        const data_delivery = dataJson_delivery.result.deliveryOrderDetails;

        const response_SubOrder = await fetch("https://seller.kuajingmaihuo.com/oms/bg/venom/api/supplier/purchase/manager/querySubOrderList", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "mallid": mallId
            },
            body: JSON.stringify({
                pageNo: 1, //改成直接搜索Shipment_ID后不需要pageNo和pageSize了
                pageSize: 20,
                isCustomGoods: false,
                oneDimensionSort: {
                  firstOrderByParam: "createdAt",
                  firstOrderByDesc: 1
                },
                subPurchaseOrderSnList: [Shipment_ID]
              })
        });
        const dataJson_SubOrder = await response_SubOrder.json();
        console.log(dataJson_SubOrder);
        const SPU = dataJson_SubOrder.result.subOrderForSupplierList[0].productId;
        const SKC = dataJson_SubOrder.result.subOrderForSupplierList[0].productSkcId;
        const data_SubOrder_skuQuantityDetailList = dataJson_SubOrder.result.subOrderForSupplierList[0].skuQuantityDetailList;

        // 向右合并 result 和 packageSKUInfos，by skuId 
        let result = data_delivery.map(item => {
            const matchedB = data_SubOrder_skuQuantityDetailList.find(b => b.productSkuId === item.productSkuId);
            return {
                spu: SPU,
                skuId: item.productSkuId,
                skuCode: matchedB ? matchedB.extCode : "",
                shipmentId: Shipment_ID,
                shipSkuNum: item.deliverSkuNum,
                className: matchedB ? matchedB.className : "",
                price: matchedB ? `${matchedB.currencyType} ${matchedB.supplierPrice/100}` : "",
                SKC: SKC
            };
        });

        // 清除之前的表格（如果存在）
        let existingTable = document.getElementById('spuSkuTableContainer');
        if (existingTable) existingTable.remove();
        
        // 创建表格展示结果
        if (result.length > 0) {
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
            result.forEach(item => {
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
        //const listName = document.querySelectorAll('div a.menu-highlight')[0].getAttribute('click-text'); //列表页

        const deliveryOrderColumnIndex =  Array.from(document.querySelectorAll("div[class*='TB_header_5'] thead th"))
            .findIndex(th => th.innerText.trim() === "发货单号");
        
        const headers = Array.from(document.querySelectorAll("tbody tr[data-testid='beast-core-table-body-tr']"))
            .map(tr => {
                const tds = tr.querySelectorAll("td");
                return tds[deliveryOrderColumnIndex]; // 直接返回 td 元素
            }).filter(td => td); // 排除 undefined 的情况
      
        if (headers.length > 0) {
            console.log('找到 发货单列表-表格 内容，开始添加按钮...');
            addButtonsToHeaders(headers);
        } else {
            console.log('未找到 发货单列表-表格 内容。');
        }
    }

    // 在每个header行添加按钮
    function addButtonsToHeaders(headers) {
        const pageSize = document.querySelectorAll("ul div[class*='IPT_mirror'")[0]?.textContent.trim(); //每页大小
        const pageNo = Number(document.querySelector("ul li[class*='PGT_pagerItemActive']")?.textContent.trim()) || 1; //页码

        console.log(pageSize,pageNo)

        headers.forEach(header => {
            // 提取备货单号
            let targetDiv = header.querySelector("div > div > div");
            let deliveryOrderSn = targetDiv?.childNodes[0]?.textContent?.trim();

            if (deliveryOrderSn) {
                // 检查是否已添加按钮
                if (header.querySelector('.show-details-button')) return;

                // 创建显示按钮
                const button = document.createElement('button');
                button.innerText = '显示备货单详情';
                button.className = 'show-details-button';
                button.style.marginLeft = '10px';
                button.style.cursor = 'pointer';

                // 按钮点击事件
                button.addEventListener('click', () => handleButtonClick_shippingList(deliveryOrderSn));

                // 将按钮添加后
                header.appendChild(button);
            }
        });
    }

    // 监听 页面 的变化
    function observeHeaders() {
        const observer = new MutationObserver(() => {
            console.log('编号查询 - 检测到 发货单列表 出现变化，处理表格...');
            processTable();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log('编号查询 - 正在全局监听 发货单列表 的变化...');
    }

    // 启动脚本
    (function initialize() {
        console.log('编号查询 - 脚本初始化，立即检查并监听 发货单列表...');
        processTable(); // 尝试立即处理表格
        observeHeaders(); // 开始监听 tr.header 的动态变化
    })();
})();
