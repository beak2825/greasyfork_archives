// ==UserScript==
// @name         去哪M端自动下单
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://m.flight.qunar.com/ncs/page/flightdetail?*
// @match        https://m.flight.qunar.com/flight/tts/book?*
// @match        https://mclient.alipay.com/cashier/mobilepay.htm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qunar.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440554/%E5%8E%BB%E5%93%AAM%E7%AB%AF%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440554/%E5%8E%BB%E5%93%AAM%E7%AB%AF%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 搜索价格信息
     */
    function selectPrice() {
        // 提示无航班信息
        let noThingInfoNodes = document.getElementsByClassName("nothing_info");
        if (noThingInfoNodes.length) {
            console.log("搜索不到航班信息");
            window.close();
            return
        }

        let minProduct = {};
        let allPriceLi = document.getElementsByClassName("ota_list_domestic")[0].childNodes;
        for (let priceNode of allPriceLi) {
            // 过滤特殊产品
            if (priceNode.childNodes.length > 1) {
                continue
            }
            // 获取产品名    '吉祥航空旗舰店'
            let productName = priceNode.getElementsByClassName("air_name")[0].innerText;
            // 产品限制 '经济舱2.5折退改¥80起>'
            let productLimit = priceNode.getElementsByClassName("labels_list")[0].innerText;
            // 获取价格
            let price = parseFloat(priceNode.getElementsByClassName("price")[0].innerText);
            // 点击按钮
            let priceBtn = priceNode.getElementsByClassName("price_btn")[0];

            if (Object.keys(minProduct).length === 0 || minProduct["price"] > price) {
                minProduct = {
                    "productName": productName,
                    "productLimit": productLimit,
                    "price": price,
                    "priceBtn": priceBtn,
                }
            }
        }

        // 获取最低价
        minProduct["priceBtn"].click();
    }

    function setCookie(cname, cvalue, exdays, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
    }


    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        if ('/ncs/page/flightdetail' === nowLocationPathname) {

            setTimeout(function () {
                // 选择最低价格
                let peopleInfoLi = JSON.parse(decodeURIComponent(location.href.slice(location.href.indexOf("info=") + 5)))

                let selectedPassengerList = [];
                for (let peopleInfo of peopleInfoLi) {
                    selectedPassengerList.push({
                        "credentialsType": 1,
                        "nationality": "中国",
                        "nationalityCode": "CN",
                        "issuedCountry": "中国",
                        "issuedCountryCode": "CN",
                        "goBaggagePrice": false,
                        "goBaggageWeight": false,
                        "retBaggagePrice": false,
                        "retBaggageWeight": false,
                        "passengerMobile": "86-",
                        "credentialsNo": peopleInfo.cardNo,
                        "chineseName": peopleInfo.name,
                        "name": peopleInfo.name,
                        "birthday": peopleInfo.birthday,
                        "gender": 1,
                        "age": parseInt((Date.now() - new Date(peopleInfo.birthday)) / 365 / 1000 / 24 / 60 / 60) + 0.5,
                        "ticketType": 1,
                        "id": parseInt(Date.now().toString().substring(0, 7) + Math.random().toString().substr(-6)),
                        "credentialses": [{"credentialsType": 1, "credentialsNo": peopleInfo.cardNo}],
                        "selected": true
                    })
                    localStorage.setItem("orderInfoId", peopleInfo.orderInfoId)
                }

                localStorage.setItem(
                    "tts_contactData",
                    JSON.stringify(
                        {
                            "selectedPassengerList": selectedPassengerList,
                            "selectedContact": {"id": "new", "name": "连晓伟", "mobile": "86-13036787990", "email": ""},
                            "lastUpdateTime": Date.now()
                        })
                )

                selectPrice();
            }, 3000);

        } else if ('/flight/tts/book' === nowLocationPathname) {

            setTimeout(function () {
                // 已阅读协议
                let iChecks = document.getElementsByClassName("i-check")
                if (iChecks.length) {
                    iChecks[0].click();

                }
                console.log("提交订单")

                setCookie(
                    "orderIdHtlm",
                    localStorage.getItem("orderInfoId"),
                    1,
                    ".qunar.com"
                );
                // 提交订单
                document.getElementsByClassName("sub-right ")[0].click();

                setTimeout(function () {
                    // 重复预定的订单
                    let confirmBtnLi = document.getElementsByClassName("confirm-btn");
                    if(confirmBtnLi.length){
                        confirmBtnLi[0].click();
                    }
                }, 3000)

            }, 5 * 1000);

        }
    });


})();

