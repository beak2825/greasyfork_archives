// ==UserScript==
// @name         800w查询数据库
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://8001198.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382397/800w%E6%9F%A5%E8%AF%A2%E6%95%B0%E6%8D%AE%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/382397/800w%E6%9F%A5%E8%AF%A2%E6%95%B0%E6%8D%AE%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    var DB_NAME = 'indexedDB-test', VERSION = 1, db;
    var request = indexedDB.open(DB_NAME, VERSION);
    request.onsuccess = function(event) {
        db = event.target.result;
        // console.log(event.target === request); // true
        db.onsuccess = function(event) {
            console.log('数据库操作成功!');
        };
        db.onerror = function(event) {
            console.error('数据库操作发生错误！', event.target.errorCode);
        };
        console.log('打开数据库成功!');
    };
    request.onerror = function(event) {
        console.error('创建数据库出错');
        console.error('error code:', event.target.errorCode);
    };


    request.onupgradeneeded = function(event) {
        // 更新对象存储空间和索引 ....
        console.log("onupgradeneeded")
        var database = event.target.result;
        var objectStore
        if (!database.objectStoreNames.contains('800w')) {
            objectStore = database.createObjectStore("800w",{ autoIncrement: true });
            objectStore.createIndex('no', 'no', { unique: false });
            objectStore.createIndex('plan_value', 'plan_value', { unique: false });
            objectStore.createIndex('real_value', 'real_value', { unique: false });
            objectStore.createIndex('result_value', 'result_value', { unique: false });
            objectStore.createIndex('win', 'win', { unique: false });
            objectStore.createIndex('rate', 'rate', { unique: false });
            objectStore.createIndex('anl_model', 'anl_model', { unique: false });
            objectStore.createIndex('isFollow', 'isFollow', { unique: false });
            objectStore.createIndex('time', 'time', { unique: false });
        }
    };

    function getDataByKey(storeName){
        console.log("select")
        var transaction=db.transaction(storeName,'readwrite');
        var store=transaction.objectStore(storeName);
        var allRecords = store.getAll();
        var str="msg:"
        allRecords.onsuccess = function() {
            for(var key in allRecords.result){
                var value=allRecords.result[key]
                str=str+value.no+"\t"
                    +value.plan_value+"\t"
                    +value.real_value+"\t"
                    +value.result_value+"\t"
                    +value.win+"\t"
                    +value.rate+"\t"
                    +value.anl_model+"\t"
                    +value.isFollow+"\t"
                    +value.time+"\n"
            }
            console.log(str);
        };
    }
    setTimeout(function(){
        getDataByKey('800w')
    },300)

})();