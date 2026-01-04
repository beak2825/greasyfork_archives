// ==UserScript==
// @name         Filt Limited Games
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  在steamdb的App页面和筛选页面显示游戏是否受限
// @author       lyzlyslyc
// @match        https://steamdb.info/sales/*
// @match        http://steamdb.info/sales/*
// @match        https://steamdb.info/app/*
// @match        http://steamdb.info/app/*
// @grant        GM_xmlhttpRequest
// @connect      store.steampowered.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422811/Filt%20Limited%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/422811/Filt%20Limited%20Games.meta.js
// ==/UserScript==


var interval = 500;  //查询间隔(毫秒)
var timeoutMs = 10000;  //超时时长（毫秒）

var queryQueue = new Array();
(function() {
    'use strict';

    //steamdb筛选页面
    if(location.href.match("steamdb.info/sales/")!=null)
    {
        var filterNode = document.querySelector("div.pre-table-title");//Filter节点
        var limitFilterDiv = filterNode.children[0].cloneNode(false);//按钮div
        limitFilterDiv.id = "limit_filter_div";
        limitFilterDiv.className = "limit_filter";
        limitFilterDiv.setAttribute("style","line-height : 20px;");
        document.head.innerHTML+='<style type="text/css"> .limit_filter {font: 14px/20px Inter,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";margin-left:10px;} </style>';

        //开始按钮
        var btnStart = document.createElement("input");
        btnStart.setAttribute("type","button");
        btnStart.setAttribute("value","查询受限");
        btnStart.id="start_limit_query";
        btnStart.className = "limit_filter";
        btnStart.setAttribute("onQuerying","false");

        //过滤按钮
        var btnFilt = document.createElement("input");
        btnFilt.setAttribute("type","button");
        btnFilt.setAttribute("value","过滤");
        btnFilt.id="filt_limit";
        btnFilt.className = "limit_filter";
        var i=0;
        //开始按钮点击事件
        btnStart.addEventListener
        (
            "click",
            function()
            {
                var trs = document.querySelectorAll("#DataTables_Table_0  tr.app");
                for(i=0;i<queryQueue.length;i++)clearTimeout(queryQueue[i]);
                queryQueue=[];
                if(btnStart.getAttribute("onQuerying")!="true")
                {
                    var waitCount = 0;
                    for(i = 0;i<trs.length;i++)
                    {
                        if(trs[i].querySelector("a.b").classList.contains("limitQueried")||trs[i].querySelector("a.b").classList.contains("limitQuerying"))continue;
                        trs[i].querySelector("a.b").classList.add("limitQuerying");
                        queryQueue.push(setTimeout(getLimitedInfo,waitCount*interval,trs[i],i));
                        waitCount++;
                    }
                    if(waitCount!=0)
                    {
                        btnStart.setAttribute("onQuerying","true");
                        btnStart.setAttribute("value","停止");
                    }
                }
                else
                {
                    for(i = 0;i<trs.length;i++)trs[i].querySelector("a.b").classList.remove("limitQuerying");
                    btnStart.setAttribute("onQuerying","false");
                    btnStart.setAttribute("value","继续");
                }
            }
        );

        //筛选按钮点击事件
        btnFilt.addEventListener
        (
            "click",
            function()
            {
                var trs = document.querySelectorAll("#DataTables_Table_0  tr.app");
                for(i = 0;i<trs.length;i++)if(trs[i].querySelector(".limited")!=null)trs[i].remove();
            }
        )

        limitFilterDiv.appendChild(btnStart);
        limitFilterDiv.appendChild(btnFilt);
        var cardFilter = filterNode.querySelector(".card_filter");
        if(cardFilter!=null)filterNode.insertBefore(limitFilterDiv,cardFilter);
        else filterNode.insertBefore(limitFilterDiv,filterNode.children[1]);
    }
    //steamdb App页面
    else
    {
        var isGameLimited = false;
        if(document.querySelectorAll("[aria-label='Profile Features Limited']").length!=0)isGameLimited = true;
        if(document.querySelectorAll("[aria-label='Low Confidence Metric']").length!=0)isGameLimited = true;

        if(isGameLimited)document.querySelector("tbody").innerHTML+="<tr><td>个人资料功能受限</td><td style='color: red;'>是</td></tr>";
        else document.querySelector("tbody").innerHTML+="<tr><td>个人资料功能受限</td><td>否</td></tr>";
    }
})();

async function getLimitedInfo(tr,index)
{
    let domparser = new DOMParser();
    let doc = null;
    if(tr.querySelector(".limitMsg")==null)
    {
        tr.querySelector("a.b").outerHTML+='<a style="margin: 10px;" class="limitMsg">受限查询中</a>';
        tr.querySelector(".limitMsg").addEventListener
        (
            "click",
            retry
        );
    }
    else tr.querySelector(".limitMsg").innerHTML="受限查询中";
    var msg = tr.querySelector(".limitMsg");
    GM_xmlhttpRequest
    (
        {
            method: "GET",
            url: `https://store.steampowered.com/app/${tr.dataset.appid}/`,
            timeout: timeoutMs,
            onload: getData,
            ontimeout: timeOut,
            onerror: error
        }
    );
    if(index == document.querySelectorAll("#DataTables_Table_0  tr.app").length - 1)
    {
        var btnStart = document.getElementById("start_limit_query");
        btnStart.setAttribute("onQuerying","false");
        btnStart.setAttribute("value","查询受限");
    }
    function getData(res)
    {
        if(res.status == 200)
        {
            if(tr.querySelector("a.b").classList.contains("limitQuerying"))tr.querySelector("a.b").classList.replace("limitQuerying","limitQueried");
            else tr.querySelector("a.b").classList.add("limitQueried");

            var isGameLimited = false;
            doc = domparser.parseFromString(res.responseText, "text/html");
            if(doc.getElementById("category_block")==null)
            {
                tr.querySelector("a.b").classList.remove("limitQuerying");
                msg.removeEventListener("click",retry);
                msg.href = `https://store.steampowered.com/app/${tr.dataset.appid}/`;
                msg.setAttribute("target","_blank");
                if(doc.getElementById("error_box")!=null)msg.innerHTML='游戏锁区';
                else
                {
                    tr.querySelector("a.b").classList.remove("limitQueried");
                    msg.innerHTML='因偏好设置无法获取，点此设置';
                }
                msg.style.color="sandybrown";
            }
            else
            {
                msg.remove();
                if(doc.getElementById("category_block").querySelectorAll(".learning_about").length!=0)isGameLimited = true;
                if(isGameLimited)tr.querySelector("a.b").outerHTML+='<span style="font-size: 14px;color: red;margin: 10px;" class="limited">×</span>';
                else tr.querySelector("a.b").outerHTML+='<span style="font-size: 14px;color: green;margin: 10px;" class="unlimited">√</span>';
            }
        }
        else
        {
            tr.querySelector("a.b").classList.remove("limitQuerying");
            msg.innerHTML='受限查询失败，点击重试';
            msg.style.color="sandybrown";
        }
    }
    function timeOut()
    {
        tr.querySelector("a.b").classList.remove("limitQuerying");
        msg.innerHTML='查询超时，点击重试';
        msg.style.color="sandybrown";
    }
    function error()
    {
        tr.querySelector("a.b").classList.remove("limitQuerying");
        msg.innerHTML='受限查询失败，点击重试';
        msg.style.color="sandybrown";
    }
    function retry(){ getLimitedInfo(tr); }
}