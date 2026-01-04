// ==UserScript==
// @name         去哪儿网自动搜索
// @namespace    http://tampermonkey.net/
// @version      1.0.2.8
// @description  去哪网搜索航班，自动点击航班
// @author       MzXing
// @match        https://www.qunar.com/
// @match        https://flight.qunar.com/site/oneway_list.htm?*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416228/%E5%8E%BB%E5%93%AA%E5%84%BF%E7%BD%91%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/416228/%E5%8E%BB%E5%93%AA%E5%84%BF%E7%BD%91%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var allCityDic = {"AKA":"安康","PEK":"北京","MY2":"北京","PKX":"北京","PVG":"上海","SHA":"上海","HDG":"邯郸","CIH":"长治","SJW":"石家庄","CKG":"重庆","KMG":"昆明","CTU":"成都","XIY":"西安","SZX":"深圳","HKG":"香港","XMN":"厦门","KNH":"金门","HGH":"杭州","DEQ":"湖州","LZO":"泸州","NAO":"南充","TAO":"青岛","DBC":"白城","HLH":"乌兰浩特","YSQ":"松原","HRB":"哈尔滨","CGO":"郑州","HSJ":"郑州","CAN":"广州","FUO":"佛山","BZX":"巴中","GYS":"广元","TSN":"天津","TNA":"济南","HAK":"海口","KWE":"贵阳","CSX":"长沙","URC":"乌鲁木齐","NKG":"南京","AKU":"阿克苏","AQG":"安庆","AAT":"阿勒泰","AOG":"鞍山","AHJ":"红原","AVA":"安顺","YIE":"阿尔山","NGQ":"阿里","RHT":"阿拉善右旗","AXF":"阿拉善左旗","MFM":"澳门","ZUH":"珠海","JNG":"济宁","LYI":"临沂","BAV":"包头","BHY":"北海","WEF":"潍坊","RIZ":"日照","ET1":"鄂托克前旗","WUA":"乌海","INC":"银川","BSD":"保山","AEB":"百色","RLK":"巴彦淖尔","BFJ":"毕节","BPL":"博乐","TVS":"唐山","CGQ":"长春","CZX":"常州","CGD":"常德","CIF":"赤峰","AEQ":"赤峰","CHG":"朝阳","NBS":"白山","JUH":"池州","BPX":"昌都","CDE":"承德","PQ1":"承德","HNY":"衡阳","LLF":"永州","WGN":"邵阳","CWJ":"沧源","DLC":"大连","DDG":"丹东","DLU":"大理","DAT":"大同","XNN":"西宁","HBQ":"祁连","JIC":"金昌","DOY":"东营","DNH":"敦煌","WSK":"巫山","HPG":"神农架","ENH":"恩施","DAX":"达州","DQA":"大庆","DCY":"稻城","JUZ":"衢州","YIW":"义乌","HEW":"东阳","HXD":"德令哈","JM1":"荆门","XFN":"襄阳(中国)","WUH":"武汉","DSN":"鄂尔多斯","ERL":"二连浩特","NNY":"南阳","XAI":"信阳","UYN":"榆林","LLV":"吕梁","ENY":"延安","ZD1":"肇东","EJN":"额济纳旗","FOC":"福州","MFK":"马祖","LZN":"南竿","FUG":"阜阳","SQD":"上饶","WUS":"武夷山","FYN":"富蕴","FYJ":"抚远","KWL":"桂林","KOW":"赣州","SHE":"沈阳","YKH":"营口","YYA":"岳阳","JIU":"九江","ZQZ":"张家口","TXN":"黄山","JDZ":"景德镇","GOQ":"格尔木","MIG":"绵阳","GXH":"夏河","LHW":"兰州","WNH":"文山","ACX":"兴义","GYU":"固原","GMQ":"果洛","KHH":"高雄","TNN":"台南","WDS":"十堰","HFE":"合肥","HET":"呼和浩特","HTN":"和田","TNH":"通化","HLD":"海拉尔","JNZ":"锦州","LYA":"洛阳","HUZ":"惠州","HZG":"汉中","JZH":"九寨沟","HEK":"黑河","HMI":"哈密","HIA":"淮安","HCJ":"河池","HJJ":"怀化","DYG":"张家界","HUN":"花莲","YNJ":"延吉","MDG":"牡丹江","HYN":"台州","HTT":"花土沟","HUO":"霍林郭勒","YIN":"伊宁","SWA":"揭阳","JMU":"佳木斯","SH1":"佳木斯","JHG":"西双版纳","WUX":"无锡","YIC":"宜春","JGS":"井冈山","JGN":"嘉峪关","KHN":"南昌","JGD":"加格达奇","DF1":"丹凤","JXA":"鸡西","LFQ":"临汾","YCU":"运城","ZHA":"湛江","KRL":"库尔勒","JJN":"泉州","CYI":"嘉义","JSJ":"建三江","KHG":"喀什","KCA":"库车","KRY":"克拉玛依","KJI":"布尔津","KGT":"康定","KJH":"凯里","LJG":"丽江","LZH":"柳州","LXA":"拉萨","LYG":"连云港","LNJ":"临沧","HZH":"黎平","LLB":"荔波","WXN":"万州","LZY":"林芝","WNZ":"温州","LPF":"六盘水","YNT":"烟台","JMJ":"澜沧","LCX":"龙岩","NGB":"宁波","NZH":"满洲里","LUM":"芒市","MXZ":"梅州","OHE":"漠河","MZG":"马公","WMT":"遵义","ZYI":"遵义","NNG":"南宁","NTG":"南通","NLH":"宁蒗","PZI":"攀枝花","SYM":"普洱","XUZ":"徐州","NDG":"齐齐哈尔","BPE":"秦皇岛","IQN":"庆阳","IQM":"且末","JIQ":"黔江","BAR":"琼海","RKZ":"日喀则","SYX":"三亚","SHF":"石河子","SQJ":"三明","XIL":"锡林浩特","QSZ":"莎车","TYN":"太原","TYC":"太原","TGO":"通辽","TEN":"铜仁","TCZ":"腾冲","TCG":"塔城","TLQ":"吐鲁番","THQ":"天水","TPE":"台北","TSA":"台北","TTT":"台东","RMQ":"台中","YTY":"扬州","LNL":"陇南","WEH":"威海","WUZ":"梧州","ZHY":"中卫","UCB":"乌兰察布","WZQ":"乌拉特中旗","XIC":"西昌","DIG":"迪庆","WUT":"忻州","NLT":"新源","YIH":"宜昌","YBP":"宜宾","YNZ":"盐城","LDS":"伊春","YUS":"玉树","HSN":"舟山","ZAT":"昭通","YZY":"张掖","NZL":"扎兰屯","GZG":"甘孜","HN3":"武汉","GH1":"根河","TWC":"图木舒克","DTU":"五大连池","YC2":"盐池","TFU":"成都","RQA":"若羌","WHA":"芜湖","BJS":"北京","GNI":"中国格林岛","SHP":"秦皇岛","CMJ":"中国七美","SIA":"西安"};

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

    function setCookie(cname, cvalue, exseconds, domain) {
        let d = new Date();
        d.setTime(d.getTime() + (exseconds * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";Path=/;domain=" + domain + ";" + expires;
    }

    // 搜索航班信息
    function selectFlightInfo(depCode, arrCode, depDate) {
        console.log("选择出发抵达,以及日期");
        if(!allCityDic.hasOwnProperty(depCode) || !allCityDic.hasOwnProperty(arrCode)){
            alert("缺少城市信息,请手工查询");
            return
        }
        return "https://flight.qunar.com/site/oneway_list.htm?searchDepartureAirport=" + allCityDic[depCode] + "&searchArrivalAirport=" + allCityDic[arrCode] + "&searchDepartureTime=" + depDate + "&searchArrivalTime=&nextNDays=0&startSearch=true&fromCode=" + depCode + "&toCode=" + arrCode + "&from=qunarindex&lowestPrice=null";
    }

    // 选择价格信息
    function clickOne() {
        // 点击直达
        document.getElementsByTagName("label").forEach(function (x) {
            if (x.innerText.indexOf("直飞") !== -1) {
                x.click();
                console.log("点击直达");
            }
        })
    }

    function clickFlight(flightNo) {
        let flightDic = {
            'CZ': '南方航空',
            'MU': '东方航空',
            'CA': '中国国航',
            '3U': '四川航空',
            'MF': '厦门航空',
            'SC': '山东航空',
            'HU': '海南航空',
            'ZH': '深圳航空',
            '9C': '春秋航空',
            'JD': '首都航空',
            'GS': '天津航空',
            'GJ': '长龙航空',
            '8L': '祥鹏航空',
            'HO': '吉祥航空',
            'EU': '成都航空',
            'G5': '华夏航空',
            'FM': '上海航空',
            'QW': '青岛航空',
            'PN': '西部航空',
            'DZ': '东海航空',
            'TV': '西藏航空',
            'BK': '奥凯航空',
            'KY': '昆明航空',
            'AQ': '九元航空',
            'KN': '中国联合航空',
            'NS': '河北航空',
            'FU': '福州航空',
            'DR': '瑞丽航空',
            'RY': '江西航空',
            '9H': '长安航空',
            'Y8': '金鹏航空',
            'GX': '北部湾航空',
            'UQ': '乌鲁木齐航空',
            'A6': '红土航空',
            'GY': '多彩航空',
            'GT': '桂林航空',
            'LT': '龙江航空',
            'JR': '幸福航空',
            '9D': '天骄航空',
        };
        // 点击过滤航司
        document.getElementsByTagName("label").forEach(function (x) {
            let title = x.getAttribute("title") || "";
            if (title.indexOf(flightDic[flightNo.substring(0, 2)]) !== -1) {
                x.click();
                console.log("点击航司");
            }
        });
    }


    function clickFlightNo(flightNo) {
        // 点击航班号
        let dataReactId = '.1.4.0.2.2.0.$' + flightNo + '.0';
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
        let flightInfoAndUserInfo = getCookie("flightInfoAndUserInfo");
        flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        flightInfoAndUserInfo["purchasingAccount"] = purchasingAccount
        setCookie(
            "flightInfoAndUserInfo",
            JSON.stringify(flightInfoAndUserInfo),
            40,
            ".qunar.com"
        );

    }


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

    } else if ("/site/oneway_list.htm" === nowLocationPathname) {
        console.log("开始选择价格信息");

        let flightInfoAndUserInfo = decodeURIComponent(window.location.href.split("#")[1]);
        if (!flightInfoAndUserInfo) {
            return
        }
        flightInfoAndUserInfo = JSON.parse(flightInfoAndUserInfo);
        // 添加到cookies 里面
        setCookie("flightInfoAndUserInfo", JSON.stringify(flightInfoAndUserInfo), 40, ".qunar.com");

        window.eTxtId = setInterval(function () {
            let eTxt = document.getElementsByClassName("e-txt");
            if (eTxt.length > 0 && eTxt[0].innerText === '暂无符合条件的机票信息，请重新搜索') {
                clearInterval(window.eTxtId)
                window.location.reload();
            }
        }, 1000)


        window.saveConcat = function () {
            let concatPhone = document.getElementById("htlmConcatPhone").value;
            localStorage.setItem("concatPhone", concatPhone);
            setCookie("concatPhoneHtlm", concatPhone, 3600, ".qunar.com");
            // 更新去哪的登录手机号
            let loginPhone = document.getElementById("loginPhone").value;
            localStorage.setItem("loginPhone", loginPhone);
            updateLoginPhone(loginPhone);
            alert("保存成功");
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

        $("body").append($('<div style="z-index: 99;position: fixed;top: 40%;right: 5%;font-size: 20px;text-align: center;padding: 15px;border-radius: 30px;border: 10px solid #e1e1e1;">去哪儿网当前登录账号(若不一致,请自行修改): <br><input style="text-indent:10px;margin: 10px 0;padding: 5px;border-radius: 10px;" type="text" value="' + loginPhone + '" id="loginPhone"><br>联系人预留手机号: <br><input style="text-indent:10px;margin: 10px 0;padding: 5px;border-radius: 10px;" type="text" value="' + concatPhone + '" id="htlmConcatPhone"><br><button class="m-search-btn" type="button" onclick="saveConcat()">保存</button></div>'))

        // 添加到cookies 里面
        setCookie("concatPhoneHtlm", concatPhone, 40, ".qunar.com");


        $("body").append($('<p style="position: fixed; top: 10%;left: 1%;color:#ae313166; z-index:10000' +
            ' font-size: 20px;text-align: center;">信息保存完毕</p>'))

        // document 加载完毕后执行下面代码
        $(document).ready(function () {
            // 自动点击提示信息
            let btnTags = document.getElementsByClassName("btn");
            if (btnTags.length > 0) {
                for (let btnTag of btnTags) {
                    btnTag.click();
                }
            }

            // 定时查询航班是否已展示
            let cleanReactId = setInterval(function () {
                let targetNode = getDom('div', 'data-reactid', '.1.4.0.2.2');
                if (targetNode.length > 0) {
                    let tip = document.getElementsByClassName("e-select")[0].textContent;
                    if (!tip && !window.clickOne) {
                        window.clickOne = true;     // 防止触发 递归死循环

                        // 点击直达
                        clickOne();
                    }
                    if (!window.clickFlight) {
                        window.clickFlight = true;   // 防止触发 递归死循环
                        // 取消过滤航班
                        // setTimeout(function () {
                        //     clickFlight(flightInfoAndUserInfo.flightNo);
                        // }, 500 * 2);

                    } else if (window.clickFlight && !window.clickFlightNo) {
                        window.clickFlightNo = true; // 防止触发 递归死循环

                        clearInterval(cleanReactId);

                        window.eTxtId2 = setInterval(function () {
                            let eClassTab = document.getElementsByClassName("clear-both");

                            if (eClassTab && eClassTab[0]) {
                                clearInterval(window.eTxtId2);
                            } else {
                                clickFlightNo(flightInfoAndUserInfo.flightNo);
                            }
                        }, 1000)
                    }
                }
            }, 1500);

            // setTimeout(function () {
            //     // 监听页面 dom 结构变化
            //     let targetNode = getDom('div', 'data-reactid', '.1.4.0.2')[0];
            //     let config = {attributes: true, childList: true, subtree: true};
            //     let observerCallback = function (mutationsList, observer) {
            //         for (const mutation of mutationsList) {
            //             if (mutation.type === 'childList') {
            //                 if (mutation.addedNodes.length) {
            //                     if (mutation.addedNodes[0].getAttribute("class") === "mb-10") {
            //                         clearInterval(cleanReactId);
            //                         console.log("航班全部展示完毕", cleanReactId);
            //                         let tip = document.getElementsByClassName("e-select")[0].textContent;
            //                         if (!tip && !window.clickOne) {
            //                             window.clickOne = true;     // 防止触发 递归死循环
            //                             clickOne();
            //                         }
            //                         if (!window.clickFlight) {
            //                             window.clickFlight = true;   // 防止触发 递归死循环
            //                             clickFlight(flightInfoAndUserInfo.flightNo);
            //                         } else if (window.clickFlight && !window.clickFlightNo) {
            //                             window.clickFlightNo = true; // 防止触发 递归死循环
            //
            //                             clickFlightNo(flightInfoAndUserInfo.flightNo);
            //                             window.eTxtId2 = setInterval(function () {
            //                                 let eTxt = document.getElementsByClassName("e-txt");
            //                                 if(eTxt.length > 0 && eTxt[0].innerText === '查询无结果'){
            //                                     clickFlightNo(flightInfoAndUserInfo.flightNo);
            //                                 }
            //                             }, 2000)
            //                         }
            //                     } else if (mutation.addedNodes[0].lastChild && mutation.addedNodes[0].lastChild.getAttribute("class") === "clear-both") {
            //                         console.log("价格已经展示完毕");
            //                         // clickMinPrice(flightInfoAndUserInfo.originalUnitPrice);
            //                     }
            //                 }
            //             }
            //         }
            //     };
            //
            //     // 创建一个链接到回调函数的观察者实例
            //     let observer = new MutationObserver(observerCallback);
            //
            //     // 开始观察目标节点的配置突变
            //     observer.observe(targetNode, config);
            // }, 1000)

        })
    }

})();