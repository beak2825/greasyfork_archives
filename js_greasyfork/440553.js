// ==UserScript==
// @name         去哪M端支付
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去哪M端支付服务
// @author       Mz
// @match        https://pay.qunar.com/webapp/payment7/indexq?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qunar.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440553/%E5%8E%BB%E5%93%AAM%E7%AB%AF%E6%94%AF%E4%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/440553/%E5%8E%BB%E5%93%AAM%E7%AB%AF%E6%94%AF%E4%BB%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.getCookie = function (cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    function sendPurchaseRecord(data) {
        let formData = {
            "method": "post",
            "url": "http://micro-service.spider.htairline.com/task/taskWriteResult",
            "form_data": JSON.stringify(data)
        }
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://micro-service.spider.htairline.com/forwarding_service/',
            data:  JSON.stringify(formData),
            onload: function (res) {
                debugger;
                if (res.status === 200) {
                    console.log(res.responseText);
                } else {
                    console.log('失败');
                }
            },
            onerror: function (err) {
                debugger;
                console.log('error');
            },
            ontimeout: function (err) {
                debugger;
                console.log('ontimeout');
            },
            onabort: function (err) {
                debugger;
                console.log('onabort ');
            }
        });
        debugger;
    }


    var oldFun = JSON.parse
    JSON.parse = function() {
        let data = arguments[0];
        let result = oldFun.apply(this, arguments);
        if(data.indexOf("https://openapi.alipay.com/gateway.do") !== -1 && data.indexOf("sig") !== -1){
            let resultInfo = {
                // 去哪订单号
                "orderNo": result["orderInfo"]["orderNo"],
                // 去哪订单总价
                "orderAmount": result["orderInfo"]["amount"],
                // 后台ID
                "id": window.getCookie("orderIdHtlm"),
                // 支付链接
                "payUrl": result["payURL"],
                // 下单账号
                "orderPhone": "13036787990",
            }
            console.log(resultInfo);
            sendPurchaseRecord(resultInfo);
        }
        return result
    }

    if ('/webapp/payment7/indexq' === window.location.pathname) {
        // 选择支付宝
        setTimeout(function () {
            document.getElementById("c_payment_global_mobileali").click();
        }, 5000)

    }
})();


