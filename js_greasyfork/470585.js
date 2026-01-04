// ==UserScript==
// @name               temu Seller Assistant
// @name:zh-CN         temu批量加入发货台
// @include            http*://seller.kuajingmaihuo.com/main/*
// @description        temu batch add
// @description:zh-cn  temu批量加入发货
// @grant              GM_getValue
// @grant              GM_setValue
// @version            3.2.8
// @run-at             document-end
// @compatible         chrome 测试通过
// @namespace          https://greasyfork.org/users/1123819
// @require https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js
// @require            https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// 验证网址是否包含某字符串
// @downloadURL https://update.greasyfork.org/scripts/470585/temu%20Seller%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/470585/temu%20Seller%20Assistant.meta.js
// ==/UserScript==
// 验证网址是否包含某字符串

function UrlExp(textStr) {
  return RegExp(textStr).test(window.location.href);
}
// 创建选择器的简化写法
function dQuery(selector) {
  return document.querySelector(selector);
}
function dQueryAll(selector) {
  return document.querySelectorAll(selector);
}
//初始化参数
function init(){
//清除定时任务
localStorage.removeItem("intervalId")
// 我的备货单页面
if (UrlExp(/order-manage-urgency|order-manage|shipping-desk|sale-manage/)) {
  setTimeout(() => {
    let contactMsgs = [
      ["GM_START_DELIVERY", "开始加入发货台"],
      ["GM_END_DELIVERY"  , "结束加入发货台"],
      ["COLLECT_SALE_DATA", "销售数据采集"]
  ]
  let button = dQuery('.GM_START');
  if(null === button){
    let buttonBar = document.createElement('div');
    contactMsgs.forEach((item) => {
        buttonBar.innerHTML += `<input class="${item[0]}" type="button" value="${item[1]}" style="margin: 20px;"/>`;
    });
    dQuery('.index-module__bodyContainer___3qKSt').children[0].children[0].children[0].appendChild(buttonBar);
    dQuery('.GM_START_DELIVERY').addEventListener('click', (event) => {
      startAddShippedTable();
    });
    dQuery('.GM_END_DELIVERY').addEventListener('click', (event) => {
      endAddShippedTable();
    });
    dQuery('.COLLECT_SALE_DATA').addEventListener('click', (event) => {
      collectSaleData();
    });
  }
  keyBoardEndAddShippingInfo()
  },3000)
  urlHasChange();
}
}

//开始加入发货台
function startAddShippedTable(){
if(null !== localStorage.getItem("intervalId")){
  console.log("任务已存在");
  clearInterval(localStorage.getItem("intervalId"));
}
var intervalId = addDeliverTable();
console.log( "定时任务开关" + intervalId);
localStorage.setItem("intervalId", intervalId)
}

//结束加入发货台
function endAddShippedTable(){
  if(null !== localStorage.getItem("intervalId")){
      console.log("清除已存在定时任务" + localStorage.getItem("intervalId"));
      clearInterval(localStorage.getItem("intervalId"));
      localStorage.removeItem("intervalId")
    }
}

//开始创建发货单
function startCreateInvoice(){
  if(null !== localStorage.getItem("createInvoiceId")){
      console.log("任务已存在")
      clearInterval(localStorage.getItem("createInvoiceId"));
    }
    var intervalId = createInvoice();
    console.log( "定时任务开关" + intervalId);
    localStorage.setItem("createInvoiceId", intervalId);
}

//结束创建发货单
function endCreateInvoice(){
  if(null !== localStorage.getItem("createInvoiceId")){
      console.log("清除已存在定时任务" + localStorage.getItem("createInvoiceId"));
      clearInterval(localStorage.getItem("createInvoiceId"));
      localStorage.removeItem("createInvoiceId")
    }
}


//加入发货台
function addDeliverTable(){
  var intervalId = setInterval(() => {
      //获取加入发货台按钮
      let btnArr = $('a[data-tracking-id="custom-t3wO-KG-3BT_5xyK"]').filter( function( index , e) {
          var a = e.getAttribute("disabled");
          if(a == null){
              return true;
          }else{
              return false;
          }
      } );
      //点击加入发货台
      btnArr.each(function(index , e){
          e.click();
      });
      //获取确认按钮
      let comfirmArr = dQueryAll('.PP_popoverContent_5-111-0 .body-module__popover___IF379');
      //逐个点击
      comfirmArr.forEach(e =>{
          setTimeout(function(){
              let btn = e.querySelectorAll('button')[0]
              btn.click()
          },generateRandom(500, 1000, 300))
      })
      var failWindow = document.querySelectorAll('div[data-testid="beast-core-modal-mask"]');
      failWindow.forEach(e =>{
          e.parentNode.removeChild(e)
      })
  },1500);
  return intervalId
}

function keyBoardEndAddShippingInfo(){
  document.addEventListener('keydown', function(event) {
      // 处理键盘按下事件
      console.log('结束发货Processing...');
      endAddShippedTable()
      console.log('结束发货成功Processing...');
      var failWindow = document.querySelectorAll('div[data-testid="beast-core-modal-mask"]');
      failWindow.forEach(e =>{
          e.parentNode.removeChild(e)
      })
      var maskList = document.querySelectorAll('.MDL_innerWrapper_5-111-0');
      maskList.forEach(e =>{
        e.parentNode.removeChild(e)
      })
      var failWindow = document.querySelectorAll('div[data-testid="beast-core-modal"]');
      failWindow.forEach(e =>{
          e.parentNode.removeChild(e)
      })
});
}


//创建发货单
function createInvoice(){
var intervalId = setInterval(() => {
  console.log('创建发货单')
  if(UrlExp(/shipping-list/)){
    //返回发货台
    console.log('返回发货台')
    returnShippingDesk();
  }
  //点击查询按钮
  let button = $('button[data-tracking-id="xqVOakOmzZvI1RvU"]');
  button.each(function(index , e){
    e.click();
});
  setTimeout(function() {}, 1000)
  let inputArr = dQueryAll('.CBX_squareInputWrapper_5-72-0');
  inputArr.forEach((element, index) => {
      if (index === 0) {
        return;
      }
        //点击创建发货单
        element.click();
      //console.log(element);
    });
    setTimeout(function(){
      //点击创建发货单
      let createInvoiceBtn = $('button[data-tracking-id="O2EwJMyrt0ciAraT"]');
      createInvoiceBtn.click();
    },2000);
    //点击确认创建发货单
    setTimeout(function(){
      let confirmsArr = document.querySelector('.body-module__footer___APhLF');
      let button = confirmsArr.querySelector('button');
      button.click();
    },1000);
    if(UrlExp(/create/)){
    //点击创建备货单
    let create = document.querySelector('.shipping-desk_nBarWrapper__bXfOf');
    let button = create.querySelector('button');
    button.click();
    }
}, 20000)
return intervalId;
}
//返回发货台
function returnShippingDesk(){

let shippingDeskMenu = $('a[data-tracking-id="menu-/main/order-manager/shipping-desk"]');
shippingDeskMenu.each(function(index , e){
  e.click();
});
}


(function(jQuery){
  'use strict';
  console.log('脚本开始执行');
  //初始化参数
  init();
})();

function urlHasChange(){
  // 获取当前URL
  var currentUrl = window.location.href;
  // 定时检测URL是否发生变化
  setInterval(function() {
      if (window.location.href !== currentUrl) {
          if (UrlExp(/order-manage-urgency|order-manage/)) {
              endAddShippedTable();
            }else if(UrlExp(/order-manage-urgency|order-manage/)){
              endCreateInvoice();
            }
            console.log('URL发生变化');
            currentUrl = window.location.href;
      }}, 1000);
}
function generateRandom(min, max, step) {
  const randomNum = min + Math.random() * (max - min);
  return Math.round(randomNum / step) * step;
}