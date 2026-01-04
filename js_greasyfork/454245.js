// ==UserScript==
// @name         Show prices on Steam followedgames page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在Steam社区"已关注的游戏"页面显示游戏的价格
// @author       lyzlyslyc
// @match        http*://steamcommunity.com/*/followedgames*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454245/Show%20prices%20on%20Steam%20followedgames%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/454245/Show%20prices%20on%20Steam%20followedgames%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let interval = 1000;
    let requestTimeout = 3e3;
    let cc="";

    //查询账号区域
    console.log("Checking country.");
    getCountryCode();
    function getCountryCode(){
        GM_xmlhttpRequest({
            method: "get",
            url: `https://store.steampowered.com/api/getfundwalletinfo/`,
            responseType: "json",
            timeout: requestTimeout,
            onload: (result)=>{
                result = result.response;
                if(result.success){
                    cc=result.country_code;
                    console.log(`Country code:${cc}`);
                }
                setInterval(requestPrice,interval);
            },
            ontimeout:()=>{
                getCountryCode();
                console.log("Checking country timeout. Retrying.");
            },
            onerror:(e)=>{
                console.log("Checking country error.");
                console.log(e);
            }
        })
    }

    function requestPrice(){
        //获取关注列表
        let apps = document.querySelector(".games_list_rows").children;
        let queryList = {};
        let appidString = "";
        for(let i=0;i<apps.length;i++){
            if(apps[i].hasPrice||apps[i].hasPrice=="loading")continue;
            //找到第一个没查询且在可视区域内的app
            if(isAppVisible(apps[i])){
                //前后查询50个
                let min = (i-25)<0?0:(i-25);
                let max = (i+25)>apps.length?apps.length:(i+25);
                for(let j = min;j<max&&j<apps.length;j++){
                    if(apps[j].hasPrice||apps[j].hasPrice=="loading"){
                        max++;
                        continue;
                    }
                    let appUrl = apps[j].querySelector("a").href;
                    if(appUrl){
                        //获取appid
                        let appId = appUrl.match(/app\/(\d+)/)[1];
                        apps[j].hasPrice = "loading";
                        queryList[appId] = apps[j];
                        appidString+=appId+",";
                    }
                }
                break;
            }
        }

        if(appidString=="")return;
        //发送查询请求
        GM_xmlhttpRequest({
            method: "get",
            url: `https://store.steampowered.com/api/appdetails?appids=${appidString}&cc=${cc}&filters=price_overview`,
            responseType: "json",
            timeout: requestTimeout,
            onload: handleResult,
            ontimeout:handleTimeout
        })
        console.log(`Request:${appidString}`);
        function handleResult(result){
            try{
                result = result.response;
                let appId;
                //对每一个app
                for(appId in result){
                    //获取app信息：success和data
                    let appInfo = result[appId];
                    let price = null;
                    //应用已下架,success===false
                    if(!appInfo.success){
                        price = {
                            discount_percent: 0,
                            final : 0,
                            final_formatted: "Not for Sale"
                        };
                    }
                    //如果data为空，无法判断是免费或者还是未发售，需要继续请求
                    else if(appInfo.data.length===0){
                        //发送查询请求
                        GM_xmlhttpRequest({
                            method: "get",
                            url: `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${cc}`,
                            responseType: "json",
                            timeout: requestTimeout,
                            onload: handleResult,
                            ontimeout:handleTimeout
                        })
                        console.log(`RequestDetail:${appId}`);
                        continue;
                    }
                    //此处处理上面分支发送的请求
                    else if(appInfo.data.name){
                        //即将发售
                        if(appInfo.data.release_date.coming_soon){
                            price = {
                                discount_percent: 0,
                                final : 0,
                                final_formatted: "Coming Soon"
                            };
                        }
                        //免费
                        else if(appInfo.data.is_free){
                            price = {
                                discount_percent: 0,
                                final : 0,
                                final_formatted: "Free to Play"
                            };
                        }
                    }
                    else price = appInfo.data.price_overview;

                    //添加结果
                    let content = generatePrice(price);
                    let span = queryList[appId].querySelector(".game_purchase_action_bg");
                    if(!span)span = document.createElement("span");
                    span.innerHTML = content;
                    span.className = "game_purchase_action_bg";
                    let a = queryList[appId].querySelector(".followed_game_actions a");
                    a.parentElement.prepend(span);
                    queryList[appId].hasPrice = true;
                }
            }
            catch(e){
                let content =
                    `<span class="discount_block  no_discount discount_block_inline" data-price-final="0">`+
                    '<div class="discount_prices">'+
                    `<div class="discount_final_price">Request Error</div>`+
                    '</div>'+
                    '</span>';

                let appId;
                for(appId in queryList){
                    if(queryList[appId].hasPrice==true)continue;
                    let span = queryList[appId].querySelector(".game_purchase_action_bg");
                    if(!span)span = document.createElement("span");
                    span.innerHTML = content;
                    span.className = "game_purchase_action_bg";
                    let a = queryList[appId].querySelector(".followed_game_actions a");
                    a.parentElement.prepend(span);
                    queryList[appId].hasPrice = false;
                    console.log(`Error:${appId}`);
                    console.log(e);
                }
            }
        }

        function handleTimeout(){
            let content =
                `<span class="discount_block  no_discount discount_block_inline" data-price-final="0">`+
                '<div class="discount_prices">'+
                `<div class="discount_final_price">Request Timeout</div>`+
                '</div>'+
                '</span>';

            let appId;
            for(appId in queryList){
                if(queryList[appId].hasPrice==true)continue;
                let span = queryList[appId].querySelector(".game_purchase_action_bg");
                if(!span)span = document.createElement("span");
                span.innerHTML = content;
                span.className = "game_purchase_action_bg";
                let a = queryList[appId].querySelector(".followed_game_actions a");
                a.parentElement.prepend(span);
                queryList[appId].hasPrice = false;
                console.log(`Timeout:${appId}`);
            }
        }
    }

    function generatePrice(price){
        let content = "";
        let template = "";
        if(price.discount_percent==0){
            template =
                `<span class="discount_block  no_discount discount_block_inline" data-price-final="${price.final}">`+
                    '<div class="discount_prices">'+
                        `<div class="discount_final_price">${price.final_formatted}</div>`+
                    '</div>'+
                '</span>';
        }
        else {
            template =
                `<span class="discount_block  discount_block_inline" data-price-final="${price.final}">`+
                    `<div class="discount_pct">-${price.discount_percent}%</div>`+
                    '<div class="discount_prices">'+
                        `<div class="discount_original_price">${price.initial_formatted}</div>`+
                        `<div class="discount_final_price">${price.final_formatted}</div>`+
                    '</div>'+
                '</span>'
        }
        content+=template;
        return content;
    }

    function isAppVisible(app){
        let s = app.offsetTop;    // 元素相对于页面顶部的距离
        let x = app.offsetHeight;    //元素自身高度
        let t = document.documentElement.scrollTop;  // 页面在垂直方向上滚动的距离
        let y = document.documentElement.clientHeight;   //窗口可视区域的高度
        let isHidden = (s+x) < t || (s > (t+y));
        return !isHidden
    }
})();