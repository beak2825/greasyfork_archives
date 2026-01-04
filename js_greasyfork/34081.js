// ==UserScript==
// @name         Test
// @namespace    JuicefishTest
// @version      0.1.0
// @description  N/A
// @author       Juciefish
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/34081/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/34081/Test.meta.js
// ==/UserScript==


/*
 * 印出物件所有內容的名稱跟值
 */
function printCollections(collectname, a_object) {
    for (var objectName in a_object) {
        try {
            console.log(collectname + objectName + ", Data : " + a_object[objectName]);
        }
        catch(e) {
            console.log(collectname + objectName + ", Data : Not Avaible.");
        }
    }
}

/*
 * 確認Meteor有沒有啟動
 */
function meteorIsLoaded() {
    return typeof(Meteor) === 'object' ? true : false;
}

/*
 * 取得Meteor.users
 */
function GetMetroUsers() {
    // ---------------------------------------------
    // 定義來源物件
    var src = Meteor;
    var col = {name: "Meteor.users", instance: src["users"], count: src["users"].find().count()};
    
    // ---------------------------------------------
    // 物件格式轉換
    console.log("Progress : " + col.name + ", Data : " + col.instance);
    
    col.content = [];
    if (col.count > 0) {
        for (var fetchObject of col.instance.find().fetch()) {
            // Metero的資料只有一筆, 
            // 但是內容物需要做多層Paser
            col.content = col.content.concat(deepProperty(fetchObject, 3));
        }
    }
    // ---------------------------------------------
    // 回傳資料
    return col;
}

/*
 * 取得Mango.Collection.指定collection集
 */
function GetMangoCollection(strProperty) {
    // ---------------------------------------------
    // 定義來源物件
    var src = Meteor.connection._mongo_livedata_collections;
    var col = {name: "Mango.Collection." + strProperty, instance: src[strProperty], count: src[strProperty].find().count()};
    
    // ---------------------------------------------
    // 物件格式轉換
    console.log("Progress : " + col.name + ", Data : " + col.instance);
    
    col.content = [];
    if (col.count > 0) {
        for (var fetchObject of col.instance.find().fetch()) {
            
            // Mango Collections的結構比較單純(大概)
            // 只要把id跟value轉換成自己想讀的格式就可以了
            col.content.push({key:fetchObject._id, value:fetchObject.value});
        }
    }
    // ---------------------------------------------
    // 回傳資料
    return col;
}

/*
 * Debug : 印出相關資訊
 * 屬於原始參考用(未整理)
 */
function DebugCollections() {
    //return Meteor.connection._mongo_livedata_collections;
    var cols = [];
    var objectName;
    // Global collections
    // Global : Mongo, Data : [object Object]
    // Global : Meteor, Data : [object Object]
    for (objectName in unsafeWindow) {
        console.log("Global : " + objectName + ", Data : " + unsafeWindow[objectName]);
        if (unsafeWindow[objectName] instanceof Meteor.Collection) {
            console.log("Global : " + objectName + ", Data : " + unsafeWindow[objectName]);
            cols.push({name: objectName, instance: unsafeWindow[objectName], count: unsafeWindow[objectName].find().count()});
        }
    }
    // Meteor collections
    for (objectName in unsafeWindow.Meteor) {
        console.log("Meteor : " + objectName + ", Data : " + unsafeWindow.Meteor[objectName]);
        if (unsafeWindow.Meteor[objectName] instanceof Meteor.Collection) {
            cols.push({name: 'Meteor.' + objectName, instance: unsafeWindow.Meteor[objectName], count: unsafeWindow.Meteor[objectName].find().count()});
            console.log("Meteor : " + objectName + ", Data : " + unsafeWindow.Meteor[objectName]);
        }
        if(objectName.toUpperCase() == "variables".toUpperCase()){
            //cols.push({name: 'Meteor.' + objectName, instance: unsafeWindow.Meteor[objectName], count:0});
            //console.log("Meteor : " + objectName + ", Data : " + unsafeWindow.Meteor[objectName]);
        }
    }

    // Mongo collection
    var src = unsafeWindow.Meteor.connection._mongo_livedata_collections;
    for (objectName in src) {
        //console.log("Mongo : " + objectName + ", Data : " + toType(src[objectName]));
        if(objectName.toUpperCase() == "variables".toUpperCase()){
            cols.push({name: 'Mongo.' + objectName, instance: src[objectName], count: src[objectName].find().count()});
            console.log("Mongo : " + objectName + ", Data : " + src[objectName]);
        }
    }
    
    console.log("-----------------------------------------------------------");
    console.log("-----------------------------------------------------------");

    //printCollections("Mongo : ", unsafeWindow.Mongo);
    //printCollections("Mongo.Collection() : ", unsafeWindow.Mongo.Collection());
    //printCollections("Mongo.ObjectID() : ", unsafeWindow.Mongo.ObjectID());
    //printCollections("Mongo.Cursor() : ", unsafeWindow.Mongo.Cursor());

    //printCollections("Metero.settings : ", unsafeWindow.Meteor.settings);
    //printCollections("Metero.users : ", unsafeWindow.Meteor.users);
    //printCollections("Metero.users._collection : ", unsafeWindow.Meteor.users._collection);
    //printCollections("Metero.users.find() : ", unsafeWindow.Meteor.users.find());
    //printCollections("Metero.users.find().collection : ", unsafeWindow.Meteor.users.find().collection);
    //printCollections("Metero.users.find().fetch() : ", unsafeWindow.Meteor.users.find().fetch());
    //printCollections("Metero.users.find().fetch()[0] : ", unsafeWindow.Meteor.users.find().fetch()[0]);
    //printCollections("Metero.users.findOne() : ", unsafeWindow.Meteor.users.findOne());

    //printCollections("Meteor._localStorage : ", unsafeWindow.Meteor._localStorage);
    //printCollections("Meteor._localStorage.getItem() : ", unsafeWindow.Meteor._localStorage.getItem());

    //printCollections("Meteor.connection : ", unsafeWindow.Meteor.connection);
    printCollections("Meteor.connection._mongo_livedata_collections : ", unsafeWindow.Meteor.connection._mongo_livedata_collections);
    //printCollections("Meteor.connection._mongo_livedata_collections.variables : ", unsafeWindow.Meteor.connection._mongo_livedata_collections.variables);
    //printCollections("Meteor.connection._mongo_livedata_collections.variables.find() : ", unsafeWindow.Meteor.connection._mongo_livedata_collections.variables.find());
    //printCollections("Meteor.connection._mongo_livedata_collections.variables.find().fetch() : ", unsafeWindow.Meteor.connection._mongo_livedata_collections.variables.find().fetch());
    //printCollections("Meteor._get() : ", unsafeWindow.Meteor._get());

    console.log("-----------------------------------------------------------");
    console.log("-----------------------------------------------------------");
    
    // check for non-uniform fields in collection
    for (var c of cols) {
        c.fieldCounts = [];
        console.log("Progress : " + c.name + ", Data : " + c.instance);
        if (c.instance.find().count() > 0) {
            for (var r of c.instance.find().fetch()) {
                fields = deepProperty(r, 2);
                fields.forEach(function( field ) {
                    c.fieldCounts.push(field);
                });
            }
        }
    }

    // sort the collections by name
    cols = cols.sort(function(a,b){
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    return cols;
}

function deepProperty(a_object, depth = 2) {
    var prop = [];
    Object.getOwnPropertyNames(a_object).forEach(function( propertyName ) {
        // don't get details if..
        //   Date
        //   Array
        //   too deep
        if (typeof(a_object[propertyName]) === 'object' && 
            a_object[propertyName] !== null && 
            !(a_object[propertyName] instanceof Date) && 
            !(a_object[propertyName] instanceof Array) && 
            depth > 1) {

            results = deepProperty(a_object[propertyName], depth - 1);
            results.forEach(function( result ) {
                //printCollections("Fetch Debug : ", result);
                prop.push({key:propertyName + '.' + result.key, value:result.value});
                console.log("Fetch Inner : Key [" + propertyName + '.' + result.key + "], Value : " + result.value);
            });
        } else {
            prop.push({key:propertyName, value:a_object[propertyName]});
            console.log("Fetch Last : Key [" + propertyName + "], Value : " + a_object[propertyName]);
        }
    });
    return prop.sort();
}

// ********************************************************************************
// ********************************************************************************
// 公司清單取得
// ********************************************************************************
// ********************************************************************************
function GetCompanyList(a_pageFrom = 0, a_pageTo = 1024){
    
    // 先取得最大公司數
    var companyCount = Meteor.connection._stores["variables"]._getCollection().findOne("totalCountOfCompanyList").value;
    
    // 20171014 08:00 有1694個公司
    if(companyCount <= 1694)
        companyCount = 1694;
    
    // PageIndex確保
    var pageIndex;
    if(a_pageFrom < 0)
        a_pageFrom = 0;
    if(a_pageTo * 12 > companyCount)
        a_pageTo = Math.floor(companyCount / 12) + 1;
    
    // 避免時差造成公司增加而少取資料    
    a_pageTo++;
    
    // 設定Timeout取指定次數的companyList
    for(pageIndex = a_pageFrom; pageIndex < a_pageTo; pageIndex++){
        // 伺服器限制一分鐘20次, 
        // 反算差不多3秒一次, 
        // 建議5秒一次
        // 取得時使用創建日期可避免股價波動造成的影響
        setTimeout(Meteor.subscribe, 5000 * (pageIndex - a_pageFrom), 'companyList', '', 'none', 'createdAt', pageIndex * 12);
    }   
    
    // 取完再Call清單整理
    setTimeout(GetCompanyListFinish, 5000 * (a_pageTo - a_pageFrom));
}

function GetCompanyListFinish(){
    
    console.log("-----------------------------------------------------------");
    console.log("-----------------------------------------------------------");
    
    var cols = [];
    //cols.push(GetMetroUsers());
    //cols.push(GetMangoCollection("variables"));
    cols.push(GetMangoCollection("companies"));
    
    // jQuery foreach
    $.each(cols, function(index,col) {
        console.log("Juicefish >> Column Name : " + col.name + ", Count : "  + col.count);
        col.content.forEach(function( myData ){
            console.log("Juicefish >> Retrieve Key : " + myData.key + ", Data : " + myData.value);
        });
    });
}
// ********************************************************************************
// ********************************************************************************
// ***                                                                          ***
// ***                              Main Event                                  ***
// ***                                                                          ***
// ********************************************************************************
// ********************************************************************************
/*
$(document).ready(function() {
    'use strict';

    console.log("Juicefish >> Meteor Loaded() : " + meteorIsLoaded());

    // Only run the code if Meteor is loaded
    if (!meteorIsLoaded()) {
        return;
    }


    $.each(getCollections(), function(index,col) {
        console.log("Juicefish >> Meteor Var : [" + col.name + "], Count" + col.count);

    });
});
*/

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
    Tester();
}

function onCompanyDetailPageLoaded() {
    Tester();
}

function Tester() {
    console.log("Juicefish >> Meteor Loaded() : " + meteorIsLoaded());

    // Only run the code if Meteor is loaded
    if (!meteorIsLoaded()) {
        return;
    }

    //DebugCollections();
    
    console.log("-----------------------------------------------------------");
    console.log("-----------------------------------------------------------");
    
    Meteor.connection._mongo_livedata_collections.companies.find().observeChanges({
        added(id, fields) {
            console.log('added', id, fields)
        }
    })
    
    GetCompanyList(0, 10);
    
    return;
}

// 程式進入點
(function mainfunction() {
  observeLoadingOverlay();
})();

