// ==UserScript==
// @name         GFStockAutoBuy
// @namespace    JuicefishTest
// @version      0.0.11
// @description  N/A
// @author       Juciefish
// @match        https://acgn-stock.com/company/detail/4Ks4xaTK6gYoGJz75
// @downloadURL https://update.greasyfork.org/scripts/36254/GFStockAutoBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/36254/GFStockAutoBuy.meta.js
// ==/UserScript==
// ********************************************************************************
// ********************************************************************************

// 腳本追蹤目標
var scriptCompanyName = "亞斯塔祿 自動收藏";
var scriptCompanyID = "4Ks4xaTK6gYoGJz75";

// 是否購買新創狀態(監聽Added), 0為不啟用, 1為啟用
// 以及取得新創時擺多少單上去
var buyInitial = 0;
var initBuyAmout = 512;

// 是否購買股價更新狀態(監聽Changed), 0為不啟用, 1為啟用
// 以及取得下次更價時擺多少單上去
var buyUpdate = 0;
var nextBuyAmout = 256;

// 自動撤單延遲秒數
var functionDelay = 5000;

// 是否要顯示自動防掛網的訊息, 0為不顯示, 1為顯示
var showAvoidIdle = 0;

// 自己的使用者ID, 自動取得
var scriptUserID = "";

// 防止腳本掛上兩次, 不須更動
var avoidOnece = 0;

// Function溝通用變數, 主要用於更價時
var lastListPrice = 0;
var nextPredictPrice = 0;

// ********************************************************************************
// ********************************************************************************
/*
 * 確認Meteor有沒有啟動
 */
function meteorIsLoaded() {
    return typeof(Meteor) === 'object' ? true : false;
}

// ********************************************************************************
// ********************************************************************************
// ***                                                                          ***
// ***                              Main Event                                  ***
// ***                                                                          ***
// ********************************************************************************
// ********************************************************************************
// 觀察頁面載入狀態
function observeLoadingOverlay() {
  new MutationObserver(mutations => {
    mutations.filter(m => m.attributeName === "class").forEach(m => {
      if (m.target.classList.contains("d-none")) {
        onPageLoaded();
      } else {
        onPageLoading();
      }
    });
  }).observe($("#loading .loadingOverlay")[0], { attributes: true });
}

function onPageLoading() {
  //console.log('Page loading: ${document.location.href}');
}

function onPageLoaded() {
  const currentUrl = document.location.href;
  //console.log('Page loaded: ${currentUrl}');

  // 頁面 url 樣式的回呼表
  const urlPatternCallbackTable = [
    { pattern: /company\/[0-9]+/, callback: onStockSummaryPageLoaded },
    { pattern: /company\/detail/, callback: onCompanyDetailPageLoaded },
  ];

  urlPatternCallbackTable.forEach(({ pattern, callback }) => {
    if (currentUrl.match(pattern)) {
      // loadingOverlay 消失後，需要給點時間讓頁面的載入全部跑完
      setTimeout(callback, 100);
    }
  });
}

function onStockSummaryPageLoaded() {
    Tester();
}

function onCompanyDetailPageLoaded() {
    Tester();
}

function Tester() {
    // Only run the code if Meteor is loaded
    if (!meteorIsLoaded()) {
        return;
    }

    if(avoidOnece === 0)
    {
        
        PrintTime(scriptCompanyName + " : Initial Time @ ");

        scriptUserID = Meteor.userId();
        PrintTime(scriptCompanyName + " : Initial User [" + scriptUserID + "] @ ");
        
        avoidOnece = 1;
        AvoidMeteorIdle();
        
        
        Meteor.connection._mongo_livedata_collections.companies.find().observeChanges({
            added(id, fields) {
                if(id == scriptCompanyID && fields["listPrice"] !== undefined)
                {
                    console.log(scriptCompanyName  +  " ：取得公司資訊：", fields["companyName"], " ", id);
                    UpdatePriceByField(fields["listPrice"]);
                }
                
                if(id == scriptCompanyID && fields["listPrice"] !== undefined && buyInitial === 1)
                {
                    buyInitial = 0;
                    UpdatePriceByField(fields["listPrice"]);
                    PrintTime(scriptCompanyName + " : 新創買股動作 @ ");
                    Meteor.customCall("createBuyOrder", {"companyId":scriptCompanyID, "unitPrice":nextPredictPrice, "amount":initBuyAmout});
                }
            }
        });
        if(buyInitial === 1)
            PrintTime(scriptCompanyName + " : 監聽公司創始已啟動 ");
        
        Meteor.connection._mongo_livedata_collections.companies.find().observeChanges({
            changed(id, fields) {
                if(id == scriptCompanyID && fields["lastPrice"] !== undefined)
                    PrintTime(scriptCompanyName + " : 成交價變動 [" + fields["lastPrice"] +"] @ ");
                    
                if(id == scriptCompanyID && fields["listPrice"] !== undefined)
                    PrintTime(scriptCompanyName + " : 參考價變動 [" + fields["listPrice"] +"] @ ");
                
                // 若參考價更新時
                if(id == scriptCompanyID && fields["listPrice"] !== undefined && fields["listPrice"] > lastListPrice && buyUpdate === 1)
                {
                    buyUpdate = 0;
                    var previousListPrice = lastListPrice;
                    UpdatePriceByField(fields["listPrice"]);
                    PrintTime(scriptCompanyName + " : 買股動作 [$" + nextPredictPrice + "] @ ");
                    
                    setTimeout(Meteor.customCall, functionDelay * 0, "createBuyOrder", {"companyId":scriptCompanyID, "unitPrice":nextPredictPrice, "amount":nextBuyAmout});
                    
                    var retriveID = Meteor.connection._mongo_livedata_collections.orders.findOne({companyId : scriptCompanyID, userId : scriptUserID, unitPrice: previousListPrice})["_id"];
                    setTimeout(Meteor.customCall, functionDelay * 1, "retrieveOrder", retriveID);
                    
                }
            }
        });
        if(buyUpdate === 1)
            PrintTime(scriptCompanyName + " : 監聽公司更價已啟動 ");
    }
    return;
}

function AvoidMeteorIdle()
{
    if(showAvoidIdle === 1)
        PrintTime(scriptCompanyName + " : Avoid Idle @ ");
    UserStatus.pingMonitor();
    setTimeout(AvoidMeteorIdle, 5 * 60 * 1000);
}

function UpdatePriceByField(a_newListPrice)
{
    lastListPrice = a_newListPrice;
    if(lastListPrice >=  Meteor.connection._mongo_livedata_collections.variables.findOne("lowPriceThreshold")["value"] )
        nextPredictPrice = Math.ceil(lastListPrice * 1.15);
    else
        nextPredictPrice = Math.ceil(lastListPrice * 1.3);
    PrintTime(scriptCompanyName + " : 目前參考價 [$" + lastListPrice +"] @ ");
    PrintTime(scriptCompanyName + " : 下次預估價 [$" + nextPredictPrice +"] @ ");
}

function UpdatePrice()
{
    lastListPrice = Meteor.connection._mongo_livedata_collections.companies.findOne({"_id":scriptCompanyName})["listPrice"];
    if(lastListPrice >=  Meteor.connection._mongo_livedata_collections.variables.findOne("lowPriceThreshold")["value"] )
        nextPredictPrice = Math.ceil(lastListPrice * 1.15);
    else
        nextPredictPrice = Math.ceil(lastListPrice * 1.3);
    PrintTime(scriptCompanyName + " : 目前參考價 [$" + lastListPrice +"] @ ");
    PrintTime(scriptCompanyName + " : 下次預估價 [$" + nextPredictPrice +"] @ ");
}


function PrintTime(a_title)
{
    var currentdate = new Date(); 
    console.log(a_title +
                currentdate.getFullYear() + "/" + 
                (currentdate.getMonth()+1) + "/" +   
                currentdate.getDate() + 
                " @ " + 
                currentdate.getHours() + ":" + 
                currentdate.getMinutes() + ":" + 
                currentdate.getSeconds());
}

// 程式進入點
(function mainfunction() {
    observeLoadingOverlay();
})();

