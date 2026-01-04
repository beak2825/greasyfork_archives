// Here is an example of a complete Tampermonkey script that uses SheetJS to load an Excel file:

// ==UserScript==
// @name         妙手订单上传表格批量本地备注快递单号
// @namespace    12358940
// @version      1.8
// @license MIT
// @description  上传表格批量本地备注快递单号
// @author       Your Name
// @match        https://order.chengji-inc.com/order/stock_up/index?purchaseOrderTab=*
// @require https://greasyfork.org/scripts/448905-xlsx-core/code/xlsxcore.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464734/%E5%A6%99%E6%89%8B%E8%AE%A2%E5%8D%95%E4%B8%8A%E4%BC%A0%E8%A1%A8%E6%A0%BC%E6%89%B9%E9%87%8F%E6%9C%AC%E5%9C%B0%E5%A4%87%E6%B3%A8%E5%BF%AB%E9%80%92%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/464734/%E5%A6%99%E6%89%8B%E8%AE%A2%E5%8D%95%E4%B8%8A%E4%BC%A0%E8%A1%A8%E6%A0%BC%E6%89%B9%E9%87%8F%E6%9C%AC%E5%9C%B0%E5%A4%87%E6%B3%A8%E5%BF%AB%E9%80%92%E5%8D%95%E5%8F%B7.meta.js
// ==/UserScript==
async function selectExcelFile() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xls,.xlsx,.csv';
  input.addEventListener('change', function() {
    var errorMessages = [];
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = async function(e) {
          var 全部商家ID = await 获取妙手订单商家ID();
          console.log('商家ID:', 全部商家ID);
          var data = e.target.result;
          var workbook = XLSX.read(data, {type: 'binary'});
          var sheet_name_list = workbook.SheetNames;
          var json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
          console.log('JSON data:', json_data);
          for (let i = 0; i < json_data.length; i++) {
              const delivery = json_data[i];
              const recipient = delivery["收件人"];
              let mobile = delivery["收件人联系方式"] || delivery["收件人电话"] || delivery["手机号"];
              mobile = mobile.replace(/'/g, '');//去掉表格可能包含的单引号'
              const courier = delivery["快递"] || delivery["快递公司"];
              const trackingNumber = delivery["快递单号"] || delivery["运单号"];
              if (!recipient || !mobile || !courier || !trackingNumber) {
                for (let i = 0; i < json_data.length; i++) {
                    if (!recipient || !mobile || !courier || !trackingNumber) {
                        errorMessages.push(`收件人：${recipient} 手机号：${mobile} 快递：${courier} 快递单号：${trackingNumber} \n错误：识别的信息不完整`);
                    }
                }
                  return;
              }
              console.log(`${recipient} : ${mobile} - ${courier}: ${trackingNumber}`);
              var orderIdinfo = await 获取妙手订单采购信息(recipient, mobile, 全部商家ID);
              if (orderIdinfo.result === "fail" && orderIdinfo.reason.includes("已过期")) {
                  const expiredStoreIds = orderIdinfo.reason.match(/\[(\d+)\]/g).map(id => id.slice(1, -1));
                  全部商家ID = 全部商家ID.filter(id => !expiredStoreIds.includes(id));
                  orderIdinfo = await 获取妙手订单采购信息(recipient, mobile, 全部商家ID);
              }
              console.log(orderIdinfo);
              if (orderIdinfo.orderListHtml.includes("没有找到相应的订单信息")) {
                errorMessages.push(`收件人：${recipient} 手机号：${mobile} \n错误：没有找到相应的订单信息`);
                console.log(`没有找到相应的订单信息`);
                  continue;
              }
              for (let i = 0; i < orderIdinfo.orderList.length; i++) {
                  let oldvenderNote = orderIdinfo.orderList[i].venderNote;
                  if (oldvenderNote && oldvenderNote.includes('-undefined:undefined')) {
                      const regex = /【([^】]*)】/;
                      const match = oldvenderNote.match(regex);
                      const extractedString = match[0];
                      const { orderIds } = orderIdinfo.orderList[i];
                      await saveBatchVenderNote(orderIds, extractedString,1);
                  }
                  if (oldvenderNote && oldvenderNote.includes(trackingNumber)) {
                      //本地备注已有单号就跳过
                      continue;
                  }
                  const { orderIds } = orderIdinfo.orderList[i];
                  const venderNote = `-${courier}:${trackingNumber}`;
                  await saveBatchVenderNote(orderIds, venderNote);
                  console.log(`订单${orderIds}备注成功`);
              }
          }
          alert("快递单号备注完成");
          if (errorMessages.length > 0) {
            const errorMessagesString = errorMessages.join('\n');
            const errorMessagesElement = document.createElement('textarea');
            errorMessagesElement.value = errorMessagesString;
            errorMessagesElement.setAttribute('readonly', '');
            errorMessagesElement.style.position = 'absolute';
            errorMessagesElement.style.left = '-9999px';
            document.body.appendChild(errorMessagesElement);
            errorMessagesElement.select();
            document.execCommand('copy');
            document.body.removeChild(errorMessagesElement);
            console.log(`以下信息存在问题，请检查并修改：\n${errorMessagesString}\n已复制到剪贴板`);
            alert(`以下信息存在问题，请检查并修改：\n${errorMessagesString}\n已复制到剪贴板`);

        }
      };
      reader.readAsBinaryString(file);
  });
  input.click();
}
/**
* @param {订单号} orderId
* @param {备注内容} venderNote
* @param {覆盖订单备注传入：1} fg
*/
async function saveBatchVenderNote(orderIds,venderNote,fg) {
  let url = "https://order.chengji-inc.com/order/stock_up/save_batch_vender_note";
  let obj = `orderIds%5B%5D=${orderIds}&venderNote=${venderNote}`
  if (fg === 1) {
      obj = `orderId=${orderIds}&venderNote=${venderNote}`
      url = "https://order.chengji-inc.com/order/stock_up/save_order_vender_note";
  }

  const headers = {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": "\"Chromium\";v=\"112\", \"Microsoft Edge\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
  };
  const referrer = "https://order.chengji-inc.com/order/stock_up/index?purchaseOrderTab=has_send";
  const referrerPolicy = "strict-origin-when-cross-origin";
  const method = "POST";
  const mode = "cors";
  const credentials = "include";
  const body = obj;

  const response = await fetch(url, { headers, referrer, referrerPolicy, method, mode, credentials, body });
  const data = await response.json();
  console.log(data);
  if (data.result !== "success") {
      console.error('订单号：'+orderIds+"Error: " + data.result);
  }
}

/**
* @param {收件人} fullname
* @param {订单备注或本地备注的手机号} venderRemark
* @param {全部商家ID} 全部商家ID
*/

/**
* @param {收件人} fullname
* @param {订单备注或本地备注的手机号} venderRemark
* @param {全部商家ID} 全部商家ID
*/
async function 获取妙手订单采购信息(fullname='', venderRemark='', 全部商家ID) {
  //时间模块
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth();
  let endmonth = time.getMonth() + 1;
  let date = time.getDate();
  if (month < 10) { month = '0' + month };
  if (date < 10) { date = '0' + date };
  let 开始时间 = time.getFullYear() - 1 + '-' + month + '-' + date;
  let 截至时间 = year + '-' + endmonth + '-' + date;
  //时间模块结束
  //构造请求参数
  let purchaseOrderTab = 'has_send';
  let authVenderIds = 全部商家ID.join("&authVenderIds%5B%5D=");
  let body = `_zc_csrf=MWBib0ZpNjMuRgEHECUOW3s2Ci4rO2R6XD44FgguU1pmJQoNCzpmWF02&useOrderStateFilter=0&purchaseOrderTab=${purchaseOrderTab}&pageSize=20&sortType=orderStartTimeDesc&isFromExport=0&isPurchase=&onlyShowAutoOutstorageFail=&isOrderAddressDifferent=&isPurchaseOrderingAndWaitPay=&onlyShowMoreThanTwoHoursOrder=&hasUploadOrderMobile=&expressStatus=&jingPeiOrder=&oldFilterAuthVenderIds=${authVenderIds}&authVenderIds%5B%5D=${authVenderIds}&searchTimeType=orderStartTime&orderStartTime=${开始时间}&orderEndTime=${截至时间}&orderId=&provinceIds=&isCustomArea=&isExclude=&keywords=&purchaseOrderBuyer=&purchaseOrderSn=&fullname=${fullname}&pin=&logisticsId=0&waybillCode=&mobile=&skuName=&orderRemark=&venderRemark=${venderRemark}&skuId=&needInvoice=&searchType=byItemNum&itemNumSearchType=accurate&keyword=&platformGroup=&page=1`;
  let headers = {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": "\"Chromium\";v=\"112\", \"Microsoft Edge\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
  };
  let referrer = "https://order.chengji-inc.com/order/stock_up/index?purchaseOrderTab=has_send";
  let referrerPolicy = "strict-origin-when-cross-origin";
  let method = "POST";
  let mode = "cors";
  let credentials = "include";
  let fetchUrl = "https://order.chengji-inc.com/order/stock_up/search_order_list";
  let response = await fetch(fetchUrl, {headers,referrer,referrerPolicy,body,method,mode,credentials});
  let data = await response.json();
  if (data.total === 0 && purchaseOrderTab === 'has_send') {//已发货订单没找到，找已完成的
    purchaseOrderTab = 'finished';
    body = `_zc_csrf=MWBib0ZpNjMuRgEHECUOW3s2Ci4rO2R6XD44FgguU1pmJQoNCzpmWF02&useOrderStateFilter=0&purchaseOrderTab=${purchaseOrderTab}&pageSize=20&sortType=orderStartTimeDesc&isFromExport=0&isPurchase=&onlyShowAutoOutstorageFail=&isOrderAddressDifferent=&isPurchaseOrderingAndWaitPay=&onlyShowMoreThanTwoHoursOrder=&hasUploadOrderMobile=&expressStatus=&jingPeiOrder=&oldFilterAuthVenderIds=${authVenderIds}&authVenderIds%5B%5D=${authVenderIds}&searchTimeType=orderStartTime&orderStartTime=${开始时间}&orderEndTime=${截至时间}&orderId=&provinceIds=&isCustomArea=&isExclude=&keywords=&purchaseOrderBuyer=&purchaseOrderSn=&fullname=${fullname}&pin=&logisticsId=0&waybillCode=&mobile=&skuName=&orderRemark=&venderRemark=${venderRemark}&skuId=&needInvoice=&searchType=byItemNum&itemNumSearchType=accurate&keyword=&platformGroup=&page=1`;
    response = await fetch(fetchUrl, {headers,referrer,referrerPolicy,body,method,mode,credentials});
    data = await response.json();
  }
  return data;
};

async function 获取妙手订单商家ID() {
  const 全部商家ID = [];
  try {
      const response = await fetch("https://order.chengji-inc.com/user/vender_auth/getVenderAuthGroupMap", {
          method: "GET",
          headers: { "Content-type": "application/json; charset='UTF-8'" }
      });
      const data = await response.json();
      //获取全部商家ID添加到数组
      for (const authGroup of Object.values(data.authGroupMap)) {
          for (const member of authGroup.members) {
              if (!全部商家ID.includes(member.vender_id)) {
                  console.log(`${member.vender_id}-${member.shop_name}`);
                  全部商家ID.push(member.vender_id);
              }
          }
          if (!全部商家ID.includes(authGroup.group_owner_vender_id)) {
              全部商家ID.push(authGroup.group_owner_vender_id);
          }
      }
      console.log(全部商家ID);
      const res = await 获取妙手订单采购信息("","",全部商家ID);
      return 全部商家ID;
  } catch (error) {
      console.error(error);
  }
}

(function() {
  'use strict';
  var selectButton = document.createElement('button');
  selectButton.innerHTML = '选择表格备注';
  selectButton.onclick = function() {
      selectExcelFile();
  };
  selectButton.classList.add('btn', 'btn-info', 'btn-sm', 'm-l');
  var parentElement = document.getElementById('J_batchExportBtn').parentNode;
  parentElement.insertBefore(selectButton, document.getElementById('J_batchExportBtn').nextSibling);
})();