// ==UserScript==
// @name         Steam市场 价格/比例/汇率 换算器
// @namespace    http://pronax.wtf/
// @version      1.0.4
// @description  见安装页面介绍
// @author       Pronax
// @include      *://steamcommunity.com/market/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @noframes
// @require      https://lib.baomitu.com/vue/2.6.14/vue.min.js
// @downloadURL https://update.greasyfork.org/scripts/397036/Steam%E5%B8%82%E5%9C%BA%20%E4%BB%B7%E6%A0%BC%E6%AF%94%E4%BE%8B%E6%B1%87%E7%8E%87%20%E6%8D%A2%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/397036/Steam%E5%B8%82%E5%9C%BA%20%E4%BB%B7%E6%A0%BC%E6%AF%94%E4%BE%8B%E6%B1%87%E7%8E%87%20%E6%8D%A2%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function () {

    const 修改汇率时强行同步成本 = false;

    GM_addStyle('.grabbing{cursor:grabbing !important;}.price_tool_drag_bar{display:inline-block;width:80px;cursor:grab;opacity:1;border-radius:5px;background-color:#ffffff26;transition:all .5s;}.price_tool_drag_bar:hover{background-color:#7aa546d6;color:#fff;}.f-right{float:right;}.transparent{opacity:0;}.currency_selector_menu{width:160px;height:203px;overflow-y:scroll;scrollbar-width:thin;position:absolute;background-color:#171a21;box-shadow:0 3px 10px 0 #000;}.currency_selector_item{transition:all .2s;padding:5px 6px;color:#b8b6b4;text-transform:none;font-size:13px;font-weight:normal;line-height:normal;text-align:left;cursor:pointer;display:block;text-decoration:none;border-left:2px solid #00000000;}.currency_selector_item:hover{color:#fff;background-color:#2c3340;}.currency_selector_item.checked{color:#fff;background-color:#548131;}.currency_selector_item.checked:hover{background-color:#609438;}.price_tool_hide{opacity:0;}.currency_selector_menu::-webkit-scrollbar{padding:0;margin:0;width:8px;}.currency_selector_menu::-webkit-scrollbar-thumb{padding:0;margin:0;background:#5e5f64;}.currency_selector_menu::-webkit-scrollbar-track{padding:0;margin:0;background-color:transparent;}.currency_selector_menu::-webkit-scrollbar-thumb:hover{padding:0;margin:0;background:#717276;}.currency_selector_menu::-webkit-scrollbar-thumb:active{padding:0;margin:0;background:#3c3e42;}.price_tool input::-webkit-outer-spin-button,.price_tool input::-webkit-inner-spin-button{-webkit-appearance:none;appearance:none;}.price_tool input[type="number"]{-moz-appearance:textfield;text-align:right;border-radius:0 3px 3px 0 !important;}.price_tool_input{width:90px;height:26px;font-size:16px !important;border:0 !important;padding:2px 4px 2px 18px !important;background-color:#101822 !important;transition:all .5s;}.price_tool_input_div>.price_tool_locked{background-color:#1b2838 !important;color:#3e759d;}.currency_loading{position:absolute;margin:5px 0;left:40px;fill:#C5C3C2;animation:rotate-R 1.5s linear infinite;}.icon_forbid{fill:#cc4033 !important;}.price_tool_input_div>.icon{position:absolute;margin-top:6px;left:50px;transition:all .3s;width:18px;height:18px;fill:#aaa;}.price_tool_input_btn:hover+.icon{opacity:.5;}.price_tool{user-select:none;z-index:500;position:fixed;border-radius:5px;padding:2px 5px 5px;font-family:Motiva Sans,Arial,Helvectica,Verdana,sans-serif;background-image:linear-gradient(140deg,#386797b3,#172e4ab3);text-align:center;box-shadow:0 0 10px 0 #0a0a0a;}.price_tool_rate_form{margin:3px 0}.price_tool_rate_div,.price_tool_input_div{margin:3px 0;display:flex;justify-content:center;width:160px;position:relative;}.price_tool_menu_text{height:100%;padding:0 8px;}.price_tool_chose_btn{transition:background-color .3s;width:60px;color:#C5C3C2;line-height:28px;border-radius:3px 0 0 3px;display:inline-block;background-color:#171a2185;cursor:pointer;}.price_tool_chose_btn:hover{background-color:#111b22cc;}.price_tool_rate_input{width:94px;height:24px;font-size:14px;border:0 !important;padding:2px 4px;background-color:#101822 !important;}.price_tool_input_btn{line-height:30px;width:50px;color:#ddd;display:inline-block;cursor:pointer;background-color:#467ea5d6;border:transparent;border-radius:3px 0 0 3px;transition:all .3s;font-weight:bold;font-size:16px;}.price_tool_input_btn:hover{background-color:#4090bf;}.price_tool_input_btn.price_tool_locked:hover{color:#bbb;}.price_tool_checkbox{display:none;}.price_tool_pagebtn{padding:0 10px;color:#f9f9f9;background-color:#f5f5f53b;width:15px;user-select:none;transition:all .3s;}.price_detail{user-select:text;width:158px;height:201px;display:flex;position:absolute;background-color:#333;border:1px solid #666;color:#acb2b8;flex-direction:column;justify-content:space-around;}.price_detail>span{display:block;}.price_detail>.in,.price_detail>.out{display:flex;justify-content:space-evenly;}.currency_selector{position:relative;}.price_tool_alert_box{position:absolute;bottom:235px;}.price_tool_alert{width:140px;position:relative;color:#fff;word-break:break-all;padding:5px 10px;margin-top:7px;border-radius:5px;transition:opacity .5s;}.price_tool_alert.success{background-color:#379e2ed9;box-shadow:0 0 5px 0px #379e2e;}.price_tool_alert.failed{background-color:#d14c47d9;box-shadow:0 0 5px 0px #d04944;}.price_tool_alert.warning{background-color:#d4a925d9;box-shadow:0 0 5px 0px #d4a925;}.scale-in{-webkit-animation:scale-in cubic-bezier(.22,.58,.12,.98) .4s;animation:scale-in cubic-bezier(.22,.58,.12,.98) .4s;}.scale-out{-webkit-animation:scale-out cubic-bezier(.22,.58,.12,.98) .4s;animation:scale-out cubic-bezier(.22,.58,.12,.98) .4s;}@keyframes rotate-R{0%{-webkit-transform:rotate(0);transform:rotate(0);}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg);}}@keyframes scale-in{0%{transform:scale(0);}100%{transform:scale(1);}}@keyframes scale-out{0%{opacity:1;transform:scale(1);}100%{opacity:0;transform:scale(.8);}}');

    document.querySelector("body").insertAdjacentHTML("beforeEnd", `<div id="marketTool"></div>`);

    new Vue({
        el: '#marketTool',
        data() {
            return {
                CURRENCY_DATA: { "AED": { "strCode": "AED", "eCurrencyCode": 32, "strSymbol": "AED", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "阿联酋迪拉姆" }, "ARS": { "strCode": "ARS", "eCurrencyCode": 34, "strSymbol": "ARS$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " ", "strName": "阿根廷比索" }, "AUD": { "strCode": "AUD", "eCurrencyCode": 21, "strSymbol": "A$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "澳元" }, "BRL": { "strCode": "BRL", "eCurrencyCode": 7, "strSymbol": "R$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " ", "strName": "巴西雷亚尔" }, "CAD": { "strCode": "CAD", "eCurrencyCode": 20, "strSymbol": "CDN$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "加元" }, "CHF": { "strCode": "CHF", "eCurrencyCode": 4, "strSymbol": "CHF", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " ", "strName": "瑞士法郎" }, "CLP": { "strCode": "CLP", "eCurrencyCode": 25, "strSymbol": "CLP$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " ", "strName": "智利比索" }, "CNY": { "strCode": "CNY", "eCurrencyCode": 23, "strSymbol": "¥", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "人民币" }, "COP": { "strCode": "COP", "eCurrencyCode": 27, "strSymbol": "COL$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " ", "strName": "哥伦比亚比索" }, "CRC": { "strCode": "CRC", "eCurrencyCode": 40, "strSymbol": "₡", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "", "strName": "哥斯达尼家科朗" }, "CZK": { "strCode": "CZK", "eCurrencyCode": 44, "strSymbol": "Kč", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "捷克克朗" }, "DKK": { "strCode": "DKK", "eCurrencyCode": 45, "strSymbol": "kr.", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "丹麦克朗" }, "EUR": { "strCode": "EUR", "eCurrencyCode": 3, "strSymbol": "€", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "", "strName": "欧元" }, "GBP": { "strCode": "GBP", "eCurrencyCode": 2, "strSymbol": "£", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "英镑" }, "HKD": { "strCode": "HKD", "eCurrencyCode": 29, "strSymbol": "HK$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "港元" }, "HRK": { "strCode": "HRK", "eCurrencyCode": 43, "strSymbol": "kn", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "库纳" }, "HUF": { "strCode": "HUF", "eCurrencyCode": 46, "strSymbol": "Ft", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "福林" }, "IDR": { "strCode": "IDR", "eCurrencyCode": 10, "strSymbol": "Rp", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " ", "strName": "卢比" }, "ILS": { "strCode": "ILS", "eCurrencyCode": 35, "strSymbol": "₪", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "新谢克尔" }, "INR": { "strCode": "INR", "eCurrencyCode": 24, "strSymbol": "₹", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "印度卢比" }, "JPY": { "strCode": "JPY", "eCurrencyCode": 8, "strSymbol": "¥", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "日元" }, "KRW": { "strCode": "KRW", "eCurrencyCode": 16, "strSymbol": "₩", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "韩元" }, "KWD": { "strCode": "KWD", "eCurrencyCode": 38, "strSymbol": "KD", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "科威特第纳尔" }, "KZT": { "strCode": "KZT", "eCurrencyCode": 37, "strSymbol": "₸", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "", "strName": "腾格" }, "MXN": { "strCode": "MXN", "eCurrencyCode": 19, "strSymbol": "Mex$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "墨西哥比索" }, "MYR": { "strCode": "MYR", "eCurrencyCode": 11, "strSymbol": "RM", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "马来西亚林吉特" }, "NOK": { "strCode": "NOK", "eCurrencyCode": 9, "strSymbol": "kr", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " ", "strName": "挪威克朗" }, "NZD": { "strCode": "NZD", "eCurrencyCode": 22, "strSymbol": "NZ$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "新西兰" }, "PEN": { "strCode": "PEN", "eCurrencyCode": 26, "strSymbol": "S/.", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "新索尔" }, "PHP": { "strCode": "PHP", "eCurrencyCode": 12, "strSymbol": "P", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "菲律宾比索" }, "PLN": { "strCode": "PLN", "eCurrencyCode": 6, "strSymbol": "zł", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "", "strName": "兹罗提" }, "QAR": { "strCode": "QAR", "eCurrencyCode": 39, "strSymbol": "QR", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "卡塔尔里亚尔" }, "RON": { "strCode": "RON", "eCurrencyCode": 47, "strSymbol": "lei", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "罗马尼亚列伊" }, "RUB": { "strCode": "RUB", "eCurrencyCode": 5, "strSymbol": "pуб.", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": "", "strSymbolAndNumberSeparator": " ", "strName": "俄罗斯卢布" }, "SAR": { "strCode": "SAR", "eCurrencyCode": 31, "strSymbol": "SR", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "沙特里亚尔" }, "SEK": { "strCode": "SEK", "eCurrencyCode": 33, "strSymbol": "kr", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "瑞典克朗" }, "SGD": { "strCode": "SGD", "eCurrencyCode": 13, "strSymbol": "S$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "新加坡" }, "THB": { "strCode": "THB", "eCurrencyCode": 14, "strSymbol": "฿", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "泰铢" }, "TRY": { "strCode": "TRY", "eCurrencyCode": 17, "strSymbol": "TL", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " ", "strName": "土耳其里拉" }, "TWD": { "strCode": "TWD", "eCurrencyCode": 30, "strSymbol": "NT$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " ", "strName": "新台币" }, "UAH": { "strCode": "UAH", "eCurrencyCode": 18, "strSymbol": "₴", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "", "strName": "格里夫尼亚" }, "USD": { "strCode": "USD", "eCurrencyCode": 1, "strSymbol": "$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "", "strName": "美元" }, "UYU": { "strCode": "UYU", "eCurrencyCode": 41, "strSymbol": "$U", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "", "strName": "乌拉圭比索" }, "VND": { "strCode": "VND", "eCurrencyCode": 15, "strSymbol": "₫", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "", "strName": "越南盾" }, "ZAR": { "strCode": "ZAR", "eCurrencyCode": 28, "strSymbol": "R", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " ", "strName": "兰特" } },
                // CURRENCY_DATA_INDEX: [null, "USD", "GBP", "EUR", "CHF", "RUB", "PLN", "BRL", "JPY", "NOK", "IDR", "MYR", "PHP", "SGD", "THB", "VND", "KRW", "TRY", "UAH", "MXN", "CAD", "AUD", "NZD", "CNY", "INR", "CLP", "PEN", "COP", "ZAR", "HKD", "TWD", "SAR", "AED", "SEK", "ARS", "ILS", null, "KZT", "KWD", "QAR", "CRC", "UYU", null, "HRK", "CZK", "DKK", "HUF", "RON"],
                inputList: {
                    "cost": {
                        id: "cost",
                        name: "cost",
                        value: "",
                        describe: {
                            name: "成本",
                            content: "购入价格"
                        }
                    },
                    "scale": {
                        id: "scale",
                        name: "scale",
                        value: GM_getValue("scale", ""),
                        describe: {
                            name: "比例",
                            content: "价格比例"
                        }
                    },
                    "withFee": {
                        id: "withFee",
                        name: "sell",
                        value: "",
                        describe: {
                            name: "税后",
                            content: "税后实收"
                        }
                    },
                    "withoutFee": {
                        id: "withoutFee",
                        name: "sell",
                        value: "",
                        describe: {
                            name: "售价",
                            content: "买家实付"
                        }
                    }
                },
                currency: {
                    origin: {
                        select: GM_getValue("originSelect", "CNY"),
                        loading: false
                    },
                    foreign: {
                        select: GM_getValue("foreignSelect", "CNY"),
                        loading: false
                    },
                    target: undefined,
                },
                exchangeRate: Object.assign(GM_getValue("exchangeRate", {}), {
                    "CNY": {
                        FtoC: 1,
                        CtoF: 1,
                        get timestamp() {
                            return Date.now();
                        }
                    },
                }),
                exchangeValue: {
                    origin: "",
                    foreign: ""
                },
                inputLockList: GM_getValue("inputLockList", ["scale"]),
                lastChanged: undefined,
                selectorStatus: false,
                selectorStyle: {
                    top: undefined
                },
                relevance: {
                    "cost": ["scale", "withFee"],
                    "scale": ["cost", "withFee"],
                    "withFee": ["withoutFee", "scale", "cost"],
                    "withoutFee": ["withFee", "scale", "cost"],
                },
                dragSetting: {
                    dragging: false,
                    panelOffsetX: undefined,
                    panelOffsetY: undefined
                },
                priceDetail: {
                    name: undefined,
                    display: false
                },
                alertMsg: [],
                panelStyle: GM_getValue("panelStyle", { top: "35%", right: "10px" }),
                forceSyncCost: 修改汇率时强行同步成本
            }
        },
        computed: {
            computedPriceDetail() {
                let obj = {};
                if (this.priceDetail.name) {
                    obj.name = this.CURRENCY_DATA[this.priceDetail.name].strName;
                    obj.in = this.exchangeRate[this.priceDetail.name].CtoF;
                    obj.out = this.exchangeRate[this.priceDetail.name].FtoC;
                    let timestamp = this.exchangeRate[this.priceDetail.name].timestamp;
                    obj.time = new Date(timestamp).toLocaleString('zh-CN', { hour12: false });
                    obj.diff = this.$options.methods.upToNow(Math.round((Date.now() - timestamp) / 1000));
                }
                return obj;
            },
            inputLock: {
                get() {
                    return this.inputLockList;
                },
                set(val) {
                    this.inputLockList.clear();
                    this.inputLockList.push(val.pop());
                    GM_setValue("inputLockList", this.inputLockList);
                }
            }
        },
        methods: {
            alert(option) {
                this.alertMsg.push(option);
                setTimeout(() => {
                    let index = this.alertMsg.indexOf(option);
                    if (index >= 0) {
                        this.alertMsg.splice(index, 1);
                    }
                }, option.time);
            },
            updateCurrency(currencyData, target = this.currency.target) {
                let select = this.currency[target].select;
                this.currency[target].loading = true;
                /* 找到人民币上架的记录，直接通过原货币和目标货币获取汇率 */
                fetch(`https://steamcommunity.com/market/listings/730/AK-47%20%7C%20Asiimov%20%28Field-Tested%29/render/?start=0&count=100&currency=${currencyData.eCurrencyCode}`)
                    .then(res => res.json())
                    .then(json => {
                        if (json.success) {
                            for (const key in json.listinginfo) {
                                let item = json.listinginfo[key];
                                if (item.currencyid % 2000 == 23 && item.converted_price) {
                                    this.exchangeRate[currencyData.strCode] = {
                                        FtoC: (item.price / item.converted_price).toFixed(6),
                                        CtoF: (item.converted_price / item.price).toFixed(6),
                                        timestamp: Date.now()
                                    }
                                    GM_setValue("exchangeRate", this.exchangeRate);
                                    break;
                                }
                            }
                        }
                        if (this.currency[target].select == select) {
                            this.currency[target].loading = false;
                            // 更新因为某些原因没有成功时恢复CNY
                            if (!this.exchangeRate[select]) {
                                this.alert({
                                    time: 7000,
                                    type: "warning",
                                    msg: `没有汇率信息：${this.CURRENCY_DATA[this.currency[target].select].strName}`
                                });
                                this.currency[target].select = "CNY";
                                GM_setValue(`${select}Select`, "CNY");
                            } else {
                                this.alert({
                                    time: 5000,
                                    type: "success",
                                    msg: `已更新汇率：${this.CURRENCY_DATA[this.currency[target].select].strName}`
                                });
                            }
                            this.calculateExchangeValue(this.currency.target == "origin" ? "foreign" : "origin");
                        }
                    })
                    .catch(err => {
                        if (this.currency[target].select == select) {
                            this.alert({
                                time: 7000,
                                type: "failed",
                                msg: `汇率更新失败：${this.CURRENCY_DATA[this.currency[target].select].strName}`
                            });
                            this.currency[target].loading = false;
                            // 更新因为某些原因没有成功时恢复CNY
                            if (!this.exchangeRate[select]) {
                                this.currency[target].select = "CNY";
                                GM_setValue(`${select}Select`, "CNY");
                            }
                            this.calculateExchangeValue(this.currency.target == "origin" ? "foreign" : "origin");
                        }
                        console.log(err);
                    });
            },
            detailDisplaySide() {
                let selector = this.$refs.tool_panel;
                if (!selector) { return; }
                let left = parseInt(selector.getStyle("left"));
                let right = parseInt(selector.getStyle("right"));
                if (left > right) {
                    return {
                        left: "-165px"
                    }
                } else {
                    return {
                        right: "-165px"
                    }
                }
            },
            upToNow(sec) { // only accepts seconds
                // const uppercaseChinese = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
                const unit = ["秒前", "分", "小时", "天"];
                //  0   1   2   3
                // sec min hour day
                let timeArray = [0, 0, 0, 0];
                for (timeArray[0] = sec % 60, sec -= timeArray[0]; sec > 0; sec -= 60) {
                    timeArray[1]++;
                    if (timeArray[1] == 60) {
                        timeArray[1] = 0;
                        timeArray[2]++;
                        if (timeArray[2] == 24) {
                            timeArray[2] = 0;
                            timeArray[3]++;
                        }
                    }
                }
                let str = "";
                for (let index = timeArray.length - 1; index >= 0; index--) {
                    if (str.length || timeArray[index] > 0) {
                        str += timeArray[index] + unit[index];
                    }
                }
                return str ? str : "刚刚";
            },
            switchPage(target) {
                let temp = document.getElementById(`searchResults_btn_${target}`);
                temp && temp.click();
            },
            changeCurrency(event) {
                let val = event.target.getAttribute("value");
                this.currency[this.currency.target].select = val;
                this.selectorStatus = false;
                this.calculateExchangeValue(this.currency.target == "origin" ? "foreign" : "origin");
                if ((!this.exchangeRate[val]) || Date.now() - this.exchangeRate[val].timestamp > 1800000) {
                    this.updateCurrency(this.CURRENCY_DATA[val]);
                }
                GM_setValue(`${this.currency.target}Select`, val);
            },
            closeSelector() {
                this.selectorStatus = false;
            },
            showCurrencySelector(target) {
                if (this.selectorStatus && this.currency.target == target) {
                    this.selectorStatus = false;
                } else {
                    this.selectorStyle.top = target == "origin" ? '-5px' : '-36px';
                    this.currency.target = target;
                    this.selectorStatus = true;
                    let top = 0;
                    let selector = this.$refs.selector;
                    let checked = document.querySelector(".currency_selector_item.checked");
                    checked && checked.removeClassName("checked");
                    for (let index = 0; index < selector.children.length; index++) {
                        let item = selector.children[index];
                        if (item.getAttribute("value") == this.currency[target].select) {
                            top = index * 29 - 87;
                            item.addClassName("checked");
                            break;
                        }
                    }
                    this.$nextTick(() => {
                        this.$refs.selector.scrollTop = top;
                    });
                }
            },
            calculateExchangeValue(self) {
                if (!(this.exchangeRate[this.currency["foreign"].select] && this.exchangeRate[this.currency["origin"].select])) { return }
                let target = self == "origin" ? "foreign" : "origin";
                if (!+this.exchangeValue[self]) {
                    this.exchangeValue[target] = '';
                } else if (this.currency[self].select == this.currency[target].select) {
                    this.exchangeValue[target] = this.exchangeValue[self];
                    if (this.forceSyncCost || this.inputLockList[0] != "cost") {
                        this.inputList["cost"].value = this.exchangeValue[target]
                        this.updateValue("cost");
                    }
                } else {
                    let cny = this.exchangeRate[this.currency[self].select].FtoC * this.exchangeValue[self];
                    let foreign = this.exchangeRate[this.currency[target].select].CtoF * cny;
                    this.exchangeValue[target] = this.$options.methods.toFixed(foreign);
                    if (this.forceSyncCost || this.inputLockList[0] != "cost") {
                        this.inputList["cost"].value = this.exchangeValue[target]
                        this.updateValue("cost");
                    }
                }
            },
            toFixed(value) {
                return Math.round(value * 100) / 100;
            },
            updateValue(key) {
                this.lastChanged = key;
                for (const id of this.relevance[key]) {
                    if (this.inputLock.includes(this.inputList[id].name) && this.inputList[id].name != this.inputList[key].name) {
                        continue;
                    }
                    this.$options.methods[`update_${id}`](key, this);
                }
            },
            update_cost(target, vm) {
                if (!(+vm.inputList["scale"].value && +vm.inputList["withFee"].value)) { return; }
                vm.inputList["cost"].value = vm.$options.methods.toFixed(vm.inputList["scale"].value * vm.inputList["withFee"].value);
            },
            update_scale(target, vm) {
                if (!(+vm.inputList["cost"].value && +vm.inputList["withFee"].value)) { return; }
                vm.inputList["scale"].value = vm.$options.methods.toFixed(vm.inputList["cost"].value / vm.inputList["withFee"].value);
            },
            update_withFee(target, vm) {
                if (target == "withoutFee") {
                    if (!+vm.inputList["withoutFee"].value) { return; }
                    vm.inputList["withFee"].value = vm.$options.methods.toFixed(vm.inputList["withoutFee"].value / 1.15);
                } else {
                    if (!(+vm.inputList["cost"].value && +vm.inputList["scale"].value)) { return; }
                    vm.inputList["withFee"].value = vm.$options.methods.toFixed(vm.inputList["cost"].value / vm.inputList["scale"].value);
                    vm.$options.methods.update_withoutFee(target, vm);
                }
            },
            update_withoutFee(target, vm) {
                vm.inputList["withoutFee"].value = vm.$options.methods.toFixed(vm.inputList["withFee"].value * 1.15);
            },
            startDrag(e) {
                let panel = this.$refs["tool_panel"];
                this.dragSetting.panelOffsetX = e.pageX - panel.offsetLeft;
                this.dragSetting.panelOffsetY = e.pageY - panel.offsetTop;
                document.body.style.userSelect = "none";
                this.dragSetting.dragging = true;
            },
            dragging(e) {
                if (this.dragSetting.dragging) {
                    let panel = this.$refs["tool_panel"];
                    let width = panel.offsetWidth + 10;
                    let diffX = document.body.offsetWidth - (e.pageX - this.dragSetting.panelOffsetX);
                    let left = parseInt(panel.getStyle("left"));
                    if ((e.pageX - this.dragSetting.panelOffsetX) > 10 && diffX > width) {
                        if (left < document.body.offsetWidth >> 1) {
                            panel.style.right = "";
                            panel.style.left = e.pageX - this.dragSetting.panelOffsetX + "px";
                        } else {
                            panel.style.left = "";
                            panel.style.right = document.body.offsetWidth - 170 - (e.pageX - this.dragSetting.panelOffsetX) + "px";
                        }
                        panel.style.top = e.pageY - this.dragSetting.panelOffsetY + "px";
                    }
                }
            },
            currencyStatus(key) {
                if (this.exchangeRate[key]) {
                    let diff = Date.now() - this.exchangeRate[key].timestamp;
                    if (diff < 1800000) {
                        return "#0ac20a";
                    } else if (diff < 7200000) {
                        return "#81b814";
                    } else if (diff < 14400000) {
                        return "#c2b20a";
                    } else if (diff < 28800000) {
                        return "#da730b";
                    } else {
                        return "#383838";
                    }
                }
                return "#00000000";
            },
            displayDetail(key) {
                if (this.exchangeRate[key]) {
                    this.priceDetail.display = true;
                    this.priceDetail.name = key;
                } else {
                    this.priceDetail.display = false;
                }
            }
        },
        watch: {
            'inputList.scale.value'(val) {
                if (this.inputLockList.includes("scale")) {
                    GM_setValue("scale", val);
                }
            }
        },
        mounted: function () {
            window.addEventListener('resize', e => {
                let panel = this.$refs["tool_panel"];
                let left = parseInt(panel.getStyle("left"));
                let right = parseInt(panel.getStyle("right"));
                if (left < 10 || right < 10) {
                    panel.style.right = panel.style.left = "";
                    if (left < 10) {
                        panel.style.right = right - 10 + left + "px";
                    } else {
                        panel.style.left = left - 10 + right + "px";
                    }
                }
            });
            window.addEventListener('mouseup', e => {
                if (this.dragSetting.dragging) {
                    document.body.style.userSelect = "";
                    this.dragSetting.dragging = false;
                    let panel = this.$refs["tool_panel"];
                    let top = panel.getStyle("top");
                    let left = panel.getStyle("left");
                    let right = panel.getStyle("right");
                    let temp = {
                        top: top,
                    };
                    if (parseInt(left) > parseInt(right)) {
                        temp.right = right;
                    } else {
                        temp.left = left;
                    }
                    GM_setValue("panelStyle", temp);
                }
            });
            window.addEventListener('click', e => {
                if (e.target.hasClassName("price_tool_menu_text") || e.target.hasClassName("price_tool_chose_btn")) {
                    return;
                }
                if (this.selectorStatus) {
                    this.selectorStatus = false;
                }
            });
            GM_registerMenuCommand("恢复默认设置", () => {
                GM_deleteValue("inputLockList");
                GM_deleteValue("scale");
                GM_deleteValue("originSelect");
                GM_deleteValue("foreignSelect");
                GM_deleteValue("panelStyle");
                this.panelStyle = { top: "35%", right: "10px" };
            });
            this.$nextTick(function () {
                let buffPrice = location.search.match(/buffPrice=([\d\.]+)/);
                if (buffPrice != null) {
                    this.inputList.cost.value = buffPrice[1];
                    this.updateValue("cost");
                }
                if (Date.now() - this.exchangeRate[this.currency.origin.select].timestamp > 1800000) {
                    this.updateCurrency(this.CURRENCY_DATA[this.currency.origin.select], "origin");
                }
                if (Date.now() - this.exchangeRate[this.currency.foreign.select].timestamp > 1800000) {
                    this.updateCurrency(this.CURRENCY_DATA[this.currency.foreign.select], "foreign");
                }
            });
        },
        template: `
            <div class="price_tool" ref="tool_panel" :style="panelStyle">
                <div class="price_tool_alert_box">
                    <div class="price_tool_alert scale-in" :class="item.type" v-for="item in alertMsg" :key="item.msg">
                        {{item.msg}}
                    </div>
                </div>
                <form id="price_tool_form">
                    <div class="price_tool_input_div" v-for="(item,index) in inputList" :key="item.id">
                        <label class="price_tool_input_btn" :class="{price_tool_locked:inputLock.include(item.name)}"
                            :for="item.id">
                            {{item.describe.name}}
                        </label>
                        <svg :class="{price_tool_hide:!inputLock.include(item.name),icon_forbid:inputLock.include(item.name)}" class="icon" viewBox="0 0 1024 1024"
                            version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M512 64c153.173333 0 277.333333 124.16 277.333333 277.333333v128a128 128 0 0 1 128 128v234.666667a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V597.333333a128 128 0 0 1 128-128v-128c0-153.173333 124.16-277.333333 277.333333-277.333333z m277.333333 469.333333H234.666667a64 64 0 0 0-63.893334 60.245334L170.666667 597.333333v234.666667a64 64 0 0 0 60.245333 63.893333L234.666667 896h554.666666a64 64 0 0 0 63.893334-60.245333L853.333333 832V597.333333a64 64 0 0 0-60.245333-63.893333L789.333333 533.333333z m-243.2 106.666667c4.693333 0 8.533333 3.84 8.533334 8.533333v110.933334a8.533333 8.533333 0 0 1-8.533334 8.533333h-46.933333a8.533333 8.533333 0 0 1-8.533333-8.533333v-110.933334c0-4.693333 3.84-8.533333 8.533333-8.533333h46.933333zM512 128c-115.84 0-210.090667 92.309333-213.248 207.36L298.666667 341.333333v128h426.666666v-128c0-115.84-92.309333-210.090667-207.36-213.248L512 128z"
                                p-id="2041"></path>
                        </svg>
                        <input class="price_tool_checkbox" type="checkbox" :id="item.id" :value="item.name"
                            :disabled="inputLock.includes(item.name)" v-model="inputLock" />
                        <input type="number" step="0.01" min="0" class="price_tool_input" :ref="item.id"
                            :class="{price_tool_locked:inputLock.include(item.name)}" v-model="item.value"
                            @input="updateValue(index)" :placeholder="item.describe.content" />
                    </div>
                </form>
                <form id="price_tool_rate_form">
                    <div class="price_tool_rate_div">
                        <label class="price_tool_chose_btn" @click="showCurrencySelector('foreign')">
                            {{CURRENCY_DATA[currency.foreign.select].strSymbol}}
                            <span class="pulldown f-right price_tool_menu_text" :class="{transparent:this.currency.foreign.loading}"></span>
                            <svg class="currency_loading" v-if="this.currency.foreign.loading" viewBox="0 0 1024 1024" width="18" height="18" ><path d="M128 512c0-211.2 172.8-384 384-384s384 172.8 384 384c0 38.4-25.6 64-64 64s-64-25.6-64-64c0-140.8-115.2-256-256-256S256 371.2 256 512s115.2 256 256 256c38.4 0 64 25.6 64 64s-25.6 64-64 64c-211.2 0-384-172.8-384-384z" p-id="4797"></path></svg>
                        </label>
                        <input type="number" min="0" step="0.01" class="price_tool_rate_input" v-model="exchangeValue.foreign"
                            @input="calculateExchangeValue('foreign')"
                            :placeholder="CURRENCY_DATA[currency.foreign.select].strName" />
                    </div>
                    <div class="price_tool_rate_div">
                        <label class="price_tool_chose_btn" @click="showCurrencySelector('origin')">
                            {{CURRENCY_DATA[currency.origin.select].strSymbol}}
                            <span class="pulldown f-right price_tool_menu_text" :class="{transparent:this.currency.origin.loading}"></span>
                            <svg class="currency_loading" v-if="this.currency.origin.loading" viewBox="0 0 1024 1024" width="18" height="18" ><path d="M128 512c0-211.2 172.8-384 384-384s384 172.8 384 384c0 38.4-25.6 64-64 64s-64-25.6-64-64c0-140.8-115.2-256-256-256S256 371.2 256 512s115.2 256 256 256c38.4 0 64 25.6 64 64s-25.6 64-64 64c-211.2 0-384-172.8-384-384z" p-id="4797"></path></svg>
                        </label>
                        <input type="number" min="0" step="0.01" class="price_tool_rate_input" v-model="exchangeValue.origin"
                            @input="calculateExchangeValue('origin')" :placeholder="CURRENCY_DATA[currency.origin.select].strName" />
                    </div>
                    <div class="currency_selector">
                        <div class="price_detail" v-show="priceDetail.display" :style="[selectorStyle,detailDisplaySide()]">
                            <span>{{computedPriceDetail.name}}</span>
                            <div class="in">
                                <span>兑入：</span>
                                <span>{{computedPriceDetail.in}}</span>
                            </div>
                            <div class="out">
                                <span>兑回：</span>
                                <span>{{computedPriceDetail.out}}</span>
                            </div>
                            <span style="font-size: smaller;color: #c86375;">汇率基于人民币</span>
                            <span>更新时间：</span>
                            <span>{{computedPriceDetail.diff}}</span>
                            <span>{{computedPriceDetail.time}}</span>
                        </div>
                        <transition enter-active-class="scale-in" leave-active-class="scale-out">
                            <div class="currency_selector_menu" ref="selector" @click="changeCurrency" @mouseleave="selectorStatus = false;priceDetail.display = false" v-show="selectorStatus" :style="selectorStyle">
                                <span class="currency_selector_item" v-for="(value, key) in CURRENCY_DATA" :key="key"
                                    :style="{'border-color':currencyStatus(key)}" :value="key" @mouseover="displayDetail(key)">
                                    {{value.strName}}
                                    <span class="f-right" :value="key">{{value.strSymbol}}</span>
                                </span>
                            </div>
                        </transition>
                    </div>
                </form>
                <div style="margin-top: 5px;">
                    <span class="pagebtn price_tool_pagebtn" @click="switchPage('prev')">&lt;</span>
                    <span class="price_tool_drag_bar" :class="{grabbing:this.dragSetting.dragging}" @mousedown="startDrag" @mousemove="dragging">拖动</span>
                    <span class="pagebtn price_tool_pagebtn" @click="switchPage('next')">&gt;</span>
                </div>
            </div>
        `
    });

})();