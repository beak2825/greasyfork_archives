// ==UserScript==
// @name         国航web端半自动下单
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       Mz_xing
// @description  国航半自动下单
// @match        http://et.airchina.com.cn/
// @match        https://et.airchina.com.cn/
// @match        http://et.airchina.com.cn/cn/index.shtml
// @match        https://et.airchina.com.cn/cn/index.shtml
// @match        http://et.airchina.com.cn/InternetBooking/AirFareFamiliesFlexibleForward.do
// @match        https://et.airchina.com.cn/InternetBooking/AirFareFamiliesFlexibleForward.do
// @match        http://et.airchina.com.cn/InternetBooking/TravelersDetailsForwardAction.do
// @match        https://et.airchina.com.cn/InternetBooking/TravelersDetailsForwardAction.do
// @match        http://et.airchina.com.cn/InternetBooking/PaymentForward.do
// @match        https://et.airchina.com.cn/InternetBooking/PaymentForward.do
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406235/%E5%9B%BD%E8%88%AAweb%E7%AB%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/406235/%E5%9B%BD%E8%88%AAweb%E7%AB%AF%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCode(depCode, arrCode, depDate, manNum, childNum, cabin, isCode) {
        //步骤一:创建异步对象
        var ajax = new XMLHttpRequest();
        //步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
        ajax.open('get', 'http://www.htairline.com/autoOrder/getCode?dep=' + depCode + "&arr=" + arrCode + "&cabin=" + cabin + "&depDate=" + depDate);
        //步骤三:发送请求
        ajax.send();
        //步骤四:注册事件 onreadystatechange 状态改变就会调用
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的
                var couponDic = JSON.parse(ajax.responseText);
                var coupon = couponDic.code;

                if(!coupon || !isCode){
                    coupon = "";
                }
                console.log("优惠码", coupon);
                selectPriceUrl(depCode, arrCode, depDate, manNum, childNum, cabin, coupon);
            }else{
                console.log("出现异常");
            }
        }

    }
    // 搜索价格信息
    function selectPriceUrl(depCode, arrCode, depDate, manNum, childNum, cabin, coupon) {
        var depDateList = depDate.split("-");
        var day = depDateList[2];
        var mouth = depDateList[1];
        var year = depDateList[0];

        var url = "http://et.airchina.com.cn/InternetBooking/AirLowFareSearchExternal.do?&tripType=OW&searchType=FARE&flexibleSearch=false&directFlightsOnly=false&fareOptions=1.FAR.X&outboundOption.originLocationCode=" + depCode + "&outboundOption.destinationLocationCode=" + arrCode + "&outboundOption.departureDay=" + day + "&outboundOption.departureMonth=" + mouth + "&outboundOption.departureYear=" + year + "&outboundOption.departureTime=NA";

        url = url + "&guestTypes%5B0%5D.type=ADT&guestTypes%5B0%5D.amount=" + manNum + "&guestTypes%5B1%5D.type=CNN&guestTypes%5B1%5D.amount=" + childNum + "&guestTypes%5B3%5D.type=MWD&guestTypes%5B3%5D.amount=0&guestTypes%5B4%5D.type=PWD&guestTypes%5B4%5D.amount=0&pos=AIRCHINA_CN&lang=zh_CN";

        url = url + "&guestTypes%5B2%5D.type=INF&guestTypes%5B2%5D.amount=0";

        url = url + "&coupon=" + coupon;

        window.location = url;
    }

    // 选择价格信息
    function selectPrice(flightNo) {
        // 所有价格列表
        var allTbody = $("#AIR_SEARCH_RESULT_CONTEXT_ID0 > tbody");
        for (var index in allTbody) {
            var tbody = $(allTbody[index]);
            var flightNoStr = tbody.children("tr").children("td").children("div").children("a")[0].innerText;
            var indexNum = flightNoStr.indexOf(flightNo.substring(2));
            if (indexNum === -1) {
                continue
            } else {
                var tdList = tbody.children("tr").children("td");
                for (var inde in tdList) {
                    // 有值代表有价格
                    var id = $(tdList[tdList.length - 1 - inde]).find("input").attr("id");
                    if (id) {
                        document.getElementById(id).click();
                        return id
                    }
                }
            }
        }
    }

    // 确定订单信息
    function confirmOrderAuto() {
        // 选中不要保险
        window.scrollTo(0, document.documentElement.clientHeight);
        $("#insurancePurchaseNo").click();
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
                newUserInfo.splice(0,0, userInfo[i]);
            } else {
                newUserInfo.push(userInfo[i]);
            }
        }
        return newUserInfo
    }

    // 填写乘客信息
    function writeUserInfo(userInfo) {
        // 乘客信息进行排序
        userInfo = sortUserInfo(userInfo);

        // 填写客人信息
        // 设置为新添加
        document.querySelector("#travellersInfo\\[0\\]\\.profileId").value = "-2";
        // 执行添加新用户
        try {
            travellerView.onChangeProfile(0, document.querySelector("#travellersInfo\\[0\\]\\.profileId"), false, true);
        } catch (e) {
            console.log("忽略这个语法异常");
        }
        for (var index in userInfo) {
            // 是否是儿童
            if (userInfo[index]["ageType"] === "CHILD") {
                // 身份证
                var IDCard = userInfo[index]["cardNum"];
                // 年
                document.getElementById("travellersInfo[" + String(index) + "].travellerBirthYear").value = IDCard.substring(6, 10);
                // 月
                document.getElementById("travellersInfo[" + String(index) + "].travellerBirthMonth").value = parseInt(IDCard.substring(10, 12));
                // 日
                document.getElementById("travellersInfo[" + String(index) + "].travellerBirthDay").value = parseInt(IDCard.substring(12, 14));
            }
            // 判断证件类型
            if(userInfo[index].cardType === "PP"){
                // 选择护照
                document.getElementById("travellersInfo[" + String(index) + "].advancedPassengerDetails(foid)").value = "2.DOC";
            }else if(userInfo[index].cardType === "NI"){
                console.log("跳过");
            }else{
                // 选择其他
                document.getElementById("travellersInfo[" + String(index) + "].advancedPassengerDetails(foid)").value = "MI_CARD";
            }

            // 判断名字是否属于英文
            if(userInfo[index]["name"].indexOf("/") !== -1){
                // 切割为姓和名
                let [surname,name] = userInfo[index]["name"].split("/");
                // 姓
                document.getElementById("travellersInfo[" + String(index) + "].lastName").value = surname;
                // 名
                document.getElementById("travellersInfo[" + String(index) + "].firstName").value = name;
            }else{
                // 姓
                document.getElementById("travellersInfo[" + String(index) + "].lastName").value = userInfo[index]["name"].substring(0, 1);
                // 名
                document.getElementById("travellersInfo[" + String(index) + "].firstName").value = userInfo[index]["name"].substring(1);
            }
            // 身份证号/护照号/其他证件
            document.getElementById("travellersInfo[" + String(index) + "].advancedPassengerDetails(foidNumber)").value = userInfo[index]["cardNum"];
            // 手机号  固定类型
            $(document.getElementById("travellersInfo[" + String(index) + "].personalPhone.phoneNumber")).val(getMoble());
        }

        document.getElementById("travellersInfo[0].mobilePhone.phoneNumber").value = "18146573461";
    }

    // 支付界面
    function pay() {
        try {
            popupFramework.hide({id: 'alertPopup'});
        } catch (e) {
            console.log("忽略该异常")
        } finally {
            $("#acceptTermsAndConditionsCheckBox").click();
        }
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
        }

        _UserInfoStr += '</div><button id="rightPerson" style="font-size: 25px;color: #fff;height: 50px;padding: 0 15px;background-color: #d54913;border: 1px solid #ff4109;outline:none;border-radius: 10px;cursor:pointer;">确定</button>';

        _UserInfoStr += '<span class="myP" style="float:left; cursor: pointer;font-size: 15px;line-height: 50px;margin-right: -25%;"><input id="isCode" 0="" type="checkbox" name="vehicle" value="0" checked="checked"/>是否携带促销码</span>';


        $($("#warp")[0]).append($('<div id="myDiv" style="font-family: \'Open Sans\', sans-serif;text-align: center;background-image: linear-gradient(0deg, #02abcbeb 10%, #2631e4 100%);border: 1px solid #00a1de;-webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);border-radius: 25px;position: absolute;top: 40%;right: 0;transform: translate(-50%, -50%);padding: 10px;     color: #ffffff;">' + _UserInfoStr + "</div>"));

        $(".myP").click(function () {
            var input = $(this).children("input");
            input.prop('checked', !input.prop('checked'))
        });
    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var flightInfoAndUserInfo = window.localStorage.getItem("flightInfoAndUserInfo");
        if (flightInfoAndUserInfo) {
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        }

        var nowLocationPathname = window.location.pathname;
        if ("/" === nowLocationPathname) {
            // 搜索价格信息
            var flightInfo = decodeURIComponent(window.location.href.split("#")[1]);
            flightInfo = JSON.parse(flightInfo);
            // 出现弹框
            addSpringBox(flightInfo);
            window.localStorage.setItem("flightInfoAndUserInfo", JSON.stringify(flightInfo));

        } else if ("/InternetBooking/AirFareFamiliesFlexibleForward.do" === nowLocationPathname) {
            // 选择价格信息
            console.log("开始选择价格信息");
            selectPrice(flightInfoAndUserInfo.flightNo);
            // 执行下一步
            $("#pgButtonNext").click();

            // } else if ("/InternetBooking/ItinerarySummary.do" === nowLocationPathname) {
            // 确定价格信息
            // confirmOrderAuto();
            //console.log("确定价格 保险选中 !!!!");
        } else if ("/InternetBooking/TravelersDetailsForwardAction.do" === nowLocationPathname) {
            // 填写乘客信息
            console.log("开始填写乘客信息");
            writeUserInfo(flightInfoAndUserInfo.passengerInfos);
            $("#pgButtonProceed").click();
        } else if ("/InternetBooking/PaymentForward.do" === nowLocationPathname) {
            // 支付界面
            pay();
        }

        // 首页div 点击框
        $("#rightPerson").click(() => {
            var flightInfoAndUserInfo = window.localStorage.getItem("flightInfoAndUserInfo");
            if (flightInfoAndUserInfo) {
                flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            }

            var passengerInfos = deepClone(flightInfoAndUserInfo.passengerInfos);
            var newPassengerInfos = [];
            var inputLists = $("#myDiv input:checkbox:checked");
            // 导出最后一个 选择框 : 其实就是 是否选择优惠码
            var isCode = inputLists[inputLists.length -1].id;
            // 循环的长度控制
            var inputListsLength = inputLists.length;
            if(isCode === "isCode"){
                isCode = true;
                inputListsLength--
            }else{
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
            getCode(flightInfoAndUserInfo.depAirport,
                flightInfoAndUserInfo.arrAirport,
                flightInfoAndUserInfo.depDate,
                manNum,
                childNum,
                flightInfoAndUserInfo.cabin.substring(0, 1),
                isCode);

        });
    });
    // 去掉生日会
    $("#xiaocha").click();

})();