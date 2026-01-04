// ==UserScript==
// @name         Steam Get Trading Card Info
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  在steam商店页面以及steamdb筛选页面获取游戏的卡牌信息
// @author       lyzlyslyc
// @license      MIT
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @match        http://store.steampowered.com/app/*
// @match        https://store.steampowered.com/app/*
// @match        https://steamdb.info/sales/*
// @match        http://steamdb.info/sales/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @connect      steamcommunity.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422180/Steam%20Get%20Trading%20Card%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/422180/Steam%20Get%20Trading%20Card%20Info.meta.js
// ==/UserScript==

var timeOut = 6000; //请求超时时长(毫秒)
var interval = 800; //查询间隔 steamdb (毫秒)

var hasAddTableHead=false;               //是否已经添加表头
var hasAddButton=false;                  //是否添加重试按钮
var queryArray = new Array();            //请求线程列表
var lastIndex = 0;                       //上一个请求的位置
var lastErrorIndex = -1;                 //上一个请求出错的位置
var isSameCountry = true;                //steamdb和社区市场货币相同
var isSteamDB = false;                   //当前页面是否为steamdb
var showPureIncome = false;              //是否显示纯收入
var isBlocked = false;                   //悬浮窗已屏蔽
var currentPage = "1";                   //当前显示页面
var hover;                               //悬浮窗
var steamDBCurrency = null;
var steamCountry = null;
var errorNum = 0;
var successNum = 0;
var noInfoNum = 0;
(function()
 {
    'use strict';

    //steamdb
    if(location.href.search("steamdb.info/sales/")!=-1)
    {
        if(location.href.search("#setFilter")!=-1)$("#DataTables_Table_0").ready(()=>{$("#DataTables_Table_0 > thead > tr > th:nth-child(5)").click();});
        isSteamDB = true;
        //样式
        document.head.innerHTML+='<style type="text/css">table.table-sales{table-layout: auto ;word-break: keep-all;}#card_filter_chk_div {display: flex;gap: 10px;margin-top: 25px;justify-content: center;flex-wrap: wrap;}#card_filter_container{max-width:480px;margin: 15px 0;}a.card-filter-btn{width: 100%;margin-top: 5px;padding: 8px;line-height: 1;font-size: 14px;border: 0;color: #fff;background: #338037;box-shadow: none;text-align: center;}</style>';
        //卡牌筛选容器
        const cardFilterContainer = $("<div id = 'card_filter_container'></div>");
        cardFilterContainer.prependTo($("div.filters-container"));
        //选项容器
        const chkContainer = $("<div id ='card_filter_chk_div'></div>");
        chkContainer.appendTo(cardFilterContainer);
        //按钮容器
        const btnContainer = $("<div id ='card_filter_btn_div' style='margin-top: 10px;'></div>");
        btnContainer.appendTo(cardFilterContainer);

        //重试按钮
        const btnRetry = $('<a href="#" class="btn card-filter-btn" id="retry_card_query">失败重试</a>');
        btnRetry.on("click",function(){
            for(var i=0;i<queryArray.length;i++)clearTimeout(queryArray[i]);
            queryArray=[];
            startQuery("retryError");
        });
        btnRetry.appendTo(btnContainer);
        btnRetry.hide();

        //停止按钮
        var btnPause = $('<a href="#" class="btn card-filter-btn" id="abort_card_query">停止</a>');
        btnPause.on("click",function(e){
            if(btnPause.text()=="停止"){
                for(var i=0;i<queryArray.length;i++)clearTimeout(queryArray[i]);
                queryArray=[];
                btnPause.text("继续");
            }
            else if(btnPause.text()=="继续"){
                startQuery("continue");
            }
        });
        btnPause.appendTo(btnContainer);
        btnPause.hide();

        //开始按钮
        const btnStart = $('<a href="#" class="btn card-filter-btn" id="start_card_query">获取卡牌信息</a>');
        btnStart.on("click",function(){
            for(var i=0;i<queryArray.length;i++)clearTimeout(queryArray[i]);
            queryArray=[];
            btnRetry.show();
            btnPause.show();
            startQuery("start");
            btnStart.text("全部重试");
        });
        btnStart.appendTo(btnContainer);

        //一键设置卡牌筛选
        const btnSetFilter = $('<a href="#setFilter" class="btn card-filter-btn" id="start_card_query">一键设置卡牌条件</a>');
        btnSetFilter.on("click",function(){
            setFilter();
        });
        btnSetFilter.appendTo($("#js-filters"));

        //屏蔽悬浮窗
        const chkBlock = $(`<div class='steamy-checkbox-control' id='block_hover'><div class="steamy-checkbox"></div><span class="steamy-checkbox-label">屏蔽悬浮窗</span></div>`);
        chkBlock.on("click",()=>{
            isBlocked=!isBlocked;
            chkBlock.toggleClass("checked",isBlocked);
            blockHover(isBlocked);
        });
        chkBlock.appendTo(chkContainer);

        //显示净收入
        const chkPureIncome = $(`<div class='steamy-checkbox-control' id='show_pure_income'><div class="steamy-checkbox"></div><span class="steamy-checkbox-label">显示净收入</span></div>`);
        chkPureIncome.on("click",(e)=>{
            showPureIncome=!showPureIncome;
            chkPureIncome.toggleClass("checked",showPureIncome);
            showIncome(showPureIncome);
        });
        chkPureIncome.appendTo(chkContainer);

        //忽略最高价
        const chkIgnoreHighest = $(`<div class='steamy-checkbox-control' id='ignore_highest'><div class="steamy-checkbox"></div><span class="steamy-checkbox-label">忽略最高价</span></div>`);
        chkIgnoreHighest[0].checked=false;
        chkIgnoreHighest.on("click",(e)=>{
            chkIgnoreHighest[0].checked=!chkIgnoreHighest[0].checked;
            chkIgnoreHighest.toggleClass("checked",chkIgnoreHighest[0].checked);
        });
        chkIgnoreHighest.appendTo(chkContainer);

        //使用中位数
        const chkUseMedium = $(`<div class='steamy-checkbox-control' id='use_medium'><div class="steamy-checkbox"></div><span class="steamy-checkbox-label">使用中位数</span></div>`);
        chkUseMedium[0].checked=false;
        chkUseMedium.on("click",(e)=>{
            chkUseMedium[0].checked=!chkUseMedium[0].checked;
            chkUseMedium.toggleClass("checked",chkUseMedium[0].checked);
        });
        chkUseMedium.appendTo(chkContainer);

        //社区登录状态
        $("<a id='loginInfo' style='margin-right: 10px;' href='https://steamcommunity.com' target='_blank'></a>").appendTo($(".header-user.hide-small"));

        //更改单页显示数量后
        document.querySelector("#DataTables_Table_0_length > label > select").addEventListener
        (
            "change",
            function(e)
            {
                blockHover(document.getElementById("block_hover").checked);
                if(document.getElementById("abort_card_query")!=null)
                    if(document.getElementById("abort_card_query").innerText == "查询完成")
                        if(lastIndex + 1<document.querySelector("#DataTables_Table_0 tbody").childElementCount)
                            document.getElementById("abort_card_query").innerText ="继续";
            }
        )

        //翻页后
        document.querySelector("#DataTables_Table_0_paginate").addEventListener("click",function(e){
            if(document.querySelector(".paginate_button.active").innerHTML != currentPage)
            {
                currentPage=document.querySelector(".paginate_button.active").innerHTML;
                blockHover(document.getElementById("block_hover").checked);
                for(var i=0;i<queryArray.length;i++)clearTimeout(queryArray[i]);
                queryArray=[];
                lastIndex = 0;
                lastErrorIndex = -1;
                if(document.getElementById("abort_card_query")!=null)
                    document.getElementById("abort_card_query").innerText ="继续";
            }
        })
        checkLoginStatus();
    }
    else
    //steam界面
    {
        var appid = document.location.href.match(/\/app\/+\d*\//)[0].replace(/[^\d]/ig,"");
        var oriNode = document.querySelector(".release_date");
        var cardDiv = oriNode.cloneNode(true);//克隆样式

        cardDiv.setAttribute("class","card_info_row");
        cardDiv.children[0].innerHTML="卡牌信息:";
        cardDiv.children[1].setAttribute("class","summary column");
        cardDiv.children[1].setAttribute("id","card_info_summary");
        cardDiv.children[1].innerHTML="";
        document.head.innerHTML+='<style type="text/css"> .card_info_row .column {overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}  .card_info_row {display: flex;line-height: 16px;padding-top: 9px;padding-bottom: 13px;} </style>';

        var node=document.createElement("A");
        cardDiv.children[1].appendChild(node);
        oriNode.parentNode.appendChild(cardDiv);

        getCardInfo(appid, node);
    }

    //steamdb开始查询
    function startQuery(status)
    {
        //检查登录状态
        checkLoginStatus();
        //获取steamDB货币
        steamDBCurrency = getSteamDBCurrency();
        //开始添加表头
        //表格节点
        var table = document.querySelector("#DataTables_Table_0");
        if(!hasAddTableHead)
        {
            //卡牌收入表头
            var cardIncomeHead = table.querySelector("thead > tr > th:nth-child(5)").cloneNode(true);
            //卡牌数量表头
            var cardCountHead = table.querySelector("thead > tr > th:nth-child(5)").cloneNode(true);
            //卡牌均价表头
            var AvgPriceHead = table.querySelector("thead > tr > th:nth-child(5)").cloneNode(true);
            cardIncomeHead.textContent = " CardIncome";
            cardIncomeHead.setAttribute("class","sorting");
            cardIncomeHead.setAttribute("style","width:125px");
            cardIncomeHead.setAttribute("aria-label"," CardIncome: activate to sort column ascending");
            cardIncomeHead.addEventListener("click",function(){sort(0);});
            table.querySelector("thead > tr").appendChild(cardIncomeHead);

            AvgPriceHead.textContent = " AvgPrice";
            AvgPriceHead.setAttribute("class","sorting");
            AvgPriceHead.setAttribute("style","width:100px");
            AvgPriceHead.setAttribute("aria-label"," AvgPrice: activate to sort column ascending");
            AvgPriceHead.addEventListener("click",function(){sort(1);});
            table.querySelector("thead > tr").appendChild(AvgPriceHead);

            cardCountHead.textContent = " Count";
            cardCountHead.setAttribute("class","sorting");
            cardCountHead.setAttribute("style","width:75px");
            cardCountHead.setAttribute("aria-label"," Count: activate to sort column ascending");
            cardCountHead.addEventListener("click",function(){sort(2);});
            table.querySelector("thead > tr").appendChild(cardCountHead);

            hasAddTableHead = true;
        }

        var header = document.querySelectorAll("[class=sorting_desc],[class=sorting_asc]");
        for(i = 0;i<header.length;i++)header[i].setAttribute("class","sorting");
        //获取app列表
        var apps=table.querySelector("tbody");

        btnPause.text("停止");
        //开始查询
        if(status=="start")lastIndex=0;
        var queryCount = 0;
        var i = 0
        if(status=="continue"&&lastIndex+1>=apps.childElementCount)btnPause.text("查询完成");
        //遍历app表格
        for(i=0;i<apps.childElementCount;i++)
        {
            //app行
            var parentNode = apps.children[i];
            //app价格项
            var priceNode = apps.children[i].querySelector("td:nth-child(5)");
            //卡牌收入项
            var cardIncomeNode = parentNode.querySelector("td:nth-child(5)").cloneNode(true);
            //卡牌数量项
            var cardCountNode = parentNode.querySelector("td:nth-child(5)").cloneNode(false);
            //卡牌均价项
            var AvgPriceNode = parentNode.querySelector("td:nth-child(5)").cloneNode(false);
            //卡牌收入结果
            var cardLink = document.createElement("A");
            //设置为查询中
            cardLink.setAttribute("hasQueried","false");
            cardIncomeNode.innerHTML="";
            cardIncomeNode.setAttribute("class","card_income");
            cardIncomeNode.dataset.sort = 0;
            cardCountNode.setAttribute("class","card_count");
            cardCountNode.dataset.sort = 0;
            AvgPriceNode.setAttribute("class","card_avgprice");
            AvgPriceNode.dataset.sort = 0;
            cardIncomeNode.appendChild(cardLink);
            //如果还没有查询过
            if(parentNode.lastChild.className != "card_count")
            {
                parentNode.appendChild(cardIncomeNode);
                parentNode.appendChild(AvgPriceNode);
                parentNode.appendChild(cardCountNode);
                queryArray.push(setTimeout(getCardInfo,(queryCount+1)*interval, apps.children[i].dataset.appid,cardLink,status,i,parseInt(priceNode.dataset.sort),i));
                queryCount++;
            }
            else
            {
                switch(status)
                {
                    //重试，重新请求加载中和错误的部分
                    case "retryError":
                        if(lastErrorIndex == -1)btnPause.text("继续");
                        if(parentNode.querySelector("[hasqueried]").getAttribute("hasqueried")!="error" && parentNode.querySelector("[hasqueried]").getAttribute("hasqueried")!="loading")break;
                        if(i>lastIndex)break;
                    case "continue":
                        if(parentNode.querySelector("[hasqueried]").getAttribute("hasqueried")=="true")break;
                    default:
                        parentNode.lastChild.previousSibling.previousSibling.replaceWith(cardIncomeNode);
                        parentNode.lastChild.previousSibling.replaceWith(AvgPriceNode);
                        parentNode.lastChild.replaceWith(cardCountNode);
                        queryArray.push(setTimeout(getCardInfo,(queryCount+1)*interval, apps.children[i].dataset.appid,cardLink,status,i,parseInt(priceNode.dataset.sort)));
                        queryCount++;
                        break;
                }

            }
        }

    }
})();

//查询线程
async function getCardInfo(appid, infoNode, status = "start", index = 0, appPrice = 699)
{
    var retryTime = 1;
    var queryUrl = `https://steamcommunity.com/market/search?q=&category_753_Game%5B%5D=tag_app_${appid}&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753`;
    infoNode.setAttribute("href",queryUrl);
    infoNode.setAttribute("target","_blank");
    infoNode.appendChild(document.createTextNode("读取中..."));
    infoNode.setAttribute("hasQueried","loading");
    if(status=="retryError")infoNode.setAttribute("hasQueried","error");
    GM_xmlhttpRequest
    (
        {
            method: "GET",
            url: queryUrl,
            timeout: timeOut,
            onload: getData,
            ontimeout: timeout,
            onerror: error
        }
    );
    //更新上一次查询位置
    if(index>lastIndex)lastIndex=index;
    if(status=="retryError" && lastErrorIndex==index)
    {
        document.getElementById("abort_card_query").innerText="继续";
        lastErrorIndex = -1;
    }
    if(lastIndex==document.querySelector("tbody").childElementCount-1)document.getElementById("abort_card_query").innerText="查询完成";

    //获取结果
    function getData(res)
    {
        try
        {
            //转换为DOM
            let domparser = new DOMParser();
            let doc = domparser.parseFromString(res.responseText, "text/html");

            //市场返回错误页面
            if((doc.title.search("错误") != -1) || (doc.title.toLowerCase().search("error") != -1))
            {
                infoNode.textContent="";
                infoNode.style.color="red";
                infoNode.appendChild(document.createTextNode("请求过于频繁"));
                infoNode.setAttribute("hasQueried","error");
                errorNum++;
                lastErrorIndex=index;
                setRetry();
                return;
            }
            //钱包信息
            var walletInfoDoc = doc.querySelector("[class=responsive_page_template_content]").querySelector("script").innerHTML;
            var steamDBCountry = null;
            if(isSteamDB)steamDBCountry = document.querySelector("#DataTables_Table_0 > thead img").src.replace(/.*\//,"").replace(".svg","").toUpperCase(); //steamDB国家
            steamCountry = walletInfoDoc.match(/"+[A-Z]*"/)[0].replace(/"/g,""); //steam国家
            if(isSteamDB)isSameCountry = (steamDBCountry == steamCountry);
            if(!isSameCountry)$("#show_pure_income").toggleClass("disabled",true);
            else if(isSteamDB)$("#show_pure_income").toggleClass("disabled",false);
            //获取卡牌价格列表
            var prices = doc.querySelectorAll("#searchResultsRows div.market_listing_price_listings_block > div.market_listing_right_cell.market_listing_their_price > span.market_table_value.normal_price > span.normal_price");
            //获取卡牌总数
            var cardCount = parseInt(doc.getElementById("searchResults_total").textContent);
            var avgPrice = 0;
            var parentNode = infoNode.parentNode;

            //有卡
            if(cardCount>0)
            {
                var steamCurrency = {"currency":prices[0].innerHTML.replace(/[\d.,]/ig,""),position:"front"};
                var sum = 0;
                var max = 0;
                var priceArray = new Array();
                //获取总价
                for(var i=0;i<prices.length;i++)
                {
                    var curPrice = parseInt(prices[i].dataset.price);
                    priceArray[i] = curPrice;
                    if(curPrice>max)max = curPrice;
                    sum += curPrice;
                }
                //如果取中位数
                if(isSteamDB && document.getElementById("use_medium").checked)
                {
                    priceArray.sort(function(a,b){return a-b;});
                    avgPrice = ((priceArray[Math.floor(priceArray.length/2)] + priceArray[Math.floor((priceArray.length-1)/2)])/200).toFixed(2);
                }
                //如果忽略最高价
                else if(isSteamDB && document.getElementById("ignore_highest").checked)avgPrice = ((sum-max)/100.0/(prices.length-1)).toFixed(2);
                //取平均
                else avgPrice = (sum/100.0/prices.length).toFixed(2);
                var income = (calcfee(avgPrice*100)*Math.ceil(cardCount/2)/100).toFixed(2);
                var pureIncome = (income - appPrice / 100.0).toFixed(2);
                infoNode.textContent="";
                if(isSteamDB)
                {
                    var appNode = parentNode.parentNode;
                    parentNode.dataset.sort = income;
                    parentNode.dataset.sortpure = pureIncome;
                    parentNode.nextSibling.dataset.sort = avgPrice;
                    parentNode.nextSibling.nextSibling.dataset.sort = cardCount;
                    if(isSameCountry)
                    {
                        if(pureIncome > 0)infoNode.style.color="#5bfd00";
                        if(steamDBCurrency.currency!=null)steamCurrency=steamDBCurrency;
                    }
                    if(steamCurrency.position=="back")
                    {
                        infoNode.innerHTML+=`${(isSameCountry&&showPureIncome)?pureIncome:income}${steamCurrency.currency}`;
                        parentNode.nextSibling.innerHTML+=`${avgPrice}${steamCurrency.currency}`;
                    }
                    else
                    {
                        infoNode.innerHTML+=`${steamCurrency.currency}${(isSameCountry&&showPureIncome)?pureIncome:income}`;
                        parentNode.nextSibling.innerHTML+=`${steamCurrency.currency}${avgPrice}`;
                    }
                    parentNode.nextSibling.nextSibling.innerHTML+=`${cardCount}`;
                }
                else infoNode.innerHTML+=`${cardCount}张<br>均价${steamCurrency.currency}${avgPrice}<br>预计税后收入${steamCurrency.currency}${income}`;
                infoNode.setAttribute("hasQueried","true");
                successNum++;
            }
            else if(doc.querySelector(".market_listing_table_message")!=null&&doc.querySelector(".market_listing_table_message").innerHTML.match(/(出错|Error)/i)!=null)
            {
                infoNode.textContent="";
                infoNode.style.color="red";
                infoNode.appendChild(document.createTextNode("请求过于频繁"));
                infoNode.setAttribute("hasQueried","error");
                errorNum++;
                lastErrorIndex=index;
                setRetry();
            }
            //卡牌数量为0，同时重试次数也为0
            else if(retryTime==0)
            {
                infoNode.textContent="";
                infoNode.style.color="yellow";
                infoNode.appendChild(document.createTextNode("未查询到卡牌信息"));
                infoNode.setAttribute("hasQueried","true");
                noInfoNum++;
                setRetry();
            }
            //卡牌数量为0，重试
            else
            {
                setTimeout
                (
                    GM_xmlhttpRequest,
                    interval,
                    {
                        method: "GET",
                        url: queryUrl,
                        timeout: timeOut,
                        onload: getData,
                        ontimeout: timeout,
                        onerror: error
                    }
                );
                retryTime--;
            }

        }catch(e)
        {
            infoNode.textContent="";
            infoNode.style.color="red";
            infoNode.appendChild(document.createTextNode("解析结果出错"));
            infoNode.setAttribute("hasQueried","error");
            errorNum++;
            lastErrorIndex=index;
            console.log(e);
            setRetry();
        }
    }


    function error()
    {
        infoNode.textContent="";
        infoNode.style.color="red";
        infoNode.appendChild(document.createTextNode("查询出错"));
        infoNode.setAttribute("hasQueried","error");
        errorNum++;
        lastErrorIndex=index;
        setRetry();
    }

    function timeout()
    {
        infoNode.textContent="";
        infoNode.style.color="red";
        infoNode.appendChild(document.createTextNode("请求超时"));
        infoNode.setAttribute("hasQueried","error");
        errorNum++;
        lastErrorIndex=index;
        setRetry();
    }

    function setRetry()
    {
        var retryA = document.createElement("a");
        retryA.appendChild(document.createTextNode("点击重试"));
        retryA.setAttribute("href","javascript:void(0);");
        retryA.addEventListener
        (
            "click",
            function()
            {
                if(infoNode.getAttribute("hasqueried")=="error")errorNum--;
                else noInfoNum--;
                infoNode.innerHTML="";
                infoNode.removeAttribute("style");
                var parentNode = infoNode.parentNode;
                parentNode.innerHTML="";
                parentNode.appendChild(infoNode);
                getCardInfo(appid, infoNode, "start", index, appPrice);
            }
        );
        if(infoNode.parentNode.dataset.sort!==undefined)infoNode.parentNode.appendChild(document.createElement("br"));
        infoNode.parentNode.appendChild(retryA);
    }
}

//计算手续费
function calcfee(p){
    var pnofee = Math.max(Math.floor(p/1.15),1);
    var vfee = Math.max(Math.floor(pnofee*0.1),1);
    var pfee = Math.max(Math.floor(pnofee*0.05),1);
    var i = 0;
    while((pnofee + vfee + pfee) != p && i < 100) {
        if((pnofee + vfee + pfee) > p) {
            pnofee--;
        }
        if((pnofee + vfee + pfee) < p) {
            pnofee++;
        }
        vfee = Math.max(Math.floor(pnofee*0.1),1);
        pfee = Math.max(Math.floor(pnofee*0.05),1);
        i++;
    }
    return pnofee;
}

//排序
var ascend = false;
var col = 0;
function sort(column)
{
    if(document.querySelector(".card_income")==null)return;
    if(column == col)ascend = !ascend;
    else ascend = false;
    col = column;


    var table = document.querySelector("tbody");
    var appWithCard = new Array();
    var appWithoutCard = new Array();
    var i = 0;
    for(i = 0;i<table.childElementCount;i++)
    {
        if(table.children[i].querySelector(".card_income")==null||table.children[i].querySelector(".card_income").dataset.sort==0)appWithoutCard.push(table.children[i]);
        else appWithCard.push(table.children[i]);
    }

    appWithCard.sort(compare);

    for(i = 0;i<appWithCard.length;i++)table.appendChild(appWithCard[i]);
    for(i = 0;i<appWithoutCard.length;i++)table.appendChild(appWithoutCard[i]);

    var header = document.querySelectorAll("[class=sorting_desc],[class=sorting_asc]");
    for(i = 0;i<header.length;i++)header[i].setAttribute("class","sorting");
    var curHeader;

    switch(column)
    {
        case 0:
            curHeader = document.querySelector("[aria-label^=' CardIncome']");
            curHeader.setAttribute("class","sorting_" + (ascend ? "asc" : "desc"));
            curHeader.setAttribute("aria-label"," CardIncome: activate to sort column " + (ascend ? "ascending" : "descending"));
            break;
        case 1:
            curHeader = document.querySelector("[aria-label^=' AvgPrice']");
            curHeader.setAttribute("class","sorting_" + (ascend ? "asc" : "desc"));
            curHeader.setAttribute("aria-label"," AvgPrice: activate to sort column " + (ascend ? "ascending" : "descending"));
            break;
        case 2:
            curHeader = document.querySelector("[aria-label^=' Count']");
            curHeader.setAttribute("class","sorting_" + (ascend ? "asc" : "desc"));
            curHeader.setAttribute("aria-label"," Count: activate to sort column " + (ascend ? "ascending" : "descending"));
            break;
        default:
            break;
    }

    function compare(a,b)
    {
        var res = 0;
        switch(col)
        {
            case 0:
                res = (isSameCountry&&showPureIncome)? (a.querySelector(".card_income").dataset.sortpure - b.querySelector(".card_income").dataset.sortpure) : (a.querySelector(".card_income").dataset.sort - b.querySelector(".card_income").dataset.sort);
                break;
            case 1:
                res = a.querySelector(".card_avgprice").dataset.sort - b.querySelector(".card_avgprice").dataset.sort;
                break;
            case 2:
                res = a.querySelector(".card_count").dataset.sort - b.querySelector(".card_count").dataset.sort;
                break;
            default:
                break;
        }
        return res * (ascend ? 1 : -1);
    }
}


//屏蔽悬浮窗
function blockHover(isBlocked)
{
    if(isBlocked)
    {
        hover = document.getElementById("js-hover");
        document.getElementById("js-hover").remove();
    }
    else
    {
        document.body.appendChild(hover);
    }
}

function showIncome(showPureIncome)
{
    if(!isSameCountry)
    {
        alert("steamdb和steam社区货币不同，该功能无法使用！");
        return;
    }
    var incomeArea = document.getElementsByClassName("card_income");
    if(incomeArea.length == 0)return;
    for(var i=0;i<incomeArea.length;i++)if(incomeArea[i].children[0].getAttribute("hasqueried")=="true")incomeArea[i].children[0].innerHTML = incomeArea[i].children[0].innerHTML.replace(/[-]?[0-9]{1,}[.\d]?[0-9]*/,showPureIncome? `${incomeArea[i].dataset.sortpure}`:`${incomeArea[i].dataset.sort}`);
}

function getSteamDBCurrency(){
    let priceList = document.querySelectorAll("#DataTables_Table_0 > tbody td:nth-child(5)");
    let i = -1;
    let currency = {"currency":null,"position":null};
    try{
        do{
            i++;
            if(priceList[i].innerHTML.match(/^[^0-9]+/)!=null){
                currency.currency = priceList[i].innerHTML.match(/^[^0-9]+/)[0];
                currency.position = "front";
            }
            else{
                currency.currency = priceList[i].innerHTML.match(/[^0-9]+$/)[0];
                currency.position = "back";
            }
        }
        while(i<priceList.length&&priceList[i].dataset.sort==='0')
    }
    catch(e){
        //layer.msg("获取steamDB货币时出现错误");
        console.log(e);
    }
    return currency;
}

function checkLoginStatus(){
    GM_xmlhttpRequest
    (
        {
            method: "GET",
            url: "https://steamcommunity.com/market/",
            timeout: timeOut,
            onload: function(res){
                //转换为DOM
                let domparser = new DOMParser();
                let doc = domparser.parseFromString(res.responseText, "text/html");
                if(doc.querySelector("#account_pulldown")!=null){
                    document.getElementById("loginInfo").style.color="rgb(91, 253, 0)";
                    document.getElementById("loginInfo").innerText=`社区已登录：${doc.querySelector("#account_pulldown").innerText.replace(/[\n\t]/g,"")}`;
                    document.getElementById("loginInfo").href = doc.querySelector("#global_actions > a").href;
                    steamCountry = res.responseText.match(/"wallet_country":"([A-Za-z]+)"/);
                    if(steamCountry==null)console.log("未找到Steam社区货币");
                    else steamCountry=steamCountry[1];
                }
                else{
                    document.getElementById("loginInfo").style.color="red";
                    document.getElementById("loginInfo").innerText="社区未登录×";
                    document.getElementById("loginInfo").href = "https://steamcommunity.com";
                }
            },
            ontimeout: err,
            onerror: err
        }
    );

    function err(){
        document.getElementById("loginInfo").style.color="red";
        document.getElementById("loginInfo").innerText="社区连接失败×";
        document.getElementById("loginInfo").href = "https://steamcommunity.com";
        //layer.msg("社区连接失败，请检查加速器是否启动");
    }
}

function setFilter(){
    let url = "https://steamdb.info/sales/?displayOnly=Game&min_reviews=0&tagid=-1003823&min_rating=0&min_discount=0&category=29";
    if(steamCountry!=null)url+=`&cc=${steamCountry.toLowerCase()}`;
    url+="#setFilter";
    location.href = url;
}
