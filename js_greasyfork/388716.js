// ==UserScript==
// @name         ACGN-stock一鍵投推薦票
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  可可蘿我婆
// @author       shdopeoplesn
// @match        https://acgn-stock.com/productCenter/season/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388716/ACGN-stock%E4%B8%80%E9%8D%B5%E6%8A%95%E6%8E%A8%E8%96%A6%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/388716/ACGN-stock%E4%B8%80%E9%8D%B5%E6%8A%95%E6%8E%A8%E8%96%A6%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(milliseconds)
    {
        var start = new Date().getTime();
        while(1)
            if ((new Date().getTime() - start) > milliseconds)
                break;
    }
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="send_all_ticket" type="button" class="btn btn-primary btn-sm">'
        + '投完此頁產品的推薦票</button>'
    ;
    zNode.setAttribute ('id', 'myContainer');
    try{
        document.getElementsByClassName("d-flex justify-content-between align-items-center text-center")[0].appendChild (zNode);
    }catch(e){

    }
    document.getElementById("send_all_ticket").addEventListener("click", function(){
        alert("因股市有限制每秒發送請求次數，程式有設定延遲，畫面會卡住30秒唷！");
        for(var i = 1;i <= 30;i++){
            //console.log(document.getElementsByClassName("btn btn-primary btn-sm")[i].dataset.voteProduct);
            console.log(Package.meteor.Meteor.customCall("voteProduct", document.getElementsByClassName("btn btn-primary btn-sm")[i].dataset.voteProduct));
            sleep(1000);
        }
    });

})();