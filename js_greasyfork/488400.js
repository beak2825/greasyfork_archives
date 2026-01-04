// ==UserScript==
// @name         24.02.25淘宝物流信息（个人使用）
// @version      2.5
// @description  淘宝物流信息获取
// @author       menkeng
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @match        https://buyertrade.taobao.com/trade/itemlist/*
// @namespace    https://greasyfork.org/users/935835
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @connect      yun.zhuzhufanli.com
// @grant        GM_getResourceURL
// @connect      http://yun.zhuzhufanli.com/mini/create/
// @connect      http://adventure.land
// @resource ogg http://adventure.land/sounds/loops/empty_loop_for_js_performance.ogg
// @resource wav http://adventure.land/sounds/loops/empty_loop_for_js_performance.wav
// @downloadURL https://update.greasyfork.org/scripts/488400/240225%E6%B7%98%E5%AE%9D%E7%89%A9%E6%B5%81%E4%BF%A1%E6%81%AF%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/488400/240225%E6%B7%98%E5%AE%9D%E7%89%A9%E6%B5%81%E4%BF%A1%E6%81%AF%EF%BC%88%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==


// let ogg = new Audio(GM_getResourceURL("ogg").replace("data:application", "data:audio/ogg"));
// ogg.loop = true;
// unsafeWindow.ogg = ogg;

// let wav = new Audio(GM_getResourceURL("wav").replace("data:application", "data:audio/wav"));
// wav.loop = true;
// unsafeWindow.wav = wav;

// document.addEventListener("visibilitychange", function () { //document不可见时循环播放空音频 可见时暂停
//     document.hidden ? ogg.play() : ogg.pause() //ogg和wav二选一就行
// })

var flag = false;
var batchSize = 100;
var ordersData = [];
var regex_num = /\d{9,}/;
var removestr = ["\\[交易快照\\]", "\\(含运费：￥0.00\\)"];
var regex_str = new RegExp(removestr.join("|"), "g");
var maxPage = parseInt($(".row-mod__row___1aPep.js-actions-row-bottom ul li:nth-last-child(3)").text(), 10);
var max_page = $(".row-mod__row___1aPep.js-actions-row-bottom ul li:nth-last-child(3)").text();
var next_page = $(".pagination-next");
var csvString = "";
var dataArray = [];
var updatedList = [];

function hoverAndScroll(element, scrollDistance) {
  return new Promise((resolve) => {
    const mouseover = new MouseEvent("mouseover", {
      view: document.defaultView,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(mouseover);
    window.scrollBy(0, scrollDistance);
    // 留出足够时间让页面处理滚动和鼠标悬停事件
    setTimeout(resolve, 400);
  });
}

async function hoverelement() {
  const anchors = $("a:contains('查看物流')");
  const count = anchors.length;
  const pageHeight = document.body.scrollHeight;
  const scrollDistance = pageHeight / count;

  for (let i = 0; i < count; i++) {
    // 等待上一个 hoverAndScroll 完成后，再执行下一个
    await hoverAndScroll(anchors[i], scrollDistance * i);
  }
}
function filterstautus() {
  var links = $("a:contains('查看物流')");
  links.each(function () {
    var className = $(this).attr("class");
    if (className.includes("text-mod__primary___zjRQH")) {
      updatedList.push("已发货");
    } else if (className.includes("text-mod__hover___1TDrR")) {
      updatedList.push("部分发货");
    } else { updatedList.push("异常"); }
  });
}
function goToNextPage(currentPage) {
  var nextPageButton = $(".pagination-next");
  if (!nextPageButton.hasClass("pagination-disabled")) {
    nextPageButton.click();
    currentPage++;
  } else {
    flag = true;
    exportlist(ordersData);
  }
  return currentPage;
}
var orderid, ordertime, shopName, ship_company, ship_id, ship_time, ship_status;
var innerindex = 0;
function getOrdersData() {
  $(".bought-table-mod__table___AnaXt.bought-wrapper-mod__table___3xFFM").each(function (index) {
    var $table = $(this);
    var orderItems = [];
    var skip = false;
    if (updatedList[index] == "部分发货") {
      skip = true;
    }
    if (skip) {
      ship_company = ship_id = ship_time = ship_status = "部分发货"
      console.log("跳过部分发货订单:", index);
    } else {
      var ship_dom = $('[style="position: absolute; top: 0px; left: 0px; width: 100%;"]').eq(innerindex);
      ship_company = $(ship_dom).find("div > span:first-child").text();
      ship_id = $(ship_dom).find("div > span:last-child").text();
      ship_time = $(ship_dom).find("ul > li:first-child > p:first-child").text();
      ship_status = $(ship_dom).find("ul > li:first-child > p:nth-child(2)").text();
      innerindex++
    }
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
          productName: $cells
            .eq(0)
            .find("div > div:nth-child(2) > p:first-child")
            .text()
            .replace(regex_str, "")
            .replace("  采到旺销王| 收藏到旺销王", "")
            .trim(),
          specification: $cells.eq(0).find("div > div:nth-child(2) p span span:last-child").text(),
          unitPrice: $cells.eq(1).find("p:last-child").text(),
          quantity: $cells.eq(2).text(),
          total: $cells.eq(4).text().replace(regex_str, ""),
          url: $cells.eq(0).find("a").attr("href").replace("//", ""),
        };
        orderItems.push(itemData);
      }
    });
    ordersData.push({
      orderid: orderid,
      ordertime: ordertime,
      shopName: shopName,
      items: orderItems,
      ship_company: ship_company,
      ship_id: ship_id,
      ship_time: ship_time,
      ship_status: ship_status,
    });
  });
}

function exportlist(ordersData) {
  dataArray = [
    [
      "淘宝",
      "订单ID",
      "店铺名称",
      "商品名称",
      "规格",
      "单价",
      "件数",
      "总计",
      "数量",
      "材质",
      "快递",
      "快递单号",
      "物流状态",
      "最后更新时间",
      "购买链接",
    ],
  ];
  var regex_pack = /(\d+)(双|个|套|只|把|件|支|条|块|张|颗|根|份|台|座|辆|枚|片|条)/;
  var colorsToRemove = [
    "白色",
    "紫红色",
    "米白色",
    "桔红色",
    "巧克力色",
    "红色",
    "藕色",
    "深紫色",
    "银色",
    "粉红色",
    "蓝色",
    "古铜色",
    "黑色",
    "乳白色",
    "灰色",
    "桔色",
    "深卡其布色",
    "玫红色",
    "浅灰色",
    "深灰色",
    "天蓝色",
    "咖啡色",
    "墨绿色",
    "杏色",
    "黄色",
    "栗色",
    "卡其色",
    "绿色",
    "褐色",
    "浅蓝色",
    "深蓝色",
    "浅黄色",
    "酒红色",
    "姜黄色",
    "香槟色",
    "军绿色",
    "紫色",
    "明黄色",
    "湖蓝色",
    "藏青色",
    "宝蓝色",
  ];
  var colorsRegexStr = colorsToRemove.join("|");
  var regex_color = new RegExp("\\b(" + colorsRegexStr + ")\\b", "g");
  var regex_material = /(\d+)\s*材质/;
  ordersData.forEach(function (order) {
    var dateParts = order.ordertime.split("-");
    var year = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10);
    var day = parseInt(dateParts[2], 10);
    order.items.forEach(function (item) {
      var packMatch = item.specification.match(regex_pack);
      var packQuantity = packMatch ? packMatch[1] : "";
      var materialMatch = item.specification.match(regex_material);
      var materialNumber = materialMatch ? materialMatch[1] : "";
      var cleanSpecification = item.specification.replace(regex_color, "");
      var rowData = [
        order.ordertime,
        order.orderid,
        order.shopName,
        item.productName,
        cleanSpecification,
        item.unitPrice,
        item.quantity,
        item.total,
        packQuantity,
        materialNumber,
        order.ship_company,
        order.ship_id,
        order.ship_time,
        order.ship_status,
        item.url,
      ];
      dataArray.push(rowData);
    });
  });
  return dataArray;
}
var currentPage = 1;
function main() {
  // if ((currentPage - 1) % batchSize === 0) {
  //   ordersData = [];
  // }
  getOrdersData();
  // currentPage = goToNextPage(currentPage);
}

// 飞书系列
// 请求飞书api
var app_id = "cli_a552fcd44272d00b";
var app_secret = "3ngFgRHTqfawejIx5QdekGDMkNufIXZ6";
var tenantAccessToken = "";
// var spreadsheetId = 'Kdv0slsCVhK5QGtMhyUcVhIyn3d';
// var sheetId = '2CuMer';
var spreadsheetId = "Kdv0slsCVhK5QGtMhyUcVhIyn3d";
var sheetId_taobao = "2CuMer";
var sheetId_changjia = "3LaMxN!";
const appid = 257605
const outerid = "863BE260DF474CC8"
var sheet_read_result = {}; // 用于快递查询的对象
var sheet_read_shipcompany = [];
var sheet_read_shipid = [];
var query_list = [];
var resultArray = [];
var resultObject = {};
let empty_array = new Array(100).fill().map(() => new Array(15).fill([]));
// 请求飞书tenantAccessToken-----------------------
async function get_tenant_access_token() {
  return new Promise((resolve, reject) => {
    const auth_url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal";
    const auth_headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    const body = JSON.stringify({
      app_id: app_id,
      app_secret: app_secret,
    });
    GM_xmlhttpRequest({
      method: "POST",
      url: auth_url,
      headers: auth_headers,
      data: body,
      onload: function (response) {
        if (response.status >= 200 && response.status < 400) {
          var responseData = JSON.parse(response.responseText);
          tenantAccessToken = responseData.tenant_access_token;
          resolve(responseData.tenant_access_token); // Resolve with the token
        } else {
          reject("获取 tenantAccessToken 失败: " + response.responseText);
        }
      },
      onerror: function () {
        reject("Request failed");
      },
    });
  });
}
// 请求表格元数据--------------------------
function get_sheet_info() {
  const sheet_info_url = "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/" + spreadsheetId + "/metainfo";
  const sheet_info_headers = {
    Authorization: "Bearer " + tenantAccessToken,
    "Content-Type": "application/json; charset=utf-8",
  };
  GM_xmlhttpRequest({
    method: "GET",
    url: sheet_info_url,
    headers: sheet_info_headers,
    onload: function (response) {
      if (response.status >= 200 && response.status < 400) {
        var responseData = JSON.parse(response.responseText);
        console.log("get_sheet_info:", responseData);
      } else {
        console.error("Request failed with status:", response.status);
      }
    },
    onerror: function () {
      console.error("Request failed");
    },
  });
}
// 表格写入数据---------------------------
function sheet_update(range, data, tenantAccessToken) {
  return new Promise((resolve, reject) => {
    // console.log(`写入范围: ${range}，数据: ${JSON.stringify(data)}`);
    var sheet_update_url = "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/" + spreadsheetId + "/values";
    var headers = {
      Authorization: `Bearer ${tenantAccessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    };
    var body = JSON.stringify({
      valueRange: {
        range: range,
        values: data,
      },
    });
    GM_xmlhttpRequest({
      method: "PUT",
      url: sheet_update_url,
      headers: headers,
      data: body,
      onload: function (response) {
        if (response.status >= 200 && response.status < 400) {
          console.log("写入表格成功:", response.responseText);
          resolve(response.responseText);
        } else {
          reject("写入表格错误:", response.responseText);
        }
      },
      onerror: function () {
        reject("Request failed");
      },
    });
  });
}
// 表格写入数据---------------------------
// 表格读取数据---------------------------
function sheet_read(range, tenantAccessToken) {
  return new Promise((resolve, reject) => {
    var spreadsheetId = "Kdv0slsCVhK5QGtMhyUcVhIyn3d";
    var sheet_read_url =
      "https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/" +
      spreadsheetId +
      "/values/" +
      range +
      "?valueRenderOption=FormattedValue";
    var headers = {
      Authorization: `Bearer ${tenantAccessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    };
    GM_xmlhttpRequest({
      method: "GET",
      url: sheet_read_url,
      headers: headers,
      // data: body,
      onload: function (response) {
        if (response.status >= 200 && response.status < 400) {
          var responseData = JSON.parse(response.responseText);
          var responsearray = responseData.data.valueRange.values;
          resolve(responsearray);
        } else {
          reject("读取表格失败: " + response.responseText);
        }
      },
      onerror: function () {
        reject("Request failed");
      },
    });
  });
}

async function readSheetAndProcessData(range) {
  try {
    const tenantAccessToken = await get_tenant_access_token();
    console.log("tenant_access_token:", tenantAccessToken); // 调用 sheet_read 函数读取数据
    const sheetData = await sheet_read(range, tenantAccessToken);
    return sheetData; // 返回 sheetData
  } catch (error) {
    console.error(error);
  }
}
async function findInSpreadsheet(sheetId, range, find) {
  const url = 'https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/' + spreadsheetId + '/sheets/' + sheetId + '/find';
  const requestData = {
    find_condition: {
      range: range,
      match_case: true,
      match_entire_cell: false,
      search_by_regex: false,
      include_formulas: false
    },
    find: find
  };

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      headers: {
        'Authorization': `Bearer ${tenantAccessToken}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      onload: function (response) {
        if (response.status >= 200 && response.status < 400) {
          const data = JSON.parse(response.responseText);
          resolve(data);
        } else {
          reject(`请求失败: ${response.status} - ${response.statusText}`);
        }
      },
      onerror: function (error) {
        reject("发生错误: " + error);
      }
    });
  });
}
function GM_xmlhttpRequestAsync(details) {
  return new Promise((resolve, reject) => {
    details.onload = function (response) {
      resolve(response);
    };

    details.onerror = function (error) {
      reject(error);
    };

    GM_xmlhttpRequest(details);
  });
}
function active() {
  const chromeVersion = /Chrome\/([0-9.]+)/.exec(window?.navigator?.userAgent)?.[1]?.split('.')[0];
  if (chromeVersion && parseInt(chromeVersion, 10) >= 88) {
    console.log(chromeVersion);
    const videoDom = document.createElement('video');
    const hiddenCanvas = document.createElement('canvas');
    videoDom.setAttribute('style', 'display:none');
    videoDom.setAttribute('muted', '');
    videoDom.muted = true;
    videoDom.setAttribute('autoplay', '');
    videoDom.autoplay = true;
    videoDom.setAttribute('playsinline', '');
    hiddenCanvas.setAttribute('style', 'display:none');
    hiddenCanvas.setAttribute('width', '1');
    hiddenCanvas.setAttribute('height', '1');
    hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
    videoDom.srcObject = hiddenCanvas?.captureStream();
  }
}
function start() {
  filterstautus();
  hoverelement();
  setTimeout(() => {
    main();
    active()
    setTimeout(async () => {
      try {
        tenantAccessToken = await get_tenant_access_token();
        // exportlist(ordersData);
        // console.log("ordersData:", ordersData);
        await sheet_update(sheetId_taobao, empty_array, tenantAccessToken);
        sheet_update(sheetId_taobao, exportlist(ordersData), tenantAccessToken);
      } catch (error) {
        console.error("Failed to get tenant access token:", error);
      }
    }, 2000);
  }, 40 * 1000);
}
var starturl = "https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&tabCode=waitConfirm#update"
var 刷新间隔 = 70
if (location.href == starturl) {
  console.log("start")
  setTimeout(() => {
    setTimeout(() => {
      console.log("refresh")
      location.href = starturl
      location.reload();
    }, 刷新间隔 * 1000);
  }, 3000);
  start();

}



