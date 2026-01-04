// ==UserScript==
// @name         okex
// @namespace    http://tampermonkey.net/
// @version      0.65
// @description  try to take over the world!
// @author       You
// @match        https://www.okexcn.com/*
// @match        https://www.okex.com/*
// @require      https://cdn.staticfile.org/echarts/5.0.1/echarts.min.js
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant       GM_notification
// @grant       window.focus
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422901/okex.user.js
// @updateURL https://update.greasyfork.org/scripts/422901/okex.meta.js
// ==/UserScript==

(function() {
    console.log('okex')
    'use strict';
    function dearDearDataCreater() {
        let echart = null;
        function ElementListToArray(el) {
            let list = [];
            for (let i = 0;i < el.length;i++) list.push(el[i]);
            return list;
        }
        function getRealData() {
            let sellData = {};
            let buyData = {};
            let sellList = document.querySelector(
                `#app > div > div.trade-panel-box > div > div.layout-lg-right > div.layout-lg-right-top > div.layout-lg-right-top-left > div > div > div.okui-tabs-panel-list > div > div > div > div.order-book-body > div.book-body-wrap > ul.order-book-list.asks`);
            if (sellList) {
                sellList = ElementListToArray(sellList
                    .getElementsByTagName('li'));
            } else {
                sellList = ElementListToArray(document.querySelector(
                `#app > div > div.trade-panel-box > div > div.layout-md-top > div.layout-md-top-right > div.layout-md-top-right-bottom > div.layout-md-top-right-bottom-left > div.order-book-box > div > div.order-book-body > div.book-body-wrap > ul.order-book-list.asks`).getElementsByTagName('li'));
            }
            let buyList = document.querySelector(`#app > div > div.trade-panel-box > div > div.layout-lg-right > div.layout-lg-right-top > div.layout-lg-right-top-left > div > div > div.okui-tabs-panel-list > div > div > div > div.order-book-body > div.book-body-wrap > ul.order-book-list.bids`);
            if (buyList) {
                buyList = ElementListToArray(buyList.getElementsByTagName('li'));
            } else {
                buyList = ElementListToArray(document.querySelector(`#app > div > div.trade-panel-box > div > div.layout-md-top > div.layout-md-top-right > div.layout-md-top-right-bottom > div.layout-md-top-right-bottom-left > div.order-book-box > div > div.order-book-body > div.book-body-wrap > ul.order-book-list.bids`).getElementsByTagName('li'));
            }
            sellList.forEach(sl => {
                let span = sl.getElementsByTagName('span');
                let p = +span[0].innerText.replace(/,/,'');
                if (!(p in sellData)) sellData[p] = 0;
                sellData[p] += + span[1].innerText;
            });
            buyList.forEach(sl => {
                let span = sl.getElementsByTagName('span');
                let p = +span[0].innerText.replace(/,/,'');
                if (!(p in buyData)) buyData[p] = 0;
                buyData[p] += + span[1].innerText;
            });
            return {
                sellData,buyData
            }
        }

        function toOption() {
            let option = {
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    position: function (point, params, dom, rect, size) {
                        // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                        // 提示框位置
                        var x = 0; // x坐标位置
                        var y = 0; // y坐标位置

                        // 当前鼠标位置
                        var pointX = point[0];
                        var pointY = point[1];

                        // 外层div大小
                        // var viewWidth = size.viewSize[0];
                        // var viewHeight = size.viewSize[1];

                        // 提示框大小
                        var boxWidth = size.contentSize[0];
                        var boxHeight = size.contentSize[1];

                        // boxWidth > pointX 说明鼠标左边放不下提示框
                        if (boxWidth > pointX) {
                            x = 5;
                        } else { // 左边放的下
                            x = pointX - boxWidth;
                        }

                        // boxHeight > pointY 说明鼠标上边放不下提示框
                        if (boxHeight > pointY) {
                            y = 5;
                        } else { // 上边放得下
                            y = pointY - boxHeight;
                        }

                        return [x, y];
                    }
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true,
                    color: 'red',
                    connectNulls: true
                },{
                    data: [],
                    type: 'line',
                    smooth: true,
                    color: 'green',
                    connectNulls: true
                }]
            };
            let ds = [];
            for (let i in datas.buy) {
                ds.push({
                    price: i,
                    num: datas.buy[i],
                    type: 'buy'
                });
            }
            for (let i in datas.sell) {
                ds.push({
                    price: i,
                    num: datas.sell[i],
                    type: 'sell'
                });
            }
            ds.sort((a,b) => a.price - b.price).forEach(_ => {
                option.xAxis.data.push(_.price);
                if (_.type === 'buy') {
                    option.series[0].data.push(_.num);
                    option.series[1].data.push(null);
                } else {
                    option.series[0].data.push(null);
                    option.series[1].data.push(_.num);
                }
            });
            let deta = ds[ds.length - 1].price - ds[0].price;
            jQuery('#echartPriceDeta').text(`值:${deta.toFixed(3)} 幅:${(deta / ds[0].price).toFixed(3)}`);
            // console.log(JSON.stringify(option,'','\t'));
            if (echart) {
                echart.setOption(option);
                echart.resize();
            }
        }

        var datas = {
            sell: {},
            buy: {},
            times: 0
        };
        var id = setInterval(() => {
            let obj = getRealData();
            for (let i in obj.sellData) {
                if (i in datas.sell) {
                    datas.sell[i] += obj.sellData[i];
                } else {
                    datas.sell[i] = obj.sellData[i];
                }
            }
            for (let i in obj.buyData) {
                if (i in datas.buy) {
                    datas.buy[i] += obj.buyData[i];
                } else {
                    datas.buy[i] = obj.buyData[i];
                }
            }
            if (datas.times > 3) {
                toOption();
                datas.times = 0;
            }
            datas.times++;
        },300);
        return (_echart,clear) => {
            echart = _echart || echart;
            if (clear) {
                datas.sell = {};
                datas.buy = {};
            }
        }
    }
    class TimeoutRunner {
        constructor(cb) {
            this.cb = cb || (()=>{});
            this.tasklist = [];
        }
        addTask(fn,time) {
            this.tasklist.push(() => {
                fn();
                setTimeout(() => {
                    if (this.tasklist.length > 0) {
                        this.tasklist.shift()();
                    } else {
                        this.cb();
                    }
                },time)
            });
        }
        run() {
            if (this.tasklist.length > 0) {
                this.tasklist.shift()();
            }
        }
    }
    const APIS = {
        getPirce() {
            return +document.querySelector('span.last').innerText.replace(',','')
        },
        getSecondData(limit) {
            let d = new Date();
            limit = limit || 120;
            return fetch(
                `https://www.okex.com/priapi/v5/market/candles?instId=BTC-USDT&bar=1m&limit=${limit}&t=${d.getTime()}`,{method: 'get'}).then(_ => _.text()).then(JSON.parse).then(_ => {
                let total = 0;
                let max = -1;
                let min = 1e10;
                let dir = 0;
                // 一开始记录最后一个值
                let best = + jQuery('span.last').text().replace(/,/g,'');
                let avg = 0;
                _.data.map(d => +d[2]).map(d => {
                    total += d;
                    max = max > d ? max : d;
                    min = min > d ? d : min;
                });
                if (max + min > total / limit * 2) {
                    dir = 'up';
                } else {
                    dir = 'down';
                }
                avg = total / limit;
                if (avg < best) {
                    best = avg;
                }
                if (max < best * vars.smaller) {
                    // 回本期望较低
                    best = parseInt(max / vars.smaller) - 1;
                }
                let ret = {
                    avg,
                    max,
                    min,
                    dir,
                    best,
                };
                console.log(JSON.stringify(ret,'','\t'));
                return {
                    datas: _,
                    ret
                }
            });
        },
        checkOrdering() {
            jQuery('div.okui-tabs-pane-label').each((ind,ele) => {
                if (ele.innerText === "当前委托") {
                    ele.click();
                }
            });
            var trs = jQuery('#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-panel-list > div > div > div > table > tbody > tr');
            var ordering = !trs.find('.empty-box').length;
            return {
                // 是否交易中
                ordering: ordering,
                // 是否为卖出(先判断 ordering)
                isSell: ordering && jQuery(trs[0]).find('td:nth(2)>span').hasClass('down'),
                price: $(trs[0]).find('td:nth(3) span:nth(1)').text()
            }
        },
        showMessage(text,title,image,timeout) {
            var notificationDetails = {
                text,
                title,
                timeout: timeout || 15000,
                image,
                onclick: function() { window.focus(); },
            };
            GM_notification(notificationDetails);
        },
        /**
         * 设置输入框的值（因为该框架为 react）
         * @param input <input> 元素
         * @param val   值
         */
        setValue(input,val) {
            // let input = document.getElementById('user-mobile');
            //let lastValue = input.value;
            input.value = val;
            let event = new Event('input', { bubbles: true });
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue('');//上面文章的原代码其实用的是 lastValue 参数，但是我觉得好像没啥用，就直接使用空字符串代替
            }
            input.dispatchEvent(event);
        },
        // 买入或卖出时全仓操作
        // type = 'buy' or 'sell'
        setTotal(cb,type) {
            var total = jQuery('input[name="total"]');

            var totalVal = 0; //jQuery('span[class="avail-display-value"]')[type === "buy" ? 0 : 1].innerText;
            if (type === "buy") {
                totalVal = document.querySelector('#leftPoForm > div:nth-child(4) > div:nth-child(1) > span.avail-display-value').innerText;
            } else {
                totalVal = document.querySelector('#rightPoForm > div:nth-child(5) > div > span.avail-display-value').innerText;
            }
            APIS.setValue(total[0],9999999999);
            if (totalVal.endsWith('USDT')) {
                totalVal = parseFloat(totalVal);
                if (type === "buy") {
                    totalVal = totalVal * vars.buyInRange;
                } else {
                    totalVal = totalVal * vars.sellOutRange;
                }
                console.log(true);
                setTimeout(() => {
                    APIS.setValue(total[0],totalVal);
                    cb(true);
                },50);
            } else {
                cb(false);
            }
        },
        /**
         * 一键卖出
         * @param sellPrice 买入时价格
         * @param rate      卖出时价格和买入价格的差价比值
         */
        selloutAll(sellPrice,rate) {
            // 1.0019 为保本比值
            rate = rate || vars.smaller;
            // 切换到卖的窗口
            jQuery('div.okui-tabs-pane-segmented')[1].click();
            var price = jQuery('input[name="price"]');
            APIS.setValue(price[0],sellPrice * rate);
            // 全部卖出
            var selloutAllOk = function() {
                vars.lastSellPrice = sellPrice * rate;
                vars.inputDom.find(`[tar="sellOutPriceInput"]`).val(sellPrice * rate);
                APIS.recordAutoOP("sellout",vars.lastSellPrice);
                var sell = jQuery('button[side="sell"]');
                sell.click();
                setTimeout(() => {
                    jQuery('button[class="okui-btn btn-sm btn-primary btn-primary-normal dialog-btn double-btn"]').click();
                },500);
            }
            setTimeout(() => {
                APIS.setTotal(ok => {
                    if (ok) {
                        selloutAllOk();
                    } else {
                        APIS.setTotal(ok => {
                            if (ok) {
                                selloutAllOk();
                            } else {
                                APIS.showMessage("执行一键卖出失败","尝试两次均失败")
                            }
                        },'sell');
                    }
                },'sell');
            },200);
        },
        buyinAll(limit) {
            APIS.getSecondData(limit)
                .then(d => {
                    if (d.ret.best > 50000) {
                        // 切换到买的窗口
                        jQuery('div.okui-tabs-pane-segmented')[0].click();
                        var price = jQuery('input[name="price"]');
                        // d.ret.best
                        APIS.setValue(price[0],d.ret.best);
                        // 全部买入
                        var selloutAllOk = function() {
                            vars.lastBuyPrice = d.ret.best;
                            vars.inputDom.find(`[tar="buyInPriceInput"]`).val(vars.lastBuyPrice);
                            vars.inputDom.find(`[tar="sellOutPriceImageInput"]`).val(vars.lastBuyPrice * vars.smaller);
                            APIS.recordAutoOP("buyin",d.ret.best);
                            var sell = jQuery('button[side="buy"]');
                            sell.click();
                            setTimeout(() => {
                                jQuery('button[class="okui-btn btn-sm btn-primary btn-primary-normal dialog-btn double-btn"]').click();
                            },500);
                        }
                        setTimeout(() => {
                            APIS.setTotal(ok => {
                                if (ok) {
                                    selloutAllOk();
                                } else {
                                    APIS.setTotal(ok => {
                                        if (ok) {
                                            selloutAllOk();
                                        } else {
                                            APIS.showMessage("执行一键买入失败","尝试两次均失败")
                                        }
                                    },"buy");
                                }
                            },"buy");
                        },200);
                    } else {
                        console.log('交易价格太低');
                    }
                });
        },
        // 按最新价格买入
        buyinAllAsNewestPrice() {
            let newestPrice = APIS.getPirce();
            jQuery('div.okui-tabs-pane-segmented')[0].click();
            var price = jQuery('input[name="price"]');
            // d.ret.best
            APIS.setValue(price[0],newestPrice);
            // 全部买入
            var selloutAllOk = function() {
                vars.lastBuyPrice = newestPrice;
                vars.inputDom.find(`[tar="buyInPriceInput"]`).val(vars.lastBuyPrice);
                vars.inputDom.find(`[tar="sellOutPriceImageInput"]`).val(vars.lastBuyPrice * vars.smaller);
                APIS.recordAutoOP("buyin",newestPrice);
                var sell = jQuery('button[side="buy"]');
                sell.click();
                setTimeout(() => {
                    jQuery('button[class="okui-btn btn-sm btn-primary btn-primary-normal dialog-btn double-btn"]').click();
                },500);
            }
            setTimeout(() => {
                APIS.setTotal(ok => {
                    if (ok) {
                        selloutAllOk();
                    } else {
                        APIS.setTotal(ok => {
                            if (ok) {
                                selloutAllOk();
                            } else {
                                APIS.showMessage("执行一键买入失败","尝试两次均失败")
                            }
                        },"buy");
                    }
                },"buy");
            },200);
        },
        selloutAllAsNewestPrice() {
            let newestPrice = APIS.getPirce();
            jQuery('div.okui-tabs-pane-segmented')[1].click();
            var price = jQuery('input[name="price"]');
            APIS.setValue(price[0],newestPrice);
            // 全部卖出
            var selloutAllOk = function() {
                vars.lastSellPrice = newestPrice;
                vars.inputDom.find(`[tar="sellOutPriceInput"]`).val(newestPrice);
                APIS.recordAutoOP("sellout",vars.lastSellPrice);
                var sell = jQuery('button[side="sell"]');
                sell.click();
                setTimeout(() => {
                    jQuery('button[class="okui-btn btn-sm btn-primary btn-primary-normal dialog-btn double-btn"]').click();
                },500);
            }
            setTimeout(() => {
                APIS.setTotal(ok => {
                    if (ok) {
                        selloutAllOk();
                    } else {
                        APIS.setTotal(ok => {
                            if (ok) {
                                selloutAllOk();
                            } else {
                                APIS.showMessage("执行一键卖出失败","尝试两次均失败")
                            }
                        },'sell');
                    }
                },'sell');
            },200);
        },
        // 自动买卖
        autoToSellAndBuy() {
            if (vars.autoSellAndBuyId) {
                clearInterval(vars.autoSellAndBuyId);
                vars.autoSellAndBuyId = null;
            } else {
                if (vars.lastBuyPrice < 50000) {
                    console.log(`最后买入价格低于 50000 无法执行`);
                } else {
                    vars.autoSellAndBuyId = setInterval(function () {
                        // 检查是否有可买的 USDT (USDT 需要大于 1)
                        let aviUSDT = 0;
                        let aviBCT = 0;
                        let sleepTime = 200;
                        let tor = new TimeoutRunner(() => {
                            console.log(`可用USDT：${aviUSDT}`);
                            console.log(`可用BCT：${aviBCT}`);
                            if (aviUSDT > 1 && aviBCT > 0.0005) {
                                APIS.showMessage("无法自动操作，当前即可买入也可卖出，无法判定合适操作","自动买卖失败");
                            } else {
                                vars.oper = 'robot';
                                if (aviBCT > 0.0005) {
                                    // 可以卖
                                    APIS.selloutAll(vars.lastBuyPrice);
                                    vars.stopDear = -1;
                                } else if (aviUSDT > 1) {
                                    if (vars.stopDear !== -1) {
                                        console.log(`暂停卖出后立即买入交易${vars.stopDear + 1}次`);
                                        vars.stopDear--;
                                    } else {
                                        APIS.buyinAll(180);
                                    }
                                } else {
                                    console.log('当前不能交易(挂单嫌疑)');
                                }
                            }
                        });
                        tor.addTask(() => jQuery('div.okui-tabs-pane-segmented')[0].click(),sleepTime);
                        tor.addTask(() => {
                            aviUSDT = +jQuery('span.avail-display-value').text().split(' ')[0]
                        },sleepTime);
                        tor.addTask(() => jQuery('div.okui-tabs-pane-segmented')[1].click(),sleepTime);
                        tor.addTask(() => {
                            aviBCT = +jQuery('span.avail-display-value').text().split(' ')[0]
                        },sleepTime);
                        tor.run();
                    },5000);
                }
            }
        },
        // 记录自动买卖操作
        recordAutoOP(type,price) {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `http://www.sunibas.cn/recording/add?label=okex&content1=${price}&content2=${type}&content3=${vars.oper}_${new Date().getTime()}`,
                onload: response => {
                    console.log(response)
                    console.log("交易操作提交完成");
                }
            });
        }
    };
    const utils = {
        createBtn(innerHtml,bgColor,tar) {
            return `<div tar="${tar}" style="padding: 0 5px;display: inline-block;background: ${bgColor};color: white;border-radius: 6px;">${innerHtml}</div>`
        },
        createInput(label,tar) {
            return `<div style="display: inline-block;width: 90px;text-align: right;">${label}</div>
    <div class="input-item-input" style="display: inline-block;">
        <div class="okui-input input-sm " style="margin: 4px 5px;">
            <div class="okui-input-box">
                <input type="text" tar="${tar}" class="okui-input-input" value="">
            </div>
        </div>
    </div>`;
        }
    };
    const vars = {
        // 在 auto 中会被设置为 robot，其他地方设置为 man 表示机器或者人为操作
        oper: 'man',
        recordIntervalId: null,
        autoSellAndBuyId: null,
        highlightId: null,
        // 自动成交卖出后不应该立即买
        stopDear: -1,
        lastBuyPrice: 70000,
        dom: `<div class="guide-icon-btn" style="bottom: 16px;width: auto;text-align:left;left: 66px;border-radius: 0;background: rgba(0,0,0,0);">
${utils.createBtn('提醒委托（关）','#ff9800','checkOrderingAndShowMessageToggle')}
${utils.createBtn('一键卖出','#009688','selloutAll')}
${utils.createBtn('一键买入历史加权价','#f44336','buyinAll')}
${utils.createBtn('获取历史价格','#2196f3','getHistory')}
${utils.createBtn('自动交易(关)','#8bc34a','autoDear')}
${utils.createBtn('按新价格买','#4ac3b1','autoBuyNew')}
${utils.createBtn('按新价格卖','#574cc6','autoSellNew')}
${utils.createBtn('记录价格(关)','#948fe9','toRecord')}
${utils.createBtn('构建图表(关)','#3deeae','buildEchart')}
</div>`,
        inputDom: `<div class="guide-icon-btn" style="bottom: 63px;width: auto;text-align:left;left: 13px;border-radius: 0;background: rgb(220 241 232);padding: 0 5px;height: 160px;">
    ${utils.createInput("最后买入价格","buyInPriceInput")}
    ${utils.createInput("最后卖出价格","sellOutPriceInput")}
    <br/>
    ${utils.createInput("卖出仓位","sellOutRangeInput")}
    ${utils.createInput("买入仓位","buyInRangeInput")}
    <br/>
    ${utils.createInput("合理卖出价格","sellOutPriceImageInput")}
    ${utils.createInput("卖出盈利点","sellOutPoint")}
    <br/>
    ${utils.createInput("监控最高价格","monitorMaxInput")}
    ${utils.createInput("监控最低价格","monitorMinInput")}
</div>`,
        orderingIntervalId: null,
        ordering: {
            ordering: false,
            isSell: false,
            price: ''
        },
        smaller: 1.012,
        myEchart: null,
        dearDearData: null,
        buyInRange: 1,
        sellOutRange: 1,
        maxValue: 1e8,
        minValue: 0,
        monitorStopTime: 0,
    };
    const Actions = {
        // 切换 检查订单变化情况
        checkOrderingAndShowMessageToggle() {
            if (vars.orderingIntervalId) {
                clearInterval(vars.orderingIntervalId);
                vars.orderingIntervalId = null;
            } else {
                vars.orderingIntervalId = setInterval(function () {
                    var cur = APIS.checkOrdering();
                    // 订单有执行中变成执行完成，则发出消息
                    if (vars.ordering.ordering && !cur.ordering) {
                        APIS.showMessage(
                            `${vars.ordering.isSell ? '卖' : '买'}委托订单成交`,
                            `成交价格为${vars.ordering.price}`);
                    } else {
                        console.log('没有其他事情')
                    }
                    vars.ordering = cur;
                },500);
            }
        },
        toggleRecord() {
            if (vars.recordIntervalId) {
                clearInterval(vars.recordIntervalId);
                vars.recordIntervalId = null;
            } else {
                vars.recordIntervalId = setInterval(() => {
                    let price = APIS.getPirce();
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `http://172.20.109.144:8081/api`,
                        dataType: "json",
                        data:JSON.stringify({Content:`'${price}','${new Date().getTime()}'`,Method:'insert'}),
                        onload: response => {
                            console.log(response)
                            console.log("交易操作提交完成");
                        }
                    });
                    // fetch(`http://172.20.109.144:8081/api`,{
                    //     method: 'post',
                    //     headers: {
                    //         'Content-Type': "application/json;charset=UTF-8"
                    //     },
                    //     body: JSON.stringify({Content:`"'${price}','${new Date().getTime()}'"`,Method:'insert'})
                    // });
                },2000);
            }
        },
        highlight() {
            if (!vars.highlightId) {
                vars.highlightId = setInterval(() => {
                    var trs = jQuery('#app > div > div.trade-panel-box > div.react-grid-layout.layout-xl-box > div:nth-child(4) > div.account-box > div > div > div.okui-tabs-panel-list > div > div > div > table > tbody > tr');
                    trs.css({background: '#93ddff'});
                },5000);
            }
        },
        initCanvas() {
            if (vars.myEchart) {} else {
                jQuery('#headerContainer').css({height: '136px'});
                jQuery('#navContainer > ul').css({display: 'none'});
                let nvc = jQuery('#navContainer');
                nvc.append(jQuery('<div id="myEchart" style="height:136px;width:100%;"></div>'));
                vars.myEchart = echarts.init(nvc.find('#myEchart')[0]);
                vars.dearDearData(vars.myEchart);
                jQuery('.ticker-top-box').append(`<div class="ticker-item"><span class="label">echart 图表价格差</span><span class="value" id="echartPriceDeta"></span></div>`)
            }

        }
    };
    function initOver() {
        // 初始化 dom
        vars.dom = jQuery(vars.dom);
        jQuery('body').append(vars.dom);
        vars.dom.find(`[tar="checkOrderingAndShowMessageToggle"]`).on('click',function () {
            Actions.checkOrderingAndShowMessageToggle();
            vars.dom.find(`[tar="checkOrderingAndShowMessageToggle"]`).html(`提醒委托（${vars.orderingIntervalId ? '开' : '关'}）`);
        })
        vars.dom.find(`[tar="selloutAll"]`).on('click',function () {
            vars.oper = 'man';
            APIS.selloutAll(vars.lastBuyPrice);
        });
        vars.dom.find(`[tar="getHistory"]`).on('click',function () {
            APIS.getSecondData()
                .then(d => {
                    APIS.showMessage(`平均值${d.ret.avg}\r\n可能走势${d.ret.dir}\r\n最大值${d.ret.max}\r\n最小值${d.ret.min}`,"获取历史价格")
                });
        });
        vars.dom.find(`[tar="buyinAll"]`).on('click',function () {
            vars.oper = 'man';
            APIS.buyinAll();
        });
        vars.dom.find(`[tar="autoDear"]`).on('click',function () {
            APIS.autoToSellAndBuy();
            vars.dom.find(`[tar="autoDear"]`).html(`自动交易（${vars.autoSellAndBuyId ? '开' : '关'}）`);
        });
        vars.dom.find(`[tar="autoBuyNew"]`).on('click',function () {
            APIS.buyinAllAsNewestPrice();
        });
        vars.dom.find(`[tar="autoSellNew"]`).on('click',function () {
            APIS.selloutAllAsNewestPrice();
        });
        vars.dom.find(`[tar="toRecord"]`).on('click',function () {
            Actions.toggleRecord();
            vars.dom.find(`[tar="toRecord"]`).html(`记录价格（${vars.recordIntervalId ? '开' : '关'}）`);
        });
        vars.dom.find(`[tar="buildEchart"]`).on('click',function () {
            if (vars.dom.find(`[tar="buildEchart"]`)[0].innerText === "清除") {
                vars.dearDearData(null,true);
            } else {
                Actions.initCanvas();
                vars.dom.find(`[tar="buildEchart"]`).html(`清除`);
            }
        });

        vars.inputDom = jQuery(vars.inputDom);
        jQuery('body').append(vars.inputDom);
        vars.inputDom.find(`[tar="buyInPriceInput"]`).on('change',function () {
            vars.lastBuyPrice = +this.value;
            vars.inputDom.find(`[tar="sellOutPriceImageInput"]`).val(this.value * vars.smaller);
        });
        vars.inputDom.find(`[tar="buyInRangeInput"]`).on('change',function () {
            vars.buyInRange = +this.value;
        });
        vars.inputDom.find(`[tar="sellOutRangeInput"]`).on('change',function () {
            vars.sellOutRange = +this.value;
        });
        vars.inputDom.find(`[tar="sellOutPoint"]`).on('change',function () {
            vars.smaller = +this.value;
        });
        vars.inputDom.find(`[tar="buyInPriceInput"]`).val(vars.lastBuyPrice);
        vars.inputDom.find(`[tar="buyInRangeInput"]`).val(vars.buyInRange);
        vars.inputDom.find(`[tar="sellOutRangeInput"]`).val(vars.sellOutRange);
        vars.inputDom.find(`[tar="sellOutPoint"]`).val(vars.smaller);
        // 初始化 动作
        // Actions.checkOrderingAndShowMessageToggle();

        // 监控最高最低价格
        vars.inputDom.find(`[tar="monitorMaxInput"]`).val(vars.maxValue);
        vars.inputDom.find(`[tar="monitorMinInput"]`).val(vars.minValue);
        vars.inputDom.find(`[tar="monitorMaxInput"]`).on('change',function () {
            vars.maxValue = +this.value;
        });
        vars.inputDom.find(`[tar="monitorMinInput"]`).on('change',function () {
            vars.minValue = +this.value;
        });

        Actions.highlight();
        vars.dearDearData = dearDearDataCreater();
        let id = setInterval(() => {
            if (!vars.monitorStopTime) {
                let p = APIS.getPirce();
                if (p < 0) {
                    return ;
                }
                if (vars.minValue > p) {
                    APIS.showMessage(`已经低于最低价格,当前价格为${p}`,"价格波动提醒",'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAGuSURBVHhe7dtRWoNADEVh2qXU7ah7ra7Htaip6GeVFmZuJgHmnJf2jcnfAE89vH82OPTw8jR+20Zvz6/jN63j+EmVASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASh2OJ0fXf7m0GtsoBiAYgCKASh29PrPWI+Z3WUDQSzv2+znFgZxeb+trp6BIM731+jfSwTEsibfwiBON+UyCWiBeN0tj5uAFohf3XO4C0jzSzQL2PMWLpl90Qb2iLh05sW3cE+IJbMWPQN7QCydsfglsmfEmtmKAa09ItbOVAVo7QlRmaUa0NoDojqDBGhtGdHj7DKgtYdNrM0F0Noaotd53QCtrSB6ntMV0Fo7ovf53AGttSK2OFcTQGttiK3O0wzQWgtiy3M0BbSyEVtfvzmglYUYcd0QQCsaMep6YYBW1FCRP1YoYETRmx4O2HLAaDwrZQNbDJqBZ6XdwlkDe5f6DPRCzPwx0l8i6vDZm5wOaNUiZOMNwzB8AOHIhtO9/dW2AAAAAElFTkSuQmCC',1000);
                    vars.monitorStopTime = 10;
                } else if (vars.maxValue < p) {
                    APIS.showMessage(`已经高于最高价格，当前价格为${p}`,"价格波动提醒",'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAG6SURBVHhe7dtBUsJAEEZh8Aiudaf3P5BL13oFFSotCgmZzD/T3Une25DKZqa/CgVFyPHrp0PSPp9fh6NLj+9vw1GOHobXdI3hnZo6H1VKwDmkTIjpAEtxsiCmAlyKkgExDWAtRjRiCkAVIRIxHLDV8FGIoYCth45ADAPsNaw3Yghg7yE9Ed0BvYbzWscV0Pvt5bGeG6A3ntV7XRfAKDyr5/rdAaPxrF776AqYBc/qsZ9ugNnwrNb76gKYFc9qub/mgNnxrFb7bAq4FjyrxX6bAa4Nz1L3Ld+VWyvcdbV3+6QrcCt4p2pnqQbcEp5VM1MV4BbxrKWzLQbcMp61ZMZFgHvAs0pnLQbcE55VMnMR4B7xrLnZZwH3jGfdM7gLCN6lKYtJQPBuGzMZBQRvumubG0Dw5vtr9A8QvPLM6vfXGPDqOl+B4NV3/Hh6Sfsv/TU0+TWGygJQDEAxAMWaPuq1tk/zFo+NcQWKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAYgCKASgGoBiAUofDNzGEbth6a06CAAAAAElFTkSuQmCC',1000);
                    vars.monitorStopTime = 10;
                }
            } else {
                vars.monitorStopTime--;
            }
        },500);
    }
    setTimeout(function() {
        var script = document.createElement('script');
        script.src = 'https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js';
        document.head.append(script);
        script.onload = initOver();
    },1000);

    window._myfun_ = {
        Actions,
        APIS,
        vars
    };
    // Your code here...
})();