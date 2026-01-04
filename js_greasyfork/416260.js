// ==UserScript==
// @name         携程自动选择航班信息
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  携程自动搜索航班，自动点击航班
// @author       MzXing
// @match        https://www.ctrip.com/
// @match        https://flights.ctrip.com/itinerary/oneway/*
// @match        https://flights.ctrip.com/online/list/oneway*
// @match        https://flights.ctrip.com/international/search/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416260/%E6%90%BA%E7%A8%8B%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E8%88%AA%E7%8F%AD%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/416260/%E6%90%BA%E7%A8%8B%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E8%88%AA%E7%8F%AD%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.reactAutoEvent = function (doc, value, eventName = "input") {
        let doc1 = doc;
        // if (typeof doc1 === "undefined") {
        //     setTimeout(function () {
        //         location.reload();
        //     }, 5000);
        // }
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

    function getDom(tagName, name, value) {
        var selectDom = [];
        var dom = document.getElementsByTagName(tagName);
        for (var i = 0; i < dom.length; i++) {
            if (value === dom[i].getAttribute(name)) {
                selectDom.push(dom[i]);
            }
        }
        return selectDom;
    }

    // 搜索航班信息
    function selectFlightInfo(depCode, arrCode, depDate) {
        console.log("选择出发抵达,以及日期");
        let searchFlightUrl = "https://flights.ctrip.com/itinerary/oneway/" + depCode + "-" + arrCode + "?date=" + depDate;
        return searchFlightUrl
    }

    /*
    国际站点自动选择航班
     */
    function selectPriceInternational(flightNo) {
        const baseFlight = {
            "CA": "中国国航",
            "3U": "四川航空",
            "SC": "山东航空",
            "CZ": "南方航空",
            "G5": "华夏航空",
            "DZ": "东海航空",
            "TV": "西藏航空",
            "NS": "河北航空",
            "UQ": "乌鲁木齐航空",
            "GS": "天津",
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

        window.reactAutoEvent(
            $('li[u_remark="点击筛选项[DOMESTIC_FILTER_GROUP_TRANS_AND_TRAIN.TRANS_COUNT/直飞]"]')[0],
            "",
            "click"
        );

        // 点击选择航空公司
        window.reactAutoEvent(
            document.querySelector("#filter_item_airline"),
            "",
            "click"
        );

        // 从选择航空公司按钮中获取需要的航司
        var liElements = document.querySelectorAll("#filter_group_airline__airline li[u_remark]");
        var uRemarkList = [];
        liElements.forEach(function (li) {
            var uRemarkValue = li.getAttribute("u_remark");
            if (uRemarkValue.includes(baseFlight[carrier])) {
                uRemarkList.push(uRemarkValue);
                return ''
            }
        });
        if (uRemarkList.length === 0) {
            console.log("没有匹配到航空公司");
            return;
        }
        let title = uRemarkList[0];
        window.reactAutoEvent(
            $('li[u_remark="' + title + '"]')[0],
            "",
            "click"
        );

        // 点击选择航空公司
        window.reactAutoEvent(
            document.querySelector("#filter_item_airline"),
            "",
            "click"
        );

        // 标记颜色
        function signFlightNo() {
            let allFlightDiv = $("div[class='flight-item domestic']");
            for (var i = 0; i < allFlightDiv.length; i++) {
                let nowFlightText = allFlightDiv.eq(i).text();
                debugger;
                if (nowFlightText.indexOf(flightNo) !== -1) {
                    console.log("找到这个航司了, 标记颜色");
                    console.log(allFlightDiv.eq(i));
                    allFlightDiv.eq(i).find("div[class='flight-box']").attr("style", "background-color:#00ebef");
                }
            }
        }

        setTimeout(signFlightNo, 3000);
    }

    // 选择价格信息
    function selectPrice(flightNo) {
        console.log("选择航班");

        function clickOne() {
            // 点击过滤航司
            $("input[name='routeType']").eq(0).click();
            console.log("点击直达");
        }

        // setTimeout(clickOne, 1000);

        function selectCarrier() {
            // 点击过滤航司
            $("input[value='" + flightNo.substring(0, 2).toLowerCase() + "']").click();
            console.log("过滤航司");
        }

        setTimeout(selectCarrier, 1000);


        function signFlightNo() {
            // 点击过滤航司
            let allFlightDiv = $("div[class='search_box search_box_tag search_box_light Label_Flight']");
            for (var i = 0; i < allFlightDiv.length; i++) {
                let nowFlightText = allFlightDiv.eq(i).text();
                if (nowFlightText.indexOf(flightNo) !== -1) {
                    console.log("找到这个航司了, 标记颜色");
                    allFlightDiv.eq(i).find("div[class='search_table_header']").attr("style", "background-color:#00ebef");
                }
            }
            console.log("选择航班");
        }

        setTimeout(signFlightNo, 1500);
    }

    // document 加载完毕后执行下面代码
    (function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        var nowUrl = window.location.href;
        if ("/" === nowLocationPathname && nowUrl.indexOf("#") !== -1) {
            console.log("搜索价格");
            // 搜索价格信息
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            // 获取航班搜索url
            let flightUrl = selectFlightInfo(flightInfoAndUserInfo.depAirport, flightInfoAndUserInfo.arrAirport, flightInfoAndUserInfo.depDate);

            window.location = flightUrl + "#" + JSON.stringify(flightInfoAndUserInfo);

        } else if (nowLocationPathname.indexOf("/itinerary/oneway") !== -1 && nowUrl.indexOf("#") !== -1) {
            console.log("开始选择航班信息");
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            // 保存到 sessionStrong 里面
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo));
            // 搜索航班信息
            selectPrice(flightInfoAndUserInfo.flightNo);

        } else if (nowLocationPathname.indexOf("/online/list/oneway") !== -1 && nowUrl.indexOf("#") !== -1) {
            console.log("开始选择航班信息");
            debugger;
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            // 保存到 sessionStrong 里面
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo));
            // 搜索航班信息

            var count = 0;
            var intervalId = setInterval(function () {
                try {
                    count++;
                    selectPriceInternational(flightInfoAndUserInfo.flightNo);
                    clearInterval(intervalId);
                } catch (error) {
                    if (count >= 10) {
                        clearInterval(intervalId);
                        console.log("定时运行结束");
                    }
                }

            }, 3000);
        } else if (nowLocationPathname.indexOf("/international/search/") !== -1 && nowUrl.indexOf("#") !== -1) {
            console.log("开始选择航班信息");
            window.one = true;
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

            // 保存到 sessionStrong 里面
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo));

            let targetNode = getDom('div', 'class', 'result-wrapper')[0];

            let config = {attributes: true, childList: true, subtree: true};
            let observerCallback = function (mutationsList, observer) {
                for (const mutation of mutationsList) {
                    if ((mutation.type === 'attributes' && mutation.target.className === "") || (mutation.type === 'childList' && mutation.target.className === "flight-list root-flights")) {
                        console.log("再去更新航班");
                        if (window.one) {
                            window.one = false;
                            selectPriceInternational(flightInfoAndUserInfo.flightNo);
                        }
                    }
                }
            };
            // 创建一个链接到回调函数的观察者实例
            let observer = new MutationObserver(observerCallback);

            // 开始观察目标节点的配置突变
            observer.observe(targetNode, config);

        }
    })();
})();