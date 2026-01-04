// ==UserScript==
// @name         TestMuramasa
// @namespace    JuicefishTest
// @version      0.0.7
// @description  N/A
// @author       Juciefish
// @match        https://acgn-stock.com/company/detail/Dm9JuyxohzWaXX28q
// @downloadURL https://update.greasyfork.org/scripts/35445/TestMuramasa.user.js
// @updateURL https://update.greasyfork.org/scripts/35445/TestMuramasa.meta.js
// ==/UserScript==

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
  console.log('Page loading: ${document.location.href}');
}

function onPageLoaded() {
  const currentUrl = document.location.href;
  console.log('Page loaded: ${currentUrl}');

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
}

function onCompanyDetailPageLoaded() {
    Tester();
}

var buyOnece = 0;
var avoidOnece = 0;

function Tester() {
    console.log("Juicefish >> Meteor Loaded() : " + meteorIsLoaded());

    // Only run the code if Meteor is loaded
    if (!meteorIsLoaded()) {
        return;
    }

    console.log("-----------------------------------------------------------");
    console.log("-----------------------------------------------------------");
    
    if(avoidOnece === 0)
    {
        avoidOnece = 1;
        AvoidMeteorIdle();
    }
    
    Meteor.connection._mongo_livedata_collections.variables.find().observeChanges({
        changed(id, fields) {
            //if(id=="onlinePeopleNumber" && buyOnece === 1)
                //console.log('Changed', id, fields["value"]);
            if(id=="lastReleaseStocksForNoDealTime" && buyOnece === 0)
            {
                buyOnece = 1;
                console.log('Muramasa : Low Deal >> ', fields["value"]);
                console.log('Muramasa : Do Retrieve Deal.');
                PrintTime("Update Time : ");
                setTimeout(Meteor.customCall, 2100 * 0, "retrieveOrder", "F3rYHXMkwpj6jTCds");
                setTimeout(Meteor.customCall, 2100 * 1, "retrieveOrder", "ecTy74EThZPbPK6uH");
            }
            if(id=="lastRecordListPriceTime" && buyOnece === 0)
            {
                buyOnece = 1;
                console.log('Muramasa : Update Price >> ', fields["value"]);
                console.log('Muramasa : Do Renewal Order');
                PrintTime("Update Time : ");
                setTimeout(Meteor.customCall, 2100 * 0, "retrieveOrder", "KoRP26oty8cmZaE64");
                setTimeout(Meteor.customCall, 2100 * 1, "retrieveOrder", "sKf8eFk9wmJ5Zsgp3");
                setTimeout(Meteor.customCall, 2100 * 2, "createBuyOrder", {"companyId":"Dm9JuyxohzWaXX28q", "unitPrice":339, "amount":10});
                setTimeout(Meteor.customCall, 2100 * 3, "createBuyOrder", {"companyId":"Dm9JuyxohzWaXX28q", "unitPrice":339, "amount":40});
            }
        }
    })

    return;
}

function AvoidMeteorIdle()
{
    console.log('Muramasa : Avoid Idle');
    UserStatus.pingMonitor();
    setTimeout(AvoidMeteorIdle, 5 * 60 * 1000);
}

function PrintTime(a_title)
{
    var currentdate = new Date(); 
    console.log(a_title + currentdate.getDate() + "/" + 
                (currentdate.getMonth()+1)  + "/" + 
                currentdate.getFullYear() + " @ " + 
                currentdate.getHours() + ":" + 
                currentdate.getMinutes() + ":" + 
                currentdate.getSeconds());
}

// 程式進入點
(function mainfunction() {
  observeLoadingOverlay();
})();

