// ==UserScript==
// @name                隐含汇率测算-WSCN
// @namespace           Violentmonkey Scripts
// @match               http*://*/balcony/exchange_rate/index.html
// @grant               GM_xmlhttpRequest
// @connect             awtmt.com
// @require             https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/echarts/5.3.0-rc.1/echarts.min.js
// @version             1.2
// @license             MIT
// @author              uxnil
// @description         2024/3/27 23:29:58
// @downloadURL https://update.greasyfork.org/scripts/491088/%E9%9A%90%E5%90%AB%E6%B1%87%E7%8E%87%E6%B5%8B%E7%AE%97-WSCN.user.js
// @updateURL https://update.greasyfork.org/scripts/491088/%E9%9A%90%E5%90%AB%E6%B1%87%E7%8E%87%E6%B5%8B%E7%AE%97-WSCN.meta.js
// ==/UserScript==

const getCurrentTime = () => {
    var date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const now = `${year}${month}${day}`;
    return now;
};

const timestampToTime = (timestamp) => {
    timestamp = timestamp ? timestamp : null;
    let date = new Date(timestamp*1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + "-";
    let M =
        (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
    let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
     //return Y + M + D + h + m + s;
    return Y + M + D;
};

function getPrices() {
    let ids = ["USDCNY.OTC,USDCNH.OTC,XAUUSD.OTC,AUTD.SGE"];
    let date_range = 250;
    // let endDate = getCurrentTime();
    // let startDate = endDate - 10000;
    console.log(ids, date_range);
    let promiseArray = [];
    for (let i = 0, len = ids.length; i < len; i++) {
        let id = ids[i];
        if (!id.trim()) {
            continue;
        }
        let ts = Date.now();
        let url = `https://api-ddc-wscn.awtmt.com/market/kline?prod_code=USDCNY.OTC,USDCNH.OTC,XAUUSD.OTC,AUTD.SGE&tick_count=${date_range}&period_type=86400&adjust_price_type=forward&fields=tick_at,close_px`;
        console.log(url);
        promiseArray.push(
            new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { "Content-Type": "application/json;charset=UTF-8" },
                    onload: function (response) {
                        const txt = response.responseText;
                        if (txt.length > 10 && response.status === 200) {
                            var jtxt = JSON.parse(txt);
                            let small_json = jtxt.data;
                            let res = small_json;
                            resolve(res);
                        } else {
                            resolve(0);
                        }
                    },
                    onerror: function (response) {
                        reject("请求失败");
                    },
                });
            })
        );
    }
    Promise.all(promiseArray)
        .then(function (res) {
            let nres = {};
            let dts = {};
            ids = ["USDCNY.OTC","USDCNH.OTC","XAUUSD.OTC","AUTD.SGE"];
            for (let i = 0, len = ids.length; i < len; i++) {
                let id = ids[i];
                nres[id] = {};
                let kls = res[0]["candle"][id].lines;
                for (let j = 0; j < kls.length; j++) {
                    let kl = kls[j];
                    let ts = timestampToTime(kl[1]);
                    let price = kl[0];
                    nres[id][ts] = price;
                    if (dts[ts] == undefined) {
                        dts[ts] = 1;
                    } else {
                        dts[ts] += 1;
                    }
                }
            }
            let ts = [];
            for (let key in dts) {
                if (dts[key] === 4) {
                    // 确保是对象自有属性，不是原型链上的属性
                    ts.push(key);
                }
            }
            ts.sort();
            let datas = [];
            let yminmax = [];
            for (let i = 0; i < ts.length; i++) {
                let fresk = {};
                fresk["tradedate"] = ts[i];
                fresk["离岸人民币汇率"] = nres["USDCNH.OTC"][ts[i]];
                fresk["在岸人民币汇率"] = nres["USDCNY.OTC"][ts[i]];
                fresk["金价隐含人民币汇率"] = (
                    (nres["AUTD.SGE"][ts[i]] / nres["XAUUSD.OTC"][ts[i]]) *
                    31.1034768
                ).toFixed(4);
                yminmax.push(
                    fresk["离岸人民币汇率"],
                    fresk["在岸人民币汇率"],
                    fresk["金价隐含人民币汇率"]
                );
                datas.push(fresk);
            }
            var myChart = echarts.init(document.getElementById("main"));
            const dimensions_name = [];
            for (var key in datas[0]) {
                dimensions_name.push(key);
            }
            const series_name = Array(dimensions_name.length - 1).fill({
                type: "line",
            });
            var option = {
                legend: {},
                tooltip: {
                    trigger: 'item', // 触发类型： 'item' | 'axis'
                    axisPointer: {
                        type: 'cross' // 指示器类型： 'line' | 'shadow' | 'cross'
                    }
                },
                dataset: {
                    dimensions: dimensions_name,
                    source: datas,
                },
                xAxis: {
                    type: "category",
                },
                yAxis: {
                    type: "value",
                    min: (Math.floor(Math.min(...yminmax) * 10) / 10).toFixed(1), // 设置Y轴的最小值
                    max: (Math.ceil(Math.max(...yminmax) * 10) / 10).toFixed(1), // 设置Y轴的最大值
                },
                series: series_name,
            };
            myChart.setOption(option);
        })
        .catch(function (reason) {
            console.log(reason);
        })
}

(function () {
    getPrices();
})();
