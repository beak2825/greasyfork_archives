// ==UserScript==
// @name         去哪儿国际半自动下单-自动添加乘客信息
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  国际自动添加乘客信息
// @author       MzXing
// @match        https://booking.flight.qunar.com/inter/page/booking*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450074/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%9B%BD%E9%99%85%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95-%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E4%B9%98%E5%AE%A2%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/450074/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%9B%BD%E9%99%85%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95-%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E4%B9%98%E5%AE%A2%E4%BF%A1%E6%81%AF.meta.js
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

    function setCookie(cname, cvalue, exSeconds, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exSeconds * 1000));
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
     * 点击提示信息
     */
    function clickTipMessage() {
        let allBtn = document.getElementsByClassName("btn");

        for (let btn in allBtn) {
            if (!allBtn.hasOwnProperty(btn)) {
                continue
            }
            let nowBtn = allBtn[btn];
            let nowBtnContent = nowBtn.textContent;
            if (nowBtnContent.indexOf("继续预订") !== -1) {
                nowBtn.click();
            }
        }
    }

    function addPeople(peopleMessageLi) {

        let qunarPassengerButtonLi = document.getElementsByClassName("qunar-passenger-button");
        let buttonDic = {};
        for (let qunarPassengerButton of qunarPassengerButtonLi) {
            if(qunarPassengerButton.getAttribute("class").indexOf("selected") !== -1){
                qunarPassengerButton.click();
            }
            buttonDic[qunarPassengerButton.children[0].innerText] = qunarPassengerButton
        }
        // 添加乘客
        for (let i = 0; i < peopleMessageLi.length; i++) {
            let passengerInfo = peopleMessageLi[i];
            let _passengerName = passengerInfo.name.toUpperCase().replace(" ", "");
            // 添加乘客.
            if (!buttonDic.hasOwnProperty(_passengerName)) {
                alert("未找到乘客：" + passengerInfo.name + " 信息");
                return;
            }
            // 选择乘客
            buttonDic[_passengerName].click();
            if (document.getElementsByClassName("passenger-card-container").length < peopleMessageLi.length) {
                let passengerButtonLi = document.getElementsByClassName("passenger-add-button enable");
                if (!passengerButtonLi.length) {
                    alert("余票不足,无法继续添加乘客");
                    return
                }
                window.reactAutoEvent(
                    passengerButtonLi[0],
                    "",
                    "click"
                );
            }


        }

        // 修改联系人
        AddContact(peopleMessageLi[0].name);
    }

    function AddContact(concatName) {
        // 联系人
        window.reactAutoEvent(
            document.getElementById("concat-name"),
            concatName
        );

        let concatPhone = getCookie("concatPhoneHtlm");
        if (!concatPhone) {
            concatPhone = "18075193789"
        }

        // 联系人手机号
        window.reactAutoEvent(
            document.getElementById("concat-phone"),
            concatPhone
        );

        // 邮箱
        window.reactAutoEvent(
            document.getElementById("concat-email"),
            "751495223@qq.com"
        );
        // 自动点击同意协议
        document.getElementsByClassName("title-wrapper relative")[0].firstChild.click();

        // // 点击预定
        // window.reactAutoEvent(
        //     document.querySelector("input[class=darkblue-button]"),
        //     "",
        //     "click"
        // );
    }

    // 继续预定
    function cancellationInsurance(mutationsList, observer) {
        // debugger;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let mutationAddedNodes = mutation.addedNodes;
                let li = [];
                for (let i of mutationAddedNodes) {
                    li.push(i.innerText)
                }
                console.log(li.join(""));
                if (li.join("").indexOf("继续预订") !== -1) {
                    clickTipMessage()
                } else if (li.join("").indexOf("意外保障") !== -1) {
                    document.getElementsByClassName("btn btn_default")[0].click();
                }
            }
        }
        // debugger;
    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        if ('/inter/page/booking' === nowLocationPathname) {
            let flightInfoAndUserInfo = getCookie("intFlightInfoAndUserInfo");
            if(!flightInfoAndUserInfo){
                alert("操作超时,客人信息已被清除,无法自动填写");
                return
            }
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            addPeople(flightInfoAndUserInfo.passengerInfos);

            window.orderBtnIntervalId = setInterval(function () {
                // 判断提交订单是否可以点击(可以点击后,修改乘客姓名)
                let orderBtnList = document.getElementsByClassName("nts-btn nts-btn-large btn-disabled");
                if (orderBtnList.length > 0) {
                    return
                }
                clearInterval(window.orderBtnIntervalId);
                let peopleMessageLi = flightInfoAndUserInfo.passengerInfos
                // 重新填写乘客姓名
                for (let i = 0; i < peopleMessageLi.length; i++) {
                    let passengerInfo = peopleMessageLi[i];
                    window.reactAutoEvent(
                        document.getElementsByClassName("passenger-first-name upper-case")[i],
                        passengerInfo.name.split("/")[1]
                    )
                }

                // 客人信息重新赋值为空
                setCookie(
                    "intFlightInfoAndUserInfo",
                    "",
                    5,
                    ".flight.qunar.com"
                );

            }, 1000);
        }
    })
})();