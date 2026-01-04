// ==UserScript==
// @name         CSM比例脚本
// @namespace    hlw
// @version      2.1
// @description  买
// @author       hlw
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
// @connect      cs.money
// @connect      wiki.cs.money


// @downloadURL https://update.greasyfork.org/scripts/412651/CSM%E6%AF%94%E4%BE%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/412651/CSM%E6%AF%94%E4%BE%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
const $ = window.jQuery;
var site;
var steamLow;
var steamHigh;
var low;
var high;
var csmPrize;
var wikiPrize;
var st_cnt;
var st_type;
var exchangeRate = 7.24; // 汇率
var steamCardRate = 0.78;
var CsmRate = 6.65;
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
        timeout:15000,
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
    var g_name,g_st;
    let hash_name = "";
   for(var i = itemUrl.length; i >= 0; i -- )
   {

       if(itemUrl[i] == "/") {hash_name = itemUrl.substring(i + 1, itemUrl.length);break;}
       
   }

    console.log(hash_name);
    GM_xmlhttpRequest({
                                method: "GET",
                                responseType: "json",
                                url: "https://old.cs.money/check_skin_status?market_hash_name="+ hash_name+"&appid=730",
                                timeout:10000,
                                onload: function(res){
                                    if(res&&res.response){
                                        var response = res.response;
                                        st_cnt = response.overstock_difference;
                                        st_type = response.type;
                                        console.log("cnt:"+st_cnt)

                                    }
                                }
                            });
    console.log(decodeURI(hash_name))
    GM_xmlhttpRequest({
                                method: "POST",
                                url: "https://wiki.cs.money/graphql",
                                responseType: "json",
                                headers:{
                                    "Content-Type": "application/json"
                                },
                                data:JSON.stringify({
                                   // "operationName": "price_on_cs_money",
                                    "query":"query ($names: [String!]!) {\n  prices_on_cs_money_for_csgo(input: {names: $names}) {\n    buy\n    float\n    name\n    price\n  }\n}\n",
                                    "variables": {
                                        "names": [
                                            decodeURI(hash_name)+""
                                        ]
                                    },
                                    //"query":"query price_on_cs_money($names: [String!]!) {\n  price_on_cs_money(input: {names: $names}) {\n    name\n    price\n    float\n  }\n}\n"


                                }),
                                timeout:10000,
                                onload: function(res1){
                                    var res = res1.response;
                                    console.log(res);
                                    if(res.data.prices_on_cs_money_for_csgo.length > 0) csmPrize = res.data.prices_on_cs_money_for_csgo[0].price;
                                    else csmPrize = 0
                                    console.log("CSM:"+ csmPrize)
                                    high = csmPrize * exchangeRate;
                                    calcratio();


                                },
                                onerror:function(err){
                                    console.log(err.status);
                                }
                            });
                            //查询wiki价格
    format(hash_name);
    GM_addStyle(`.price > div{ margin-top:-4px;font-size:12px; }
                                        .ls, .hb {color:#e46409; }
                                        .lsnf, .hbnf {color:#1ee44a; }
                                        .shou, .yi {color:#1ee44a; }
                                        .lsr, .hbr {color:#7ccc35; }
                                        .dao, .huo {color:#7ccc35; }
                                        .price > div > span{ text-align:center;display:-moz-inline-box; display:inline-block; width:90px;}
                                        .title { font-size:10px; }
                                        .title > strong:nth-child(1) { margin-left:80px; }
                                        .title > strong:nth-child(2) { margin-left:60px; }
                                        .afkout { float:left;width:280px; }
                                        .afkout strong { color:#afb0b2;font-size: 10px}
                                       `);

                            var $pinfo = $(`<div class="afkout">
                                            <div class="title">
                                            <strong>出售</strong><strong>求购</strong>
                                            </div>
                                            <div class="price">
                                            <div><strong>价格(元)：</strong><span class="ls"></span><span class="hb"></span></div>
                                            <div><strong>收益(%)：</strong><span class="shou"></span><span class="yi"></span></div>
                                            <div><strong>收益(元)：</strong><span class="dao"></span><span class="huo"></span></div>
                                            <div><strong>状态(个)：</strong><span class="lsr"></span><span class="hbr"></span></div>
                                            <div><strong>底价(元)：</strong><span class="steamPriceHigh"></span><span class="steamPriceLow"></span></div>
                                            <div><strong>挂刀(%)：</strong><span class="steamSellLow"></span><span class="steamSellHigh"></span></div>
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
                                GM_addStyle(` .detail-cont > div.blank20 { height:0px;}
                                              .detail-summ span { display:none; margin-right:10px; }
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
    GM_xmlhttpRequest({
        method: "GET",
        url: itemUrl,
        timeout:15000,
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
                    timeout:10000,
                    method: "GET",
                    url: "https://steamcommunity.com/market/itemordershistogram?country=" + g_strCountryCode + "&language=" + g_strLanguage + "&currency=" + g_walletCurrency + "&item_nameid=" + nameid,
                    responseType: "json",
                    onload: function(data){
                        var obj = data.response;
                        if(obj){
                            if(!obj.lowest_sell_order&&!obj.highest_buy_order){
                                return;
                            }
                            //console.log(obj);
                            

                            //查询csmoney上的价格
                            
                            
                            
                           if(obj.lowest_sell_order){
                                var lowest_sell_order = parseInt(obj.lowest_sell_order);
                                $("span.steamPriceHigh").text(obj.price_prefix + " " + lowest_sell_order/100);
                               //
                                //var lsnofee = calcfee(lowest_sell_order);
                               var lsnofee = lowest_sell_order;
                                $("span.lsnf").text(obj.price_prefix + " " + lsnofee/100);
                            }

                            if(obj.highest_buy_order){
                                var highest_buy_order = parseInt(obj.highest_buy_order);
                                $("span.steamPriceLow").text(obj.price_prefix + " " + highest_buy_order/100);
                                //
                                //var hbnofee = calcfee(highest_buy_order);
                                var hbnofee = highest_buy_order;
                                $("span.hbnf").text(obj.price_prefix + " " + hbnofee/100);
                            }
                           steamLow = lsnofee;
                           steamHigh = hbnofee;

                            //calcratio();
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
function format(str)
    {
        let hash_name = str;
        let reg1 = new RegExp(/Sticker/,"g");
        let reg2 = new RegExp(/\)\s\|\s|\s\|\s|\s\(|\s/,"g")   // " ) | "," | "," ("," "
        let reg3 = new RegExp(/★\sStatTrak™\s|StatTrak™\s|★\s|Souvenir\s/,"g")
        //贴纸
        if(reg1.test(str))
        {
            str = decodeURI(str);
            console.log(str);
            str = str.replace(reg2,"-").replace(")","");
            console.log(str);
            str =  str.toLowerCase();
            console.log("WIKI接口名字（贴纸）："+str);
             GM_xmlhttpRequest({
                                 method: "POST",
                                 url: "https://wiki.cs.money/graphql",
                                 responseType: "json",
                                 headers:{
                                     "Content-Type": "application/json"
                                 },
                                 data:JSON.stringify({"operationName":"sticker","variables":{"id":str},"query":"query sticker($id: ID!) {\n  sticker(id: $id) {\n    price_trader_log {\n      name\n      values {\n        price_trader_new\n        time\n      }\n    }\n  }\n}\n"}),
                                 timeout:10000,
                                 onload: function(res1){
                                     var res = res1.response;
                                     var t ;
                                     for(var i = 0;i < res.data.sticker.price_trader_log.length;i ++)
                                     {
                                         if(res.data.sticker.price_trader_log[i].name == decodeURI(hash_name))
                                         {
                                             let len = res.data.sticker.price_trader_log[i].values.length
                                             t = res.data.sticker.price_trader_log[i].values[len - 1].price_trader_new;
                                             console.log("success");
                                         }

                                     }
                                     console.log("WIKI" + t);
                                     low = t * exchangeRate;
                                     calcratio();
                                 },
                                 onerror:function(err){
                                     console.log(err.status);
                                 }
                             });
        }
        else{
            let hashName = decodeURI(str);
            str = decodeURI(str);
            str = str.replace(reg3,"");
            for(let i = str.length; i >= 0; i--)
            {
                if(str[i] =="(")
                {
                    str = str.substring(0, i - 1);
                    break;
                }
            }
            let urlStr = str.split(" | "); // 这个是获取 url 的格式，
            console.log(urlStr)
            urlStr[0] = urlStr[0].replace(/\s/g,"-").replace("\'","").toLowerCase();
            urlStr[1] = urlStr[1].replace(/\s/g,"-").replace("\'","").toLowerCase();
            urlStr[2] = "/";
            let url;

            console.log(urlStr);
            str = str.replace(reg2,"-").replace("\'","").toLowerCase();
            console.log("WIKI接口名字（武器）："+str);
            if(urlStr[0].match(/glove|hand-wraps/) != null){
                url = "https://wiki.cs.money/gloves/" + str
            }
            else{
                url = "https://wiki.cs.money/weapons/" + urlStr[0] + urlStr[2] + urlStr[1];
            }
            GM_xmlhttpRequest({
                                 method: "GET",
                                 url: url,
                                 responseType: "html",
                onload: function(res1){
                                       let el = document.createElement('html');
                                      el.innerHTML = res1.responseText;
                                       let a  = el.getElementsByTagName( 'script' );
                                        let temp;
                                         //console.log(res1.responseText)
                                      for(let i = 0; i < a.length ; i ++){
                                            if($(a[i]).attr("id") == "__NEXT_DATA__"){
                                                temp = JSON.parse(a[i].innerHTML);
                                            }
                                        }

                                       temp = temp["props"]["pageProps"]["apolloState"]["ROOT_QUERY"]['skin({"input":{"id":"' + str + '"}})'].name_ids;
                    console.log(temp);
                    let itemId;
                    for(let i = 0; i < temp.length; i++ ){if(temp[i].name == hashName) {itemId = temp[i].name_id}}
                    console.log(itemId);
                    GM_xmlhttpRequest({
                                 method: "POST",
                                 url: "https://wiki.cs.money/graphql",
                                 responseType: "json",
                                 headers:{
                                     "Content-Type": "application/json"
                                 },

                 data:JSON.stringify({
                                        "operationName": "price_trader_log",
                                        "variables": {
                                                      "name_ids": [
                                                        itemId
                                                                ]
                                                         },
                                            "query": "query price_trader_log($name_ids: [Int!]!) {\n price_trader_log(input: {name_ids: $name_ids}) {\n name_id \n values {\n price_trader_new\n time\n }\n }\n}\n"}),

                                 timeout:10000,
                                 onload: function(res1){

                                     var res = res1.response;
                                     let len = res.data.price_trader_log[0].values.length
                                     console.log(res.data.price_trader_log[0].values[len - 1].price_trader_new)
                                     var t ;
                                     t = res.data.price_trader_log[0].values[len - 1].price_trader_new;
                                     console.log("WIKI " + t);
                                     low = t * exchangeRate;
                                     calcratio();
                                 },
                                 onerror:function(err){
                                     console.log(err.status);
                                 }
                             });

                                      }
            })
            /*
             GM_xmlhttpRequest({
                                 method: "POST",
                                 url: "https://wiki.cs.money/graphql",
                                 responseType: "json",
                                 headers:{
                                     "Content-Type": "application/json"
                                 },

                 data:JSON.stringify({
                                        "operationName": "price_trader_log",
                                        "variables": {
                                                      "name_ids": [
                                                        14390
                                                                ]
                                                         },
                                            "query": "query price_trader_log($name_ids: [Int!]!) {\n price_trader_log(input: {name_ids: $name_ids}) {\n name_id \n values {\n price_trader_new\n time\n }\n }\n}\n"}),

                                 timeout:10000,
                                 onload: function(res1){

                                     var res = res1.response;
                                     console.log(res)
                                     var t ;
                                     for(var i = 0;i < res.data.price_trader_log.length;i ++)
                                     {
                                         if(res.data.price_trader_log[i].name == decodeURI(hash_name))
                                         {
                                             t = res.data.skin.price_trader_log[i].values[0].price_trader_new;
                                              
                                         }

                                     }
                                     console.log("WIKI" + t);

                                     low = t * exchangeRate;
                                     calcratio();
                                 },
                                 onerror:function(err){
                                     console.log(err.status);
                                 }
                             });
                          */
        }
    }

function steam302(){
    var $302 = $('<div style="color:#FF0000;margin-top:15px"><span class="glyphicon glyphicon-remove"></span><strong>查询超时，建议使用<a target="_blank" href="https://steamcn.com/t339527-1-1" style="color:#0b84d3">Steam302</a></strong></div>');
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

function daofee(p){
    var huofee = Math.max(Math.floor(p/0.8695652173913),1);
    var vfee = Math.max(Math.floor(huofee*-0.1),1);
    var pfee = Math.max(Math.floor(huofee*-0.05),1);
    while((huofee + vfee + pfee) != p) {
        if((huofee + vfee + pfee) > p) {
            huofee--;
        }
        if((huofee + vfee + pfee) < p) {
            huofee++;
        }
        vfee = Math.max(Math.floor(huofee*-0.1),1);
        pfee = Math.max(Math.floor(huofee*-0.05),1);
    }
    return huofee;
}

function shoufee(p){
    var yifee = Math.max(Math.floor(p/0.8695652173913*0.975*0.995),1);
    var vfee = Math.max(Math.floor(yifee*-0.1),1);
    var pfee = Math.max(Math.floor(yifee*-0.05),1);
    while((yifee + vfee + pfee) != p) {
        if((yifee + vfee + pfee) > p) {
            yifee--;
        }
        if((yifee + vfee + pfee) < p) {
            yifee++;
        }
        vfee = Math.max(Math.floor(yifee*-0.1),1);
        pfee = Math.max(Math.floor(yifee*-0.05),1);
    }
    return yifee;
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
            if(true) {
                $("span.ls").text("¥" + " " + (low / exchangeRate * CsmRate *0.55).toFixed(2)); // 不用改
                $("span.dao").text((low / exchangeRate * CsmRate).toFixed(2));     //想改什么改什么
                $("span.shou").text((siteprice / (low / exchangeRate * CsmRate) ).toFixed(2)); //  wiki价的收益
            }
            if(true) {
                $("span.hb").text( "¥"+ " " + (high).toFixed(2));
                $("span.huo").text(((siteprice * 0.965 - high  * 0.7)).toFixed(2));  //想改什么改什么
                $("span.yi").text(((siteprice* 0.965 - high * 0.7)  / siteprice).toFixed(2)); // csm上的收益
                
            }
            if(true){
                // $("span.steamSellLow").text((siteprice*100/steamLow).toFixed(2));
               $("span.steamSellLow").text(((1- (steamLow/100) *steamCardRate /(siteprice * 0.965))).toFixed(2));
                $("span.lsr").text((st_type));
            }
            if(true){
                //$("span.steamSellHigh").text((siteprice*100/steamHigh).toFixed(2));
                $("span.steamSellHigh").text(((1- (steamHigh/100) *steamCardRate / (siteprice* 0.965)) ).toFixed(2));
                $("span.hbr").text((st_cnt).toFixed(0)); //不用改
            }
            clearInterval(t);
        }
    },200);
}