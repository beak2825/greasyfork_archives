// ==UserScript==
// @name         同程旅行半自动下单
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  同程旅行搜索航班，自动点击航班
// @author       MzXing
// @match        https://www.ly.com/*
// @match        https://www.ly.com/flights/itinerary/oneway/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427201/%E5%90%8C%E7%A8%8B%E6%97%85%E8%A1%8C%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/427201/%E5%90%8C%E7%A8%8B%E6%97%85%E8%A1%8C%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.reactAutoEvent = function (doc, value, eventName = "input") {
        let doc1 = doc;
        if (eventName === "input") {
            let lastValue = doc1.value;
            doc1.value = value;
        }
        let event = new Event(eventName, {bubbles: true});
        // hack React15
        event.simulated = true;
        // hack React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = doc1._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        doc1.dispatchEvent(event);
    };

    // 搜索航班信息
    function selectFlightInfo(depCode, arrCode, depDate) {
        console.log("选择出发抵达,以及日期");
        $("#txtAirplaneCity1").val(depCode);
        $("#txtAirplaneCity2").val(arrCode);
        $("#txtAirplaneTime1").val(depDate);
        $("#airplaneSubmit").click();
    }

    function selectPriceInternational(flightNo) {
        const baseFlight = {
            "CA": "中国国际航空",
            "3U": "四川航空",
            "SC": "山东航空",
            "CZ": "南方航空",
            "9H": "长安航空",
            "G5": "华夏航空",
            "8L": "祥鹏航空",
            "EU": "成都航空",
            "GJ": "浙江长龙航空",
            "DZ": "东海航空",
            "TV": "西藏航空",
            "NS": "河北航空",
            "UQ": "乌鲁木齐航空",
            "GS": "天津航空",
            "MU": "东方航空",
            "HU": "海南航空",
            "MF": "厦门航空",
            "KN": "中国联合航空",
            "OQ": "重庆航空",
            "ZH": "深圳航空",
            "FM": "上海航空",
            "NX": "澳门航空",
            "HO": "吉祥航空",
            "FU": "福州航空",
            "AQ": "九元航空",
            "BK": "奥凯航空",
            "JD": "首都航空",
        };
        let carrier = flightNo.substring(0, 2).toUpperCase();
        // 点击航司
        let all_checkbox_list = document.getElementsByClassName("checkbox-lists");
        for (let checkbox of all_checkbox_list) {
            for (let check_label of checkbox.childNodes) {
                if (check_label.textContent.indexOf(baseFlight[carrier]) !== -1) {
                    check_label.click()
                }
            }
        }

        // 标记颜色
        function signFlightNo() {
            let flightItemList = document.getElementsByClassName("flight-item");
            for (let flightItem of flightItemList) {
                let nowFlightText = flightItem.textContent;
                // debugger;
                if (nowFlightText.indexOf(flightNo) !== -1) {
                    console.log("找到这个航司了, 标记颜色");
                    flightItem.setAttribute("style", "border:15px solid #ff0000");
                }
            }
        }

        setTimeout(signFlightNo, 500);
    }

    function clickAddPeople(peopleInfoList) {
        // 几个乘客 添加( n -1 )次
        for (var count = 1; count < peopleInfoList.length; count++) {
            setTimeout(function () {
                console.log("123");
                document.getElementsByClassName("add")[0].click();
            }, 200 * count);
        }

        setTimeout(function () {
            addPeopleInfo(peopleInfoList)
        }, 200 * (count + 1));
    }

    function addPeopleInfo(peopleInfoList) {
        // 添加乘客信息

        // 姓名
        let nameList = $("input[placeholder='姓名，与所选证件上的姓名一致']");
        // 身份证
        let cardList = $("input[placeholder='请输入证件号码']");
        // 乘机人手机号
        let phoneList = $("input[placeholder='乘机人手机号码，用于接收航变信息']");

        for (let nameIndex = 0; nameIndex < nameList.length; nameIndex++) {
            let nameNode = nameList.eq(nameIndex)[0];
            let cardNode = cardList.eq(nameIndex)[0];
            let phoneNode = phoneList.eq(nameIndex)[0];
            window.reactAutoEvent(
                nameNode,
                peopleInfoList[nameIndex].name,
            );
            window.reactAutoEvent(
                cardNode,
                peopleInfoList[nameIndex].cardNo,
            );
            if(phoneNode){
                window.reactAutoEvent(
                    phoneNode,
                    "18146573461",
                );
            }

        }

        // 联系人手机号
        let contacts = $("input[placeholder='用于接收通知短信']")[0];
        window.reactAutoEvent(
            contacts,
            "18146573461",
        );
        debugger;
        $(".book-order").click()
    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        var nowUrl = window.location.href;
        if ("/" === nowLocationPathname && nowUrl.indexOf("#") !== -1) {
            console.log("搜索价格");
            // 搜索价格信息
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);

            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo));

            // 获取航班搜索url
            selectFlightInfo(flightInfoAndUserInfo.depAirport, flightInfoAndUserInfo.arrAirport, flightInfoAndUserInfo.depDate);

        } else if (nowLocationPathname.indexOf("/flights/itinerary/oneway") !== -1) {
            console.log("开始选择价格信息");
            let flightInfoAndUserInfo = JSON.parse(window.localStorage.getItem("flightInfoAndUserInfo"));

            setTimeout(function () {
                selectPriceInternational(flightInfoAndUserInfo.flightNo)
            }, 1000);
        } else if (nowLocationPathname === "/flights/book2") {

            console.log("开始添加乘客信息");

            let flightInfoAndUserInfo = JSON.parse(window.localStorage.getItem("flightInfoAndUserInfo"));

            setTimeout(function () {
                clickAddPeople(flightInfoAndUserInfo.passengerInfos)
            }, 1000);

        }
    });
})();