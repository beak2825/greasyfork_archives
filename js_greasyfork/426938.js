// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @name         虎牙增强@skywoodlin
// @name:zh      虎牙增强@skywoodlin
// @description  虎牙订阅每2分钟自动刷新一次/按照观看人数排序
// @include      https://www.huya.com/myfollow
// @include      https://www.huya.com/g/*
// @author       skywoodlin
// @contributor  skywoodlin
// @version      1.3
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license      LGPLv3
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/426938/%E8%99%8E%E7%89%99%E5%A2%9E%E5%BC%BA%40skywoodlin.user.js
// @updateURL https://update.greasyfork.org/scripts/426938/%E8%99%8E%E7%89%99%E5%A2%9E%E5%BC%BA%40skywoodlin.meta.js
// ==/UserScript==

;jQuery.noConflict();
(async function ($) {
    'use strict';

    function sleep(millisecond) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, millisecond)
        })
    }

    // 订阅页面排序
    function sortNum_subscript(a,b){
        let a_num = $(a).find(".num.total").text();
        let b_num = $(b).find(".num.total").text();
        let a_real_num = parseFloat(a_num.substring(0, a_num.length-1).replace(",",""));
        let b_real_num = parseFloat(b_num.substring(0, b_num.length-1).replace(",",""));
        return b_real_num-a_real_num;
    }

    // 频道分类页面排序
    function sortNum_classify(a,b){
        let a_num = $(a).find(".js-num").text();
        let b_num = $(b).find(".js-num").text();
        let a_real_num = parseFloat(a_num.substring(0, a_num.length-1).replace(",",""));
        let b_real_num = parseFloat(b_num.substring(0, b_num.length-1).replace(",",""));
        return b_real_num-a_real_num;
    }

    // console.log(window.location.href);
    //订阅页面
    if(window.location.href === "https://www.huya.com/myfollow") {
        await sleep(2000);
        // 按观看人数排序
        $(".num.total").closest("li").sort(sortNum_subscript).prependTo(".live-list");
        // 设置每隔3分钟刷新一次
        setInterval(function(){ location.reload(); }, 1000 * 180);
    }

    // 频道分类页面
    if(window.location.href.startsWith('https://www.huya.com/g/')){
       await sleep(2000);
       $(".js-num").closest("li").sort(sortNum_classify).prependTo(".live-list");
    }
})(jQuery);