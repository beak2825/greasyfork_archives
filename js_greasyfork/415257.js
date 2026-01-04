// ==UserScript==
// @icon         https://store.steampowered.com/favicon.ico
// @name         网易 buff 增强脚本
// @namespace    out
// @version      0.23
// @description  比例计算 成交量显示 销售价显示
// @author       bluebird
// @match        *://buff.163.com/market/*
// @match        *://buff.163.com/goods/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @connect      steamcommunity.com
// @supportURL   https://steamcommunity.com/id/bluebird2333/

// @downloadURL https://update.greasyfork.org/scripts/415257/%E7%BD%91%E6%98%93%20buff%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415257/%E7%BD%91%E6%98%93%20buff%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const $ = window.jQuery;


(function () {
    'use strict';

    $(document).ready(function () {
        if (window.location.href.match("buff.163.com/goods/.+")) {
            run();
        } else if (window.location.href.match("buff.163.com/market/?.+")) {
            searchFilter()
        }
    });


})();


var volumeNum = 0
var data

function run() {
    let marketUrl = $('div.detail-summ > a').attr("href")
    let detail = $("div.detail-summ")
    detail.prepend("<div><ul class='pricelist' id='infolist'><li id='tradenum' class='yellow'></li></ul></div>")
    detail.prepend("<div class='warn'> <ul id='warnlist'></ul></div>")
    getItemVolume(marketUrl, goodsGetPrice, steamError)
    getPriceData(marketUrl, calc, steamError)
}

function searchShowError() {
    $("#error").html("<h2 style='color:red'>steam网络错误</h2>")
}

function searchFilter() {
    GM_addStyle(` .new-Counter {min-width: 120px;} .fix-input {width: 160px}`);
    $(".l_Layout>.blank20").after('<div class="market-header "><div class="criteria black"><div class="l_Left"> <label>筛选：</label>  \
<div class="w-Counter new-Counter" id="taade_num"> <div class="w-Counter-input w-Counter-input3 fix-input"> 最低交易量<input type="text" class="i_Text" name="min_trade" placeholder="" pattened="true"> </div></div> \
<div class="w-Counter new-Counter" id="radio_num"><div class="w-Counter-input w-Counter-input3 fix-input"> 最低比例<input type="text" class="i_Text" name="min_radio" placeholder="" pattened="true"></div></div> \
<div class="w-Search" id="start"><a href="javascript:;" ></i>开始</a> <div id="error"></div></div> \
</div></div></div>')


    $(document).on("click", "#start", function () {
        console.log("开始过滤")
        let tradeNum = $("input[name=min_trade]")[0].value
        let radioNum = $("input[name=min_radio]")[0].value

        if (!tradeNum && !radioNum) {
            console.log("无过滤数据")
            return
        }

        let arg = window.location.href.replace(/#tab=.+?&/, "&").split("?")[1]
        console.log("开始请求")

        for (var i of $("#j_list_card>>li>a")) {
            let url = i.href
            let delli =  $(i).parents("li")
            let name = i.title
            let price = parseFloat(delli.children("p").children("strong").text().split(" ")[1])
            GM_xmlhttpRequest({
                method: "get",
                url: url,
                responseType: "json",
                timeout: 5000,
                onload: function (result) {
                    if (result.status === 200 && result.responseText !== "null") {
                        let marketUrl = result.responseText.match("(https://steamcommunity.com/market/listings/.+?)\"")[1]
                        console.log(marketUrl)
                        if (!marketUrl) {
                            return
                        }

                        if (tradeNum) {
                            getItemVolume(marketUrl, function (result) {
                                    result = result.response;
                                    if (!result) {
                                        return
                                    }
                                    let volumeNum
                                    if (result.volume) {
                                        volumeNum = parseInt(result.volume.replace(/\, ?/gi, ''))
                                    } else {
                                        volumeNum = 0
                                    }
                                    if (volumeNum < tradeNum) {

                                        delli.remove();

                                    }
                                    console.log(name+"交易量"+volumeNum.toString())
                                }
                                , searchShowError)
                        }
                        if (radioNum) {
                            getPriceData(marketUrl, function (result) {
                                    if (!result.lowest_sell_order) {
                                        return
                                    }
                                    console.log(price)
                                    let sell_min_price = price
                                    let calcLow = calcfee(parseInt(result.lowest_sell_order)) / 100
                                    let lowRatio = (sell_min_price / calcLow).toFixed(2)
                                    console.log(lowRatio)
                                    if (lowRatio > radioNum) {
                                        try {
                                            delli.remove();
                                        } catch {

                                        }
                                        return

                                    }else{

                                    }
                                    console.log(name+"比例"+lowRatio.toString())

                                }, searchShowError
                            )
                        }



                    }


                }
            })

        }

    })
}


function calc(data) {

    console.log(data)
    if (data && data.success) {
        console.log("获取数据成功")
        GM_addStyle(` .detail-cont > div.blank20 { height:5px;}
                                              .detail-summ span { display:none; margin-right:0px; }
                                              ..detail-summ a { float:right }
                                               .pricelist {font-size: 0.9rem; float:left}
                                               .red {color:red}
                                               .warn {font-size: 0.75rem;float:right}
                                                .yellow {color:yellow}
                                           `);

        if (!data.lowest_sell_order && !data.highest_buy_order) {
            return;
        }

        console.log("开始获取buff价格")
        let siteprice = getFloat($("table a.i_Btn:first").attr('data-price'));
        if (!siteprice) {
            siteprice = getFloat($("table strong.f_Strong:first").text() + $("table strong.f_Strong:first small").text());
        }
        if (!siteprice) {
            return
        }

        let lowest = 0
        let highest = 0
        let calcLow = 0
        let calcHigh = 0
        let lowRatio = 0
        let highRatio = 0

        if (data.highest_buy_order) {
            console.log("开始计算收购比例")
            highest = parseInt(data.highest_buy_order) / 100
            calcHigh = calcfee(parseInt(data.highest_buy_order)) / 100
            highRatio = (siteprice / calcHigh).toFixed(2)
            $("#infolist").append("<li  class='yellow'>最高收购价格" + highest.toString() + "        比例:<strong>" + highRatio.toString() + "</strong></li>")

        }
        if (data.lowest_sell_order) {
            console.log("开始计算销售比例")
            lowest = parseInt(data.lowest_sell_order) / 100
            calcLow = calcfee(parseInt(data.lowest_sell_order)) / 100
            lowRatio = (siteprice / calcLow).toFixed(2)
            $("#infolist").append("<li class='yellow'>最低出售价格" + lowest.toString() + "       比例:<strong>" + lowRatio.toString() + "</strong></li>")

        }
        console.log("开始计算稳定价格和价格区间数量")
        let priceRange = (siteprice / 20).toFixed(2)
        let buyPriceMap = {1: 0, 2: 0}
        let stableBuyPrice = 0
        let buy_order_graph = data.buy_order_graph
        var tmp = 0
        for (let i = 0; i < buy_order_graph.length; i++) {
            let spread = highest - buy_order_graph[i][0]
            let itemNum = buy_order_graph[i][1]
            let rangeNum = Math.trunc(spread / priceRange) + 1
            if (rangeNum > 3) {
                break
            }
            buyPriceMap[rangeNum] += (itemNum - tmp)
            if ((itemNum - tmp) >= 5 & stableBuyPrice === 0) {
                stableBuyPrice = buy_order_graph[i][0]
            }
            tmp = itemNum

        }
        if (stableBuyPrice != 0) {
            $("#infolist").append("<li>最高稳定收购价格:" + stableBuyPrice.toString() + " 比例:<strong>" + (siteprice * 100 / calcfee(stableBuyPrice * 100)).toFixed(2) + "</strong></li>")
        }
        let sellPriceMap = {1: 0, 2: 0}
        let stableSellPrice = 0
        let sell_order_graph = data.sell_order_graph
        tmp = 0
        for (let i = 0; i < sell_order_graph.length; i++) {
            let spread = sell_order_graph[i][0] - lowest
            let itemNum = sell_order_graph[i][1]
            let rangeNum = Math.trunc(spread / priceRange) + 1
            if (rangeNum > 3) {
                break
            }
            sellPriceMap[rangeNum] += (itemNum - tmp)
            if ((itemNum - tmp) >= 5 & stableSellPrice === 0) {
                stableSellPrice = sell_order_graph[i][0]
            }
            tmp = itemNum

        }
        if (stableSellPrice != 0) {
            $("#infolist").append("<li>最低稳定出售价格:" + stableSellPrice.toString() + " 比例:<strong>" + (siteprice * 100 / calcfee(stableSellPrice * 100)).toFixed(2) + "</strong></li>")
        }


        if (highRatio > 0.8) {
            // info = info + "<li class='red'>比例过低</li>"
            $("#warnlist").append("<li class='red'>比例过低</li>")
        }


        if (buy_order_graph.length !== 0 && buyPriceMap[1] < 5) {
            $("#warnlist").append("<li class='red'>目前最高收购价格区间(5%)仅有" + buyPriceMap[1].toString() + "件请谨慎购买</li>")
        }

        if (sell_order_graph.length !== 0 && sellPriceMap[1] < 5) {
            $("#warnlist").append("<li class='red'>目前最低出售价格区间(5%)仅有" + sellPriceMap[1].toString() + "件请谨慎购买</li>")
        }


    }


}


function getItemVolume(marketUrl, onLoad, onError) {
    let oriLink = marketUrl.split('/');
    let appid = oriLink[oriLink.length - 2];
    oriLink = oriLink[oriLink.length - 1];
    GM_xmlhttpRequest({
        method: "get",
        url: `https://steamcommunity.com/market/priceoverview/?appid=${appid}&market_hash_name=${oriLink}`,
        responseType: "json",
        timeout: 5000,
        onload: onLoad,
        ontimeout: onError,
        onerror: onError
    });
}

function goodsGetPrice(result) {
    if (result.status !== 200){
       $("#tradenum").attr("class","red")
       if(result.status === 429){
         $("#tradenum").html("api请求过多造成限制 推荐换个加速器或梯子")
       }else{
         $("#tradenum").html("请求销售量发生网络错误 错误码"+result.status)
       }
       return
    }
    result = result.response;
    if (result.volume) {
        volumeNum = parseInt(result.volume.replace(/\, ?/gi, ''))
    } else {
        volumeNum = 0
    }
    $("#tradenum").html("24小时出售量 :<strong>" + volumeNum.toString() + "</strong>")
    if (volumeNum < 100) {
        $("#warnlist").append("<li class='red'>每日销售量过低请谨慎购买</li>")
    }

}


function getPriceData(marketUrl, precess, onError) {
    GM_xmlhttpRequest({
            method: "GET",
            url: marketUrl,
            timeout: 5000,
            onload: function (res) {
                console.log("req ok ")
                if (res.status === 200 && res.responseText !== "null") {
                    console.log("req  status ok ")
                    var g_sessionID
                    var g_strCountryCode
                    var g_strLanguage
                    var g_walletCurrency

                    try{
                        g_sessionID = res.responseText.match(/g_sessionID = "([^"]+)"/)[1];
                        g_walletCurrency = parseInt(res.responseText.match(/"wallet_currency":(\d+)/)[1]);
                        g_strLanguage = res.responseText.match(/g_strLanguage = "([^"]+)"/)[1];
                        g_strCountryCode = res.responseText.match(/g_strCountryCode = "([^"]+)"/)[1];
                    }
                    catch(err){
                        g_strCountryCode = "CN"
                        g_strLanguage = "schinese";
                        g_walletCurrency = 23
                    }
                    try {
                        var nameid = res.responseText.match(/Market_LoadOrderSpread\( (\d+)/)[1];
                    } catch (err) {
                        if (res.responseText.indexOf('market_listing_nav_container') != -1) {
                            // steamxj();
                            return;
                        }
                    }
                    GM_xmlhttpRequest({
                            timeout: 5000,
                            method: "GET",
                            url: "https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=" + nameid,
                            responseType: "json",
                            onload: function (data) {
                                var obj = data.response;
                                data = obj
                                precess(data)
                            }
                        }
                    )
                }

            },
            ontimeout: onError,
            onerror: onError
        }
    )
}

function steamError() {
    $("div.detail-summ").append("<h1>无法获取steam市场数据 可能是请求频率过高或无法连接steam</h1>");
}


function calcfee(price) {
    let p = Math.round(price)
    var pnofee = Math.max(Math.floor(p / 1.15), 1);
    var vfee = Math.max(Math.floor(pnofee * 0.1), 1);
    var pfee = Math.max(Math.floor(pnofee * 0.05), 1);
    while ((pnofee + vfee + pfee) != p) {
        if ((pnofee + vfee + pfee) > p) {
            pnofee--;
        }
        if ((pnofee + vfee + pfee) < p) {
            pnofee++;
        }
        vfee = Math.max(Math.floor(pnofee * 0.1), 1);
        pfee = Math.max(Math.floor(pnofee * 0.05), 1);
    }
    return pnofee;
}


function getFloat(str) {
    try {
        var f = parseFloat(str.match(/[\d]{1,}(\.\d+)?/)[0]);
    } catch (err) {
        return 0;
    }
    return f;

}