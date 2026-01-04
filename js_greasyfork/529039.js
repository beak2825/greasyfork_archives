// ==UserScript==
// @name         拼多多导出訂單油猴脚本 PDD order lists export to excel GreaseMonkey script
// @namespace    https://www.pinduoduo.com/
// @version      1.5
// @description  导出拼多多订单信息
// @author       ForkedFrom吾愛破解yiqifeng
// @match        https://mobile.yangkeduo.com/orders.html*
// @match        https://mobile.pinduoduo.com/orders.html*
// @grant        GM_download
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529039/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%AF%BC%E5%87%BA%E8%A8%82%E5%96%AE%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%20PDD%20order%20lists%20export%20to%20excel%20GreaseMonkey%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/529039/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%AF%BC%E5%87%BA%E8%A8%82%E5%96%AE%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%20PDD%20order%20lists%20export%20to%20excel%20GreaseMonkey%20script.meta.js
// ==/UserScript==

const $ = (selector) => document.querySelector(selector);

$('body').insertAdjacentHTML('beforeend', '<div class="pdd-go-to-app" id="export">导出数据</div>');

$('#export').addEventListener('click', startScrolling);

function startScrolling() {
    let scrollInterval = setInterval(function () {
        let text = $('.rbl-loading-text').textContent;
        console.log(text);
        if (text === "没有更多了...") {
            clearInterval(scrollInterval);
            fetchDataAndExport();
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 800);
}

function fetchDataAndExport() {
    let order = [];
    let listOrder = [...$('#base-list0>.react-base-list').children];

    listOrder.forEach(row => {
        order.push(row.innerText.split('\n\n'));
    });

    exportToCSV(order);
}

function exportToCSV(order) {
    let orderlist = '店铺名称,交易状态,商品名称,型号分类,价格,数量,实际付款\r\n';

    order.forEach(row => {
        console.log(row);
        let isPrice = row[3] && row[3].charAt(0) === "￥";
        row = row.map(cell => cell.replace(/\r|\n|\r\n|\n\r|\t|,|￥/ig, ""));

        if (isPrice) {
            let priceMatch = row[3].match(/(\d+\.?\d*)(×|x)(.*)/);
            let price = priceMatch ? [priceMatch[1], priceMatch[3]] : [row[3], ''];
            let fields = [row[0], row[1], row[2], 'null', price[0], price[1], row[5]];
            orderlist += fields.join(',') + '\r\n';
        } else {
            let priceMatch = row[4].match(/(\d+\.?\d*)(×|x)(.*)/);
            let price = priceMatch ? [priceMatch[1], priceMatch[3]] : [row[4], ''];
            let fields = [row[0], row[1], row[2], row[3], price[0], price[1], row[6]];
            orderlist += fields.join(',') + '\r\n';
        }
    });

    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(orderlist);
    const link = document.createElement("a");
    link.href = uri;
    link.download = '拼多多订单数据.csv';
    link.click();
}
