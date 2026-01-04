// ==UserScript==
// @name         每日养铁
// @namespace    hx
// @version      1.3
// @description  自动关注养铁池中媒体号进行评论互动，互动博均为媒体号发布过的与宝有关或人畜无害博，养铁池中媒体号分为三级，一级为近期重点养铁脚本运行一次即互动一次，二级为暂不急用慢慢培养脚本运行一次依次取3个媒体号互动，三级为保持铁粉级脚本运行一次依次取2个媒体号互动，养铁池内容将结合实事不定期调整
// @author       hx
// @match        http*://weibo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://greasyfork.org/scripts/477354-%E5%85%BB%E9%93%81%E6%B1%A0/code/%E5%85%BB%E9%93%81%E6%B1%A0.js
// @require      https://greasyfork.org/scripts/477240-%E8%AF%AD%E6%96%99%E5%BA%93-%E5%BE%AE%E5%8D%9A%E8%A1%A8%E6%83%85/code/%E8%AF%AD%E6%96%99%E5%BA%93-%E5%BE%AE%E5%8D%9A%E8%A1%A8%E6%83%85.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/477565/%E6%AF%8F%E6%97%A5%E5%85%BB%E9%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/477565/%E6%AF%8F%E6%97%A5%E5%85%BB%E9%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //版本号
    let version=1.3;
    //数据记录存储标识
    let ID="mryt";
    //养铁媒体号集合
    let accountList=[];
    //养铁媒体号地址集合
    let accountUrl=[];
    //媒体号需完成互动数量标识
    let important=ytc_mth.important.length;
    let common=3;
    let ignore=2;
    //已经完成互动的位置
    let finish;

    //初始化数据
    initData();
    //注册功能菜单
    GM_registerMenuCommand("一键养铁", function (e) {
        GM_openInTab(accountUrl[0],{active:true})
    });

    let n=$.inArray($(location).attr('href'),accountUrl);
    if(n!=-1 && finish==accountUrl.length-1){
        //success();
    }
    if(n!=-1){
        //if(finish==accountUrl.length-1){
            //success();
        //}else{
            setTimeout(function(){
                if($(".woo-button-s .woo-button-content:contains('关注')").length>0){
                    $(".woo-button-s .woo-button-content:contains('关注')")[0].click();
                }
                $(".woo-box-item-inlineBlock i[title='表情']")[0].click();
            },3000);
            setTimeout(function(){
                let bq1=ylk_vbbq[Math.floor(Math.random() * ylk_vbbq.length)];
                let bq2=ylk_vbbq[Math.floor(Math.random() * ylk_vbbq.length)];
                let bq3=ylk_vbbq[Math.floor(Math.random() * ylk_vbbq.length)];
                $(".woo-box-item-inlineBlock div[title='"+bq1+"']")[0].click();
                $(".woo-box-item-inlineBlock div[title='"+bq2+"']")[0].click();
                $(".woo-box-item-inlineBlock div[title='"+bq3+"']")[0].click();
            },6000);
            setTimeout(function(){
                $(".woo-button-content:contains('评论')")[0].click();
                let obj=GM_getValue(ID);
                obj.finish=n;
                GM_setValue(ID,obj);
                //console.log(obj.finish);
            },9000);
            setTimeout(function(){
                if(n==accountUrl.length-1){
                    success();
                }else{
                    window.location.href=accountUrl[n+1];
                }
            },60*1000);
        //}
    }

    function success(){
        let str="今日养铁已完成，共互动 "+accountList.length+" 个媒体号：\n";
        for(let i=0;i<accountList.length;i++){
            str+=accountList[i].title+"，";
        }
        alert(str);
    }

    //初始化数据
    function initData(){
        if(GM_getValue(ID) && GM_getValue(ID).date==getDate()){
            accountList=GM_getValue(ID).accountList;
            accountUrl=GM_getValue(ID).accountUrl;
            finish=GM_getValue(ID).finish;
            //console.log(GM_getValue(ID));
        }else{
            initAccountList();
            GM_setValue(ID,{date:getDate(),accountList:accountList,accountUrl:accountUrl,finish:0});
        }
        //console.log(GM_getValue(ID));
        //console.log(GM_getValue("common"));
        //console.log(GM_getValue("ignore"));
    }

    //初始化媒体号集合
    function initAccountList(){
        let cp=GM_getValue("common")==undefined?0:GM_getValue("common");
        let ip=GM_getValue("ignore")==undefined?0:GM_getValue("ignore");
        for(let i=0; i<important;i++){
            accountList.push(ytc_mth.important[i]);
            accountUrl.push(ytc_mth.important[i].url);
        }
        for(let i=0; i<common;i++){
            let n=cp<ytc_mth.common.length?cp:0;
            accountList.push(ytc_mth.common[n]);
            accountUrl.push(ytc_mth.common[n].url);
            cp=n+1;
        }
        for(let i=0; i<ignore;i++){
            let n=ip<ytc_mth.ignore.length?ip:0;
            accountList.push(ytc_mth.ignore[n]);
            accountUrl.push(ytc_mth.ignore[n].url);
            ip=n+1;
        }
        GM_setValue("common",cp);
        GM_setValue("ignore",ip);
    }

    /**
     * 获取当前日期
     */
    function getDate(){
        let date=new Date();
        return ""+date.getFullYear()+(date.getMonth() + 1)+date.getDate();
    }

})();