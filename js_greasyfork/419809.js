// ==UserScript==
// @name         填写账号信息
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解放双手
// @author       MzXing
// @match        https://cashdesk.yeepay.com/bc-cashier/bcnewpc/request/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419809/%E5%A1%AB%E5%86%99%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/419809/%E5%A1%AB%E5%86%99%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function getCode() {
        GM_xmlhttpRequest({
            method: "get",
            url: 'http://ybpay.spider.htairline.com/get_card_info',
            onload: function(res){
                if(res.status === 200){
                    console.log('成功');
                    var data = JSON.parse(res.responseText);
                    var cardNo = data["card_no"];
                    var cvv = data["cvv"];
                    var expiryDate = data["expiry_date"];
                    var idCardNo = data["card_number"];
                    var userName = data["name"];
                    var phone = "18075193789";
                    executePay(cardNo, cvv, expiryDate, phone, idCardNo, userName, "true");
                }else{
                    console.log('失败');
                    console.log(res)
                }
            },
            onerror : function(err){
                console.log('error');
                console.log(err)
            }
        });
    }

    function executePay(cardNo, cvv, expireDate, phone, idCardNo, userName, auto) {
        //获取所有的h2元素
        var h2s = $("body > div > h2");
        for (var i = 0; i < h2s.length; i++) {
            var h2 = h2s[i];
            if ("无卡支付" == h2.innerHTML) {
                h2.classList.add("active");
            } else {
                h2.classList.remove("active");
            }
        }
        //填写账号并点击下一步
        var cardInput = $("form .sington input[name=cardno]");
        cardInput.attr("value", cardNo);
        simulateEvent(cardInput, "input");
        $("#quickPayForm > button")[0].click();

        var clicked = false;
        $("#addItemWrapper").bind("DOMNodeInserted", function (e) {
                var finishCount = 0;
                if ("储蓄卡" == $.trim($(".card-bin .card-type").text())) {
                    alert("确认为储蓄卡,不支持自动导入");
                } else {
                    // console.log("确认为信用卡");
                    tryInputThreeTimes(cardNo, cvv, expireDate, phone, idCardNo, userName, auto, submitRequest);
                }
            }
        );

        function simulateEvent(cb, event) { //js触发事件--事件构造器
            var evt = document.createEvent("Event");
            evt.initEvent(event, true, true);
            var canceled = !cb[0].dispatchEvent(evt);
            if (canceled) {
                // A handler called preventDefault
                // console.log("canceled");
            } else {
                // None of the handlers called preventDefault
                // console.log("not canceled");
            }
        }

        function tryInputThreeTimes(cardNo, cvv, expireDate, phone, idCardNo, userName, auto, callbackSubmit) {
            for (var i = 0; i < 3; i++) {
                //尝试三次设置值
                checkInputValue("name", userName);
                checkInputValue("idno", idCardNo);
                checkInputValue("valid", expireDate);
                checkInputValue("cvv2", cvv);
                checkInputValue("phone", phone);
            }
            console.log("asd");
            callbackSubmit(auto);
        }

        function checkInputValue(key, value) {
            if ($("form input[name='" + key + "']").attr("value") != value) {
                // console.log(key + "还为空")
                $("form input[name='" + key + "']").attr("value", value);
                return 0;
            } else {
                return 1;
            }
        }

        function submitRequest(auto) {
            if (clicked) {
                return;
            }
            clicked = true;
            // auto = "false";
            if ("false" == auto) {

            } else {
                setTimeout(
                    function () {
                        console.log("准备支付")
                        $("#firstPayBtn").click();
                        simulateEventClick("firstPayBtn", "click");
                    }
                    , 1000);//延时3秒
            }
        }
    }

    getCode();
})();


