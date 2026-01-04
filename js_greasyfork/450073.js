// ==UserScript==
// @name         去哪儿国际自动下单-绑定客人信息
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  去哪儿国际自动下单
// @author       You
// @match       https://booking.flight.qunar.com/inter/page/booking?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450073/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%9B%BD%E9%99%85%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95-%E7%BB%91%E5%AE%9A%E5%AE%A2%E4%BA%BA%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/450073/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%9B%BD%E9%99%85%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95-%E7%BB%91%E5%AE%9A%E5%AE%A2%E4%BA%BA%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    localStorage.removeItem("3wInfoBooking")

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }


    function hook() {
        localStorage.removeItem("3wInfoBooking");

        var oldStartBooking = window.startBooking
        window.startBooking = function(data) {
            localStorage.removeItem("3wInfoBooking");

            console.log('拦截成功', data)

            if (data.hasOwnProperty("data") && data.data.hasOwnProperty("omPassengersResult")) {

                let flightInfoAndUserInfo = getCookie("intFlightInfoAndUserInfo");
                if(!flightInfoAndUserInfo){
                    alert("客人信息已过期,请重新执行半自动下单");
                    return
                }
                flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

                let passengers = [];
                let id = 1;
                for (var passengerInfo of flightInfoAndUserInfo.passengerInfos) {

                    let cardNo = passengerInfo.cardNo;
                    if(!cardNo){
                        cardNo = "00000" + String(id);
                    }

                    let gender = "1"
                    if(passengerInfo.gender !== "MALE"){
                        gender = "2";
                    }

                    if(passengerInfo.ageType !== "ADULT"){
                        alert("不支持儿童");
                        return
                    }

                    let nationalityName = "中国";
                    if(passengerInfo.hasOwnProperty("nationalityZh")){
                        nationalityName = passengerInfo.nationalityZh;
                    }

                    passengers.push({
                        "totName": "成人票",
                        "tot": "adult",
                        "isChild": "0",
                        "ageType": "0",
                        "name": "",
                        "gender": gender,
                        "id": String(id),   // 这个必须唯一
                        "birthday": passengerInfo.birthday,
                        "englishName": passengerInfo.name,
                        "nationality2Code": passengerInfo.nationality,   // 国籍
                        "nationalityName": nationalityName,  // 国籍
                        "certs": [
                            {
                                "number": cardNo,
                                "numberObj": {
                                    "value": cardNo,
                                    "display": "",
                                    "prenum": ""
                                },
                                "type": "PP",
                                "name": "护照",
                                "certId": String(id),
                                "cardlssuePlace2Code": "",
                                "cardlssuePlaceName": "",
                                "invalidday": passengerInfo.cardExpired, // 证件过期日期
                                "lastUpdateTime": 1661319228000,
                                "createTime": 1661319228000
                            }
                        ],
                        "ticketType": "1",
                        "lastUpdateTime": 1651640369000,
                        "createTime": 1651640369000
                    });
                    id++;
                }

                data.data.omPassengersResult.passengers = passengers;
            }

            return oldStartBooking(data)
        }
    }

    if (!window.oldFun) {
        window.oldFun = new Proxy(window.document.getElementById, {
            apply: function(target, thisArg, argumentsList) {
                if (argumentsList[0] === 'root') {
                    console.log('开始执行注入代码')
                    hook()
                }
                return Reflect.apply(target, thisArg, argumentsList);
            }
        })
        document.getElementById = window.oldFun
    }


})();