// ==UserScript==
// @name         去哪儿国际半自动下单-自动搜索
// @namespace    http://tampermonkey.net/
// @version      1.0.0.3
// @description  去哪网搜索航班，自动点击航班
// @author       MzXing
// @match        https://www.qunar.com/
// @match        https://flight.qunar.com/site/oneway_list_inter.htm?*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450075/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%9B%BD%E9%99%85%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95-%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/450075/%E5%8E%BB%E5%93%AA%E5%84%BF%E5%9B%BD%E9%99%85%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%B8%8B%E5%8D%95-%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var allCityDic = {
        "PQC": "富国岛",
        "KBV": "甲米",
        "VCA": "芹苴",
        "SIN": "新加坡",
        "CNX": "清迈",
        "KIX": "大阪",
        "UTH": "乌隆他尼",
        "BMV": "邦美蜀",
        "TPE": "台北",
        "HDY": "合艾",
        "DLI": "大叻",
        "KUL": "吉隆坡",
        "VDO": "广宁",
        "BKK": "曼谷",
        "UIH": "归仁",
        "DAD": "岘港",
        "ICN": "首尔",
        "CXR": "芽庄",
        "CEI": "清莱",
        "URT": "素叻他尼",
        "HPH": "海防",
        "PXU": "波来古",
        "HKT": "普吉",
        "DPS": "巴厘岛",
        "DEL": "德里",
        "TBB": "宣化",
        "NRT": "东京",
        "KKC": "孔敬",
        "HAN": "河内",
        "VDH": "冬海",
        "VII": "荣市",
        "PNH": "金边",
        "SGN": "胡志明市",
        "THD": "清化",
        "VCL": "褚来",
        "UBP": "乌汶",
        "NST": "洛坤",
        "HUI": "顺化",
        "PUS": "釜山"
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

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    function setCookie(cname, cvalue, exSeconds, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exSeconds * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
    }

    // 搜索航班信息
    function selectFlightInfo(depCode, arrCode, depDate) {
        console.log("选择出发抵达,以及日期");
        return "https://flight.qunar.com/site/oneway_list_inter.htm?searchDepartureAirport=" + allCityDic[depCode] + "&searchArrivalAirport=" + allCityDic[arrCode] + "&searchDepartureTime=" + depDate + "&searchArrivalTime=&nextNDays=0&startSearch=true&fromCode=" + depCode + "&toCode=" + arrCode + "&from=qunarindex&lowestPrice=null";
    }

    // 选择价格信息
    function clickOne() {
        // 点击过滤航司
        let oneLabelLi = getDom("label", "data-reactid", ".0.2.0.4.2.1.0.0.0.1.1.0");
        if (oneLabelLi.length) {
            oneLabelLi[0].click();
            console.log("点击直达");
        }
    }

    function clickFlight(flightNo) {

        let flightDic = {
            'VJ': '越南越捷',
            'VZ': '泰国越捷'
        };
        // 点击过滤航司
        let titleLi = getDom("label", "title", flightDic[flightNo.substring(0, 2)])
        if (titleLi.length) {
            titleLi[0].click();
            console.log("点击航司");
        }
    }


    function clickFlightNo(flightInfo) {
        debugger;
        // 点击航班号
        let dataReactId = '.0.2.0.4.3.2.2.$' + flightInfo + '.0';
        let divLi = getDom("div", "data-reactid", dataReactId);
        if (divLi.length) {
            // 给父级添加颜色
            divLi[0].parentElement.style = "border: 10px solid red;";
            divLi[0].click();
            console.log("点击航班号");
        }
    }

    /**
     *
     * @param topBLabel   顶部的 b 标签, 里面包含 i 标签
     * @param otherBLabelLi  其他 b 标签
     * @returns {string}
     */
    function getRealPrice(topBLabel, otherBLabelLi) {
        /*
            根据 最上面的假的 b 标签的 left 属性，以及 假的 b 标签 的 i 标签个数，来算出 每个 标签偏移宽度
         */
        let myRe = new RegExp("-[0-9]+");

        // 总体偏移量
        let totalOffset = parseInt(myRe.exec(topBLabel.getAttribute("style"))[0]);
        // 价格模板
        let priceList = topBLabel.textContent.split("");
        // 标签个数
        let iLabelCount = priceList.length;
        // 每个偏移量
        let averageOffset = totalOffset / iLabelCount;

        for (let otherBLabel of otherBLabelLi) {
            let otherBLabelOffset = parseInt(myRe.exec(otherBLabel.getAttribute("style"))[0]);
            priceList[iLabelCount - otherBLabelOffset / averageOffset] = otherBLabel.textContent;
        }
        return priceList.join("");
    }

    /**
     * 获取所有价格
     * @returns {{}}
     */
    function arrangeAllPrice() {
        let allPriceLi = document.getElementsByClassName("e-ota-outer");
        let allPriceMap = {};
        for (let priceIndex = 0; priceIndex < allPriceLi.length; priceIndex++) {
            if (priceIndex !== 0 && allPriceLi.hasOwnProperty(priceIndex)) {
                let nowPriceLabel = allPriceLi[priceIndex];
                // 出行必备, 等 额外产品, 不需要购买
                let assureDivLabel = nowPriceLabel.getElementsByClassName("assure")[0];
                if (assureDivLabel) {
                    continue
                }
                // 获取 B 标签
                let allBLabelLi = nowPriceLabel.getElementsByClassName("prc_wp")[0].children[0].children;
                let otherBLabelLi = [];
                for (let BLabelIndex = 0; BLabelIndex < allBLabelLi.length; BLabelIndex++) {
                    if (BLabelIndex !== 0 && allBLabelLi.hasOwnProperty(BLabelIndex)) {
                        otherBLabelLi.push(allBLabelLi[BLabelIndex])
                    }
                }
                let nowPrice = parseInt(getRealPrice(allBLabelLi[0], otherBLabelLi));
                if (allPriceMap[nowPrice]) {
                    allPriceMap[nowPrice].push(nowPriceLabel.children[0])

                } else {
                    allPriceMap[nowPrice] = [nowPriceLabel.children[0]]

                }
            }
        }
        return allPriceMap
    }


    function getMinPrice(priceKeyLi, allPriceMap) {
        // 最低价格
        let minPriceDiv = null;
        let minPrice = 0;
        for (let priceDiv of allPriceMap[priceKeyLi[0]]) {
            // 是否需要减
            let minusContent = priceDiv.getElementsByClassName("minus");
            if (minusContent.length) {
                minusContent = minusContent[0].textContent
            } else {
                minusContent = "";
            }
            // 可再减 价格
            let reducePrice = 0;
            if (minusContent.indexOf("可再减") !== -1) {
                let minContentLi = minusContent.split("¥");
                reducePrice = parseInt(minContentLi[minContentLi.length - 1]);
            }
            let nowPrice = priceKeyLi[0] - reducePrice;
            if (!minPriceDiv) {
                minPriceDiv = priceDiv;
                minPrice = nowPrice;
            } else if (nowPrice < minPrice) {
                minPriceDiv = priceDiv;
                minPrice = nowPrice;
            }
        }
        return {
            minPriceDiv: minPriceDiv,
            minPrice: minPrice,
        };
    }

    function clickMinPrice(originalUnitPrice) {
        // 整理航班价格
        let allPriceMap = arrangeAllPrice();
        // 排序获取 最低价格
        let priceKeyLi = Reflect.ownKeys(allPriceMap).map(Number).sort(function (a, b) {
            return a - b;
        });
        let minPriceDivMap = getMinPrice(priceKeyLi, allPriceMap);
        // 点击最低价格
        window.minPriceDIV = minPriceDivMap.minPriceDiv;
        console.log(minPriceDivMap.minPriceDiv);
        console.log(minPriceDivMap.minPrice);
        // 亏损在 3 元 以内 允许点击
        if ((minPriceDivMap.minPrice + 50) < (originalUnitPrice + 3)) {
            console.log("取消自动点击价格");
            //minPriceDivMap.minPriceDiv.click();
        } else {
            alert("单人亏损超过 3 元, 进单价: " + originalUnitPrice + "  去哪最低价: " + (minPriceDivMap.minPrice + 50));
        }
    }

    /**
     * 更新联系人手机号
     * @param purchasingAccount
     */
    function updateLoginPhone(purchasingAccount) {
        let flightInfoAndUserInfo = getCookie("intFlightInfoAndUserInfo");
        flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        flightInfoAndUserInfo["purchasingAccount"] = purchasingAccount
        setCookie(
            "intFlightInfoAndUserInfo",
            JSON.stringify(flightInfoAndUserInfo),
            25,
            ".flight.qunar.com"
        );

    }

    // document 加载完毕后执行下面代码
    $(document).ready(function () {
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

            // flightInfoAndUserInfo.passengerInfos = [];
            window.location = flightUrl + "#" + JSON.stringify(flightInfoAndUserInfo);

        } else if ('/site/oneway_list_inter.htm' === nowLocationPathname) {
            console.log("开始选择价格信息");

            let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
            if (!flightInfoAndUserInfo) {
                return
            }
            flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);

            // 添加到cookies 里面
            setCookie(
                "intFlightInfoAndUserInfo",
                JSON.stringify(flightInfoAndUserInfo),
                25,
                ".flight.qunar.com"
            );

            window.saveConcat = function () {
                let concatPhone = document.getElementById("htlmConcatPhone").value;
                localStorage.setItem("concatPhone", concatPhone);
                setCookie("concatPhoneHtlm", concatPhone, 1, ".qunar.com");
                // 更新去哪的登录手机号
                let loginPhone = document.getElementById("loginPhone").value;
                localStorage.setItem("loginPhone", loginPhone);
                updateLoginPhone(loginPhone);
            }

            // 联系人手机号
            let concatPhone = localStorage.getItem("concatPhone");
            if (!concatPhone) {
                concatPhone = "18075193789"
            }

            // 登录手机号
            let loginPhone = localStorage.getItem("loginPhone");
            if (!loginPhone) {
                loginPhone = "13036787990"
            }

            updateLoginPhone(loginPhone);

            $("body").append($('<p style="position: fixed; top: 50%;right: 1%; font-size: 20px;text-align: center;">去哪儿网登录账号: <input style="padding: 10px;margin: 10px 0;" type="text" value="' + loginPhone + '" id="loginPhone"></br>联系人手机号: <input style="padding: 10px;margin: 10px 0;" type="text" value="' + concatPhone + '" id="htlmConcatPhone"></br><button style="font-size: 25px;color: red;" type="button" onclick="saveConcat()">保存</button></p>'))

            // 添加到cookies 里面
            setCookie(
                "concatPhoneHtlm",
                concatPhone,
                5 * 60,
                ".qunar.com"
            );


            // 自动点击提示信息
            let btnTags = document.getElementsByClassName("btn");
            if (btnTags.length > 0) {
                for (let btnTag of btnTags) {
                    btnTag.click();
                }
            }

            window.linshi = setInterval(function () {
                // 监听页面 dom 结构变化
                let targetNodeLi = getDom('div', 'data-reactid', '.0.2.0.4.3.2.2');
                console.log(targetNodeLi);
                if (!targetNodeLi.length) {
                    return
                }
                clearInterval(window.linshi);
                clickOne();
                // 过滤航司
                clickFlight(flightInfoAndUserInfo.flightNo);
                // VJ837|ICN-CXR|2022-10-03
                // 点击航班号
                clickFlightNo([
                    flightInfoAndUserInfo.flightNo,
                    flightInfoAndUserInfo.depAirport + "-" + flightInfoAndUserInfo.arrAirport,
                    flightInfoAndUserInfo.depDate
                ].join("|"));

            }, 1000)

        }

    });
})();