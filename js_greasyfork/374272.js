// ==UserScript==
// @icon         data:image/png;base64,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
// @name         Currencies Price
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  价格信息显示在控制台，方便上班偷偷看
// @author       Synvaier
// @mail         synvaier@gmail.com
// @include      http*://*/*
// @compatible   chrome
// @compatible   firefox
// @supportURL   superov.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374272/Currencies%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/374272/Currencies%20Price.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // Your code here...

    // 时间格式函数
    (function() {
        Date.prototype.convertDate = function(format, countObj) {
            format = format || "YYYY-MM-DD HH:mm:SS";
            countObj = countObj || {};
            this.setHours(
                this.getHours() + (countObj.H || 0),
                this.getMinutes() + (countObj.m || 0),
                this.getSeconds() + (countObj.S || 0),
                this.getMilliseconds() + (countObj.s || 0)
            );
            this.setFullYear(
                this.getFullYear() + (countObj.Y || 0),
                this.getMonth() + (countObj.M || 0),
                this.getDate() + (countObj.D || 0)
            );
            if (format === "number") {
                return new Date(this) - 0;
            }

            var weeks = [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六"
            ];
            var seasons = ["一季度", "二季度", "三季度", "四季度"];
            var timeOptions = {
                M: this.getMonth() + 1, //月份
                D: this.getDate(), //日
                H: this.getHours(), //小时
                m: this.getMinutes(), //分
                S: this.getSeconds(), //秒
                q: seasons[Math.floor((this.getMonth() + 3) / 3) - 1], //季度
                s: this.getMilliseconds(), //毫秒
                d: weeks[this.getDay()] //星期几
            },
                _this = this;
            format = format.replace(/([YMDHmSdqs])+/g, function(matchValue, key) {
                if (
                    ((key === "s" || key === "d" || key === "q") &&
                     matchValue.length > 2) ||
                    (key === "Y" && matchValue.length > 4) ||
                    ((key === "M" ||
                      key === "D" ||
                      key === "H" ||
                      key === "m" ||
                      key === "S") &&
                     matchValue.length > 2)
                ) {
                    throw new TypeError(
                        "时间格式输入错误，必须确认有分割符号，请重新确认时间格式！"
                    );
                }

                var v = timeOptions[key];
                if (v !== undefined) {
                    if (matchValue.length > 1) {
                        v = "0" + v;
                        v = v.substr(v.length - 2);
                    }
                    return v;
                } else if (key === "Y") {
                    return (_this.getFullYear() + "").substr(4 - matchValue.length);
                }
                return matchValue;
            });
            return format;
        };
    })();

    //检测某个对象的type；
    function checkObjType(checkObj, checkType) {
        //利用NaN不等于自身的特性，不能用原生自带的isNaN函数
        if (checkObj !== checkObj) {
            return !checkType ? "NaN" : "NaN" === checkType;
        }
        var regx = /object\s(\w+)/gi,
            result = Object.prototype.toString.call(checkObj);
        if (regx.test(result)) {
            return !checkType ? RegExp.$1 : RegExp.$1 === checkType;
        }
    }

    //精确计算+,-,*,/
    function calc(m, n, a) {
        try {
            if (checkObjType(m - 0, "NaN") || checkObjType(n - 0, "NaN"))
                throw new TypeError("输入错误，请重新确认！");
            m += "";
            n += "";
            var len = Math.max(
                m.indexOf(".") != -1 ? m.split(".")[1].length : 0,
                n.indexOf(".") != -1 ? n.split(".")[1].length : 0
            );
            var _num = Math.pow(10, len);
            m = m * _num;
            n = n * _num;
            switch (a) {
                case "+":
                    return (m + n) / _num;
                case "-":
                    return (m - n) / _num;
                case "*":
                    return (m * n) / (_num * _num);
                case "/":
                    if (n == 0)
                        throw new TypeError(
                            "n值输入错误，请重新确认！" + "\nm和n分别为：" + m + "," + n
                        );
                    return m / n;
                default:
                    throw new TypeError(
                        '运算符没有输入或者输入错误，运算符只支持"+、-、*、/"，请重新确认！'
                    );
            }
        } catch (e) {
            console.log(e);
        }
    }

    //定义ajax的promise
    function getJSONDataHandler(url) {
        return new Promise(function(resolve) {
            GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                url: url,
                onload: function(response) {
                    resolve(response.responseText);
                }
            });
        });
    }

    //当dom变动时处理函数
    function domChangeHandler() {
        //dom变动监听处理函数
        let tabNodeSelected = document
        .querySelector("#default_market_tabs-tab-watchlist")
        .getAttribute("aria-selected");

        let _arr = [];
        if (
            tabNodeSelected &&
            document.querySelectorAll(
                "#default_market_tabs-pane-watchlist .market_name>span>span"
            ).length !== 0
        ) {
            _arr = [
                ...document.querySelectorAll(
                    "#default_market_tabs-pane-watchlist .market_name>span>span"
                )
            ]
                .filter(x => {
                if (x.lastElementChild.textContent === "Gate") {
                    return true;
                }
            })
                .map(x => {
                let symbolCode = x.firstElementChild.textContent;
                return (
                    symbolCode.slice(0, symbolCode.indexOf("/")).toLowerCase() + "_usdt"
                );
            });
        }
        GM_setValue("currenciesArr", _arr);
    }

    class CurrenciesHandler {
        //定义转换价格信息优化显示到控制台的类
        handlerData(list = [], dataList = []) {
            //处理数据的类
            const usdtPrice = dataList[list.indexOf("USDT")].last - 0;
            let i = 0;

            do {
                this[list[i]] = {};
                //优化最新价信息显示；
                let _last = dataList[i].last;
                let last =
                    list[i] !== "USDT"
                ? calc(_last, usdtPrice, "*")
                : dataList[i].last - 0;
                last = last < 1 ? last.toFixed(4) : last.toFixed(2);
                this[list[i]]["最新价(￥)"] = last - 0;

                //优化涨幅百分比信息显示；
                let percentChange = (dataList[i].percentChange - 0).toFixed(2) - 0;
                this[list[i]]["涨幅(%)"] = percentChange;

                //优化涨幅成交量信息显示；
                let quoteVolume = (dataList[i].quoteVolume - 0).toFixed(2) - 0;
                this[list[i]]["交易量"] = quoteVolume;

                i++;
            } while (i < list.length);
        }
    }

    //定义app；
    class CurrencyApp {
        constructor(
        currenciesArr = ["usdt_cny"],
         updateInterver = 30000,
         lastSetTime = "It's the first time!"
        ) {
            this.currenciesArr = currenciesArr; // 数字货币数组
            this.updateInterver = updateInterver; //数字货币数据更新间隔
            this.lastSetTime = lastSetTime; // 上一次设置时间
        }

        init() {
            //检测是否是AICoin网页
            let isAICoinWeb =
                document.location.href === "https://www.aicoin.net.cn/" ? true : false;

            if (isAICoinWeb) {
                //AICoin页面内获取支持gateio平台的数字货币
                let config = {
                    //只是为记住Oberver的配置对象
                    childList: true, //该元素的子元素新增或者删除
                    subtree: true //该元素的所有子元素新增或者删除
                    // 'attributes' : false, //监听属性变化
                    // 'characterData' : false, // 监听text或者comment变化
                    // 'attributeOldValue' : false, //属性原始值
                    // 'characterDataOldValue' : false,
                    // 'attributesFliter':[] //数组内指定需要监听的属性值
                };

                let observer = new MutationObserver(domChangeHandler);

                observer.observe(document.querySelector("body"), config);

                this.currenciesArr = [
                    ...new Set([...this.currenciesArr, ...GM_getValue("currenciesArr")])
                ];

                console.log(
                    "%cInitialization for Currency Price has been completed!",
                    "color:green;font-size:13px;"
                );
            }

            //载入配置
            if (GM_getValue("currenciesArr")) {
                this.currenciesArr = [
                    ...new Set([...this.currenciesArr, ...GM_getValue("currenciesArr")])
                ];
            } else {
                this.currenciesArr = [...new Set([...this.currenciesArr])];
            }

            this.updateInterver = GM_getValue("updateInterver")
                ? GM_getValue("updateInterver")
            : this.updateInterver;

            this.lastSetTime = GM_getValue("lastSetTime")
                ? GM_getValue("lastSetTime")
            : this.lastSetTime;

            Object.keys(this).map(x => {
                GM_setValue(x, this[x]);
                localStorage[x] = this[x];
            });

            console.log(
                "Currencies Price has been %cupdated!",
                "color: rgba(255, 69, 0, 1);"
            );
            console.log(
                "%cCurrencies Price Script Config：\n%c" +
                JSON.stringify(this, null, 4),
                "color:green;font-size:13px",
                "color: rgba(255, 69, 0, 1);"
            );

            //监听localStorage存储事件
            window.addEventListener("storage", e => {
                if (e.key === "updateInterver" && e.newValue-0 > 10000){
                    if(e.newValue >= 250000){
                        GM_setValue("updateInterver", e.newValue);
                        this.updateInterver = e.newValue;
                        console.log("已经设置最新的更新间隔时间值：" + e.newValue + "ms");
                    } else if(e.newValue < 250000) {
                        GM_setValue("updateInterver", 25000);
                        this.updateInterver = 250000;
                        console.log(
                            "输入的更新间隔时间[" +
                            e.newValue +
                            "ms]太小了，已被初始化为250000ms！"
                        );
                    }
                    this.lastSetTime = new Date().convertDate();
                    GM_setValue('lastSetTime',this.lastSetTime);
                }
            })
        }
        run() {
            //更新价格信息
            let _arr = this.currenciesArr.map(function(s) {
                return "https://data.gateio.io/api2/1/ticker/" + s;
            });

            Promise.all(_arr.map(x => getJSONDataHandler(x))).then(result => {
                let listSymbol = [],
                    listPriceInfo = [];
                result.map((rlt, i) => {
                    let str = this.currenciesArr[i];
                    let priceInfo = JSON.parse(rlt, function(key, value) {
                        if (["last", "percentChange", "quoteVolume"].includes(key)) {
                            return value;
                        } else if (key === "") {
                            return value;
                        }
                    });

                    listSymbol.push(str.slice(0, str.indexOf("_")).toUpperCase());
                    listPriceInfo.push(priceInfo);
                });

                let currencies = new CurrenciesHandler();
                currencies.handlerData(listSymbol, listPriceInfo);

                GM_setValue("lastSetTime", new Date().convertDate());

                console.table(
                    //在控制台打印价格信息
                    currencies
                );
            });
        }
    }

    //定义监听
    let timerGet;
    try {
        clearInterval(window.timerGet);
        const myApp = new CurrencyApp();
        myApp.init();

        window.addEventListener("focus", function() {
            console.info("Timer has been %c opened!", "color:green");
            window.timerGet = setInterval(
                myApp.run.bind(myApp),
                myApp.updateInterver
            );
        });

        window.addEventListener("blur", function() {
            console.warn("Timer has been %c closed!", "color:red");
            clearInterval(window.timerGet);
        });
    } catch (e) {
        console.log("脚本运行错误：" + e.message);
    }
})();
