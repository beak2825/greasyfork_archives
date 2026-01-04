// ==UserScript==
// @name         订单管理
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  方便的下载淘宝系和京东订单信息
// @author       You
// @grant        none
// @include      https://buyertrade.taobao*
// @include      https://trade.taobao*
// @include      https://trade.tmall*
// @include      https://details.jd*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/402256/%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/402256/%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

/**
 * 链接匹配
 */
const tbOrderListRe = /(http|https):\/\/buyertrade\.taobao.*?\/trade/g;
const tbOrderDetailRe = /(http|https):\/\/trade\.taobao.*?\/trade/g;
const tmOrderDetailRe = /(http|https):\/\/trade\.tmall.*?\/detail/g;
const jdOrderDetailRe = /(http|https):\/\/details\.jd.*?/g


/**
 * 淘宝订单列表开始
 */
let tbOrderList = {} // 淘宝订单列表数据

if (tbOrderListRe.exec(document.URL)) {
    const element = document.getElementById("J_bought_main");
    addButtonToPage(element, tbExportOrdersToCsv, "导出订单", "160px");
    addButtonToPage(element, tbAddCurrentPageOrdersToList, "添加本页订单", "160px");
    console.log("淘宝订单列表脚本启动完成！");
}

function tbAddCurrentPageOrdersToList() {
    const orders = document.getElementsByClassName("js-order-container");

    for (let order of orders) {

        let orderItems = tbParseOrder(order);

        if (!orderItems) {
            continue;
        }

        _.forEach(orderItems, (value, key) => {
            tbOrderList[key] = value;
        })
    }
}

function tbExportOrdersToCsv() {

    let csvHeader = ["订单号", "下单日期", "商品明细", "单价", "数量", "总价", "状态"];

    exportToCsv(csvHeader, tbOrderList, "淘宝订单导出")
}

/**
 * 解析列表页淘宝单个订单块
 */
function tbParseOrder(order) {

    let output = {};
    let content = order.textContent;
    let pattern = /(\d{4}-\d{2}-\d{2})订单号: (\d{18})/;
    let noAndDate = pattern.exec(content);

    if (!noAndDate) {
        console.log('解析订单失败！');
        return null;
    }

    const orderDate = noAndDate[1];
    const orderNo = noAndDate[2];

    let orderIndex = 0;

    while (1) {
        let countPrefix = ".0.7:$order-" + orderNo + ".$" + orderNo + ".0.1:1:0.$" + orderIndex + ".$2.0.0";
        let productPrefix = ".0.7:$order-" + orderNo + ".$" + orderNo + ".0.1:1:0.$" + orderIndex + ".$0.0.1.0.0.1";
        let pricePrefix = ".0.7:$order-" + orderNo + ".$" + orderNo + ".0.1:1:0.$" + orderIndex + ".$1.0.1.1";
        let statusPrefix = ".0.7:$order-" + orderNo + ".$" + orderNo + ".0.1:1:0.$" + orderIndex + ".$5.0.0.0";

        let countQuery = order.querySelector("p[data-reactid='" + countPrefix + "']");
        let productQuery = order.querySelector("span[data-reactid='" + productPrefix + "']");
        let priceQuery = order.querySelector("span[data-reactid='" + pricePrefix + "']");

        if (orderIndex === 0) {
            let statusQuery = order.querySelector("span[data-reactid='" + statusPrefix + "']");
            status = statusQuery.textContent;
        }

        orderIndex++;

        if (countQuery === null || productQuery === null || priceQuery === null) {
            break;
        }

        let unitPrice = priceQuery.textContent;
        let count = countQuery.textContent;

        output[orderNo + orderIndex] = [
            "NO." + orderNo,
            "D." + orderDate,
            productQuery.textContent,
            parseFloat(unitPrice),
            count,
            parseFloat(unitPrice) * parseFloat(count),
            status,
        ]
    }

    return output;
}

/**
 * 淘宝订单列表结束
 */

/**
 * 淘宝订单详情开始
 */

if (tbOrderDetailRe.exec(document.URL)) {
    const element = document.getElementById("content");
    addButtonToPage(element, tbGeneratePrintPage, "生成打印页面", "160px");
}

function tbGeneratePrintPage() {
    document.body.innerHTML = document.getElementsByClassName('app-mod__tabs-container___iwi0I')[0].innerHTML;
    document.body.style.width = "950px";
    document.body.style.marginLeft = "auto";
    document.body.style.marginRight = "auto";
    window.print();
}

/**
 * 淘宝订单详情结束
 */

/**
 * 天猫订单详情开始
 */

if (tmOrderDetailRe.exec(document.URL)) {
    const element = document.getElementById("content");
    addButtonToPage(element, tmGeneratePrintPage, "生成打印页面", "160px");
}

function tmGeneratePrintPage() {
    document.title = "交易详情"
    document.body.innerHTML = document.getElementById('appDetailPanel').innerHTML + "</br>" + document.getElementById('appOrders').innerHTML + "</br>" + document.getElementById('appAmount').innerHTML;
    window.print();
}

/**
 * 天猫订单详情结束
 */

/**
 * 京东订单详情开始
 */

let jdOrderDetail = {}

if (jdOrderDetailRe.exec(document.URL)) {
    const element = document.getElementById("container");
    jdParseOrderDetail()
    addButtonToPage(element,jdExportOrderToCsv, "导出订单 Excel", "160px")
}

function jdExportOrderToCsv() {
    let csvHeader = ["商品明细", "商品编号", "单价", "数量", "总价"];

    exportToCsv(csvHeader, jdOrderDetail, "京东订单导出")
}

function jdParseOrderDetail() {
    let items = document.getElementsByClassName("goods-list")[0].getElementsByTagName("tbody")[0]

    _.forEach(items.getElementsByTagName("tr"), value => {

        if (value.className === "J-yunfeixian") {
            return 0;
        }

        let content = value.innerText;

        if (!content) {
            return 0;
        }

        let detail = content.match(/\n(.+?)\n/)[1];
        let pattern = /\t(\d{5,})\t(.+?)\t(\d+)\t(\d+)/
        let productNo = content.match(pattern)[1]
        let unitPriceStr = content.match(pattern)[2]
        let count = content.match(pattern)[3]
        let unitPrice;

        if (/¥/.exec(unitPriceStr)) {
            unitPrice = parseFloat(unitPriceStr.match(/\d+\.\d{2}/)[0]);
        } else {
            unitPrice = 0.0;
        }

        jdOrderDetail[productNo] = [detail, "NO." + productNo, unitPrice, count, parseFloat(count) * unitPrice]
    })

    jdOrderDetail['paid_total'] = ["\n应付总金额：", document.getElementsByClassName("txt count")[0].innerText];
}

/**
 * 京东订单详情结束
 */


/**
 * 公共方法
 */
function addButtonToPage(element, onclickFunc, value = "未指定按钮", width = "60px", height = "60px") {
    const button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.style.width = width;
    button.style.height = height;
    button.style.align = "center";
    button.style.marginLeft = "250px";
    button.style.marginBottom = "10px";
    button.style.background = "#409EFF";
    button.style.border = "1px solid #409EFF";
    button.style.color = "white";
    button.onclick = function () {
        onclickFunc();
    }
    element.appendChild(button);
    element.insertBefore(button, element.childNodes[0]);
}

function exportToCsv(header, data, filename) {
    let rows = "";
    let row = header.join(",");
    rows += row + "\n";

    _.forEach(data, value => {
        rows += _.replace(value.join(","), '#', '@') + "\n";
    })

    let blob = new Blob(["\ufeff" +rows],{type: 'text/csv;charset=utf-8;'});
    let encodedUri = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename + ".csv");
    document.body.appendChild(link);
    link.click();
}
