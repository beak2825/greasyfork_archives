// ==UserScript==
// @name         版主工具-统计点赞赠送数
// @namespace    http://cool18.com/
// @version      0.21
// @description  YOLO!
// @license      MIT
// @author       lyabc@6park.com
// @match        https://www.cool18.com/bbs6*app=forum&act=threadview&tid*
// @match        https://www.cool18.com/bbs6/index.php
// @match        https://www.cool18.com/bbs6/index.php?app=forum&act=cachepage&cp=tree*
// @match        https://www.cool18.com/bbs6/index.php?app=forum&act=list&pre=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469296/%E7%89%88%E4%B8%BB%E5%B7%A5%E5%85%B7-%E7%BB%9F%E8%AE%A1%E7%82%B9%E8%B5%9E%E8%B5%A0%E9%80%81%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/469296/%E7%89%88%E4%B8%BB%E5%B7%A5%E5%85%B7-%E7%BB%9F%E8%AE%A1%E7%82%B9%E8%B5%9E%E8%B5%A0%E9%80%81%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //------------------------
    //configuration
    //最小加精决定数
    const DECIDER_MIN=60;
    //回复贴所能增加的决定数
    const REPLY_MAX_DECIDER_NO=20;
    //金币贴的金币礼物所能增加的决定数
    const GIFT_MAX_DECIDER_NO=20;
    //基金奖励代表的决定数
    const REWARD_DECIDER_NO=10;
    //----------------------
    function isGoldListed(url,gold_list){
        if(!Array.isArray(gold_list)){
            console.log("not array");
            return false;}
        var a;
        for (var i=0;i<gold_list.length;i++){
            a=gold_list[i];

            if (a.href.indexOf(url)!=-1 || a.href==url||url.indexOf(a.href)!=-1){
                return true;
            }else{
                // console.log(a.href);
                // console.log(url);
                // console.log('\n');
            }
        }
        return false;
    }
    function isCoinedPost(doc){
        const coinedTitleElement=doc.querySelector("body > table:nth-child(4) > tbody > tr:nth-child(2) > td > pre > h3")
        if(coinedTitleElement) return true;
        return false;
    }
    function get_stats_single(gold_list){
        //统计点赞赠送以及回帖数 -- 帖子页面
        let str_selector="body > table:nth-child(7) > tbody > tr > td > ul > li"
        let str_selector_user="body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1)"
        var i_vote=0; var i_reply=0; var i_gift=0; var i_reward=0; var user=""; var title=""; var ret=""; var url=""; var tid="";
        user=document.querySelector(str_selector_user).innerHTML;
        title=document.querySelector("body > table:nth-child(4) > tbody > tr:nth-child(2) > td > center > font > b").innerHTML;
        url=location.href;
        tid= url.substring(url.lastIndexOf('=') + 1);
        document.querySelectorAll(str_selector).forEach(function myfunc(item){
            var ulElement = item.querySelector("ul"); // 获取要操作的 <ul> 节点
            while (ulElement.firstChild) {
                ulElement.removeChild(ulElement.firstChild);
            }
            if(item.innerHTML.indexOf("点“赞”支持3银元奖励")!= -1) {i_vote++;}
            else if(item.innerHTML.indexOf("给 "+user)!= -1 & item.innerHTML.indexOf("(^-^)")!= -1){ i_gift++;}
            else if(item.innerHTML.indexOf("已经使用版块基金对")!=-1){i_reward++;}
            else if(item.innerHTML.indexOf("已经给")!=-1&&item.innerHTML.indexOf("加上")!=-1){i_reward++;}
            else {i_reply++;}
        })
        var reg_i_decider=0;
        if(isCoinedPost(document)) {
            ret=ret+"\n金币贴: 是";
            reg_i_decider=Math.min(i_gift,GIFT_MAX_DECIDER_NO)+i_vote+i_reward*REWARD_DECIDER_NO+Math.min(i_reply,REPLY_MAX_DECIDER_NO)
        }else{
            ret=ret+"\n金币贴: 否";
            reg_i_decider=i_vote+i_gift+i_reward*REWARD_DECIDER_NO+Math.min(i_reply,REPLY_MAX_DECIDER_NO)
        }

        ret=ret+"\n送交者:" +user;
        ret=ret+"\n标题:" +title;
        ret=ret+"\n点赞数:"+i_vote;
        ret=ret+"\n礼物数:"+i_gift;
        ret=ret+"\n回帖数:"+i_reply;
        ret=ret+"\n奖励数:"+i_reward;
        ret=ret+"\n决定数:"+(reg_i_decider);
        if(isGoldListed(tid,gold_list)){
            ret=ret+"\n已经加精:是\n";
        }else{
            ret=ret+"\n已经加精:否\n";
        }
        alert(ret);
        return ret;
    }
    function get_stats_multiple(gold_list){
        //统计点赞赠送以及回帖数 -- 论坛页面
        let str_selector="#d_list > ul > li"
        let str_selector_user="a > font"
        var res=""
        var ret=""
        var simp_res=""

        var post_lis=document.querySelectorAll(str_selector);
        post_lis.forEach((e)=>{
            var i_vote=0; var i_reply=0; var i_gift=0; var i_reward=0; var user=""; var title=""; ret="";var url="";var tid="";
            user=e.querySelector(str_selector_user).innerHTML;
            title=e.querySelector("a").innerHTML;
            url=e.querySelector("a").href.trim();
            tid= url.substring(url.lastIndexOf('=') + 1);

            e.querySelectorAll(" #d_list > ul > li>ul > li > a").forEach(function myfunc(item){
                var ulElement = item.querySelector(" ul"); // 获取要操作的 <ul> 节点
                // if(ulElement){
                //     while (ulElement.firstChild) {
                //         ulElement.removeChild(ulElement.firstChild);
                //     }}
                if(item.innerHTML.indexOf("点“赞”支持3银元奖励")!= -1) {i_vote++;}
                else if(item.innerHTML.indexOf("给 "+user)!= -1 & item.innerHTML.indexOf("(^-^)")!= -1){ i_gift++;}
                else if(item.innerHTML.indexOf("已经使用版块基金对")!=-1){i_reward++;}
                else if(item.innerHTML.indexOf("已经给")!=-1&&item.innerHTML.indexOf("加上")!=-1){i_reward++;}
                else {i_reply++;
                     }

            })

            var reg_i_decider=i_vote+i_gift+i_reward*REWARD_DECIDER_NO+Math.min(i_reply,REPLY_MAX_DECIDER_NO)
            // ret=ret+"\n金币贴: 未知";
            ret=ret+"\n送交者:" +user;
            ret=ret+"\n标题:" +title;
            ret=ret+"\n点赞数:"+i_vote;
            ret=ret+"\n礼物数:"+i_gift;
            ret=ret+"\n回帖数:"+i_reply;
            ret=ret+"\n奖励数:"+i_reward;
            ret=ret+"\n暂时数:"+(reg_i_decider);
            if(isGoldListed(tid,gold_list)){
                ret=ret+"\n已经加精:是\n";
            }else{
                ret=ret+"\n已经加精:否\n";
            }

            if(reg_i_decider>=DECIDER_MIN &&!(isGoldListed(tid,gold_list))){

                // alert(ret);
                window.open(url, "_blank");
            }
            res=res+ret;
        })

        return res
    }
    function doStatsAgainstGoldPage(){
        var gold_list;
        var gold_list_url="https://www.cool18.com/bbs6/index.php?app=forum&act=gold";
        GM.xmlHttpRequest({
            method: "GET",
            url: gold_list_url,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/xml"
            },
            onload: function(response) {
                var doc=null;
                doc=new DOMParser()
                    .parseFromString(response.responseText, "text/html");
                gold_list=Array.from(doc.querySelectorAll("#thread_list > li> a"))
                var url=location.href;var ret='';
                if (url.indexOf("act=threadview")==-1){
                    ret= get_stats_multiple(gold_list);
                    alert("当前页面点赞统计已经复制到粘贴板，或者可以按F12打开Javascript控制台查看");
                } else {
                    ret= get_stats_single(gold_list);
                }
                console.log(ret);
                
                GM_setClipboard(ret);
               

            }
        });
    }



    //Create button
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="myButton" type="button">'
        + '点赞数</button>';
    zNode.setAttribute ('id', 'myContainer');
    document.body.appendChild (zNode);
    document.getElementById ("myButton").addEventListener (
        "click", ButtonClickAction, false
    );
    //Button click function
    function ButtonClickAction (zEvent) {
        doStatsAgainstGoldPage();
    }
    //Button style
    GM_addStyle ( `
    #myContainer {
        position:               fixed;
        top:                    80px;
        left:                   30px;
        font-size:              10px;
        background:             orange;
        border:                 1px outset black;
        margin:                 3px;
        opacity:                0.5;
        z-index:                9999;
        padding:                2px 2px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );
})();