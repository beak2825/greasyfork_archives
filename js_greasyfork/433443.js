// ==UserScript==
// @name         樱花动漫去广告,飞极速去广告
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  去除侧边广告，樱花动漫，飞极速
// @author       jackpapapapa
// @include      http://www.yhdm.so/*
// @include      http://fjisu2.com/*
// @include      http://www.yinghuacd.com/*
// @include      http://www.fjisu2.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433443/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E9%A3%9E%E6%9E%81%E9%80%9F%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433443/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%E9%A3%9E%E6%9E%81%E9%80%9F%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('start')
    var start_time = new Date().getTime();
    var restart_time = 200;
    var max_run_time = 3000;
    function wait_call(choose_id,callback){
        var val = setInterval(()=>{
            var choose = $(choose_id)
            //console.log(choose)
            if(new Date().getTime() - start_time>max_run_time){clearInterval(val)}
            if(choose.length>0){
                callback(choose_id);
                clearInterval(val);
            }else{
                console.log('Failed find',choose_id)

            }
            //clearInterval(val);
        },restart_time)
    }

    function removeEle(ad){
         wait_call(ad,
                      (ad)=>{
                console.log('start remove',ad)
                $(ad).remove();
                if($(ad).length<=0){
                    console.log('Successfull remove',ad)
                }else{
                    console.log('Failed',ad)
                }
            })
    }


    var Url = window.location.href
    if(new RegExp('^(http):(\/\/)www.yhdm.so\/*','g').test(Url)){
        var ad_list = ['#HMcoupletDivleft','#HMcoupletDivright','#HMRichBox']
        for(let ad of ad_list){
           removeEle(ad)
        }
    }
    //俩网站同一个模板。。。。。。
    if(new RegExp('^(http):(\/\/)(www.)?fjisu2.com\/*','g').test(Url)){
        var ad2_list = ['#HMcoupletDivleft','#HMcoupletDivright','#HMRichBox']
        for(let ad of ad2_list){
            removeEle(ad)
        }
    }
    if(new RegExp('^(http):(\/\/)(www.)?yinghuacd.com\/*','g').test(Url)){
        var ad3_list = ['#HMcoupletDivleft','#HMcoupletDivright','#HMRichBox']
        for(let ad of ad3_list){
            removeEle(ad)
        }
    }
})();