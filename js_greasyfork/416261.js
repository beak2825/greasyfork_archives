// ==UserScript==
// @name         携程自动填写乘客信息
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  携程填写乘客信息
// @author       MzXing
// @match        https://www.ctrip.com/
// @match        https://flights.ctrip.com/itinerary/checkout/passenger*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416261/%E6%90%BA%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%B9%98%E5%AE%A2%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/416261/%E6%90%BA%E7%A8%8B%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E4%B9%98%E5%AE%A2%E4%BF%A1%E6%81%AF.meta.js
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

    function addPeople(peopleMessageLi) {

        for (let i = 0; i < peopleMessageLi.length - 1; i++) {
            window.reactAutoEvent(
                document.querySelector(".psg-passenger__add-btn"),
                "",
                "click"
            );

        }

        for (let peopleMessage of peopleMessageLi) {
            debugger;
            let idNumber = peopleMessageLi.indexOf(peopleMessage);
            // 姓名
            let pNameDoc = $("#p_name_" + idNumber)[0];
            window.reactAutoEvent(
                pNameDoc,
                peopleMessage.name
            );
            // 添加一个 移除焦点
            window.reactAutoEvent(
                pNameDoc,
                peopleMessage.name,
                "blur"
            );


            // 身份证
            let pCardNoDoc = $("#p_card_no_" + idNumber)[0];
            window.reactAutoEvent(
                pCardNoDoc,
                peopleMessage.cardNum
            );
            // 添加一个 移除焦点
            window.reactAutoEvent(
                pCardNoDoc,
                peopleMessage.cardNum,
                "blur"
            );


            // 身份证
            let pCellPhoneDoc = $("#p_cellphone_" + idNumber)[0];
            window.reactAutoEvent(
                pCellPhoneDoc,
                "18075193789"
            );
            window.reactAutoEvent(
                pCellPhoneDoc,
                "18075193789",
                "blur"
            );
        }

        // 联系人
        let contacts = $("#I_contact_phone")[0];
        window.reactAutoEvent(
            contacts,
            "18075193789",
        );
        window.reactAutoEvent(
            contacts,
            "18075193789",
            "blur"
        );

        // 点击下一步
        window.reactAutoEvent($("#J_saveOrder")[0], "", "click");

    }

    // reactAutoEvent($(".alert_announce .button")[0], "", "click")
    setTimeout(function () {
        // 乘客信息和航班信息
        let nowLocationPathname = window.location.pathname;
        let nowUrl = window.location.href;
        if ("/itinerary/checkout/passenger" === nowLocationPathname) {
            console.log("添加乘客");
            // 取出 乘客信息等
            var flightInfoAndUserInfo = window.localStorage.getItem("flightInfoAndUserInfo");
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            addPeople(flightInfoAndUserInfo.passengerInfos);
        }
    }, 3000);
})();