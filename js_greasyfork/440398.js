// ==UserScript==
// @name         支付宝自动做账
// @namespace    http://tampermonkey.net/
// @version      1.1.0.4
// @license      M
// @description  自动做账
// @author       MzXing
// @match        https://excashier.alipay.com/standard/auth.htm*
// @match        https://cashierstl.alipay.com/standard/lightpay/lightPayCashier.htm*
// @match        https://pay.qunar.com/pc-cashier/cn/api/MultiCashierPay2g.do
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440398/%E6%94%AF%E4%BB%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%81%9A%E8%B4%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/440398/%E6%94%AF%E4%BB%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E5%81%9A%E8%B4%A6.meta.js
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

        setCookie(_key, "orderNo", 1, ".alipay.com");

        // 获取商户单号
        let merchantsOrderNo;
        let orderItemLi = document.getElementsByClassName("order-item");
        if (orderItemLi.length >= 1) {
            merchantsOrderNo = orderItemLi[0].querySelector(
                "table > tbody > tr:nth-child(2) > td"
            ).innerText
        } else {
            // 输入密码模式
            var J_Order = document.getElementById("J_Order");
            if (J_Order) {
                let dataConfig = J_Order.getAttribute("data-config");
                if (dataConfig) {
                    dataConfig = JSON.parse(dataConfig);
                    merchantsOrderNo = dataConfig["outBizNo"];
                }

            }
        }

        if (!merchantsOrderNo) {
            ownAddTip("商户单号获取失败", false, "自动做账");
            return
        }


        // 乘客
        let includingPassengers = [];
        let orderId;
        for (let passengerInfo of flightInfoAndUserInfo.passengerInfos) {
            includingPassengers.push(passengerInfo.name);
            orderId = passengerInfo["orderInfoId"];
        }


        // 判断是飞猪 还是 去哪儿
        let orderSeller = document.getElementsByClassName("order-seller")
        if (orderSeller) {
            orderSeller = orderSeller[0].innerText;
        } else {
            orderSeller = "未知收款商"
        }

        let payee;
        if (orderSeller.indexOf("阿斯兰") !== -1) {
            console.log("当前收款商是飞猪");
            payee = "feizhu";
        } else {
            // 暂时默认其他都是 去哪
            console.log("当前收款商是去哪儿");
            payee = "qunar";
            ownAddTip("暂不支持飞猪以外自动做账", false, "自动做账");
            return
        }

        let data;
        switch (payee) {
            case "feizhu":
                debugger;
                let orderRealAmount = document.getElementsByClassName("order-real-amount");
                if (!orderRealAmount) {
                    ownAddTip("采购总价获取失败", false, "自动做账");
                    return
                }
                orderRealAmount = parseFloat(orderRealAmount[0].querySelector("em").innerText);

                // 飞猪订单号
                let fzOrderNo = (/[0-9]+/).exec(document.getElementsByClassName("order-title")[0].innerText);
                if (!fzOrderNo) {
                    ownAddTip("飞猪订单号获取失败", false, "自动做账");
                    return
                }
                data = {
                    "add": false,
                    "realCollection": 0,
                    "advertisingExpense": "",
                    "ticketingChannel": "飞猪",  // 采购渠道
                    "purchasingTime": "",
                    "purchasingPrice": orderRealAmount,  // 采购价
                    "merchantsOrderNo": merchantsOrderNo,  // 商户单号
                    "purchasingAccount": "13036787990",  // 采购账号
                    "paymentAccount": "185支付宝",  // 支付账号
                    "remark": fzOrderNo[0],  // 备注信息
                    "purchaseOrderNo": fzOrderNo[0],    // 采购订单号
                    "orderId": orderId,  // order_id
                    "includingPassengers": includingPassengers.join(",")  // 包含乘客
                }
                break
            case "qunar":

                data = {
                    "add": false,
                    "realCollection": 0,
                    "advertisingExpense": "",
                    "ticketingChannel": "去哪儿",  // 采购渠道
                    "purchasingTime": "",
                    "purchasingPrice": payInfo.info["orderPrice"],  // 采购价
                    "merchantsOrderNo": merchantsOrderNo,  // 商户单号
                    "purchasingAccount": flightInfoAndUserInfo.purchasingAccount,  // 采购账号
                    "paymentAccount": "185支付宝",  // 支付账号
                    "remark": payInfo.info.orderNo,  // 备注信息
                    "purchaseOrderNo": payInfo.info.orderNo,    // 采购订单号
                    "orderId": orderId,  // order_id
                    "includingPassengers": includingPassengers.join(",")  // 包含乘客
                }
                break
        }

        if (data) {
            //
            sendPurchaseRecord(data);
        }
    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        if ('/standard/auth.htm' === nowLocationPathname || '/standard/lightpay/lightPayCashier.htm' === nowLocationPathname) {
            addPurchaseRecordByRobot();

        } else if ('/pc-cashier/cn/api/MultiCashierPay2g.do' === nowLocationPathname) {
            setInterval(function () {
                // 点击支付后,关闭该页面
                let titleTxtLi = document.getElementsByClassName("title_txt");
                if (titleTxtLi.length && titleTxtLi[0].innerText === "支付结果") {
                    console.log("即将关闭窗口");
                    setTimeout(() => {
                        window.close();
                    }, 3000);
                }
            }, 3000);
        }

    });
})();
