// ==UserScript==
// @name         淘宝已购买爬取
// @namespace    http://tampermonkey.net/
// @version      2024-01-22-2
// @description  爬取tb的已购买清单，并导出为表格
// @author       menkeng
// @match        https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       context-menu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485324/%E6%B7%98%E5%AE%9D%E5%B7%B2%E8%B4%AD%E4%B9%B0%E7%88%AC%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485324/%E6%B7%98%E5%AE%9D%E5%B7%B2%E8%B4%AD%E4%B9%B0%E7%88%AC%E5%8F%96.meta.js
// ==/UserScript==
var flag = false
var batchSize = 20;
var ordersData = [];
var regex_num = /\d{9,}/;
var removestr = ["\\[交易快照\\]", "\\(含运费：￥0.00\\)"];
var regex_str = new RegExp(removestr.join("|"), "g");
var maxPage = parseInt($(".row-mod__row___1aPep.js-actions-row-bottom ul li:nth-last-child(3)").text(), 10);


function goToNextPage(currentPage) {
  var nextPageButton = $(".pagination-next");
  if (!nextPageButton.hasClass("pagination-disabled")) {
    nextPageButton.click();
    currentPage++;
  } else {
    flag = true
    downloadCSV(ordersData, "淘宝已购买订单.csv");
  }
  return currentPage;
}

function getOrdersData() {
  var orderid, ordertime, shopName;
  $(".bought-table-mod__table___AnaXt.bought-wrapper-mod__table___3xFFM").each(function () {
    // 遍历所有的订单表格
    var $table = $(this);
    var orderItems = [];
    orderid = $table.find(".bought-wrapper-mod__head-info-cell___29cDO > span > span").text();
    orderid = orderid.match(regex_num)[0];
    ordertime = $table.find(".bought-wrapper-mod__create-time___yNWVS").text();
    shopName = $table.find(".seller-mod__name___2IlQm").text();
    $table.find("tbody > tr").each(function (index) {
      if (index === 0) {
        // 第一行是标题，跳过订单级别的数据
      } else {
        var $cells = $(this).find("td");
        var itemData = {
          orderid: orderid,
          ordertime: ordertime,
          shopName: shopName,
          productName: $cells.eq(0).find("div > div:nth-child(2) > p:first-child").text().replace(regex_str, "").trim(),
          specification: $cells.eq(0).find("div > div:nth-child(2) p span span:last-child").text(),
          unitPrice: $cells.eq(1).find("p:last-child").text(),
          quantity: $cells.eq(2).text(),
          total: $cells.eq(4).text().replace(regex_str, ""),
          url: $cells.eq(0).find("a").attr("href"),
        };
        orderItems.push(itemData);
      }
    });
    ordersData.push({
      orderid: orderid,
      ordertime: ordertime,
      shopName: shopName,
      items: orderItems,
    });
  });
}

var max_page = $(".row-mod__row___1aPep.js-actions-row-bottom ul li:nth-last-child(3)").text();
var next_page = $(".pagination-next");

function downloadCSV(ordersData, fileName) {
  var csvRows = ["订单ID,年,月,日,店铺名称,商品名称,规格,单价,件数,总计,数量,材质,购买链接"];

  var regex_pack = /(\d+)(双|个|套|只|把|件|支|条|块|张|颗|根|份|台|座|辆|枚|片|条)/;
  var colorsToRemove = [
    '白色', '紫红色', '米白色', '桔红色', '巧克力色',
    '红色', '藕色', '深紫色', '银色', '粉红色',
    '蓝色', '古铜色', '黑色', '乳白色', '灰色',
    '桔色', '深卡其布色', '玫红色', '浅灰色', 
    '深灰色', '天蓝色', '咖啡色', '墨绿色', 
    '杏色', '黄色', '栗色', '卡其色', '绿色', 
    '褐色', '浅蓝色', '深蓝色', '浅黄色', 
    '酒红色', '姜黄色', '香槟色', '军绿色', 
    '紫色', '明黄色', '湖蓝色', '藏青色', 
    '宝蓝色'
  ];
  var colorsRegexStr = colorsToRemove.join('|');
  var regex_color = new RegExp('\\b(' + colorsRegexStr + ')\\b', 'g');
  var regex_material = /(\d+)\s*材质/;

  ordersData.forEach(function (order) {
    var dateParts = order.ordertime.split("-");
    var year = parseInt(dateParts[0], 10); 
    var month = parseInt(dateParts[1], 10); 
    var day = parseInt(dateParts[2], 10); 
    console.log(year, month, day);

    order.items.forEach(function (item) {
      var packMatch = item.specification.match(regex_pack);
      var packQuantity = packMatch ? packMatch[1] : "";

      var materialMatch = item.specification.match(regex_material);
      var materialNumber = materialMatch ? materialMatch[1] : ""; 

      var cleanSpecification = item.specification.replace(regex_color, '');

      csvRows.push(
        [
          '"' + "'" + order.orderid + '"',
          '"' + (isNaN(year) ? "" : year) + '"', 
          '"' + (isNaN(month) ? "" : month) + '"', 
          '"' + (isNaN(day) ? "" : day) + '"', 
          '"' + order.shopName + '"',
          '"' + item.productName + '"',
          '"' + cleanSpecification  + '"',
          '"' + item.unitPrice + '"',
          '"' + item.quantity + '"',
          '"' + item.total + '"',
          '"' + packQuantity + '"', 
          '"' + materialNumber + '"', 
          '"' + item.url + '"'
        ].join(",")
      );
    });
  });

  var csvString = csvRows.join("\n");
  var blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

var currentPage = 1; 

function main() {
  if ((currentPage - 1) % batchSize === 0) {
      ordersData = []; 
  }

  getOrdersData(); 
  currentPage = goToNextPage(currentPage); 

  // 如果当前页是批次的最后一页或者是最后一页
  if (currentPage % batchSize === 0 || flag) {
      downloadCSV(ordersData, "淘宝已购买订单-" + Math.ceil(currentPage / batchSize) + ".csv");
  }

  if (!flag) { 
      setTimeout(main, 5000);
  } else {
      console.log("下载完成！");
  }
}

$(document).ready(function() {
    main();
});