// ==UserScript==
// @name         汇付自动做账
// @namespace    http://tampermonkey.net/
// @version      1.0.0.1
// @license      M
// @description  自动做账
// @author       MzXing
// @match        https://mas.chinapnr.com/nobel/WebEntry.do
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/445863/%E6%B1%87%E4%BB%98%E8%87%AA%E5%8A%A8%E5%81%9A%E8%B4%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/445863/%E6%B1%87%E4%BB%98%E8%87%AA%E5%8A%A8%E5%81%9A%E8%B4%A6.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function ownAddTip(message, grade, tag) {

        if (grade === true || grade === 1) {
            grade = "success"
        } else if (grade === false || grade === 0) {
            grade = "failed"
        }

        let ownTipInfo = document.getElementById("ownTipInfo");
        if (!ownTipInfo) {
            var bodyTag = document.getElementsByTagName("body")[0];
            var pTag = document.createElement("p");
            pTag.setAttribute("id", "ownTipInfo");
            pTag.setAttribute(
                "style",
                "position: absolute; left: 2%; bottom: 1%; font-size: 20px; " +
                "color: green;border: 3px solid;padding: 10px;z-index: 999;"
            );
            bodyTag.appendChild(pTag);
            ownTipInfo = document.getElementById("ownTipInfo");
        }

        if (!tag) {
            tag = "";
        }

        switch (grade) {
            case "success":
                ownTipInfo.style.color = "green";
                ownTipInfo.innerText = "<" + tag + ">: " + message;
                break;
            case "failed":
                ownTipInfo.style.color = "red";
                ownTipInfo.innerText = "<" + tag + ">: " + message;
                break;
        }
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    function setCookie(cname, cvalue, exdays, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
    }

    function sendPurchaseRecord(data) {

        let formData = {
            "method": "post",
            "url": "http://svc-order-manage.air-cn.svc.cluster.local:8080/purchaseRecord/addPurchaseRecordByRobot",
            "json_data": JSON.stringify(data)
        }
        GM_xmlhttpRequest({
            method: "post",
            url: 'http://micro-service.spider.htairline.com/forwarding_service/',
            data: JSON.stringify(formData),
            onload: function (res) {
                if (res.status === 200) {
                    console.log(res.responseText);
                    let result = res.responseText.trim();
                    if (result.indexOf("新增成功") !== -1) {
                        ownAddTip("成功", true, "自动做账");
                    } else {
                        ownAddTip("未知失败异常", false, "自动做账");
                    }
                } else {
                    console.log('失败');
                }
            },
            onerror: function (err) {
                console.log('error');
                ownAddTip("请求失败", false, "自动做账");
            },
            ontimeout: function (err) {
                console.log('ontimeout');
                ownAddTip("请求失败", false, "自动做账");
            },
            onabort: function (err) {
                console.log('onabort ');
                ownAddTip("请求失败", false, "自动做账");
            }
        });
    }

    /**
     * 做账
     */
    function addPurchaseRecordByRobot() {

        var quNaRPayInfo = getCookie("QuNaRPayInfo");
        if (!quNaRPayInfo) {
            ownAddTip("操作不规范, 订单信息获取失败", false, "自动做账");
            return
        }

        var payInfo = JSON.parse(quNaRPayInfo);

        let flightInfoAndUserInfo = JSON.parse(payInfo.info.flightInfoAndUserInfo);

        let _key = flightInfoAndUserInfo.flightNo + flightInfoAndUserInfo.depDate + flightInfoAndUserInfo.passengerInfos[0].cardNum
        if (getCookie(_key)) {
            console.log("账单信息重复,无法自动做账");
            ownAddTip("账单信息重复,禁止做账", false, "自动做账");
            return
        }

        setCookie(_key, "orderNo", 1, ".chinapnr.com");

        // 是否是去哪儿
        let merchantName = document.querySelector("#content-wrap > div.home-main > div:nth-child(1) > div.mer-info > span:nth-child(1) > b > span");
        if (!merchantName) {
            ownAddTip("商户名称获取失败", false, "自动做账");
            return
        } else {
            if (merchantName.innerText.indexOf("嘉信浩远") === -1) {
                ownAddTip("仅支持去哪儿汇付自动做账", false, "自动做账");
                return
            }
        }

        // 获取商户单号
        let merchantsOrderNo = document.querySelector("#content-wrap > div.home-main > div:nth-child(1) > div.mer-info > span:nth-child(3) > b > span");

        if (!merchantsOrderNo) {
            ownAddTip("商户单号获取失败", false, "自动做账");
            return
        } else {
            merchantsOrderNo = merchantsOrderNo.innerText;
        }


        // 乘客
        let includingPassengers = [];
        let orderId;
        for (let passengerInfo of flightInfoAndUserInfo.passengerInfos) {
            includingPassengers.push(passengerInfo.name);
            orderId = passengerInfo["orderInfoId"];
        }

        let data = {
            "add": false,
            "realCollection": 0,
            "advertisingExpense": "",
            "ticketingChannel": "去哪儿",  // 采购渠道
            "purchasingTime": "",
            "purchasingPrice": payInfo.info["orderPrice"],  // 采购价
            "merchantsOrderNo": merchantsOrderNo,  // 商户单号
            "purchasingAccount": flightInfoAndUserInfo.purchasingAccount,  // 采购账号
            "paymentAccount": "汇付",  // 支付账号
            "remark": payInfo.info.orderNo,  // 备注信息
            "purchaseOrderNo": payInfo.info.orderNo,    // 采购订单号
            "orderId": orderId,  // order_id
            "includingPassengers": includingPassengers.join(",")  // 包含乘客
        }
        console.log(data);

        sendPurchaseRecord(data);
    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        if ('/nobel/WebEntry.do' === nowLocationPathname) {
            addPurchaseRecordByRobot();
        }

    });
})();
