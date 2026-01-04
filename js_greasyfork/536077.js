// ==UserScript==
// @name         淘宝买家订单导出插件增强版
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  基于淘宝买家订单导出插件做的增强版，添加自动记录、订单计数等功能
// @author       kubrick
// @include      https://buyertrade.taobao.com/trade/itemlist*
// @include      https://buyertrade.taobao.com/trade/itemlist*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536077/%E6%B7%98%E5%AE%9D%E4%B9%B0%E5%AE%B6%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536077/%E6%B7%98%E5%AE%9D%E4%B9%B0%E5%AE%B6%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建顶部控制栏容器
    function createControlBar() {
        const existingBar = document.getElementById('orderExportControlBar');
        if (existingBar) return existingBar;

        const controlBar = document.createElement('div');
        controlBar.id = 'orderExportControlBar';
        controlBar.style.position = 'fixed';
        controlBar.style.top = '10px';
        controlBar.style.right = '10px';
        controlBar.style.zIndex = '9999';
        controlBar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        controlBar.style.padding = '10px';
        controlBar.style.borderRadius = '10px';
        controlBar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        controlBar.style.display = 'flex';
        controlBar.style.flexDirection = 'column';
        controlBar.style.gap = '10px';

        document.body.appendChild(controlBar);
        return controlBar;
    }

    // 添加圆角按钮
    function addButton(container, onclickFunc, color, value = "按钮", width = "120px", height = "40px") {
        const button = document.createElement("button");
        button.textContent = value;
        button.style.height = height;
        button.style.width = width;
        button.style.color = "white";
        button.style.background = color;
        button.style.border = "none";
        button.style.borderRadius = "20px";
        button.style.cursor = "pointer";
        button.style.fontWeight = "bold";
        button.style.fontSize = "14px";
        button.style.transition = "all 0.3s";

        button.onmouseover = function() {
            button.style.opacity = "0.8";
            button.style.transform = "scale(1.05)";
        };
        button.onmouseout = function() {
            button.style.opacity = "1";
            button.style.transform = "scale(1)";
        };

        button.onclick = function() {
            onclickFunc();
        };

        container.appendChild(button);
        return button;
    }

    // 添加订单计数显示
    function addOrderCountDisplay(container) {
        const countDisplay = document.createElement("div");
        countDisplay.id = "orderCountDisplay";
        countDisplay.style.padding = "8px 15px";
        countDisplay.style.backgroundColor = "#f5f5f5";
        countDisplay.style.borderRadius = "20px";
        countDisplay.style.textAlign = "center";
        countDisplay.style.fontWeight = "bold";
        countDisplay.textContent = "当前订单数: 0";
        container.appendChild(countDisplay);
        return countDisplay;
    }

    // 更新订单计数显示
    function updateOrderCount() {
        const countDisplay = document.getElementById("orderCountDisplay");
        if (countDisplay) {
            countDisplay.textContent = `当前订单数: ${Object.keys(orderList).length}`;
        }
    }

    // 主逻辑
    const orderListPage = /(http|https):\/\/buyertrade\.taobao.*?\/trade/g;
    if (orderListPage.test(window.location.href)) {
        // 创建控制栏
        const controlBar = createControlBar();

        // 添加订单计数显示
        addOrderCountDisplay(controlBar);

        // 添加按钮
        addButton(controlBar, autoRecordAllOrders, "#FFA500", "自动记录所有订单");
        addButton(controlBar, stopRecording, "#FF5252", "停止记录"); // 新增停止按钮
        addButton(controlBar, addCurrentPageOrdersToList, "#1E90FF", "添加当页订单");
        addButton(controlBar, exportOrders, "#4CAF50", "下载订单数据");
        addButton(controlBar, cleanOrderList, "#FF5252", "清除订单");

        // 添加状态提示
        const statusDisplay = document.createElement("div");
        statusDisplay.id = "recordStatus";
        statusDisplay.style.padding = "5px";
        statusDisplay.style.fontSize = "12px";
        statusDisplay.style.color = "#666";
        controlBar.appendChild(statusDisplay);
    }

    let isAutoRecording = false;
    let stopRecordingFlag = false; // 新增停止标志
    let orderList = {};

    // 自动记录所有订单
    function autoRecordAllOrders() {
        if (isAutoRecording) {
            updateStatus("已经在自动记录中...");
            return;
        }

        isAutoRecording = true;
        stopRecordingFlag = false; // 重置停止标志
        updateStatus("开始自动记录所有订单...");

        // 开始记录第一页
        recordCurrentPageAndContinue();
    }

    // 新增：停止记录功能
    function stopRecording() {
        if (!isAutoRecording) {
            updateStatus("当前没有进行中的记录任务");
            return;
        }

        stopRecordingFlag = true;
        updateStatus("正在停止记录...");
    }

    // 更新状态显示
    function updateStatus(message) {
        const statusDisplay = document.getElementById("recordStatus");
        if (statusDisplay) {
            statusDisplay.textContent = message;
        }
        console.log(message);
    }

    // 记录当前页并继续下一页
    function recordCurrentPageAndContinue() {
        // 检查是否收到停止信号
        if (stopRecordingFlag) {
            finishAutoRecording();
            updateStatus("已手动停止记录");
            return;
        }

        const orders = document.getElementsByClassName("js-order-container");

        // 检查是否有订单数据
        if (!orders || orders.length === 0) {
            finishAutoRecording();
            updateStatus("没有找到订单数据");
            return;
        }

        let hasValidData = false;
        let currentPageCount = 0;

        for (let order of orders) {
            let items = processOrder(order, null);
            if (!items) {
                continue;
            }
            hasValidData = true;
            currentPageCount += Object.keys(items).length;
            _.forEach(items, (value, key) => {
                orderList[key] = value;
            })
        }

        updateOrderCount();
        updateStatus(`已记录当前页 ${currentPageCount} 条订单，总计 ${Object.keys(orderList).length} 条`);

        // 检查是否有下一页
        const nextPageBtn = document.querySelector(".pagination-next:not(.disabled)");
        if (nextPageBtn && hasValidData && !stopRecordingFlag) {
            updateStatus("正在翻到下一页...");

            // 保存当前滚动位置
            const scrollY = window.scrollY;

            // 点击下一页按钮
            nextPageBtn.click();

            // 等待页面加载完成后继续记录
            setTimeout(() => {
                // 恢复滚动位置
                window.scrollTo(0, scrollY);
                recordCurrentPageAndContinue();
            }, 2000);
        } else {
            finishAutoRecording();
            if (!hasValidData) {
                updateStatus("没有有效订单数据，自动停止");
            } else if (!nextPageBtn) {
                updateStatus("已到达最后一页，记录完成");
            }
        }
    }

    // 完成自动记录
    function finishAutoRecording() {
        isAutoRecording = false;
        stopRecordingFlag = false;
        updateStatus(`记录完成! 共记录 ${Object.keys(orderList).length} 条订单`);
    }

    // 添加当前页面的订单到导出列表
    function addCurrentPageOrdersToList() {
        const orders = document.getElementsByClassName("js-order-container");
        let count = 0;

        for (let order of orders) {
            let items = processOrder(order, null);
            if (!items) {
                continue;
            }
            count += Object.keys(items).length;
            _.forEach(items, (value, key) => {
                orderList[key] = value;
            })
        }

        updateOrderCount();
        updateStatus(`已添加 ${count} 条订单，总计 ${Object.keys(orderList).length} 条`);
    }

    // 导出csv
    function toCsv(header, data, filename) {
        if (Object.keys(data).length === 0) {
            updateStatus("没有订单数据可导出");
            return;
        }

        let rows = "";
        let row = header.join(",");
        rows += row + "\n";

        _.forEach(data, value => {
            rows += _.replace(value.join(","), '#', '@') + "\n";
        })

        let blob = new Blob(["\ufeff" + rows], {
            type: 'text/csv;charset=utf-8;'
        });
        let encodedUrl = URL.createObjectURL(blob);
        let url = document.createElement("a");
        url.setAttribute("href", encodedUrl);
        url.setAttribute("download", filename + ".csv");
        document.body.appendChild(url);
        url.click();
        document.body.removeChild(url);

        updateStatus(`已导出 ${Object.keys(data).length} 条订单数据`);
    }

    function exportOrders() {
        const header = ["订单号", "下单日期", "商品明细", "商品链接", "单价", "数量", "实付款", "状态"];
        toCsv(header, orderList, "淘宝订单导出_" + new Date().toLocaleDateString());
    }

    // 清空订单
    function cleanOrderList() {
        let count = Object.keys(orderList).length;
        orderList = {};
        updateOrderCount();
        updateStatus(`已清除 ${count} 条订单记录`);
    }

    // 处理订单-获取订单的详细信息
    function processOrder(order, time) {
        let outputData = {};
        let textContent = order.textContent;
        let pattern = /(\d{4}-\d{2}-\d{2})订单号: ()/;
        let isExist = pattern.exec(textContent);
        let insuranceText = "保险服务";

        if (!isExist) {
            return null;
        }

        const date = isExist[1];
        const id = order.querySelector("div[data-id]")?.getAttribute("data-id");
        if (!id) return null;

        let index = 0;
        if (time != undefined && time != null) {
            if (date != time) {
                if (date < time) {
                    return null;
                }
                return null;
            }
        }

        let productQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.1.0.0.1']");
        let priceQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$1.0.1.1']");
        let countQuery = order.querySelector("p[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$2.0.0']");
        let actualPayQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$4.0.0.2.0.1']");
        let itemUrlQuery = order.querySelector("a[href]");

        if (!productQuery || productQuery.textContent == insuranceText) {
            return null;
        }

        let price = priceQuery?.textContent || "0";
        let count = countQuery?.textContent || "1";
        let actualPay = actualPayQuery?.textContent || "0";
        let orderStatus = "";

        if (index === 0) {
            let statusQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$5.0.0.0']");
            orderStatus = statusQuery?.textContent || "";
        }

        let itemUrl = itemUrlQuery?.href || "";

        outputData[id + index] = [
            id,
            date,
            productQuery.textContent.replace(/,/g, "，"),
            itemUrl,
            parseFloat(price),
            count,
            actualPay,
            orderStatus,
        ];

        return outputData;
    }
})();