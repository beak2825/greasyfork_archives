// ==UserScript==
// @name         飞猪半自动下单
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  飞猪半自动下单v1.0
// @author       MzXing
// @match        https://sjipiao.fliggy.com/flight_search_result.ht*
// @match        https://sjipiao.fliggy.com/homeow/trip_flight_search.htm*
// @match        https://fbuy.fliggy.com/travel/confirm_order.htm*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444303/%E9%A3%9E%E7%8C%AA%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/444303/%E9%A3%9E%E7%8C%AA%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';


    window.reactAutoEvent = function (doc, value, eventName = "input") {
        let doc1 = doc;
        let lastValue;
        if (eventName === "input") {
            lastValue = doc1.value;
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

    function addPeople(peopleMessageLi) {
        let overId = [];
        for (let peopleMessage of peopleMessageLi) {

            let listPanelLi = document.getElementsByClassName("frequent-list")[0].getElementsByClassName("list-panel")

            for (let listPanel in listPanelLi) {
                if (!listPanelLi[listPanel].innerText) {
                    continue
                }
                // 身份证已添加 则直接选择添加
                if (listPanelLi[listPanel].innerText.indexOf(peopleMessage.cardNo) !== -1) {

                    let inputN = listPanelLi[listPanel].getElementsByClassName("tpi-checkbox")[0];
                    if (inputN.checked) {
                        console.log("乘客已选中")
                    } else {
                        inputN.click();
                        // 展开所有乘客列表
                        document.getElementsByClassName("show-all-btn")[0].click();
                    }
                    overId.push(peopleMessage.cardNo)
                }
            }
        }

        for (let peopleMessage of peopleMessageLi) {

            if (overId.indexOf(peopleMessage.cardNo) !== -1) {
                continue
            }

            // 添加乘客
            document.getElementsByClassName("add-passenger-panel")[0].children[0].click()


            let inputItemLi = document.getElementsByClassName("right-panel")[0].getElementsByClassName("input-item");

            for (let inputItemIndex in inputItemLi) {
                switch (inputItemIndex) {
                    case "0":
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByClassName("input-target")[0],
                            peopleMessage.name
                        )
                        console.log("乘客姓名");
                        break;
                    case "1":
                        break;
                    case "2":
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByClassName("input-target")[0],
                            peopleMessage.cardNo
                        )
                        console.log("身份证号");
                        break
                    case "3":
                        console.log("手机号");
                        window.reactAutoEvent(
                            inputItemLi[inputItemIndex].getElementsByClassName("input-target")[0],
                            "13036787990"
                        )
                        break
                }
            }

            let demo = document.getElementsByClassName("dialog-button-panel")[0].getElementsByClassName("tpi-button big color")[0];

            let errorDemo = demo.innerText;

            if (errorDemo && ["重新搜索"].indexOf(errorDemo) !== -1) {
                console.log(errorDemo);
                clearInterval(window.Miao);
            } else {
                demo.click();
            }

        }
    }

    /**
     * 选择航班号
     * @param flightNo
     */
    function selectFlightNo(flightNo) {
        // 航班信息标量
        let allFlightNoLi = document.getElementsByClassName("flight-list-item clearfix J_FlightItem");
        for (let allFlightNo of allFlightNoLi) {
            let flightText = allFlightNo.innerText;
            // 标记航班号
            if (flightText.indexOf(flightNo) !== -1) {
                allFlightNo.style.border = "10px solid #0c76e0";
                // 点击订票
                allFlightNo.getElementsByClassName("select-btn J_SelectFlight")[0].click();
                window.flightSelectOver = true;
            }
        }
    }

    function setCookie(cname, cvalue, exdays, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
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

    /**
     * 修改联系人手机号
     */
    function updateContact() {
        let contactLi = document.getElementsByClassName("children-wrap");
        for (let contactIndex in contactLi) {
            switch (contactIndex) {
                case "0":
                    console.log("联系人-王子新")
                    window.reactAutoEvent(
                        contactLi[contactIndex].getElementsByClassName("input-target")[0],
                        "王子新"
                    )
                    break
                case "1":
                    console.log("联系人手机号")
                    window.reactAutoEvent(
                        contactLi[contactIndex].getElementsByClassName("input-target")[0],
                        "13036787990"
                    )
                    break

            }
        }
    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;

        if ('/flight_search_result.htm' === nowLocationPathname || '/homeow/trip_flight_search.htm' === nowLocationPathname) {
            // 已阅读疫情
            document.getElementById("J_Flight_Notify_Close_Btn").click();

            // 搜索价格信息
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            setCookie(
                "flightInfoAndUserInfo",
                flightInfoAndUserInfo,
                180,
                ".fliggy.com"
            );
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            // 选择航班号
            window.Miao2 = setInterval(function () {
                selectFlightNo(flightInfoAndUserInfo.flightNo);
                if (window.flightSelectOver) {
                    clearInterval(window.Miao2)
                }
            }, 1000);
        } else if ('/travel/confirm_order.htm' === nowLocationPathname) {
            let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo")
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

            setCookie(
                "flightInfoAndUserInfo",
                "",
                60,
                ".fliggy.com"
            );

            if(flightInfoAndUserInfo){
                setCookie(
                    "flightInfoAndUserInfo2",
                    JSON.stringify(flightInfoAndUserInfo),
                    90,
                    ".fliggy.com"
                );
            }

            window.Miao = setInterval(function () {
                // 展开所有乘客列表
                document.getElementsByClassName("show-all-btn")[0].click();

                addPeople(flightInfoAndUserInfo.passengerInfos);

                // 判断人数是否一致
                let passengerItem = document.getElementsByClassName("passenger-item").length;
                if (passengerItem === flightInfoAndUserInfo.passengerInfos.length) {
                    clearInterval(window.Miao);
                    let showDiv = document.getElementsByClassName("show-all-btn ishow");
                    if (showDiv.length) {
                        showDiv[0].click();
                    }
                }
            }, 3000);

            setTimeout(function () {
                updateContact();
            }, 2000);
            // 阅读协议
            document.getElementsByClassName("mod-protocols-wrap-check-panel")[0].getElementsByClassName("tpi-checkbox")[0].click();
        }
    });
})();