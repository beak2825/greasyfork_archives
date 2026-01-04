// ==UserScript==
// @name         TestStockRelease
// @namespace    JuicefishTest
// @version      0.0.1
// @description  N/A
// @author       Juciefish
// @match        https://acgn-stock.com/company/detail/5xHYWdPgkAqAaqaat
// @downloadURL https://update.greasyfork.org/scripts/36252/TestStockRelease.user.js
// @updateURL https://update.greasyfork.org/scripts/36252/TestStockRelease.meta.js
// ==/UserScript==

var scriptCompanyName = "鞠奈 自動收藏";
var scriptCompanyID = "5xHYWdPgkAqAaqaat";
var scriptUserID = "y3A9xyFXCAgvKidfq";

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


var avoidOnece = 0;

var lastListPrice = 0;
var nextPredictPrice = 0;

var buyInitial = 1;
var buyOnece = 0;

var initBuyAmout = 100;
var nextBuyAmout = 100;

var functionDelay = 3000;

function Tester() {
    // Only run the code if Meteor is loaded
    if (!meteorIsLoaded()) {
        return;
    }

    if(avoidOnece === 0)
    {
        PrintTime(scriptCompanyName + " : Initial Time @ ");
        
        avoidOnece = 1;
        AvoidMeteorIdle();
        
        
        Meteor.connection._mongo_livedata_collections.companies.find().observeChanges({
            added(id, fields) {
                if(id == scriptCompanyID && fields["listPrice"] != undefined)
                {
                    console.log(scriptCompanyName  +  " ：取得公司資訊：", fields["companyName"], " ", id);
                    UpdatePriceByField(fields["listPrice"]);
                }
                
                if(id == scriptCompanyID && fields["listPrice"] != undefined && buyInitial === 0)
                {
                    buyInitial = 1;
                    UpdatePriceByField(fields["listPrice"]);
                    PrintTime(scriptCompanyName + " : 新創買股動作 @ ");
                    Meteor.customCall("createBuyOrder", {"companyId":scriptCompanyID, "unitPrice":nextPredictPrice, "amount":initBuyAmout});
                }
            }
        });
        
        Meteor.connection._mongo_livedata_collections.companies.find().observeChanges({
            changed(id, fields) {
                if(id == scriptCompanyID && fields["lastPrice"] != undefined)
                    PrintTime(scriptCompanyName + " : 成交價變動 [" + fields["lastPrice"] +"] @ ");
                    
                if(id == scriptCompanyID && fields["listPrice"] != undefined)
                    PrintTime(scriptCompanyName + " : 參考價變動 [" + fields["listPrice"] +"] @ ");
                
                // 若參考價更新時
                if(id == scriptCompanyID && fields["listPrice"] > lastListPrice && buyOnece === 0)
                {
                    buyOnece = 1;
                    var previousListPrice = lastListPrice;
                    UpdatePriceByField(fields["listPrice"]);
                    PrintTime(scriptCompanyName + " : 買股動作 [$" + nextPredictPrice + "] @ ");
                    
                    //var retriveID = Meteor.connection._mongo_livedata_collections.orders.findOne({companyId : scriptCompanyID, userId : scriptUserID, unitPrice: previousListPrice})["_id"];
                    setTimeout(Meteor.customCall, functionDelay * 0, "createBuyOrder", {"companyId":scriptCompanyID, "unitPrice":nextPredictPrice, "amount":nextBuyAmout});
                    //setTimeout(Meteor.customCall, functionDelay * 1, "retrieveOrder", retriveID);
                    
                }
            }
        });
    }
    return;
}

function AvoidMeteorIdle()
{
    PrintTime(scriptCompanyName + " : Avoid Idle @ ");
    UserStatus.pingMonitor();
    setTimeout(AvoidMeteorIdle, 5 * 60 * 1000);
}

function UpdatePriceByField(a_newListPrice)
{
    lastListPrice = a_newListPrice;
    nextPredictPrice = Math.ceil(lastListPrice * 1.15);
    PrintTime(scriptCompanyName + " : 目前參考價 [$" + lastListPrice +"] @ ");
    PrintTime(scriptCompanyName + " : 下次預估價 [$" + nextPredictPrice +"] @ ");
}

function UpdatePrice()
{
    lastListPrice = Meteor.connection._mongo_livedata_collections.companies.findOne({"_id":scriptCompanyName})["listPrice"];
    nextPredictPrice = Math.ceil(lastListPrice * 1.15);
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

