// ==UserScript==
// @name         空投量化
// @namespace    q.lianghua
// @version      2.0.6
// @description  空投量化2
// @author       q
// @match        *://app.kiloex.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @icon         data:image/gif
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490460/%E7%A9%BA%E6%8A%95%E9%87%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/490460/%E7%A9%BA%E6%8A%95%E9%87%8F%E5%8C%96.meta.js
// ==/UserScript==
//注意事项。。。
//0用白色背景
//1一定要设置为繁体中文
//2开启一键交易
//3窗口一定要最大化
//4先手动做一笔交易在开启脚本



//注意事项。。。
//0用白色背景
//1一定要设置为繁体中文
//2开启一键交易
//3窗口一定要最大化
//4先手动做一笔交易在开启脚本


(async function () {
    'use strict';

    //全局属性
    const global = {
        currentPrice: null,
        currentSymbol: null,
        orderList: null,
        list: null,
        state: "初始化", //初始化，等待买点，等待交易时机,等待下单(1、2、3),等待卖出
    }

    //日志输入数据
    const log = {
        data: {
            change: 0,
            strategy: "",
            info: ""
        },
        display: () => {
            // document.querySelector("#q_console").innerHTML = `走势${log.data.change_up}\t当前价:${global.currentPrice}\t订单:${global.orderList?.length == 1 ? global.orderList[0].change + '%' : "无"}
            // \t数量：${global.orderList?.length == 1 ? global.orderList[0].count : "无"}
            // \t第${global.orderList?.[0].head ?? ""}手
            // \t 交易：${log.data.strategy}
            // \t info: ${log.data.info}`


            document.querySelector("#q_console").innerHTML = `
            状态：${global.state} 
            \t | \t 共${global.orderList?.length ?? "0"}单 第${global.orderList?.[0].head ?? ""}手 
            \t | \t info: ${log.data.info}`
            document.querySelector("#q_console2").innerHTML = `
            走势上涨/下跌：${log.data.change_down?.toFixed(2)} \t ${log.data.change_up?.toFixed(2)}`

        },
    }

    //全局配置
    const config = {
        symbol: "BTC",//交易对
        buyStrategy: [ //下单策略，多空都用这个， count = 购买数量（USDT）  timing = 购买时机（涨跌幅）
            { name: "止盈止损", count: 0, winTiming: 2.5, lossTiming: 7.5 }, //止损策略，如果已经买了3手了 在亏钱就止损。这个看得也是订单收益
            { name: "第一手", count: 100, timing: 0.5, kCount: 7 },  //kCount 第一手比较特殊要看多少根K线判断该涨跌幅
            { name: "第二手", count: 200, timing: 10 }, // 第二手开始看订单得收益，-10%就补
            { name: "第三手", count: 300, timing: 10 }, // 
        ]
    }

    //工具
    const tools = {
        getKData: async () => {
            let now = new Date();
            let tenMinutesAgo = new Date(now.getTime() - (10 * 60 * 1000));
            let startTime = Math.round(tenMinutesAgo.getTime() / 1000);
            let endTime = Math.round(now.getTime() / 1000);

            let res = await fetch(`https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=Crypto.${config.symbol}%2FUSD&resolution=1&from=${startTime}&to=${endTime}`);
            let json = await res.json();
            return json;
        },
        getKDataModel: (data) => {
            let list = [];
            for (let i = 0; i < 10; i++) {
                let item = {
                    open: data.o[i],
                    close: data.c[i],
                    low: data.l[i],
                    high: data.h[i],
                    change: 0,
                    time: tools.ormatDateTime(new Date(data.t[i] * 1000))
                }
                item.change = tools.calcChange(item.open, item.close)
                list.push(item);
            }
            return list;
        },
        /**
         * 获取当前价格
         *
         * @returns 返回当前价格
         */
        getCurrentPrice() {
            global.currentSymbol = document.querySelector(".market .label").innerText.split("/")[0];
            global.currentPrice = parseFloat(document.querySelector(".market-price").innerText);
            return global.currentPrice;
        },
        createdOrderAsync: async (isUp, price) => {
            console.log("下单", isUp, price);
            var priceDom = document.querySelector(".kilo-order-input-item .arco-input-size-large");
            priceDom.value = price;
            priceDom.dispatchEvent(new Event('input', { bubbles: true }));
            priceDom.focus();
            priceDom.dispatchEvent(new Event('change', { bubbles: true }));
            await tools.delayAsync(100);
            if (isUp) {
                document.querySelector(".kiloex-order-type-long").click();
                await tools.delayAsync(100);
                document.querySelector(".kiloex-order-market-long").click();

            } else {
                document.querySelector(".kiloex-order-type-short").click();
                await tools.delayAsync(100);
                document.querySelector(".kiloex-order-market-short").click();
            }
            global.state = "等待下单成功";
        },
        queryOrder() {
            var domList = document.querySelector(".arco-table-element").querySelector("tbody").children;
            if (domList.length <= 0 || domList[0].innerText.trim() == "無資料") {
                global.orderList = null;
                return null;
            }
            var resList = [];
            for (let i = 0; i < domList.length; i++) {
                const element = domList[i];
                var textList = element.innerText.split('\n');



                let order = {};

                if (textList.length == 26) {
                    order = {
                        symbol: textList[0],
                        type: textList[2],
                        count: parseFloat(textList[6].toString().replace("USDT", "").trim()),
                        price: parseFloat(textList[19].toString().replace("USDT", "").trim()),
                        change: parseFloat(textList[21].toString().replace("(", "").replace(")", "").trim()),
                        win: parseFloat(textList[14].toString().replace("--", "").trim()),
                        loss: parseFloat(textList[16].toString().replace("--", "").trim()),
                    }
                } else if (textList.length == 30 || textList.length == 31) {
                    order = {
                        symbol: textList[0],
                        type: textList[2],
                        count: parseFloat(textList[6].toString().replace("USDT", "").trim()),
                        price: parseFloat(textList[25].toString().replace("USDT", "").trim()),
                        change: parseFloat(textList[27].toString().replace("(", "").replace(")", "").trim()),
                        win: parseFloat(textList[14].toString().replace("--", "").trim()),
                        loss: parseFloat(textList[16].toString().replace("--", "").trim()),
                    }
                } else {
                    console.log("页面变化", textList);
                    log.data.info = "页面出现变化，暂停交易，请联系管理员"
                    GM_setValue("isEnabled", false);
                    document.querySelector("#q_button_close").style.display = "none"
                    document.querySelector("#q_button_open").style.display = ""
                    return null;
                }


                // if (textList.length < 26) {
                //     log.data.info = "网页宽度不够"
                //     return null;
                // }



                if (order.count == config.buyStrategy[1].count) {
                    order.head = 1;
                } else if (order.count == config.buyStrategy[1].count + config.buyStrategy[2].count) {
                    order.head = 2;
                } else {
                    order.head = 3;
                }

                resList.push(order);
            }
            global.orderList = resList;
            return resList;
        },
        createdLimitAsync() {
            var order = global.orderList[0];
            //如果是第一手并且没设置止盈
            if (order.head == 1 && order.win == NaN) {
                //计算止盈


            }

        },
        setLimitOrder: async (isWin, price, count) => {


            document.querySelector(".kiloex-position-stop-loss").click()
            await tools.delayAsync(100)
            document.querySelectorAll(".arco-modal-container .arco-tabs-tab")[isWin ? 0 : 1].click()
            await tools.delayAsync(50)
            var intpuDoms = document.querySelectorAll(".arco-modal-container .arco-input-size-medium");

            tools.setInputValue(intpuDoms[isWin ? 0 : 2], 67200);
            tools.setInputValue(intpuDoms[isWin ? 0 : 3], 67200);



        },
        getState: async () => {

            if (global.state == "初始化") {
                await tools.delayAsync(5000);
                tools.queryOrder();
                //如果没有订单
                if (global.orderList == null) {
                    global.state = "等待买点"
                    return global.state;
                }

                if (global.orderList.length == 1) {
                    global.state = "等待交易时机"
                    return global.state;
                }

            }

            switch (global.state) {
                case "等待下单1":
                    for (let i = 0; i < 15; i++) {
                        await tools.delayAsync(1000);
                        if (global.orderList != null && global.orderList.length >= 1) {
                            if (global.orderList[0].head == 1) {
                                global.state = "等待交易时机"
                            }
                            return global.state;
                        }
                    }
                    console.log("没有等到刷新页面")
                    location.reload();
                    break;
                case "等待下单2":
                    for (let i = 0; i < 15; i++) {
                        await tools.delayAsync(1000);
                        if (global.orderList != null && global.orderList.length >= 1) {
                            if (global.orderList[0].head == 2) {
                                global.state = "等待交易时机"
                            }
                            return global.state;
                        }
                    }
                    console.log("没有等到刷新页面")
                    location.reload();
                    break;
                case "等待下单3":
                    for (let i = 0; i < 15; i++) {
                        await tools.delayAsync(1000);
                        if (global.orderList != null && global.orderList.length >= 1) {
                            if (global.orderList[0].head == 3) {
                                global.state = "等待交易时机"
                            }
                            return global.state;
                        }
                    }
                    console.log("没有等到刷新页面")
                    location.reload();
                    break;
                case "等待卖出":
                    for (let i = 0; i < 15; i++) {
                        await tools.delayAsync(1000);
                        if (global.orderList == null) {
                            global.state = "初始化"
                            return global.state;
                        }
                    }
                    console.log("没有等到刷新页面")
                    location.reload();
                    break;
                default:
                    break;
            }
            return global.state;
        },
        calcChange: (openPrice, closePrice) => {
            return ((closePrice - openPrice) / openPrice) * 100;
        },
        //格式化时间戳
        ormatDateTime: (date) => {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            var hours = date.getHours().toString().padStart(2, '0');
            var minutes = date.getMinutes().toString().padStart(2, '0');
            var seconds = date.getSeconds().toString().padStart(2, '0');
            return hours + ':' + minutes + ':' + seconds;
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        },
        delayAsync: async (ms) => {
            await new Promise(resolve => setTimeout(resolve, ms));
        },
        setInputValue: (dom, value) => {
            dom.value = value;
            dom.dispatchEvent(new Event('input', { bubbles: true }));
            dom.focus();
            dom.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }



    //初始化
    function init() {
        var jsScript = document.createElement("script");
        jsScript.type = "text/javascript";
        jsScript.crossorigin = "anonymous";
        jsScript.text = ""
        document.body.appendChild(jsScript);


        //添加zui
        var cssLink = document.createElement("link");
        cssLink.type = "text/css";
        cssLink.rel = "stylesheet";
        cssLink.href = "///cdn.bootcdn.net/ajax/libs/zui/3.0.0-alpha.4/zui.css"; // 替换为你的 CSS 文件 URL
        document.head.appendChild(cssLink);

        // 添加外部 JavaScript
        var jsScript = document.createElement("script");
        jsScript.type = "text/javascript";
        jsScript.crossorigin = "anonymous";
        jsScript.src = "///cdn.bootcdn.net/ajax/libs/zui/3.0.0-alpha.4/zui.js"; // 替换为你的 JS 文件 URL
        document.body.appendChild(jsScript);




        //诸如样式
        let style = `
        .xxxxxxxxxxx{
            padding-top:2px;cursor:pointer;
            z-index:9999999;width: 60px;height: 60px;
            display:block;
            position:fixed;
        }`;
        var styleDom = document.createElement('style');
        styleDom.type = 'text/css';
        styleDom.rel = 'stylesheet';
        styleDom.appendChild(document.createTextNode(style));
        document.getElementsByTagName('head')[0].appendChild(styleDom);


        let html =
            `<div class='fixed inset-x-0 bottom-0 bg-gray-50 h-16 text-2xl z-50 flex justify-between row'  id='q_root'>
                <div class='inset-x-0 bottom-0 bg-gray-50 h-16 text-2xl z-50 flex col grow'>
                    <div class="h-12 text-2xl align-middle" id="q_console">123123</div>
                    <div class="h-12 text-2xl align-middle" id="q_console2">123123</div>
                </div>
                <div class='w-36 grow-0 content-center' >
                    <button id="q_button_open" class="btn primary">开启交易</button>
                    <button id="q_button_close" class="btn danger">暂停交易</button>
                </div>
            </div>`;
        var dialogDom = document.createElement('div');
        dialogDom.innerHTML = html;
        document.body.appendChild(dialogDom);

        document.querySelector("#q_button_open").addEventListener("click", function () {
            GM_setValue("isEnabled", true);
            document.querySelector("#q_button_close").style.display = ""
            document.querySelector("#q_button_open").style.display = "none"
        });
        document.querySelector("#q_button_close").addEventListener("click", function () {
            GM_setValue("isEnabled", false);
            document.querySelector("#q_button_close").style.display = "none"
            document.querySelector("#q_button_open").style.display = ""
        });

        let isEnabled = GM_getValue("isEnabled", false);

        if (isEnabled) {
            document.querySelector("#q_button_close").style.display = ""
            document.querySelector("#q_button_open").style.display = "none"
        } else {
            document.querySelector("#q_button_close").style.display = "none"
            document.querySelector("#q_button_open").style.display = ""
        }


    }

    await tools.delayAsync(3000);
    init();
    await tools.delayAsync(3000);


    const strategy = {
        config: {
            change: 0.5,//下单是涨跌幅
            tiem: 10,//往前查看多少时长 ，最多10分钟,
        },
        buy_To: () => {

        },
        buy_up: () => {
            let lastFive = global.list.slice(-config.buyStrategy[1].kCount);
            let high = Math.max(...lastFive.filter(item => item.high).map(item => item.high));
            let change = tools.calcChange(high, tools.getCurrentPrice());
            if (change < -config.buyStrategy[1].timing) {
                console.log("下跌了超过-0.5%，进入买点", tools.ormatDateTime(new Date()));
                return true;
            }
            log.data.change_up = change;
            return false;
        },
        buy_down: () => {
            let lastFive = global.list.slice(-config.buyStrategy[1].kCount);
            let low = Math.min(...lastFive.filter(item => item.low).map(item => item.low));
            let change = tools.calcChange(low, tools.getCurrentPrice());
            if (change > config.buyStrategy[1].timing) {
                console.log("上涨过-0.5%，进入买点", tools.ormatDateTime(new Date()));
                return true;
            }
            log.data.change_down = change;
            return false;
        },
        buy_moreAsync: async () => {
            var order = global.orderList[0];
            //止盈
            if (order.change > config.buyStrategy[0].winTiming) {
                console.log("止盈", order.change, tools.ormatDateTime(new Date()));
                document.querySelector("button.kiloex-position-market").click();
                await tools.delayAsync(1000);
                document.querySelector(".percencon button").click();
                global.state = "等待卖出";
                return;
            }

            //止损策略            
            if (order.head >= 3) {
                if (order.change < -config.buyStrategy[0].lossTiming) {
                    console.log("止损", order.change, tools.ormatDateTime(new Date()));
                    document.querySelector("button.kiloex-position-market").click();
                    await tools.delayAsync(1000);
                    document.querySelector(".percencon button").click();
                    global.state = "等待卖出";
                    return;
                }
                return;
            }


            var nextStrategy = config.buyStrategy[order.head + 1];
            if (order.change < -nextStrategy.timing) {
                console.log(`下单${order.type}`, tools.ormatDateTime(new Date()));
                await tools.createdOrderAsync(order.type == "買入" ? true : false, nextStrategy.count);
                global.state = "等待下单" + (order.head + 1)
                return;
            }
        }
    }

    const timerQuery1 = setInterval(function () {
        tools.getCurrentPrice();
        tools.queryOrder();
        log.display();
    }, 100);


    const timerQuery2 = setInterval(async function () {
        try {
            let kdata = await tools.getKData();
            global.list = tools.getKDataModel(kdata);
        } catch (error) {

        }
    }, 3000);

    /**
     * 定时主函数
     */
    async function interval_main() {
        try {
            let isEnabled = GM_getValue("isEnabled", false);
            if (!isEnabled) {
                log.data.info = "未开启交易";
                setTimeout(interval_main, 1000);
                return;
            }



            if (log.data.info == "网页宽度不够") {
                setTimeout(interval_main, 1000);
                return;
            }

            if (document.querySelectorAll(".wallet-connect-btn.kiloex-connect-triggerbutton").length >= 1) {
                log.data.info = "请先连接钱包";
                return;
            }
            if (global.currentSymbol != config.symbol) {
                log.data.info = "设定的交易对和当前交易对不一致";
                setTimeout(interval_main, 1000);
                return;
            } else {
                log.data.info = "";
            }


            //return;
            //await tools.createdLimitAsync();
            //return;
            //获取K线
            var state = await tools.getState();
            switch (state) {
                case "等待买点":
                    if (strategy.buy_up()) {
                        await tools.createdOrderAsync(true, config.buyStrategy[1].count);
                        global.state = "等待下单1";
                        //做多                
                    } else if (strategy.buy_down()) {
                        //做空                
                        await tools.createdOrderAsync(false, config.buyStrategy[1].count);
                        global.state = "等待下单1";
                    }
                    break;
                case "等待交易时机":
                    await strategy.buy_moreAsync();
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("错误", error)
        }

        setTimeout(interval_main, 1000); // 设置下一个定时器，100毫秒后执行  
    }

    await interval_main();

})();



