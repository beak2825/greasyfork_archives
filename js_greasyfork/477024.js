// ==UserScript==
// @name         百万工程
// @namespace    hx
// @version      1.6
// @description  模仿手动方式进行点z，非刷z，默认20一组 每隔15分钟进行一轮 上限200，可自行调整参数，一组z只取按时间排序的近20个进行点z，如已点过z会自动跳过，计数z为确认成功数量，可能存在点上z但没计数的情况，不建议频率过高，以稳为主 细水长流。
// @author       hx
// @match        https://weibo.com/1736988591/*
// @icon         <$ICON$>
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/477024/%E7%99%BE%E4%B8%87%E5%B7%A5%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477024/%E7%99%BE%E4%B8%87%E5%B7%A5%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //版本号
    let version=1.5;
    //点z数量 默认20个一轮
    let number=20;
    //间隔时间 默认20分钟
    let interval=20*60*1000;
    //点z上限 默认200个
    let max=200;

    //当前页面累计点z数
    let locationCount;
    //当前页面链接ID号
    let locationId=$(location).attr('href').match(/com\/(\S){20}/)[0];
    //当前页面标题
    let locationTitle=$(document).attr('title');
    //异常标识
    let locationRest;
    //账号状态
    let locationStatus;
    //完成状态
    let locationFinish;
    //数据记录存储标识，以当日日期作为标识
    let ID=getDate();

    //数据初始化
    locationCountInit();
    //显示计数窗口
    numWindow();
    //执行主函数
    main();

    function main(){
        clickLike();
        setTimeout(function(){
            if(locationCount+1>max){
                console.log("-- 到上限了 --");
                locationFinish=true;
                updateCache(GM_getValue(ID));
                return false;
            }
            main();
        },interval)
    }

    /**
     * 开始一轮
     */
    function clickLike(){
        console.log("-- 开始新一轮 --");
        console.log("-- 今日记录已成功 "+locationCount+" --");
        locationRest=false;
        $(".item:contains('按时间')").click();
        for (let i=0; i<number; i++) {
            setTimeout(function() {
                let $item=$(".item1 .woo-like-iconWrap").eq(i);
                if($item.find("use").attr("xlink:href")=="#woo_svg_like"){
                    if(locationCount+1>max || locationRest){
                        console.log("-- 到上限了 或 异常休息了 --");
                        return false;
                    }
                    $item.click();
                    setTimeout(function(){
                        if($item.find("use").attr("xlink:href")=="#woo_svg_liked"){
                            successLike();
                        }else{
                            if($(".woo-toast-body span")){
                                failLike($(".woo-toast-body span").html());
                            }
                        };
                    },700)
                }
                $(window).scrollTop($(window).scrollTop()+60);
            }, 1000 * (i + 1));
        }
    }

    /**
     * 点z成功执行
     */
    function successLike(){
        locationRest=false;
        locationCount++;
        locationStatus="正常";
        locationFinish=false;
        updateCache(GM_getValue(ID));
        console.log("成功 "+locationCount);
    }

    /**
     * 点z失败执行
     */
    function failLike(status){
        locationRest=true;
        locationStatus=status;
        if(status=="点赞太快了，休息一下再试试吧。"){
            locationFinish=true;
        }else{
            locationFinish=false;
        }
        updateCache(GM_getValue(ID));
    }

    /**
     * 当前页面数据初始化
     */
    function locationCountInit(){
        if(GM_getValue(ID) && GM_getValue(ID)[locationId]){
            locationCount=GM_getValue(ID)[locationId].count;
            locationRest=GM_getValue(ID)[locationId].rest;
            locationStatus=GM_getValue(ID)[locationId].status;
            locationFinish=GM_getValue(ID)[locationId].finish;
        }else{
            locationCount=0;
            locationRest=false;
            locationStatus="正常";
            locationFinish=false;
            updateCache({});
        }
    }

    /**
     * 更新数据
     */
    function updateCache(o){
        let obj=o;
        obj[locationId]={title:locationTitle,count:locationCount,status:locationStatus,finish:locationFinish};
        GM_setValue(ID,obj);
        $('.numWindow .locationCount').html(locationCount);
        $('.numWindow .locationStatus').html(locationStatus);
        $('.numWindow .locationFinish').html(locationFinish?"休息吧，点不动了":"点赞进行中");
        $('.numWindow .updateTime').html(getTime());
    }

    /**
     * 获取当前日期
     */
    function getDate(){
        let date=new Date();
        return ""+date.getFullYear()+(date.getMonth() + 1)+date.getDate();
    }

    /**
     * 获取当前时间
     */
    function getTime(){
        let date=new Date();
        return date.getHours().toString().padStart(2,'0')+":"+date.getMinutes().toString().padStart(2,'0')+":"+date.getSeconds().toString().padStart(2,'0');
    }

    /**
     * 计数窗口
     */
    function numWindow(){
        let contentHtml = "<div class='numWindow'>\n" +
            "<p>版本：V"+version+"</p>\n" +
            "<p>一组："+number+"</p>\n" +
            "<p>间隔："+interval/60/1000+"分钟</p>\n" +
            "<p>上限："+max+"</p>\n" +
            "<p>今日已成功：<span class='locationCount'>"+locationCount+"</span></p>\n" +
            "<p>账号状态：<span class='locationStatus'>"+locationStatus+"</span></p>\n" +
            "<p>点赞状态：<span class='locationFinish'>"+(locationFinish?"休息吧，点不动了":"点赞进行中")+"</span></p>\n" +
            "<p>更新时间：<span class='updateTime'></span></p>\n" +
            "</div>";
        $('.numWindow').remove();
        $("body").append(contentHtml);
        $(".numWindow").css("position","fixed");
        $(".numWindow").css("top","100px");
        $(".numWindow").css("left","20px");
        $(".numWindow").css("z-index","9999");
    }

})();