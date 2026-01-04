// ==UserScript==
// @name         海航web官网半自动下单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  海航web官网半自动下单辅助
// @author       MzXing
// @match        https://www.hnair.com/
// @match        https://new.hnair.com/hainanair/ibe/air/searchResults.do*
// @match        https://new.hnair.com/hainanair/ibe/checkout/shoppingCart.do*
// @match        https://new.hnair.com/hainanair/ibe/checkout/passengerDetailsPage.do*
// @match        https://new.hnair.com/hainanair/ibe/checkout/airAncillaries.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427439/%E6%B5%B7%E8%88%AAweb%E5%AE%98%E7%BD%91%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/427439/%E6%B5%B7%E8%88%AAweb%E5%AE%98%E7%BD%91%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = window.jQuery;

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


    function searchFlightInfo(depCode, arrCode, depDate) {
        $("#from_city1").val(depCode);
        $("#to_city1").val(arrCode);
        $("#flightBeginDate1").val(depDate);
        // 修改该方法
        getchengshi_szm = function (x) {
            return x
        };
        // 提交
        checkScNum();
    }

    function selectFlightNo(flightNo) {
        let allFlightListItem = window.jQuery(".flight-list-item");
        for (let index = 0; index < allFlightListItem.length; index++) {
            let nowFlightNode = allFlightListItem.eq(index);
            // 获取节点的航班号
            let nodeFlightNo = nowFlightNode.find(".airline-code").text();
            if (nodeFlightNo.indexOf(flightNo.substring(2)) !== -1) {
                // 是这个航班号
                console.log("是他");
                nowFlightNode.attr("style", "background-color:#00ebef");

                // 获取最后一个子节点
                let lastPriceNode = nowFlightNode.find(".row-control").children(".row-cell:last-child");
                // 点击子节点
                lastPriceNode.click();

                // 公务舱/经济舱节点
                let cabinInfoItems = nowFlightNode.find(".cabin-info-item");
                for (let cabinInfoItemIndex = 0; cabinInfoItemIndex < cabinInfoItems.length; cabinInfoItemIndex++) {
                    let nowCabinInfoItem = cabinInfoItems.eq(cabinInfoItemIndex);
                    // 判断节点是否展示
                    console.log(nowCabinInfoItem.attr("style"));
                    // debugger;
                    if (nowCabinInfoItem.attr("style").indexOf("block") !== -1) {
                        // debugger;
                        // 选择节点的第一个舱位
                        let firstCabinChild = nowCabinInfoItem.find(".dis-cabin:first-child");
                        var disCellNode = firstCabinChild.find(".dis-cell:last-child");
                        disCellNode.click();
                        // 判断是否是 立即选购
                        if (disCellNode.text().indexOf("立即选购") !== -1) {
                            let disDetailNode = nowCabinInfoItem.find(".dis-detail");
                            if (disDetailNode.length > 0) {
                                // TODO：暂时取消自动选择航班信息
                                // disDetailNode.eq(0).find(".dis-button").eq(0).find("a").eq(0).click()
                            }
                        } else {
                            // 选择立即预定
                            // TODO：暂时取消自动选择航班信息
                            // disCellNode.find(".dis-button").eq(0).find("a").eq(0).click()
                        }
                    }
                }
            }
        }
    }

    function addPeople(peopleMessageLi) {
        window.jQuery("#dialog-passenger_contact_info_tips").find("a").click();
        debugger;
        // 取消提示 优惠卷
        CouponNumber = 0;
        while (true){
            console.log(window.jQuery(".box-psg").length);
            if(window.jQuery(".box-psg").length >= peopleMessageLi.length){
                break
            }{
                // 添加乘客
                window.jQuery(".psg-add").click();
            }
        }

        for (let i = 1; i <= peopleMessageLi.length; i++) {
            let nowPeopleInfo = peopleMessageLi[i - 1];
            if(nowPeopleInfo.ageType !== "ADULT"){
                alert("不支持儿童下单");
                return ""
            }
            // 第一个乘客姓名
            window.jQuery("input[name='product$1000$/passenger$" + i + "$/Customer/PersonName/Surname']").val(nowPeopleInfo.name);
            window.jQuery("input[name='product$1000$/passenger$" + i + "$/Passport/DocID']").val(nowPeopleInfo.cardNo);
            // 失去焦点自动改变生日
            window.jQuery("input[name='product$1000$/passenger$" + i + "$/Passport/DocID']").blur();
        }

        // 联系人手机号
        window.jQuery("input[name='Profile/Customer/Telephone$3$/@PhoneNumber']").val("18146573461");

        // 不需要行程单
        window.jQuery(".tab-radio-nav").find(".crew-radio-label:first-child").click();

        // 我已阅读
        window.jQuery(".reset-check-read").find(".crew-checkbox-label").click();

        // 点击生单
        window.jQuery("#domesticPaxDetailSubmitform").click();
    }


    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        var nowUrl = window.location.href;
        if ("/" === nowLocationPathname && nowUrl.indexOf("#") !== -1) {
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            // 保存到 sessionStrong 里面
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo));
            // 添加到cookies 里面
            setCookie(
                "flightInfoAndUserInfo",
                JSON.stringify(flightInfoAndUserInfo),
                1,
                ".hnair.com"
            );
            // 搜索价格信息
            searchFlightInfo(flightInfoAndUserInfo.depAirport, flightInfoAndUserInfo.arrAirport, flightInfoAndUserInfo.depDate);
        } else if (nowLocationPathname === "/hainanair/ibe/air/searchResults.do") {
            console.log("开始选择航班信息");
            let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo");
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            // 保存到 sessionStrong 里面
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo));
            // 搜索航班信息
            setTimeout(function () {
                selectFlightNo(flightInfoAndUserInfo.flightNo);
            }, 2000);

        } else if (nowLocationPathname === "/hainanair/ibe/checkout/shoppingCart.do") {
            // 点击立即预定
            setTimeout(function () {
                commitData()
            }, 2000);

        } else if (nowLocationPathname === "/hainanair/ibe/checkout/passengerDetailsPage.do") {
            // 添加乘客
            let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo");
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

            setTimeout(function () {
                addPeople(flightInfoAndUserInfo.passengerInfos);
            }, 2000);

        } else if (nowLocationPathname === "/hainanair/ibe/checkout/airAncillaries.do") {
            // 点击去支付
            setTimeout(function () {
                window.jQuery(".go-pay").eq(0).click();
            }, 2000);
        }
    })

})();