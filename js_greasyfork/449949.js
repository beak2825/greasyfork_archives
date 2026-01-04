// ==UserScript==
// @name         B站！我受够了消息轰炸（屏蔽广告、自动跳转动态页、自动投币）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站短视频化后,无疑间成了消耗碎片时间的大杀器.对此针对网页版进行了限制！；
//               1. 针对首页进行了强制跳转到动态页的功能
//               2. 关闭了动态页右侧的广告
//               3. 自动投币
// @author       Liu Long
// @match        www.bilibili.com/*
// @match        t.bilibili.com/*
// @grant        none
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/449949/B%E7%AB%99%EF%BC%81%E6%88%91%E5%8F%97%E5%A4%9F%E4%BA%86%E6%B6%88%E6%81%AF%E8%BD%B0%E7%82%B8%EF%BC%88%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E3%80%81%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8A%A8%E6%80%81%E9%A1%B5%E3%80%81%E8%87%AA%E5%8A%A8%E6%8A%95%E5%B8%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/449949/B%E7%AB%99%EF%BC%81%E6%88%91%E5%8F%97%E5%A4%9F%E4%BA%86%E6%B6%88%E6%81%AF%E8%BD%B0%E7%82%B8%EF%BC%88%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E3%80%81%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8A%A8%E6%80%81%E9%A1%B5%E3%80%81%E8%87%AA%E5%8A%A8%E6%8A%95%E5%B8%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //预设值的值
    const OPEN_AUTO_REDIRECT = true;//                                     （true / false）开启重定向，主页会自动跳转到动态页
    const OPEN_HIDE_ADV = true;//                                          （true / false）开启屏蔽广告，！动态页！右侧的广告自动隐藏
    const OPEN_AUTO_INSERT_COIN = true;//                                  （true / false）开启自动投币功能，每点击一个视频自动投币
    const DEFAULT_INSERT_COIN_NUMS = 2;//                                  （1-2） 每次看完视频默认投n个硬币）
    const DEFAULT_SELECT_LIKE = 1;//                                       （0-1） 每次看完视频默认 || 不点赞(0) / 点赞(1)
    const INSERT_COIN_NUMS_PER_DAY = 5;//                                  （0-5） 每天最多投币数(5)

    //接口
    const INSERT_COIN_INTERFACE_URL = "https://api.bilibili.com/x/web-interface/coin/add"; // 投硬币接口
    const COIN_FLOW_INTERFACE = "https://api.bilibili.com/x/member/web/coin/log?jsonp=jsonp"; // 硬币流水接口
    //全局变量
    var curr_video_aid = 0;
    var check_video_async_refresh_interval = 5000;//（100-999999）5000毫秒的间隔,判断视频是否异步跳转了,该值越小越精确，系统开销也越大

    //程序入口
    main();

    function main(){

        const index_page_flag = "?spm_id_from";
        const myDynamic_page_flag = "t";
        const mian_page_flag = "www";

        let current_top_domain_name = getTopDomainName();
        let current_url_flag_name = getUrlFlagName();

        //alert(current_top_domain_name + " | " + current_url_flag_name);
        if( current_top_domain_name != "" || current_url_flag_name != "" ){
            //判断是否是当前什么页
            if(current_top_domain_name == myDynamic_page_flag){
                //我的动态也
                if(OPEN_HIDE_ADV){hidenAdv_DynamicPage()}
            }else if(current_top_domain_name == mian_page_flag){
                //主页
                if(current_url_flag_name.indexOf(index_page_flag)==0 || current_url_flag_name == "" ){
                    //是主页进行跳转
                    if(OPEN_AUTO_REDIRECT){redirectToDynamicPage()}
                }else{
                    //暂时不做相关操作
                    //该页面一般指向video、anim、popular、movie等二级页
                    if(current_url_flag_name.indexOf("video") != -1){
                        //判断视频是否异步刷新了
                        if(OPEN_AUTO_INSERT_COIN){setInterval(checkVideoPageAsyncRefresh,check_video_async_refresh_interval);}
                    }
                    if(current_url_flag_name.indexOf("bangumi") != -1){
                        //判断视频是否异步刷新了
                        if(OPEN_AUTO_INSERT_COIN){setInterval(checkVideoPageAsyncRefresh,check_video_async_refresh_interval);}
                    }
                    if(current_url_flag_name.indexOf("cheese") != -1){
                        //判断视频是否异步刷新了
                        if(OPEN_AUTO_INSERT_COIN){setInterval(checkVideoPageAsyncRefresh,check_video_async_refresh_interval);}
                    }
                }
            }
        }
    }

    ///
    // 检测video页是否进行了异步刷新
    // True:进行了异步刷新
    // curr_video_aid 全局变量，存储当前稿件的id值
    // ps:如果进行了异步刷新,则转入自动投币功能
    function checkVideoPageAsyncRefresh(){;
        if(curr_video_aid != aid){
            curr_video_aid = aid;
            //console.log("检测到页面发生异步刷新！");
            autoInsertCoin();
            //return true;
        }else{
            //return false;
        }
    }

    function autoInsertCoin(){
        if(typeof(aid) == "undefined"){
            console.log("阻塞：aid未定义,请检查url匹配是否在正确！");
            return false;
        }
        if(getCsrfFromCookie("bili_jct") == ""){
            console.log("阻塞：cookie未找到bili_jct！")
        }
        //该aid是网页自带的值,可以直接拿来调用
        let curr_aid = aid;
        let curr_multiply = DEFAULT_INSERT_COIN_NUMS;
        let curr_select_like = DEFAULT_SELECT_LIKE;
        let curr_cross_domain = true;
        let curr_csrf = getCsrfFromCookie("bili_jct");

        //投币
        let insertedCoinNums = GetToDayInsertedCoinNums();
        console.log("今日投币情况（不计入本次视频投币前）: (",insertedCoinNums<=INSERT_COIN_NUMS_PER_DAY?insertedCoinNums:INSERT_COIN_NUMS_PER_DAY," / ",INSERT_COIN_NUMS_PER_DAY,")");
        if(insertedCoinNums < INSERT_COIN_NUMS_PER_DAY){
            //已经投了4个硬币下一次强制投入1个硬币
            if(insertedCoinNums == 4){
                InsertCoin(curr_aid,1,curr_select_like,curr_cross_domain,curr_csrf,INSERT_COIN_INTERFACE_URL);
                console.log("今日投币已达上限！");
            }else{
                InsertCoin(curr_aid,curr_multiply,curr_select_like,curr_cross_domain,curr_csrf,INSERT_COIN_INTERFACE_URL);
            }
        }
    }

    function GetToDayInsertedCoinNums(){
        let coin_flow_obj = GetCoinFlow(COIN_FLOW_INTERFACE);
        if( coin_flow_obj !=null){
            let flow_list = coin_flow_obj['data']['list'];
            let insertedCoinNums = 0;
            for(let i=0;i<flow_list.length;i++){
                if(flow_list[i]['delta'] < 0 ){
                    let temp_date = getDate_YMD(flow_list[i]['time']);
                    let curr_date = getCurrDate_YMD();
                    let day_deviaction = curr_date - temp_date;
                    if(day_deviaction == 0){
                        insertedCoinNums=insertedCoinNums-flow_list[i]['delta'];
                    }
                }
            }
            return insertedCoinNums;
        }else{
            console.log("阻塞：硬币流水数据出错！");
            return 999;
        }
    }

    function GetCoinFlow(curr_url){
        let coin_flow = null;
        $.ajax({
            type:"GET",
            async:false,
            xhrFields:{withCredentials: true},
            url:curr_url,
            success:(data) => {
                coin_flow=eval(data);
            }
        });
        return coin_flow;
    }

    function getDate_YMD(date_str){
        let temp_date = new Date(Date.parse(date_str));
        temp_date.setHours(0);
        temp_date.setMilliseconds(0);
        temp_date.setMinutes(0);
        temp_date.setSeconds(0);
        return temp_date;
    }

    function getCurrDate_YMD(){
        let temp_date = new Date();
        temp_date.setHours(0);
        temp_date.setMilliseconds(0);
        temp_date.setMinutes(0);
        temp_date.setSeconds(0);
        return temp_date;
    }

    //投币
    function InsertCoin(curr_aid,curr_multiply,curr_select_like,curr_cross_domain,curr_csrf,curr_url){
        $.ajax({
            type:"POST",
            xhrFields:{withCredentials: true},
            url:curr_url,
            data:
            {
                aid:curr_aid,
                multiply:curr_multiply,
                select_like:curr_select_like,
                cross_domain:curr_cross_domain,
                csrf:curr_csrf
            },
            success:(data) => {
                //console.log(data)
            }
        });
    }

    function getCsrfFromCookie(cookie_name){
        var allcookies = document.cookie;
        //索引长度，开始索引的位置
        var cookie_pos = allcookies.indexOf(cookie_name);
        // 如果找到了索引，就代表cookie存在,否则不存在
        if (cookie_pos != -1) {
            // 把cookie_pos放在值的开始，只要给值加1即可
            //计算取cookie值得开始索引，加的1为“=”
            cookie_pos = cookie_pos + cookie_name.length + 1;
            //计算取cookie值得结束索引
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            if (cookie_end == -1) {
                cookie_end = allcookies.length;
            }
            //得到想要的cookie的值
            var value = unescape(allcookies.substring(cookie_pos, cookie_end));
        }
        return value;
    }

    function hidenAdv_DynamicPage(){
        $(function(){$(".right").hide();});
    }

    function redirectToDynamicPage(){
        window.location.href="https://t.bilibili.com/?tab=video";
    }

    function getTopDomainName(){
        var current_url=window.location.href;
        var url_reg=/https:\/\/(www|t).*?\/(.*?\?spm_id_from)?.*/g
        if(url_reg.test(current_url)){
            return RegExp.$1;
        }else{
            console.log("阻塞：URL校对发生错误！请校对脚本！")
            return "";
        }
    }

    function getUrlFlagName(){
        var current_url=window.location.href;
        var url_reg=/https:\/\/(www|t).*?\/(.*)/g
        if(url_reg.test(current_url)){
            return RegExp.$2;
        }else{
            console.log("阻塞：URL校对发生错误！请校对脚本！")
            return "";
        }
    }

})();