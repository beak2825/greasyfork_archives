// ==UserScript==
// @name         Steam Get Trading Card Info
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  在steam商店页面以及steamdb筛选页面获取游戏的卡牌信息
// @author       lyzlyslyc
// @license      MIT
// @require      http://cdn.bootcss.com/jquery/3.4.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.4.0/layer.min.js
// @match        http://store.steampowered.com/app/*
// @match        https://store.steampowered.com/app/*
// @match        https://steamdb.info/sales/*
// @match        http://steamdb.info/sales/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @connect      steamcommunity.com
// @run-at       document-end
// @resource     layerCss http://cdn.bootcss.com/layer/3.4.0/theme/default/layer.css
// @downloadURL https://update.greasyfork.org/scripts/445458/Steam%20Get%20Trading%20Card%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/445458/Steam%20Get%20Trading%20Card%20Info.meta.js
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
var errorNum = 0;
var successNum = 0;
var noInfoNum = 0;
(function()
 {
    'use strict';

    //steamdb
    if(location.href.search("steamdb.info/sales/")!=-1)
    {
        const layerCss = GM_getResourceText('layerCss');
        GM_addStyle(layerCss);
        isSteamDB = true;
        var parentNode = document.querySelector("div.pre-table-title");//表格节点
        var cardFilterDiv = parentNode.children[0].cloneNode(false);//按钮div
        var userDiv = document.querySelector(".header-user.hide-small");
        cardFilterDiv.id = "card_filter_div";
        cardFilterDiv.className = "card_filter";
        document.head.innerHTML+='<style type="text/css"> .card_filter {font: 14px/20px Inter,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";margin-left:10px;} .card_filter input {color: white;} </style>';

        //开始按钮
        var btnStart = document.createElement("input");
        btnStart.setAttribute("type","button");
        btnStart.setAttribute("value","获取卡牌信息");
        btnStart.id="start_card_query";
        btnStart.className = "card_filter";

        //重试按钮
        var btnRetry = document.createElement("input");
        btnRetry.setAttribute("type","button");
        btnRetry.setAttribute("value","失败重试");
        btnRetry.id="retry_card_query";
        btnRetry.className = "card_filter";

        //停止按钮
        var btnPause = document.createElement("input");
        btnPause.setAttribute("type","button");
        btnPause.setAttribute("value","停止");
        btnPause.id="abort_card_query";
        btnPause.className = "card_filter";

        //屏蔽悬浮窗
        var chkBlock = document.createElement("input");
        chkBlock.setAttribute("type","checkbox");
        chkBlock.setAttribute("value","屏蔽悬浮窗");
        chkBlock.id="block_hover";
        chkBlock.className = "card_filter";
        chkBlock.addEventListener("click",function(e){isBlocked = e.currentTarget.checked; blockHover(isBlocked);});

        //屏蔽悬浮窗
        var chkPureIncome = document.createElement("input");
        chkPureIncome.setAttribute("type","checkbox");
        chkPureIncome.setAttribute("value","显示净收入");
        chkPureIncome.id="show_pure_income";
        chkPureIncome.className = "card_filter";
        chkPureIncome.addEventListener("click",function(e){showPureIncome = e.currentTarget.checked; showIncome(showPureIncome);});

        //忽略最高价
        var chkIgnoreHighest = document.createElement("input");
        chkIgnoreHighest.setAttribute("type","checkbox");
        chkIgnoreHighest.setAttribute("value","忽略最高价");
        chkIgnoreHighest.id="ignore_highest";
        chkIgnoreHighest.className = "card_filter";

        //使用中位数
        var chkUseMedium = document.createElement("input");
        chkUseMedium.setAttribute("type","checkbox");
        chkUseMedium.setAttribute("value","使用中位数");
        chkUseMedium.id="use_medium";
        chkUseMedium.className = "card_filter";

        //社区登录状态
        var spnLoginInfo = document.createElement("a");
        spnLoginInfo.id="loginInfo";
        spnLoginInfo.style="margin-right: 10px;";
        spnLoginInfo.href="https://steamcommunity.com";
        spnLoginInfo.target="_blank";

        //开始按钮点击事件
        btnStart.addEventListener
        (
            "click",
            function()
            {
                for(var i=0;i<queryArray.length;i++)clearTimeout(queryArray[i]);
                queryArray=[];
                startQuery("start");
                btnStart.setAttribute("value","全部重试");
                if(!cardFilterDiv.contains(btnRetry))cardFilterDiv.appendChild(btnRetry);
                if(!cardFilterDiv.contains(btnPause))cardFilterDiv.appendChild(btnPause);
            }
        );

        //重试按钮点击事件
        btnRetry.addEventListener
        (
            "click",
            function()
            {
                for(var i=0;i<queryArray.length;i++)clearTimeout(queryArray[i]);
                queryArray=[];
                startQuery("retryError");
            }
        );

        //暂停按钮点击事件
        btnPause.addEventListener
        (
            "click",
            function(e)
            {
                if(e.currentTarget.value=="停止")
                {
                    for(var i=0;i<queryArray.length;i++)clearTimeout(queryArray[i]);
                    queryArray=[];
                    btnPause.setAttribute("value","继续");
                }
                else if(e.currentTarget.value=="继续")
                {
                    startQuery("continue");
                }
            }
        )

        //更改单页显示数量后
        document.querySelector("#DataTables_Table_0_length > label > select").addEventListener
        (
            "change",
            function(e)
            {
                blockHover(document.getElementById("block_hover").checked);
                if(document.getElementById("abort_card_query")!=null)
                    if(document.getElementById("abort_card_query").value == "查询完成")
                        if(lastIndex + 1<document.querySelector("#DataTables_Table_0 tbody").childElementCount)
                            document.getElementById("abort_card_query").value ="继续";
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
                    document.getElementById("abort_card_query").value ="继续";
            }
        })

        cardFilterDiv.appendChild(chkPureIncome);
        cardFilterDiv.appendChild(document.createTextNode("显示净收入"));
        cardFilterDiv.appendChild(chkBlock);
        cardFilterDiv.appendChild(document.createTextNode("屏蔽悬浮窗"));
        cardFilterDiv.appendChild(chkIgnoreHighest);
        cardFilterDiv.appendChild(document.createTextNode("忽略最高价"));
        cardFilterDiv.appendChild(chkUseMedium);
        cardFilterDiv.appendChild(document.createTextNode("使用中位数"));
        cardFilterDiv.appendChild(btnStart);
        parentNode.insertBefore(cardFilterDiv,parentNode.children[1]);
        userDiv.insertBefore(spnLoginInfo,userDiv.children[0]);
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

        btnPause.setAttribute("value","停止");
        //开始查询
        if(status=="start")lastIndex=0;
        var queryCount = 0;
        var i = 0
        if(status=="continue"&&lastIndex+1>=apps.childElementCount)btnPause.setAttribute("value","查询完成");
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
                        if(lastErrorIndex == -1)btnPause.value="继续";
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
        document.getElementById("abort_card_query").value="继续";
        lastErrorIndex = -1;
    }
    if(lastIndex==document.querySelector("tbody").childElementCount-1)document.getElementById("abort_card_query").value="查询完成";

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
            var steamCountry = walletInfoDoc.match(/"+[A-Z]*"/)[0].replace(/"/g,""); //steam国家
            if(isSteamDB)isSameCountry = (steamDBCountry == steamCountry);
            if(!isSameCountry)document.querySelector("#show_pure_income").disabled = true;
            else if(isSteamDB)document.querySelector("#show_pure_income").disabled = false;
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
        layer.msg("获取steamDB货币时出现错误");
        console.log(e);
    }
    return currency;
}

function checkLoginStatus(){
    GM_xmlhttpRequest
    (
        {
            method: "GET",
            url: "https://steamcommunity.com/",
            timeout: timeOut,
            onload: function(res){
                //转换为DOM
                let domparser = new DOMParser();
                let doc = domparser.parseFromString(res.responseText, "text/html");
                if(doc.querySelector("#account_pulldown")!=null){
                    document.getElementById("loginInfo").style.color="rgb(91, 253, 0)";
                    document.getElementById("loginInfo").innerText=`社区已登录：${doc.querySelector("#account_pulldown").innerText.replace(/[\n\t]/g,"")}`;
                    document.getElementById("loginInfo").href = doc.querySelector("#global_actions > a").href;
                }
                else{
                    document.getElementById("loginInfo").style.color="red";
                    document.getElementById("loginInfo").innerText="社区未登录×";
                    document.getElementById("loginInfo").href = "https://steamcommunity.com";
                    layer.msg("steam社区未登录，货币可能无法正常转换");
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
        layer.msg("社区连接失败，请检查加速器是否启动");
    }
}