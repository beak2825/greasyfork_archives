// ==UserScript==
// @name         Taobao orders export 淘宝订单快递导出
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Based on 淘宝买家订单导出 by CMA, added tracking number on top of it to the export data. Instructions are listed on GitHub
// @author       Trizzy33
// @include      https://buyertrade.taobao*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528003/Taobao%20orders%20export%20%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%BF%AB%E9%80%92%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528003/Taobao%20orders%20export%20%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%BF%AB%E9%80%92%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==


//github https://github.com/Trizzy33/taobaoTrackingNumberExport/blob/main/script


let orderList = [];
let state = {
    orderList: [],
    isProcessing: false,
    shouldStop: false,
    currentWindow: null
};

function addButton(parent, onClick, text) {
    const btn = document.createElement("input");
    btn.type = "button";
    btn.value = text;
    Object.assign(btn.style, {
        padding: "10px 20px",
        margin: "10px",
        backgroundColor: "#409EFF",
        border: "none",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s ease"
    });
    btn.onmouseenter = () => { btn.style.backgroundColor = "#66b1ff"; };
    btn.onmouseleave = () => { btn.style.backgroundColor = "#409EFF"; };
    btn.onclick = onClick;
    parent.insertBefore(btn, parent.firstChild);
}

if (/buyertrade\.taobao/.test(window.location.href)) {
    const main = document.getElementById("J_bought_main");
    addButton(main, addCurrentPageOrdersToList, "添加本页订单");
    addButton(main, exportOrders, "导出订单");
    addButton(main, stopScript, "停止脚本");
}

function toCsv(header, data, filename) {
    let rows = '\uFEFF' + header.join(',') + '\n';
    for (let order of data) {
        // 防止 Excel 科学计数：加 \t
        order[0] = '\t' + order[0]; // 订单号
        order[7] = order[7] ? '\t' + order[7] : ''; // 运单号
        rows += order.join(',') + '\n';
    }
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function addCurrentPageOrdersToList() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    state.shouldStop = false;
    const orders = document.querySelectorAll(".js-order-container");
    processOrders(orders);
}

function exportOrders() {
    const header = ["订单号", "商品名称", "商品链接", "单价", "数量", "实付款", "状态", "快递单号"];
    toCsv(header, orderList, "淘宝订单导出");
}

function stopScript() {
    state.shouldStop = true;
    state.isProcessing = false;
    if (state.currentWindow && !state.currentWindow.closed) {
        state.currentWindow.close();
    }
    if (state.orderList.length > 0) exportOrders();
}

function processOrders(orders, current = 0, results = []) {
    if (current >= orders.length || state.shouldStop) {
        console.table(results);
        return results;
    }

    const order = orders[current];
    const id = order.getAttribute('data-reactid')?.match(/order-(\d+)/)?.[1];

    const statusText = order.querySelector("span[data-reactid*='.$5.0.0.0']")?.textContent || '';
    if (statusText.includes("交易成功")) {
        return processOrders(orders, current + 1, results); // skip finished orders
    }

    processOrderItems(order, id, 0, [], (orderResults) => {
        orderList.push(orderResults);
        setTimeout(() => processOrders(orders, current + 1, results), 500);
    });
}

function processOrderItems(order, id, index = 0, productNames = [], callback) {
    try {
        let productQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.1.0.0.1']");
        if (productQuery == null) {
            // 没有更多商品，结束处理，返回合并名称
            const joinedNames = productNames.join('||') || '';
            const queries = {
                itemUrl: order.querySelector("a[href]"),
                price: order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$0.$1.0.1.1']"),
                count: order.querySelector("p[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$0.$2.0.0']"),
                actualPay: order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$0.$4.0.0.2.0.1']"),
                status: order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$0.$5.0.0.0']"),
                tracking: order.querySelector("#viewLogistic")
            };

            if (queries.status?.textContent === '交易成功') {
                callback(); // 跳过
                return;
            }

            const orderItem = [
                id,
                joinedNames,
                queries.itemUrl?.href || '',
                parseFloat(queries.price?.textContent || 0),
                queries.count?.textContent || '',
                queries.actualPay?.textContent || '',
                queries.status?.textContent || ''
            ];

            if (queries.tracking) {
                getTrackingNumberViaHover(queries.tracking).then(trackingNumber => {
                    orderItem.push(trackingNumber);
                    callback(orderItem);
                });
            } else {
                orderItem.push('0');
                callback(orderItem);
            }

            return;
        }

        // 有商品，记录商品名后递归
        productNames.push(productQuery.textContent.replace(/,/g, "，"));
        processOrderItems(order, id, index + 1, productNames, callback);
    } catch (e) {
        console.error(`处理订单 ${id} 时出错`, e);
        callback([]);
    }
}

async function getTrackingNumberViaHover(el) {
    return new Promise((resolve) => {
        if (state.shouldStop) return resolve('0');
        ['mouseenter', 'mouseover'].forEach(e => el.dispatchEvent(new MouseEvent(e, { bubbles: true })));
        const observer = new MutationObserver((mutations, obs) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    const tooltip = node.querySelector?.('.logistics-info-mod__header___gNRGw');
                    if (tooltip) {
                        const match = tooltip.textContent.match(/\d{13,}/);
                        if (match) {
                            obs.disconnect();
                            return resolve(match[0]);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            resolve('0');
        }, 4000);
    });
}
