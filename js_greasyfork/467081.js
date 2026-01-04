// ==UserScript==
// @name         网络请求与页面快照
// @namespace    168116060@qq.com
// @version      1.0
// @description  静默保存所有网络请求与页面元素60s一次到本地indexDB数据库
// @author       hax
// @include      http*://*youDomainName*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467081/%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E4%B8%8E%E9%A1%B5%E9%9D%A2%E5%BF%AB%E7%85%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/467081/%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E4%B8%8E%E9%A1%B5%E9%9D%A2%E5%BF%AB%E7%85%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var dbrequest= window.indexedDB.open("hax",1);
    var db;


    dbrequest.onerror = function (event) {
        console.log('数据库打开报错');
    };

    dbrequest.onsuccess = function (event) {
        db = dbrequest.result;
        console.log('数据库打开成功');
    };

    dbrequest.onupgradeneeded = function(event) {
        db = event.target.result;
        db.createObjectStore("networkLog",{autoIncrement:true});
        db.createObjectStore("viewLog",{autoIncrement:true});
    }


    function insertLog(log, tableName){
        var innsert = db.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(log);

        innsert.onsuccess = function (event) {
            console.log('数据写入成功');
        };

        innsert.onerror = function (event) {
            console.log('数据写入失败');
        }
    }

    var oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(){
        var requestBody = JSON.stringify(arguments);
        this.addEventListener("readystatechange",function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 0) {
                    var responseText = this.responseText;
                    var path = this.responseURL;
                    var log = {
                        path,
                        requestBody,
                        responseText,
                        createDate: new Date()
                    }
                    insertLog(log, "networkLog");
                }
            }
        });
        oldSend.apply(this, arguments);
    }


    var url = '';
    var i = 0;
    setInterval(() => {
        var currentUrl = window.location.href;
        if(currentUrl === url) {
            i++;
        }

        if(currentUrl !== url || i >= 60) {
            url = window.location.href;
            i = 0;
            var log = {
                path:window.location.href,
                view:document.getElementsByTagName("html")[0].outerHTML,
                createDate: new Date()
            }
            insertLog(log, 'viewLog');
        } else {
            console.log(i);
        }
    }, 1000);
})();