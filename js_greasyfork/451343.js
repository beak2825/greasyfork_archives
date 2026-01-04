// ==UserScript==
// @name         航路半自动下单
// @namespace    http://tampermonkey.net/
// @version      0.0.2.2
// @description  体验畅爽
// @author       一个默默的搬砖侠
// @match        https://b2b.flightroutes24.com/*
// @icon         https://b2b.flightroutes24.com/images/FR_Logo_32.ico
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451343/%E8%88%AA%E8%B7%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/451343/%E8%88%AA%E8%B7%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';


    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }


    function setCookie(cname, cValue, exSeconds, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exSeconds * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cValue + ";Path=/;domain=" + domain + ";" + expires;
    }

    /**
     * 点击标签
     * @param a
     * @param b
     * @param c
     * @param d
     *      参数无实际意义
     */
    function clickTab(a, b, c, d) {
        focusBase(a, b, c, d);
        blurBase(a, b, c, d);
    }

    /**
     * 搜索航班
     * @param flightInfoAndUserInfo: 订单信息
     */
    function selectFlight(flightInfoAndUserInfo) {
        window.selectFlightId = setInterval(function () {
            let adultNumber = document.getElementById("adultNum");
            if (!adultNumber) {
                return
            }

            clearInterval(window.selectFlightId);

            // 单程
            changeType(1);

            // 乘客数量
            document.getElementById("adultNum").value = flightInfoAndUserInfo["passengerInfos"].length;

            // 出发地
            document.getElementById("fromCity").value = flightInfoAndUserInfo["depAirport"];
            document.getElementById("fromCity").setAttribute('data-type', "A");

            // 抵达地
            document.getElementById("toCity").value = flightInfoAndUserInfo["arrAirport"];
            document.getElementById("toCity").setAttribute('data-type', "A");

            // 出发日期
            document.getElementById("fromDate").value = flightInfoAndUserInfo["depDate"].replaceAll("-", "/");

            // 航司

            document.getElementById("airlines").value = flightInfoAndUserInfo["flightNo"].slice(0, 2);

            // 搜索航班
            searchEvent()

        }, 1000)
    }


    /**
     * 选中目标航班
     * @param flightNo: 航班号
     */
    function checkFlightNo(flightNo) {
        window.HtlmIntervalId = setInterval(function () {
            // 选择直飞
            let iCheckBoxLi = document.getElementsByClassName("direct i-checkbox");
            if (iCheckBoxLi.length > 0 && iCheckBoxLi[0].innerText.indexOf("直飞") !== -1) {
                iCheckBoxLi[0].click();
            }

            let flightNoTagList = document.getElementsByClassName("filterList");
            if (flightNoTagList.length <= 0) {
                return
            }
            // 是否匹配航班号
            let isMatching = false;
            for (let flightNoTag of flightNoTagList) {
                let flightText = flightNoTag.querySelector("span[class='flightText']");
                if (!flightText) {
                    continue
                }
                flightText = flightText.innerText;
                console.log(flightText)
                if (!flightText || flightText !== flightNo) {
                    continue
                }
                // 航班号一致 添加边框
                flightNoTag.setAttribute("style", "border:10px solid #0e06bb;");
                // 展示价格信息
                flightNoTag.click();
                isMatching = true;
                break
            }

            if (isMatching) {
                clearInterval(window.HtlmIntervalId);
            }
        }, 1000)

    }


    /**
     * 添加乘客信息
     * @param frPassengerItemTag: 乘客信息节点
     * @param peopleInfo: 原始乘客信息
     * @param index: 乘客序号
     */
    function savePeopleInfo(frPassengerItemTag, peopleInfo, index) {
        let peopleNameLi = peopleInfo["name"].split("/");
        // lastName 姓
        frPassengerItemTag.querySelector("input[name='lastName']").value = peopleNameLi[0];
        clickTab(frPassengerItemTag.querySelector("input[name='lastName']"), 'lastName', 'aoygjj');

        // firstName 名
        frPassengerItemTag.querySelector("input[name='firstName']").value = peopleNameLi[1];
        clickTab(frPassengerItemTag.querySelector("input[name='firstName']"), 'firstName', 'aoygjj');
        // 性别
        let genderLi = frPassengerItemTag.getElementsByClassName("icon-radio fr-gender ");
        debugger;
        if(peopleInfo["gender"] === "MALE" && genderLi[0].innerText.indexOf("男") !== -1){
            changeRadio(genderLi[0], 'M', 'a9h30j');
            genderLi[0].click();
        }else if(peopleInfo["gender"] !== "MALE" && genderLi[1].innerText.indexOf("女") !== -1){
            changeRadio(genderLi[1], 'F', 'a9h30j');
            genderLi[1].click();
        }else{
            return
        }

        // 生日
        let birthdayLi = peopleInfo["birthday"].split("-");
        // 生日 年
        frPassengerItemTag.querySelector("input[class='birthday-input birthday-year']").value = birthdayLi[0];
        // 生日 月
        frPassengerItemTag.querySelector("input[class='birthday-input birthday-month']").value = birthdayLi[1];
        // 生日 日
        frPassengerItemTag.querySelector("input[class='birthday-input birthday-day']").value = birthdayLi[2];
        clickTab(frPassengerItemTag.querySelector("input[class='birthday-input birthday-day']"), 'birthday', 'u74he8');
        // 乘客国籍
        frPassengerItemTag.querySelector("input[name='nationality']").value = peopleInfo["nationality"];
        clickTab(frPassengerItemTag.querySelector("input[name='nationality']"), 'nationality', 'u74he8');
        // 证件号
        let cardNo = peopleInfo["cardNo"];
        if (!cardNo) {
            cardNo = "00000" + String(index);
        }

        frPassengerItemTag.querySelector("input[name='cardNum']").value = cardNo;
        clickTab(frPassengerItemTag.querySelector("input[name='cardNum']"), 'cardNum', 'u74he8');

        // 证件签发地
        frPassengerItemTag.querySelector("input[name='cardIssuePlace']").value = peopleInfo["cardIssuePlace"];
        clickTab(frPassengerItemTag.querySelector("input[name='cardIssuePlace']"), 'cardIssuePlace', 'u74he8')
        // 证件有效期
        let cardExpiredLi = peopleInfo["cardExpired"].split("-");
        // 证件有效期 年
        frPassengerItemTag.querySelector("input[class='cardExpired-input cardExpired-year']").value = cardExpiredLi[0];
        // 证件有效期 月
        frPassengerItemTag.querySelector("input[class='cardExpired-input cardExpired-month']").value = cardExpiredLi[1];
        // 证件有效期 日
        frPassengerItemTag.querySelector("input[class='cardExpired-input cardExpired-day']").value = cardExpiredLi[2];
        clickTab(frPassengerItemTag.querySelector("input[class='cardExpired-input cardExpired-day']"), 'cardExpired', 'u74he8')
    }

    /**
     * 添加乘客信息
     * @param passengerInfos
     */
    function addPeopleInfo(passengerInfos) {
        window.addPeopleInfoIntervalId = setInterval(function () {
            // 填写乘客信息
            let frPassengerItemTagLi = document.getElementsByClassName("fr-passenger-item");
            if (!frPassengerItemTagLi || frPassengerItemTagLi.length === 0) {
                return
            }

            clearInterval(window.addPeopleInfoIntervalId);

            if (frPassengerItemTagLi.length !== passengerInfos.length) {
                alert("乘客数量匹配失败,无法自动填写乘客信息");
                throw "乘客数量匹配失败"
            }

            for (let index = 0; index < frPassengerItemTagLi.length; index++) {
                // 乘客信息节点
                let frPassengerItemTag = frPassengerItemTagLi[index];
                // 乘客信息
                let peopleInfo = passengerInfos[index];
                // 填写乘客信息
                savePeopleInfo(frPassengerItemTag, peopleInfo, index + 1);
            }

            // 联系人姓名
            document.getElementsByName("contact-name")[0].value = passengerInfos[0].name.replaceAll("/", " ");
            clickTab(document.getElementsByName("contact-name"), "contact-name");
            // 联系人邮箱
            document.getElementsByName("contact-email")[0].value = "751495223@qq.com";
            clickTab(document.getElementsByName("contact-email"), "contact-email");
            // 国际电话区号
            document.getElementsByName("contact-area-code")[0].value = "86";
            clickTab(document.getElementsByName("contact-area-code"), "contact-area-code");
            // 联系电话
            document.getElementsByName("contact-phone")[0].value = "15254595650";
            clickTab(document.getElementsByName("contact-phone"), "contact-phone");

        }, 1000)

    }

    // 开始运行
    var nowLocationPathname = window.location.pathname;
    var nowUrl = window.location.href;
    if ('/view/fareSearch/search.html' === nowLocationPathname) {
        if (nowUrl.indexOf("#") === -1) {
            return
        }
        // 保存订单信息
        let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
        flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        setCookie(
            "flightInfoAndUserInfo",
            JSON.stringify(flightInfoAndUserInfo),
            60,
            ".flightroutes24.com"
        );
        // 搜索航班, 以及 标记航班框
        selectFlight(flightInfoAndUserInfo);
        // 选中目标航班
        checkFlightNo(flightInfoAndUserInfo["flightNo"]);

    } else if ('/view/fareSearch/verify.html' === nowLocationPathname) {

        let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo");
        if (!flightInfoAndUserInfo) {
            alert("操作超时,无法自动填写乘客信息");
            return
        }
        flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        // 添加乘客信息
        addPeopleInfo(flightInfoAndUserInfo["passengerInfos"]);
        // 移除cookie
        setCookie(
            "flightInfoAndUserInfo",
            JSON.stringify({}),
            10,
            ".flightroutes24.com"
        );
    }
})();
