// ==UserScript==
// @name         去哪儿网自动添加乘客信息
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  自动添加乘客信息
// @author       MzXing
// @match        https://qnf.trade.qunar.com/ns/book/fill?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418824/%E5%8E%BB%E5%93%AA%E5%84%BF%E7%BD%91%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E4%B9%98%E5%AE%A2%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/418824/%E5%8E%BB%E5%93%AA%E5%84%BF%E7%BD%91%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E4%B9%98%E5%AE%A2%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {attributes: true, childList: true, subtree: true};

    window.reactAutoEvent = function (doc, value, eventName = "input") {
        if(!doc){
            return
        }
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

    function setCookie(cname, cvalue, exdays, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
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

        for(let btn in allBtn){
            if(!allBtn.hasOwnProperty(btn)){
                continue
            }
            let nowBtn = allBtn[btn];
            let nowBtnContent = nowBtn.textContent;
            if(nowBtnContent.indexOf("继续预订") !== -1 ){
                nowBtn.click();
            }
        }
    }

    function addPeople(peopleMessageLi) {
        debugger;
        for (let i = 0; i < peopleMessageLi.length - 1; i++) {
            window.reactAutoEvent(
                $(".js-addPassenger")[0],
                "",
                "mousedown"
            );
        }
        // 所有姓名框
        let passengerNameLi = document.getElementsByClassName("js-passenger-name");
        let passengerCardNumberLi = document.getElementsByClassName("js-cert-number");
        let passengerPhoneLi = document.querySelectorAll("input[name=passenger_phone]");

        for (let peopleMessageIndex = 0; peopleMessageIndex < peopleMessageLi.length; peopleMessageIndex++) {
            let peopleMessage = peopleMessageLi[peopleMessageIndex];

            //姓名
            if(passengerNameLi.hasOwnProperty(peopleMessageIndex)){
                window.reactAutoEvent(
                    passengerNameLi[peopleMessageIndex],
                    peopleMessage.name
                );
            }

            //身份证号
            if(passengerCardNumberLi.hasOwnProperty(peopleMessageIndex)){
                window.reactAutoEvent(
                    passengerCardNumberLi[peopleMessageIndex],
                    peopleMessage.cardNum
                );
            }

            let concatPhone = getCookie("concatPhoneHtlm");
            if(!concatPhone){
                concatPhone = "18075193789"
            }

            //手机号
            if(passengerPhoneLi.hasOwnProperty(peopleMessageIndex)){
                window.reactAutoEvent(
                    passengerPhoneLi[peopleMessageIndex],
                    concatPhone
                );
            }

        }

        debugger;
        setTimeout(
            AddContact,
            2000
        )
    }

    function AddContact(){
        // 联系人
        window.reactAutoEvent(
            document.querySelector("input[name=contact_name]"),
            "王子"
        );

        let concatPhone = getCookie("concatPhoneHtlm");
        if(!concatPhone){
            concatPhone = "18075193789"
        }

        // 联系人手机号
        window.reactAutoEvent(
            document.querySelector("input[name=contact_phone]"),
            concatPhone
        );
        // 自动点击同意协议
        let agreementHd = document.getElementsByClassName("agreement-hd");
        if(agreementHd && agreementHd[0]){
           let agreementHdFirstChild = agreementHd[0].firstChild;
           if(agreementHdFirstChild){
               agreementHdFirstChild.click();
           }
        }

        // 点击预定
        window.reactAutoEvent(
            document.querySelector("input[class=darkblue-button]"),
            "",
            "click"
        );
    }

    // 继续预定
    function cancellationInsurance(mutationsList, observer){
        // debugger;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let mutationAddedNodes = mutation.addedNodes;
                let li = [];
                for(let i of mutationAddedNodes){
                    li.push(i.innerText)
                }
                console.log(li.join(""));
                if (li.join("").indexOf("继续预订") !== -1) {
                    clickTipMessage()
                }else if(li.join("").indexOf("意外保障") !== -1){
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
        var nowUrl = window.location.href;
        if ("/ns/book/fill" === nowLocationPathname) {
            let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo");
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

            let InsuranceNone = document.getElementsByTagName("body")[0];
            // 创建一个链接到回调函数的观察者实例
            let cancellationInsuranceObserver = new MutationObserver(cancellationInsurance);
            // 开始观察目标节点的配置突变
            cancellationInsuranceObserver.observe(InsuranceNone, {attributes: false, childList: true, subtree: true});

            addPeople(flightInfoAndUserInfo.passengerInfos);
        }

    });
})();