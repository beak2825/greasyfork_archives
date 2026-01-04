// ==UserScript==
// @name         Google翻译结果存单词本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  将google翻译的单词自动保存到服务器中
// @connect      www.wanyan.site
// @author       xuting90@gmail.com
// @match        http*://**/**
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383825/Google%E7%BF%BB%E8%AF%91%E7%BB%93%E6%9E%9C%E5%AD%98%E5%8D%95%E8%AF%8D%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/383825/Google%E7%BF%BB%E8%AF%91%E7%BB%93%E6%9E%9C%E5%AD%98%E5%8D%95%E8%AF%8D%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let func = window.onload;
    let observer = new MutationObserver((a,b)=>{
        getExpainStrArr();
    });
    let tb = document.body;
    let options = {
        'childList': true,
        "subtree":true,
    } ;
    observer.observe(tb, options);
    function ExplainObj(type,explain){
        this.type = type;
        this.explain = explain;
    }
    ExplainObj.prototype.toJson = function(){
        return JSON.stringify(this);
    }
    function getExpainStrArr(){
        let shadowDomHost = document.getElementById("gtx-host");
        if(!shadowDomHost)return;
        let gtx=shadowDomHost.shadowRoot.querySelector(".content");
        if(!gtx)return;
        let keyValueArr = gtx.querySelectorAll(".gtx-body");
        let kvArr = Array.from(keyValueArr).map(item=>item.innerText);
        let explainsArr = gtx.querySelector("table");
        let explainsStrArr = Array.from(explainsArr.querySelectorAll("tr"))
                                  .map(tag=>{
                                      let [type,explain] = Array.from(tag.querySelectorAll("td"))
                                                 .map(i=>i.innerText);
                                      return new ExplainObj(type,explain);
                                  });
        if(!explainsStrArr)return;
        let obj = {};
        obj.word=kvArr[0];
        obj.explain=explainsStrArr;
        sendData(obj);
    }

    function sendData(obj){
        //let url = "http://0.0.0.0:8120/node-book/save/word";
        let url = "https://www.wanyan.site/nodejs/node-book/save/word";
        console.log(obj);
        GM_xmlhttpRequest({
            method:"post",
            url:url,
            headers:{"Content-Type":"application/json; charset=UTF-8"},
            data:JSON.stringify(obj),
            responseType:'json',
            timeout:3000,
            onload:(result)=>{console.log(result && result.response);},
            onerror:(error)=>{console.log(error && error.response);}
        });

    }
})();