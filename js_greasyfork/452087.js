// ==UserScript==
// @name         (视频号、微信小店)-订单-代发货：商品数量统计
// @namespace    ojh
// @version      0.2
// @description  统计(视频号、微信小店)-订单-代发货的每个商品数量
// @license      GPL3.0
// @author       ojh
// @match        https://channels.weixin.qq.com/shop/order/*
// @match        https://mp.weixin.qq.com/wxatrade/order/*
// @icon         https://*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/452087/%28%E8%A7%86%E9%A2%91%E5%8F%B7%E3%80%81%E5%BE%AE%E4%BF%A1%E5%B0%8F%E5%BA%97%29-%E8%AE%A2%E5%8D%95-%E4%BB%A3%E5%8F%91%E8%B4%A7%EF%BC%9A%E5%95%86%E5%93%81%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/452087/%28%E8%A7%86%E9%A2%91%E5%8F%B7%E3%80%81%E5%BE%AE%E4%BF%A1%E5%B0%8F%E5%BA%97%29-%E8%AE%A2%E5%8D%95-%E4%BB%A3%E5%8F%91%E8%B4%A7%EF%BC%9A%E5%95%86%E5%93%81%E6%95%B0%E9%87%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

var statisticOrderCount = 0;//已统计的订单数
var currentPageOrderCount = 0;//当前页订单数量
const goodsMap = []

//统计当前页订单中的商品
function statisticCurrentPage() {
    // document.getElementById("total").attributes["enable"] = false;
    //获取订单表格table
    var table = document.getElementsByClassName("table_container")[0];

    //获取包含商品信息的订单elements
    var orders = table.getElementsByClassName("table-main-info");
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].classList.length != 1) continue;
        //正确获取到订单中的商品信息行
        statisticOrderCount++;
        //商品名称xx（规格：xx）
        var goodsName = orders[i].getElementsByClassName("good-title")[0].textContent.trim() + "(规格：" + orders[i].getElementsByClassName("good-attr")[0].textContent.trim() + ")";
        //数量
        var goodsCount = parseInt(orders[i].getElementsByClassName("good-num")[0].textContent.replace("×", "").trim());
        //累计
        if (goodsMap[goodsName] != null) {
            goodsCount += goodsMap[goodsName];
        }
        //记录
        goodsMap[goodsName] = goodsCount;
    }


    //输出结果
    var resultStr = "";
    for (var key in goodsMap) {
        resultStr += (key.trim() + "，数量（" + goodsMap[key] + "）\n");
    }
    document.getElementById("result").textContent = resultStr;

    //更新窗口数据
    document.getElementById("order_all").textContent = "已统计订单数:" + statisticOrderCount;
}

//添加展示窗口
window.onload = () => {
    console.log("window.onload start");

    //container
    let container = document.getElementsByClassName("order_list_page")[0];
    // console.log(container);
    //div
    let div = document.createElement("div");
    div.innerHTML = `<h2 id="order_all">已统计订单数:0</h2>
    <button id="total" type="button">统计当前页</button>\
    <h3 id="order_current"></h3>
    <textarea id="result" title="统计结果"  cols="80" rows="10"></textarea>`;
    container.appendChild(div);

    //点击事件
    document.getElementById("total").addEventListener("click", statisticCurrentPage, false);
    console.log("window.onload end");
}

(function () {
    'use strict';
})();