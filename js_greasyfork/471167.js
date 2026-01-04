// ==UserScript==
// @name         国际飞猪半自动下单
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  国际飞猪半自动下单v1.0
// @author       MzXing
// @match        https://www.fliggy.com/*
// @match        https://sijipiao.fliggy.com/ie/flight_search_result.htm*
// @match        https://sjipiao.fliggy.com/flight_search_result.ht*
// @match        https://sjipiao.fliggy.com/homeow/trip_flight_search.htm*
// @match        https://fbuy.fliggy.com/travel/confirm_order.htm*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471167/%E5%9B%BD%E9%99%85%E9%A3%9E%E7%8C%AA%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/471167/%E5%9B%BD%E9%99%85%E9%A3%9E%E7%8C%AA%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var oldIsArray = Array.isArray
    Array.isArray = function (arg) {
        let result = oldIsArray(arg);
        if (result && arg.length === 10 && navigator.PeopleInfo && navigator.PeopleInfo.firstName && arg[0].hasOwnProperty("firstName")) {

            arg[0] = {
                "type": "name",
                "firstName": navigator.PeopleInfo.firstName,
                "lastName": navigator.PeopleInfo.lastName,
                "firstNameError": false,
                "lastNameError": false,
                "errorInfo": ""
            }
            arg[1] = {"type": "sex", "value": navigator.PeopleInfo.sex, "errorInfo": ""}
            arg[2] = {
                "type": "certType",
                "value": "1",
                "name": "护照",
                "options": [{
                    "name": "护照", "value": "1", "certId": "1951774",
                    "certIssueCountry": navigator.PeopleInfo.certIssueCountry,
                    "certValidatePeriod": navigator.PeopleInfo.certValidatePeriod,
                    "defaultCertNo": navigator.PeopleInfo.cardNo,
                }],
                "errorInfo": ""
            }
            arg[3] = {"type": "certNo", "value": navigator.PeopleInfo.cardNo, "errorInfo": ""}
            arg[4] = {"type": "certIssueCountry", "value": navigator.PeopleInfo.certIssueCountry, "errorInfo": ""}
            arg[5] = {"type": "certValidatePeriod", "value": navigator.PeopleInfo.certValidatePeriod, "errorInfo": ""}
            arg[6] = {"type": "birthday", "value": navigator.PeopleInfo.birthday, "errorInfo": ""}
            arg[7] = {"type": "nationality", "value": navigator.PeopleInfo.nationality, "errorInfo": ""}
            arg[8] = {
                "type": "telephone",
                "mobileCountryCode": "86",
                "mobileCountryCodeError": false,
                "telephoneError": false,
                "value": navigator.PeopleInfo.telephone,
                "errorInfo": ""
            }
            arg[9] = {
                "type": "frequentCard",
                "options": [{"name": "请选择常旅客卡", "value": ""}],
                "errorInfo": "",
                "useTip": "亲，部分行程暂无法在线提交常旅客信息，您可以值机柜台提交或直接致电航空公司"
            }
            navigator.PeopleInfo = {};
            console.log("替换完毕~", arg);
        }
        return result
    }

    window.ALL_COUNTRY_CODE = {
        'CN': '中国大陆',
        'HK': '中国香港',
        'MO': '中国澳门',
        'TW': '中国台湾',
        'US': '美国',
        'GB': '英国',
        'JP': '日本',
        'KR': '韩国',
        'CA': '加拿大',
        'FR': '法国',
        'AE': '阿联酋',
        'AF': '阿富汗',
        'AG': '安提瓜与巴布达',
        'AI': '安圭拉岛',
        'AL': '阿尔巴尼亚',
        'AM': '亚美尼亚',
        'AN': '荷属安的列斯',
        'AO': '安哥拉',
        'AR': '阿根廷',
        'AS': '美属萨摩亚',
        'AT': '奥地利',
        'AU': '澳大利亚',
        'AW': '阿鲁巴',
        'AZ': '阿塞拜疆',
        'BA': '波黑',
        'BB': '巴巴多斯',
        'BD': '孟加拉',
        'BE': '比利时',
        'BF': '布基纳法索',
        'BG': '保加利亚',
        'BH': '巴林',
        'BI': '布隆迪',
        'BJ': '贝宁',
        'BM': '百慕大',
        'BN': '文莱',
        'BO': '玻利维亚',
        'BR': '巴西',
        'BS': '巴哈马',
        'BT': '不丹',
        'BW': '博茨瓦纳',
        'BY': '白俄罗斯',
        'BZ': '伯利兹',
        'CC': '科科斯群岛',
        'CD': '刚果民主共和国',
        'CF': '中非',
        'CG': '刚果共和国',
        'CH': '瑞士',
        'CI': '科特迪瓦',
        'CK': '库克群岛',
        'CL': '智利',
        'CM': '喀麦隆',
        'CO': '哥伦比亚',
        'CR': '哥斯达黎加',
        'CS': '塞黑',
        'CU': '古巴',
        'CV': '佛得角',
        'CX': '圣诞岛',
        'CY': '塞浦路斯',
        'CZ': '捷克',
        'DE': '德国',
        'DJ': '吉布提',
        'DK': '丹麦',
        'DM': '多米尼克',
        'DO': '多米尼加共和国',
        'DZ': '阿尔及利亚',
        'EC': '厄瓜多尔',
        'EE': '爱沙尼亚',
        'EG': '埃及',
        'ER': '厄立特里亚',
        'ES': '西班牙',
        'ET': '埃塞俄比亚',
        'FI': '芬兰',
        'FJ': '斐济',
        'FK': '福克兰群岛',
        'FM': '密克罗尼西亚',
        'FO': '法罗群岛',
        'GA': '加蓬',
        'GD': '格林纳达',
        'GE': '格鲁吉亚',
        'GF': '法属圭亚那',
        'GH': '加纳',
        'GI': '直布罗陀',
        'GL': '格陵兰',
        'GM': '赞比亚',
        'GN': '几内亚',
        '法属(GP': '瓜德罗普',
        'GQ': '赤道几内亚',
        'GR': '希腊',
        'GT': '危地马拉',
        'GU': '关岛',
        'GW': '几内亚比绍',
        'GY': '圭亚那',
        'HN': '洪都拉斯',
        'HR': '克罗地亚',
        'HT': '海地',
        'HU': '匈牙利',
        'ID': '印度尼西亚',
        'IE': '爱尔兰',
        'IL': '以色列',
        'IN': '印度',
        'IQ': '伊拉克',
        'IR': '伊朗',
        'IS': '冰岛',
        'IT': '意大利',
        'JM': '牙买加',
        'JO': '约旦',
        'KE': '肯尼亚',
        'KG': '吉尔吉斯斯坦',
        'KH': '柬埔寨',
        'KI': '基里巴斯',
        'KM': '科摩罗',
        'KN': '圣基茨和尼维斯',
        'KP': '朝鲜',
        'KW': '科威特',
        'KY': '开曼',
        'KZ': '哈萨克斯坦',
        'LA': '老挝',
        'LB': '黎巴嫩',
        'LC': '圣卢西亚',
        'LI': '列支敦士登',
        'LK': '斯里兰卡',
        'LR': '利比里亚',
        'LS': '莱索托',
        'LT': '立陶宛',
        'LU': '卢森堡',
        'LV': '拉脱维亚',
        'LY': '利比亚',
        'MA': '摩洛哥',
        'MD': '摩尔多瓦',
        'MG': '马达加斯加',
        'MH': '马绍尔群岛',
        'MK': '马其顿',
        'ML': '马里',
        'MM': '缅甸',
        'MN': '蒙古',
        'MP': '北马里亚纳群岛',
        'MQ': '马提尼克',
        'MR': '毛里塔尼亚',
        'MS': '蒙特塞拉特',
        'MT': '马耳他',
        'MU': '毛里求斯',
        'MV': '马尔代夫',
        'MW': '马拉维',
        'MX': '墨西哥',
        'MY': '马来西亚',
        'MZ': '莫桑比克',
        'NA': '纳米比亚',
        'NC': '新喀里多尼亚',
        'NE': '尼日尔',
        'NF': '诺福克岛',
        'NG': '尼日利亚',
        'NI': '尼加拉瓜',
        'NL': '荷兰',
        'NO': '挪威',
        'NP': '尼泊尔',
        'NR': '瑙鲁',
        'NU': '纽埃',
        'NZ': '新西兰',
        'OM': '阿曼',
        'PA': '巴拿马',
        'PE': '秘鲁',
        'PF': '法属波利尼西亚',
        'PG': '巴布亚新几内亚',
        'PH': '菲律宾',
        'PK': '巴基斯坦',
        'PL': '波兰',
        'PM': '圣皮埃尔和密克隆岛',
        'PR': '波多黎各',
        'PS': '巴勒斯坦',
        'PT': '葡萄牙',
        'PW': '帕劳',
        'PY': '巴拉圭',
        'QA': '卡塔尔',
        'RE': '留尼汪',
        'RO': '罗马尼亚',
        'RU': '俄罗斯',
        'RW': '卢旺达',
        'SA': '沙特阿拉伯',
        'SB': '所罗门群岛',
        'SC': '塞舌尔',
        'SD': '苏丹',
        'SE': '瑞典',
        'SG': '新加坡',
        'SH': '圣赫勒拿',
        'SI': '斯洛文尼亚',
        'SK': '斯洛伐克',
        'SL': '塞拉利昂',
        'SM': '圣马力诺',
        'SN': '塞内加尔',
        'SO': '索马里',
        'SR': '苏里南',
        'ST': '圣多美及普林西比',
        'SV': '萨尔瓦多',
        'SY': '叙利亚',
        'SZ': '斯威士兰',
        'TC': '特克斯和凯科斯群岛',
        'TD': '乍得',
        'TG': '多哥',
        'TH': '泰国',
        'TJ': '塔吉克斯坦',
        'TL': '东帝汶',
        'TM': '土库曼斯坦',
        'TN': '突尼斯',
        'TO': '汤加',
        'TR': '土耳其',
        'TT': '特立尼达与多巴哥',
        'TV': '图瓦卢',
        'TZ': '坦桑尼亚',
        'UA': '乌克兰',
        'UG': '乌干达',
        'UM': '美国本土外小岛屿',
        'UY': '乌拉圭',
        'UZ': '乌兹别克斯坦',
        'VC': '圣文森特和格林纳丁斯',
        'VE': '委内瑞拉',
        'VG': '英属维尔京群岛',
        'VI': '美属维尔京群岛',
        'VN': '越南',
        'VU': '瓦努阿图',
        'WF': '瓦利斯与富图纳',
        'WS': '萨摩亚',
        'YE': '也门',
        'YT': '马约特岛',
        'ZA': '南非',
        'ZM': '赞比亚',
        'ZW': '津巴布韦',
        'BL': '圣巴泰勒米',
        'BQ': '加勒比荷兰',
        'CW': '库拉索',
        'MC': '摩纳哥',
        'ME': '黑山',
        'MF': '法属圣马丁岛',
        'RS': '塞尔维亚',
        'SS': '南苏丹',
        'SX': '荷属圣马丁岛'
    };


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


    /*
    添加乘客信息
     */
    function addPeople(peopleMessageLi) {
        let overId = [];
        for (let peopleMessage of peopleMessageLi) {

            let frequentList = document.getElementsByClassName("frequent-list");
            if (!frequentList.length) {
                break
            }

            let listPanelLi = frequentList[0].getElementsByClassName("list-panel")
            if (!listPanelLi.length) {
                break
            }

            for (let listPanel in listPanelLi) {
                if (!listPanelLi.hasOwnProperty(listPanel)) {
                    continue
                }
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
                        let showNodeLi = document.getElementsByClassName("show-all-btn");
                        if (showNodeLi && showNodeLi.length > 0) {
                            showNodeLi[0].click();
                        }
                    }
                    overId.push(peopleMessage.cardNo)
                }
            }
        }

        for (let peopleInfoIndex in peopleMessageLi) {
            if (!peopleMessageLi.hasOwnProperty(peopleInfoIndex)) {
                continue
            }
            let peopleMessage = peopleMessageLi[peopleInfoIndex];
            if (overId.indexOf(peopleMessage.cardNo) !== -1) {
                continue
            }

            let userName = peopleMessage.name.split("/")

            setTimeout(function (peopleInfo) {
                // 点击添加乘客
                document.getElementsByClassName("add-passenger-panel")[0].children[0].click();
                navigator.PeopleInfo = peopleInfo
                // 点击保存
                document.getElementsByClassName("tpi-button big color")[0].click()
            }, 3000 * peopleInfoIndex, {
                firstName: userName[1],
                lastName: userName[0],
                sex: peopleMessage.gender === "MALE" ? "0" : "1",   // 0 是男, 1是女
                cardNo: peopleMessage.cardNo || peopleMessage.cardNum,
                certIssueCountry: window.ALL_COUNTRY_CODE[peopleMessage.cardIssuePlace],
                certValidatePeriod: peopleMessage.cardExpired,
                birthday: peopleMessage.birthday,
                nationality: window.ALL_COUNTRY_CODE[peopleMessage.nationality],
                telephone: "18010272539",
            })

        }
    }

    /**
     * 选择航班号
     * @param flightNo
     */
    function selectFlightNo(flightNo) {
        let carrier = flightNo.slice(0, 2);
        let endStr = flightNo.slice(2);
        let start = false;
        for(let index in endStr){
            if(!endStr.hasOwnProperty(index)){
                continue
            }
            if(endStr[index] !== "0"){
                start = true;
            }
            if(start){
                carrier += endStr[index]
            }
        }
        flightNo = carrier;
        // 选择直达
        let J_direct = document.getElementById("J_direct");
        if (!J_direct.checked) {
            J_direct.click();
        }

        // 航班信息标量
        let allFlightNoLi = document.getElementsByClassName("flightInfoItem J_FlightInfoIndex");
        for (let allFlightNo of allFlightNoLi) {
            let flightText = allFlightNo.innerText;
            // 标记航班号
            if (flightText.indexOf(flightNo) !== -1) {
                allFlightNo.style.border = "10px solid #0c76e0";
                console.log("成功标记航班号");
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
            if (!contactLi.hasOwnProperty(contactIndex)) {
                continue
            }

            let inputNode = contactLi[contactIndex].getElementsByClassName("input-target")[0];
            switch (contactIndex) {
                case "0":
                    console.log("联系人-王子新");
                    inputNode.value = "王子新";
                    window.reactAutoEvent(inputNode, "王子新");
                    window.reactAutoEvent(inputNode, "王子新", "blur");
                    break
                case "1":
                    console.log("联系人手机号");
                    inputNode.value = "18010272539";
                    window.reactAutoEvent(inputNode, "18010272539");
                    window.reactAutoEvent(inputNode, "18010272539", "blur");
                    break
                case "2":
                    console.log("邮箱");
                    inputNode.value = "18010272539@163.com";
                    window.reactAutoEvent(inputNode, "18010272539@163.com");
                    window.reactAutoEvent(inputNode, "18010272539@163.com", "blur");
                    break
            }
        }
    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
        // 乘客信息和航班信息
        var nowLocationPathname = window.location.pathname;
        if (nowLocationPathname === "/") {
            // 搜索价格信息
            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            setCookie(
                "flightInfoAndUserInfo",
                flightInfoAndUserInfo,
                300,
                ".fliggy.com"
            );
            console.log("航班信息已保存");
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            let passengerCountDic = {};
            for(let passengerInfo of flightInfoAndUserInfo["passengerInfos"]){
                let ageType = passengerInfo["ageType"];
                if(passengerCountDic.hasOwnProperty(ageType)){
                    passengerCountDic[ageType] = passengerCountDic[ageType] + 1
                }else{
                    passengerCountDic[ageType] = 1
                }
            }

            $("body").append($('<div style="z-index: 99;position: fixed;top: 40%;right: 5%;font-size: 20px;text-align: center;padding: 15px;border-radius: 30px;border: 10px solid #e9ba65;background:#daef06"><b style="color: red; font-size: 30px;">--半自动行程信息--</b><br><b>出发:</b> '+flightInfoAndUserInfo["depAirport"]+'<br><b>抵达:</b> '+flightInfoAndUserInfo["arrAirport"]+'<br><b>出发日期:</b> '+ flightInfoAndUserInfo["depDate"] +'<br><b>航班号:</b> '+ flightInfoAndUserInfo["flightNo"]+'<br><b>乘客人数:</b> 成人('+ passengerCountDic.ADULT +'人), 儿童('+ (passengerCountDic.CHILD || 0) +'人)<br></div>'));


        } else if ('/ie/flight_search_result.htm' === nowLocationPathname || '/flight_search_result.htm' === nowLocationPathname || '/homeow/trip_flight_search.htm' === nowLocationPathname) {
            // 缓存的航班信息
            let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo")
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
            // 选择航班号
            window.Miao2 = setInterval(function () {
                // 已阅读疫情
                let tip = document.getElementById("J_Flight_Notify_Close_Btn");
                if (tip) {
                    tip.click();
                }

                let J_Flight_Notify_Close_Btn = document.getElementById("J_Flight_Notify_Close_Btn");
                if (J_Flight_Notify_Close_Btn) {
                    J_Flight_Notify_Close_Btn.click();
                }

                // 判断行程日期是否一致
                let J_Title = document.getElementById("J_Title").innerText;
                if (J_Title && J_Title.indexOf(flightInfoAndUserInfo.depDate) === -1) {
                    alert("航班日期不一致,请自己重新校验>>>" + J_Title + "!=" + flightInfoAndUserInfo.depDate);
                    clearInterval(window.Miao2);
                    return
                }

                selectFlightNo(flightInfoAndUserInfo.flightNo);

                let filterContainer = document.getElementsByClassName("filter-container");
                if(filterContainer.length < 0){
                    alert("无法自动匹配行程, 请自行判断");
                    clearInterval(window.Miao2);
                    return
                }
                if (filterContainer[0].innerText.indexOf("起飞时段") !== -1) {
                    console.log("取消标记操作");
                    clearInterval(window.Miao2)
                }
            }, 2000);
        } else if ('/travel/confirm_order.htm' === nowLocationPathname) {

            let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo")
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

            // setCookie("flightInfoAndUserInfo", "", 60, ".fliggy.com");

            if (flightInfoAndUserInfo) {
                setCookie(
                    "flightInfoAndUserInfo",
                    JSON.stringify(flightInfoAndUserInfo),
                    300,
                    ".fliggy.com"
                );
            }

            window.ERROR_COUNT = 0

            window.Miao = setInterval(function () {
                // 展开所有乘客列表
                let showAllBtn = document.getElementsByClassName("show-all-btn");
                if (showAllBtn.length) {
                    showAllBtn[0].click();
                }

                addPeople(flightInfoAndUserInfo.passengerInfos);

                // 判断人数是否一致
                let passengerItem = document.getElementsByClassName("passenger-item").length;
                if (passengerItem === flightInfoAndUserInfo.passengerInfos.length) {
                    console.log("乘客数量一致, 取消添加乘客");
                    debugger;
                    clearInterval(window.Miao);
                    window.WUHAHA = true;
                    return
                }
                console.log("当前错误次数为:", window.ERROR_COUNT);

                window.ERROR_COUNT += 1;
                if (window.ERROR_COUNT > 10) {
                    // 刷新页面
                    location.reload();
                }

            }, 3000);

            setTimeout(function () {
                updateContact();
            }, 2000);

            window.WUHAHA = false;

            window.ClosePeopleId = setInterval(function () {
                if(window.WUHAHA){
                    console.log("准备关闭");
                    // 关闭添加乘客框按钮
                    let tipButtonSimple = document.getElementsByClassName("tpi-button big simple");
                    if(tipButtonSimple.length){
                        console.log("关闭添加乘客按钮");
                        tipButtonSimple[0].click();
                        clearInterval(window.ClosePeopleId);
                    }
                    let showDiv = document.getElementsByClassName("show-all-btn ishow");
                    if (showDiv.length) {
                        console.log("关闭添加乘客按钮???");
                        showDiv[0].click();
                        // clearInterval(window.ClosePeopleId);
                    }
                    console.log("数量一致,关闭自动填写乘客信息");
                }
            }, 1500);

            // 阅读协议
            let modProtocolsWrapCheckPanel = document.getElementsByClassName("mod-protocols-wrap-check-panel");
            if (modProtocolsWrapCheckPanel.length) {
                let tpiCheckbox = modProtocolsWrapCheckPanel[0].getElementsByClassName("tpi-checkbox");
                if (tpiCheckbox.length) {
                    tpiCheckbox[0].click();
                }
            }
        }
    });
})();