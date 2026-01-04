// ==UserScript==
// @name        扫描发货手动输入补全工具
// @namespace   Violentmonkey Scripts
// @match       https://www.dianxiaomi.com/package/scanPackShipped.htm
// @grant       GM_xmlhttpRequest
// @license MIT
// @require https://update.greasyfork.org/scripts/499487/1404450/%E5%BA%97%E5%B0%8F%E7%A7%98%E9%80%9A%E7%94%A8%E5%87%BD%E6%95%B0.js
// @version     1.4
// @author      -
// @description 2024/5/20 16:26:34
// @downloadURL https://update.greasyfork.org/scripts/495577/%E6%89%AB%E6%8F%8F%E5%8F%91%E8%B4%A7%E6%89%8B%E5%8A%A8%E8%BE%93%E5%85%A5%E8%A1%A5%E5%85%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/495577/%E6%89%AB%E6%8F%8F%E5%8F%91%E8%B4%A7%E6%89%8B%E5%8A%A8%E8%BE%93%E5%85%A5%E8%A1%A5%E5%85%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(async function(){
  var taskList = [];
  let url = "https://www.dianxiaomi.com/package/list.htm";
  let data = {
    "pageNo": 1,
    "pageSize": 300,
    "shopId": "-1",
    "state": "allocated_has",
    "platform": "",
    "isSearch": 0,
    "searchType": "orderId",
    "authId": "-1",
    "startTime": "",
    "endTime": "",
    "country": "",
    "orderField": "order_pay_time",
    "isVoided": 0,
    "isRemoved": 0,
    "ruleId": "-1",
    "sysRule": "",
    "applyType": "",
    "applyStatus": "",
    "printJh": -1,
    "printMd": -1,
    "commitPlatform": "",
    "productStatus": "",
    "jhComment": -1,
    "storageId": 0,
    "isOversea": -1,
    "isFree": 0,
    "isBatch": 0,
    "history": "",
    "custom": -1,
    "timeOut": 0,
    "refundStatus": 0,
    "buyerAccount": "",
    "forbiddenStatus": -1,
    "forbiddenReason": 0,
    "behindTrack": -1,
    "orderId": ""
  }
  let book = await tool.getTotalPage(url,data);
  let orderList = [];
  for(page of book){
    orderList = orderList.concat(page.find("#orderListTable tr[data-orderid]").map(function(){return $(this).children("td:eq(5)").find("a[title='点击查看物流追踪']").text()}).toArray());
  }
  let acomp = $("#scanShippingInput").autocomplete({source:orderList})
  $("#scanShippingInput").on("input",function(){
    var val = $(this).val();
    if(orderList.includes(val)){
      acomp.autocomplete( "disable" );
    }else{
      acomp.autocomplete( "enable" );
    }
  });
})();