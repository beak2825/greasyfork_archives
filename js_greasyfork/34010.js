// ==UserScript==
// @name         ACGN-Stock股票事件監聽
// @namespace    http://tampermonkey.net/
// @version      0.003
// @description  監聽ACGN網頁變化並給予Addevent
// @author       Ming
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        none
// ==/UserScript==
// ==/UserScript==

class BaseEvent {
  constructor(pattern) {
    this.pattern = pattern;
    this.callbacklist = [];
  }
  AddEventListner(callback) { this.callbacklist.push(callback); }
  RunCallback() {
    for (let i = 0; i < this.callbacklist.length; i++) {
      this.callbacklist[i]();
    }
  }
  CheckUrllState() {
    if (document.location.href.search(this.pattern) !== -1) {
      setTimeout(this.RunCallback.bind(this), 1000);
    }
  }
}
class Company extends BaseEvent {
  constructor() {
    super(/company\/detail/);
  }
}
class StockSummary extends BaseEvent {
  constructor() {
    super(/company\/[0-9]+/);
  }
}
class AccountInfo extends BaseEvent {
  constructor() {
    super(/accountInfo/);
  }
}
class Foundation extends BaseEvent {
  constructor() {
    super(/foundation\/[0-9]+/);
  }
}
class ACGNClass {
  constructor() {
    this.oldUrl = "";
    this.EventList = [];
    this.EventList.push(new Company());
    this.EventList.push(new StockSummary());
    this.EventList.push(new AccountInfo());
    this.EventList.push(new Foundation());
    setTimeout(this.BindMain.bind(this),5000);
  }
  BindMain(){
    console.log(this);
    $("#main").bind("DOMNodeInserted DOMNodeRemoved", this.MainDivCheck.bind(this));
    console.log("ACGN-Stock Listener Done");
  }
  MainDivCheck() {
    // 因AJAX動態生成不斷執行，所以有時候main的變動並不代表換頁，此時無須重新加入事件
    if (this.oldUrl === document.location.href) return;
    this.oldUrl = document.location.href;

    //偵測網址並呼叫callback
    for(let i = 0 ;i < this.EventList.length;i++)
      this.EventList[i].CheckUrllState();
  }
  AddCompanyListener(callback){
    this.EventList[0].AddEventListner(callback);
  }
  AddStockSummaryListener(callback){
    this.EventList[1].AddEventListner(callback);
  }
  AddAccountInfoListener(callback){
    this.EventList[2].AddEventListner(callback);
  }
  AddFoundationListener(callback){
    this.EventList[3].AddEventListner(callback);
  }
  AddCutsomEvent(event){
    this.EventList.push(event);
    return this.EventList.indexOf(event);
  }
  AddCutsomListener(eventIndex,callback){
    this.EventList[eventIndex].AddEventListner(callback);
  }
}
const ACGNListener = new ACGNClass();

////////////以上為程式碼，以下為使用範例
function ListenerDebugMode(){
  console.log("ACGN-Stock股票事件監聽開啟除錯模式");

  //新增監聽
  ACGNListener.AddCompanyListener(function(){console.log("AddCompanyListener");});
  ACGNListener.AddStockSummaryListener(function(){console.log("AddStockSummaryListener");});
  ACGNListener.AddAccountInfoListener(function(){console.log("AddAccountInfoListener");});
  ACGNListener.AddFoundationListener(function(){console.log("AddFoundationListener");});

  //註冊客製化事件，輸入網址辨識片段
  let seasonalReportEventindex = ACGNListener.AddCutsomEvent(new BaseEvent(/seasonalReport/));
  //新增客製化事件監聽
  ACGNListener.AddCutsomListener(seasonalReportEventindex, function(){console.log("AddSeasonalReportListener");});
}
