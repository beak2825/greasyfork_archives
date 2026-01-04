// ==UserScript==
// @name         淘宝买家订单导出插件
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  基于-淘宝买家订单导出这个插件做了一些拓展
// @author       kubrick
// @include      https://buyertrade.taobao*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452853/%E6%B7%98%E5%AE%9D%E4%B9%B0%E5%AE%B6%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/452853/%E6%B7%98%E5%AE%9D%E4%B9%B0%E5%AE%B6%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
function addButton(element, onclickFunc, color, value = "按钮", width = "40px", height = "40px",) {
    const button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.style.height = height;
    button.style.width = width;
    button.style.align = "center";
    button.style.marginBottom = "10px";
    button.style.marginLeft = "50px";
    button.style.color = "white";
    button.style.background = color;
    button.style.border = "1px solid #409EFF";

    button.onclick = function () {
        onclickFunc();
    }

    element.appendChild(button);
    element.insertBefore(button, element.childNodes[0]);
}

const orderListPage = /(http|https):\/\/buyertrade\.taobao.*?\/trade/g;
const buttonWidth = "80px"
if (orderListPage.exec(document.URL)) {
    const orderListMain = document.getElementById("J_bought_main");
    addButton(orderListMain, addCurrentPageOrdersToList, "#1E90FF", "添加当页订单", buttonWidth,);
    addButton(orderListMain, addOrdersToReportListV2, "#1E90FF", "添加昨日订单", buttonWidth);
    addButton(orderListMain, cleanOrderList, "#1E90FF", "清除订单", buttonWidth);
    addButton(orderListMain, exportOrders, "#1E90FF", "导出订单", buttonWidth);
    addButton(orderListMain, timerReportYesterday, "#1E90FF", "定时导出订单", buttonWidth);
}

let flag = true
let yesterday = getYesterday()

// 添加昨日订单到导出列表
function addOrdersToReportListV2() {

    // 1、循环所有的页面订单，小于指定日期直接进行返回
    // 2、先获取当前页面的，有下一页就获取下一页，直到没有下一页。
    get_next_page_order(yesterday)

    while (flag) {
        document.getElementsByClassName("pagination-next")[0].click();
        // 延迟执行
        sleep(get_next_page_order, 2000);
    }
    console.info("添加订单成功!")
}
// 跳转到下一页(需要递归)
function get_next_page_order(time) {

    const orders = document.getElementsByClassName("js-order-container");
    if (orders == null || orders == undefined) {
        return
    }
    for (let order of orders) {
        let items = processOrder(order, yesterday);
        if (!items) {
            continue;
        }
        _.forEach(items, (value, key) => {
            orderList[key] = value;
        })
    }
    console.info("添加了: (" + Object.keys(orderList).length + ") 条订单")
}

// 导出csv
function toCsv(header, data, filename) {
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
}
// 清空
function cleanOrderList() {
    let count = Object.keys(orderList).length
    orderList = {}
    console.info("清除订单成功!")
    console.info("清除了: (" + count + ") 条订单")
}
let orderList = {}
// 添加当前页面的订单到导出列表
function addCurrentPageOrdersToList() {
    const orders = document.getElementsByClassName("js-order-container");

    for (let order of orders) {
        let items = processOrder(order, null);
        if (!items) {
            continue;
        }
        _.forEach(items, (value, key) => {
            orderList[key] = value;
        })
    }
    console.info("添加订单成功!")
}

function exportOrders() {
    const header = ["订单号", "下单日期", "商品明细", "商品链接", "单价", "数量", "实付款", "状态"];
    toCsv(header, orderList, "淘宝订单导出")
}

// 处理订单-获取订单的详细信息
function processOrder(order, time) {

    let outputData = {};
    let textContent = order.textContent;
    let pattern = /(\d{4}-\d{2}-\d{2})订单号: ()/;
    let isExist = pattern.exec(textContent);
    let insuranceText = "保险服务";

    if (!isExist) {
        console.log('暂未发现订单！');
    } else {
        const date = isExist[1];
        const id = order.querySelector("div[data-id]").getAttribute("data-id");
        let index = 0;

        if (time != undefined) {
            if (time != null) {
                if (date != time) {
                    if (date < time) {
                        flag = false
                        return
                    }
                    return
                }
            }
        }

        let productQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.1.0.0.1']");
        let priceQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$1.0.1.1']");
        let countQuery = order.querySelector("p[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$2.0.0']");
        let actualPayQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$4.0.0.2.0.1']");
        let itemUrlQuery = order.querySelector("a[href]");

        if (productQuery === null) {
            return;
        }

        let price = priceQuery.textContent;
        if (productQuery.textContent == insuranceText) {
            return;
        }

        let count = countQuery.textContent;
        let actualPay;
        if (actualPayQuery != null) {
            // 实付金额
            actualPay = actualPayQuery.textContent;
        } else {
            count = 1;
        }
        let orderStatus = ""
        if (index === 0) {
            let statusQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$5.0.0.0']");
            // 订单状态
            orderStatus = statusQuery.textContent;
        }

        let itemUrl = itemUrlQuery.href

        index++;

        outputData[id + index] = [
            id,
            date,
            productQuery.textContent.replace(/,/g, "，"),
            itemUrl,
            parseFloat(price),
            count,
            actualPay,
            orderStatus,
        ]
    }
    return outputData;
}

// 定时导出订单
function timerReportYesterday() {
    console.info("定时导出订单开始处理!")
    // 启动定时器-定时导出订单数据
    setInterval(exportYesterday, 100000);
}
// 今天是否已经导出过订单
let todayExecuteFlag = false

function exportYesterday() {
    let y = getYesterday();
    let t = getToDay();
    // 判断今天是否执行过一次
    if (t > y && !todayExecuteFlag) {
        addOrdersToReportListV2()
        exportOrders()
        todayExecuteFlag = true
    }
}

// 格式化时间
function formatDate(date) {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) {
        month = `0${month}`
    }
    if (day < 10) {
        day = `0${day}`
    }
    return (`${year}-${month}-${day}`)
}

// 获取昨天日期
function getYesterday() {
    return getDate(-1);
}

// 获取今天日期
function getToDay() {
    return getDate(0);
}

function getDate(days) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return formatDate(new Date(year, month, day + days))
}

// setTimeout
let sleep = function (fun, time) {
    setTimeout(() => {
        fun();
    }, time);
}

function openClosePage() {
    const url = "https://trade.tmall.com/detail/orderDetail.htm?spm=a1z09.2.0.0.67002e8dTwCepX&bizOrderId=2944899865585097114";
    let result = getSyncUrlResponse(url)
    console.info(result)
}

function getSyncUrlResponse(url) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open("GET", url, false);
    xhr.send();
    return xhr.responseText;
}