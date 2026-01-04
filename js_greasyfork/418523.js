// ==UserScript==
// @name         吉祥航空web端半自动下单
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @author       Mz_xing
// @description  吉祥航空半自动下单
// @match        http://www.juneyaoair.com/
// @match        https://www.juneyaoair.com/
// @match        http://www.juneyaoair.com/index.aspx/
// @match        https://www.juneyaoair.com/index.aspx/
// @match        http://www.juneyaoair.com/pages/Flight/flight.aspx?*
// @match        https://www.juneyaoair.com/pages/Flight/flight.aspx?*
// @match        http://www.juneyaoair.com/pages/Flight/flight_guestInfo.aspx
// @match        https://www.juneyaoair.com/pages/Flight/flight_guestInfo.aspx
// @match        http://www.juneyaoair.com/pages/Flight/flight_confirm.aspx
// @match        https://www.juneyaoair.com/pages/Flight/flight_confirm.aspx
// @match        http://www.juneyaoair.com/pages/Flight/flight_pay.aspx
// @match        https://www.juneyaoair.com/pages/Flight/flight_pay.aspx
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418523/%E5%90%89%E7%A5%A5%E8%88%AA%E7%A9%BAweb%E7%AB%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/418523/%E5%90%89%E7%A5%A5%E8%88%AA%E7%A9%BAweb%E7%AB%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 搜索价格信息
    function selectPriceUrl(depCode, arrCode, depDate, manNum, childNum, cabin, coupon) {
        console.log("选择出发抵达,以及日期");
        if(depCode === "PVG"){
            depCode = "SHA";
        }else if(arrCode === "PVG"){
            arrCode = "SHA";
        }

        let depAirport = depCode;
        let arrAirport = arrCode;
        let fromcity = document.getElementById("fromcity");
        fromcity.value = depAirport;
        fromcity.setAttribute("szm", depAirport);
        let tocity = document.getElementById("tocity");
        tocity.value = arrAirport;
        tocity.setAttribute("tocityszm", arrAirport);
        tocity.setAttribute("isinternation", "D");
        tocity.setAttribute("isturn", "N");
        let date = document.getElementById("date01");
        date.value = depDate;
        document.getElementById("boxs-left-img-search").click();
    }

    // 选择价格信息
    function selectPrice(flightNo) {
        console.log("选择航班");
        var allTr = $("#flt_hd_table >> tbody > tr");

        var minPrice = 0;
        var isTrue = false;
        for (var index in allTr) {
            var tr = $(allTr[index]);
            // 判断class
            if (tr.attr("class") === "title") {
                let flightNoStr = tr.find(".flt_No").text();
                console.log(flightNoStr);
                // 航班号不相等，跳过
                if (flightNoStr.indexOf(flightNo.substring(2)) === -1) {
                    continue
                } else {
                    isTrue = true;
                    let allTd = tr.children("td");
                    let priceText = allTd[allTd.length - 3].innerText;
                    minPrice = priceText.substring(1, priceText.length - 1);
                }
            } else if (tr.attr("class") === "flt_more") {
                isTrue = false;
            } else if (tr.attr("class") === "cnt" && isTrue) {
                let allTd = tr.children("td");
                let price = allTd[allTd.length - 4].innerText.substring(1);
                if (parseFloat(price) === parseFloat(minPrice)) {
                    let allA = tr.find("a");
                    $(allA[allA.length - 1])[0].click();
                    break
                }
            }
        }
        console("未找到 " + flightNo +" 航班");
    }

    function getMoble() {
        var prefixArray = new Array(
            "133", "135", "137", "138", "170",
            "166", "159", "152", "130", "131", "132"
        );
        var i = parseInt(10 * Math.random());
        var prefix = prefixArray[i];
        for (var j = 0; j < 8; j++) {
            prefix = prefix + Math.floor(Math.random() * 10);
        }
        return prefix
    }

    // 排序
    function sortUserInfo(userInfo) {
        const newUserInfo = [];
        for (let i = 0; i < userInfo.length; i++) {
            if (userInfo[i]["ageType"] === "ADULT") {
                newUserInfo.splice(0, 0, userInfo[i]);
            } else {
                newUserInfo.push(userInfo[i]);
            }
        }
        return newUserInfo
    }

    // 填写乘客信息
    function writeUserInfo(userInfoLi) {
        console.log("开始添加乘客信息");
        // 乘客信息进行排序
        userInfoLi = sortUserInfo(userInfoLi);

        for (let i in userInfoLi) {
            if (parseInt(i) !== 0) {
                // 增加乘客
                $(".addPassenger")[0].click();
            }
            let userInfo = userInfoLi[i];
            // 添加几个乘客，数字就跟着变化
            let ids = "#newAdult" + (parseInt(i) + 1).toString();
            let newAdult1 = $(ids);
            if (userInfo.ageType !== "ADULT") {
                // 如果是儿童在执行， 执行完毕
                newAdult1.find("#inlineRadio2").click();
                // 儿童生日
                let childrenBirsday = newAdult1.find("#formGroupInputSmall");
                childrenBirsday.val(userInfo.birthday);
                // 儿童身份证号码
                let childCardNo = newAdult1.find("input[name$='childCardNo']");
                childCardNo.val(userInfo.cardNum);
                // 儿童姓名
                let childName = newAdult1.find("input[name$='childName']");
                childName.val(userInfo.name);
            } else {
                // 成人姓名
                let adultName = newAdult1.find("input[name$='adultName']");
                adultName.val(userInfo.name);
                // 成人身份证号码
                let adultCardNo = newAdult1.find("input[name$='adultCardNo']");
                adultCardNo.val(userInfo.cardNum);
            }
            // 手机号码
            let phone = newAdult1.find("input[name$='phone']");
            phone.val(getMoble());
        }
        // 联系人姓名
        let personName = $("#personName");
        personName.val("王子");
        // 联系人手机号
        let contactPhone = $("#contactPhone");
        contactPhone.val("18075193789");
        // 联系人邮箱地址
        let contactEmail = $("#contactEmail");
        contactEmail.val("13456789@qq.com");

        $($(".next")[1])[0].click();
    }

    function deepClone(obj) {
        var _obj = JSON.stringify(obj),
            objClone = JSON.parse(_obj);
        return objClone;
    }

    // 添加 弹框
    function addSpringBox(flightInfo) {
        var _UserInfoStr = '<h3 style="font-weight: bold;    margin: 15px 0;text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);font-size: 30px;">乘客信息</h3> <div style="min-height: 150px;    text-align: left;padding-left: 35px;">';
        for (var i in flightInfo.passengerInfos) {
            _UserInfoStr += '<p style="" class="myP"><input id="myInput"' + i + ' type="checkbox" name="vehicle" value="' + i + '" checked="checked" /> <span style="margin-left: 15px;cursor:pointer;font-size: 20px;">姓名：' + flightInfo.passengerInfos[i]["name"] + '&nbsp&nbsp&nbsp身份证号: ' + flightInfo.passengerInfos[i]["cardNum"] + '</span></p>'
            if(parseInt(i) === flightInfo.passengerInfos.length - 1){
                break
            }
        }

        _UserInfoStr += '</div><button id="rightPerson" style="font-size: 25px;color: #fff;height: 50px;padding: 0 15px;background-color: #d54913;border: 1px solid #ff4109;outline:none;border-radius: 10px;cursor:pointer;">确定</button>';

        _UserInfoStr += '<span class="myP" style="display:none;float:left; cursor: pointer;font-size: 15px;line-height: 50px;margin-right: -25%;"><input id="isCode" 0="" type="checkbox" name="vehicle" value="0" checked="checked"/>是否携带促销码</span>';


        $($("#indexSlide")[0]).append($('<div id="myDiv" style="font-family: \'Open Sans\', sans-serif;text-align: center;background-image: linear-gradient(0deg, #02abcbeb 10%, #2631e4 100%);border: 1px solid #00a1de;-webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);border-radius: 25px;position: absolute;top: 40%;right: 0;transform: translate(-50%, -50%);padding: 10px;     color: #ffffff; z-index: 99999;">' + _UserInfoStr + "</div>"));

        $(".myP").click(function () {
            var input = $(this).children("input");
            input.prop('checked', !input.prop('checked'))
        });
    }
    // 首页div 点击框
    function click_search() {


        var flightInfoAndUserInfo = window.localStorage.getItem("flightInfoAndUserInfo");
        if (flightInfoAndUserInfo) {
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        }

        var passengerInfos = deepClone(flightInfoAndUserInfo.passengerInfos);
        var newPassengerInfos = [];
        var inputLists = $("#myDiv input:checkbox:checked");
        // 导出最后一个 选择框 : 其实就是 是否选择优惠码
        var isCode = inputLists[inputLists.length - 1].id;
        // 循环的长度控制
        var inputListsLength = inputLists.length;
        if (isCode === "isCode") {
            isCode = true;
            inputListsLength--
        } else {
            isCode = false;
        }
        console.log(isCode);
        var manNum = 0;
        var childNum = 0;

        for (var input = 0; input < inputListsLength; input++) {
            var flightDate = passengerInfos[inputLists[input].value];
            newPassengerInfos.push(flightDate);
            if (flightDate.ageType === "ADULT") {
                manNum += 1;
            } else if (flightDate.ageType === "CHILD") {
                childNum += 1;
            }
        }

        flightInfoAndUserInfo.passengerInfos = newPassengerInfos;
        window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo));

        console.log("开始执行搜索任务");
        selectPriceUrl(flightInfoAndUserInfo.depAirport,
            flightInfoAndUserInfo.arrAirport,
            flightInfoAndUserInfo.depDate,
            manNum,
            childNum,
            flightInfoAndUserInfo.cabin.substring(0, 1),
            isCode);

    }
    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var flightInfoAndUserInfo = window.localStorage.getItem("flightInfoAndUserInfo");
        if (flightInfoAndUserInfo) {
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        }

        var nowLocationPathname = window.location.pathname;
        if ("/index.aspx/" === nowLocationPathname || "/" === window.location.pathname) {
            // 搜索价格信息
            var flightInfo = decodeURIComponent(window.location.href.split("#")[1]);
            flightInfo = JSON.parse(flightInfo);
            // 出现弹框
            addSpringBox(flightInfo);
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfo));
            click_search();
        } else if ("/pages/Flight/flight.aspx" === nowLocationPathname) {
            // 选择价格信息
            console.log("开始选择价格信息");
            window.setInterval(
                function(){
                    try{
                        selectPrice(flightInfoAndUserInfo.flightNo)
                    }catch (e) {
                        console.log("出现异常")
                    }
                },
                1000
            );
            console.log("等待")

        } else if ("/pages/Flight/flight_guestInfo.aspx" === nowLocationPathname) {
            // 填写乘客信息
            writeUserInfo(flightInfoAndUserInfo.passengerInfos);
        } else if ("/pages/Flight/flight_confirm.aspx" === nowLocationPathname) {
            let checkBox = $("#checkbox");
            if (!checkBox.is(":checked")) {
                checkBox.click();
            }
            $("#submit")[0].click();
        }


        // 广告去除
        $(".u-close").click();
    });

})();