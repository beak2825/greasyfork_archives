// ==UserScript==
// @name         饰品套现比例计算脚本byXM
// @namespace    out
// @version      1.1
// @description  XM
// @author       out
// @icon      	https://store.steampowered.com/favicon.ico
// @match        *://www.c5game.com/*
// @match        *://buff.163.com/*
// @match        *://www.igxe.cn/product/*
// @match        *://www.v5fox.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @connect      steamcommunity.com
// @supportURL   https://jq.qq.com/?_wv=1027&k=7K7xX60t

// @downloadURL https://update.greasyfork.org/scripts/427630/%E9%A5%B0%E5%93%81%E5%A5%97%E7%8E%B0%E6%AF%94%E4%BE%8B%E8%AE%A1%E7%AE%97%E8%84%9A%E6%9C%ACbyXM.user.js
// @updateURL https://update.greasyfork.org/scripts/427630/%E9%A5%B0%E5%93%81%E5%A5%97%E7%8E%B0%E6%AF%94%E4%BE%8B%E8%AE%A1%E7%AE%97%E8%84%9A%E6%9C%ACbyXM.meta.js
// ==/UserScript==
const $ = window.jQuery;
var site;
var low;
var high;
(function() {
    'use strict';

    // Your code here...
    $(document).ready(function(){
        start(query);
    });
})();
function start(){
    var name,appid;
    if($(".steamUrl").length!== 0){
        site = "c5";
        query($(".steamUrl a").attr("href"));
    }else if($('div.detail-summ > a').length !== 0){
        site = "buff";
        query($('div.detail-summ > a').attr("href"));
    }else if($('div.productInfo').length !== 0){
        name = $('.productInfo .name').text();
        appid = window.location.href.match(/product\/(\d+)/)[1];
        site = "ig";
        getItemUrl(appid,name);
    }else if($('div.goods-details-r').length !==0){
        site="v5";
        name = $('.goods-details-r .l:first em').text();
        switch($('.crumbs a:last').attr('href')){
            case "/dota2":
                appid=570;
                break;
            case "/h1z1/kotk":
                appid=433850;
                break;
            case "/csgo":
                appid=730;
                break
        }

        if(appid && name){
            getItemUrl(appid,name);
        }
    }
}

function getItemUrl(appid,name){
    GM_xmlhttpRequest({
        method: "GET",
        responseType: "json",
        url: "https://steamcommunity.com/market/search/render/?count=1&q=&appid=" + appid + "&norender=1&query=" + name,
        timeout:5000,
        onload: function(res){
            if(res&&res.response){
                var response = res.response;
                if(response.success && response.results.length > 0){
                    query("https://steamcommunity.com/market/listings/" + appid + "/" + response.results[0].hash_name);
                }
            }
        }
    });
}

function query(itemUrl){
    GM_xmlhttpRequest({
        method: "GET",
        url: itemUrl,
        timeout:5000,
        onload: function(res){
            if(res.status == "200" &&res.responseText!=="null"){
                try{
                    var g_sessionID = res.responseText.match(/g_sessionID = "([^"]+)"/)[1];
                    var g_walletCurrency = parseInt(res.responseText.match(/"wallet_currency":(\d+)/)[1]);
                    var g_strLanguage = res.responseText.match(/g_strLanguage = "([^"]+)"/)[1];
                    var g_strCountryCode = res.responseText.match(/g_strCountryCode = "([^"]+)"/)[1];
                }
                catch(err){
                    steamlogin();
                    return;
                }

                try{
                    var nameid = res.responseText.match(/Market_LoadOrderSpread\( (\d+)/)[1];
                }
                catch(err){
                    if(res.responseText.indexOf('market_listing_nav_container') != -1){
                        steamxj();
                        return;
                    }
                }

                GM_xmlhttpRequest({
                    timeout:5000,
                    method: "GET",
                    url: "https://steamcommunity.com/market/itemordershistogram?country=" + g_strCountryCode + "&language=" + g_strLanguage + "&currency=23&item_nameid=" + nameid,
                    responseType: "json",
                    onload: function(data){
                        var obj = data.response;
                        if(obj){
                            if(!obj.lowest_sell_order&&!obj.highest_buy_order){
                                return;
                            }

                            GM_addStyle(`.price > div{ margin-top:4px;font-size:16px; }
                                        .ls, .hb {color:#e46409; }
                                        .lsnf, .hbnf {color:#7ccc35; }
                                        .lsr, .hbr {color:#1ee44a; }
                                        .price > div > span{ text-align:center;display:-moz-inline-box; display:inline-block; width:90px;}
                                        .title { font-size:14px; }
                                        .title > strong:nth-child(1) { margin-left:80px; }
                                        .title > strong:nth-child(2) { margin-left:60px; }
                                        .afkout { float:left;width:280px; }
                                        .afkout strong { color:#afb0b2;font-size: 15px}
                                       `);

                            var $pinfo = $(`<div class="afkout">
                                            <div class="title">
                                            <strong>出售</strong><strong>求购</strong>
                                            </div>
                                            <div class="price">
                                            <div><strong>ST价格：</strong><span class="ls"></span><span class="hb"></span></div>
                                            <div><strong>套现比：</strong><span class="lsr"></span><span class="hbr"></span></div>
                                            </div></div>
                                         `);

                            if(site=="c5"){
                                GM_addStyle(` .hero .ft-orange{ display:none }
                                              .hero { position:unset !important; margin:0px }
                                              .name > span:first-child { width:fit-content !important; display: inline-block !important;}
                                              .afkout { margin-top:5px; }
                                           `);
                                $(".hero").before($pinfo);
                            }else if(site=="buff"){
                                GM_addStyle(` .detail-cont > div.blank20 { height:5px;}
                                              .detail-summ span { display:none; margin-right:0px; }
                                              ..detail-summ a { float:right }
                                           `);
                                $("div.detail-summ").prepend($pinfo);
                                $(".buying, .selling, .history").click(calcratio);
                            }else if(site=="ig"){
                                GM_addStyle(` .proposedPrice, .averagePrice { display:none }
                                              .bnts { float:left;margin-top:0px }
                                              .steamUrl a { color:#0b84d3; font-size:16px }
                                              .afkout, .steamUrl, .rarity { margin-top:15px; }
                                           `);
                                $("div.rarity:last").after($pinfo);
                                $('.productInfo .name').after($('<div class="steamUrl"><a target="_blank">steam市场链接</a></div>'));
                                $(".steamUrl a").attr("href",itemUrl);
                            }else if(site=="v5"){
                                GM_addStyle(` .goods-details-r h4, .goods-details-r h5 { display:none }
                                              .steamUrl a { color:#0b84d3; font-size:16px ;float:right }
                                           `);
                                $('.goods-details-r .clearfix').after($('<div class="steamUrl"><a target="_blank">steam市场链接</a></div>')).after($pinfo);
                                $(".steamUrl a").attr("href",itemUrl);
                            }

                            if(obj.lowest_sell_order){
                                var lowest_sell_order = parseInt(obj.lowest_sell_order);
                                $("span.ls").text(obj.price_prefix + " " + lowest_sell_order/100);
                                var lsnofee = calcfee(lowest_sell_order);
                                $("span.lsnf").text(obj.price_prefix + " " + lsnofee/100);
                            }

                            if(obj.highest_buy_order){
                                var highest_buy_order = parseInt(obj.highest_buy_order);
                                $("span.hb").text(obj.price_prefix + " " + highest_buy_order/100);
                                var hbnofee = calcfee(highest_buy_order);
                                $("span.hbnf").text(obj.price_prefix + " " + hbnofee/100);
                            }

                            if(GM_getValue("version","0") != GM_info.script.version) {
                                GM_setValue("version",GM_info.script.version);
                                var details = {text: "如果有用请帮忙加点体力(点这里)\r\n提交BUG请附上console输出",
                                               title: "C5比例脚本",
                                               image: "data:image/png;base64,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",
                                               highlight: true,
                                               timeout: 10000,
                                              }
                                GM_notification(details,function(){ GM_openInTab("https://steamcn.com/t331397-1-1", { active: true }); });
                            }
                            low = lsnofee;
                            high = hbnofee;
                            calcratio();
                        }
                    },
                    ontimeout:steam302,
                    onerror: steam302
                });
            }
        },
        ontimeout:steam302,
        onerror: steam302
    });
}

function steam302(){
    var $302 = $('<div style="color:#FF0000;margin-top:15px"><span class="glyphicon glyphicon-remove"></span><strong>查询超时，请开加速器,建议使用<a target="_blank" href="https://steamcn.com/t339527-1-1" style="color:#0b84d3">Steam302</a></strong></div>');
    if(site=="c5"){
        $("div.hero").before($302);
    }else if(site=="buff"){
        $("div.detail-summ").append($302);
    }else if(site=="ig"){
        $("div.stock").after($302);
    }else if(site=="v5"){
        $('.goods-details-r .clearfix').after($302);
    }
}

function steamlogin(){
    var $login = $('<div style="color:#FF0000;margin-top:15px"><strong>请登录<a target="_blank" href="https://steamcommunity.com/login/" style="color:#0b84d3">steam社区</a></strong></div>');
    if(site=="c5"){
        $("div.hero").before($login);
    }else if(site=="buff"){
        $("div.detail-summ").append($login);
    }else if(site=="ig"){
        $("div.stock").after($login);
    }else if(site=="v5"){
        $('.goods-details-r .clearfix').after($login);
    }
}

function steamxj(){
    var $xj = $('<div style="color:#FF0000;margin-top:15px"><strong>物品不在货架上</strong></div>');
    if(site=="c5"){
        $("div.hero").before($xj);
    }else if(site=="buff"){
        $("div.detail-summ").append($xj);
    }else if(site=="ig"){
        $("div.stock").after($xj);
    }else if(site=="v5"){
        $('.goods-details-r .clearfix').after($xj);
    }
}

function getFloat(str){
    try{
        var f = parseFloat(str.match(/[\d]{1,}(\.\d+)?/)[0]);
    }
    catch(err){
        return 0;
    }
    return f;
}

function calcfee(p){
    var pnofee = Math.max(Math.floor(p/1.15),1);
    var vfee = Math.max(Math.floor(pnofee*0.1),1);
    var pfee = Math.max(Math.floor(pnofee*0.05),1);
    while((pnofee + vfee + pfee) != p) {
        if((pnofee + vfee + pfee) > p) {
            pnofee--;
        }
        if((pnofee + vfee + pfee) < p) {
            pnofee++;
        }
        vfee = Math.max(Math.floor(pnofee*0.1),1);
        pfee = Math.max(Math.floor(pnofee*0.05),1);
    }
    return pnofee;
}

function calcratio(){
    var t = setInterval(function(){
        var siteprice;
        if(site == "c5"){
            siteprice = siteprice = getFloat($("tbody .ft-orange:first span").text());
            if(!siteprice){
                siteprice = getFloat($("tbody .ft-orange:first").text());
            }

            if(!siteprice){
                siteprice = getFloat($(".sale-item-lists span.ft-gold:first").text());
            }
        } else if(site == "buff"){
            siteprice = getFloat($("table a.i_Btn:first").attr('data-price'));
            if(!siteprice){
                siteprice = getFloat($("table strong.f_Strong:first").text() + $("table strong.f_Strong:first small").text());
            }
        } else if(site == "ig"){
            siteprice = getFloat($("td > span.c-4:first").text());
        } else if(site == "v5"){
            siteprice = getFloat($("p.list-pri:first").text());
        }

        if(siteprice != 0){
            if(low) {
                $("span.lsr").text((siteprice*84.78/low).toFixed(2));
            }
            if(high) {
                $("span.hbr").text((siteprice*84.78/high).toFixed(2));
            }
            clearInterval(t);
        }
    },200);
}