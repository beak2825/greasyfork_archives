// ==UserScript==
// @name         美团替换页面和声音次数
// @namespace    mt_change
// @version      0.12
// @description  美团替换页面和声音次数1
// @author       fidcz
// @include      *yiyao.meituan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meituan.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442972/%E7%BE%8E%E5%9B%A2%E6%9B%BF%E6%8D%A2%E9%A1%B5%E9%9D%A2%E5%92%8C%E5%A3%B0%E9%9F%B3%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442972/%E7%BE%8E%E5%9B%A2%E6%9B%BF%E6%8D%A2%E9%A1%B5%E9%9D%A2%E5%92%8C%E5%A3%B0%E9%9F%B3%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 历史订单页面: https://yiyao.meituan.com/#/v2/order/history
    // 退款订单页面: https://yiyao.meituan.com/#/v2/order/refund/unprocessed
    // 催单订单页面: https://yiyao.meituan.com/#/v2/order/reminder

    const myJsUrl = 'https://fidcz.coding.net/p/fidcz_version/d/bl_tools/git/raw/master/js/yiyao.meituan.com';
    const replaceJsUrl = [
        '/static/624ee951/js/page/root.js',
        '/static/624ee951/js/page/order/search.js',
        '/static/624ee951/js/page/order/reminder/order_reminder.js',
        '/static/624ee951/js/page/order/history.js',
        '/static/624ee951/js/page/order/refund/unprocessed.js'
        ]

    require = function(a,b,c,d){
        //console.log('myJs Req');
        //console.log(a,b,c,d);
        if (replaceJsUrl.includes(a[0])){
            console.log('FIND AND REPLACE!!!');
            a[0] = myJsUrl + a[0];
            // return;
        }
        requirejs(a,b,c,d);
    }
    require.config = function(a){
        //console.log('myJs Con')
        //console.log(a);
        requirejs.config(a);
    }

        function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function changeEle(id, loop, ogg){
        var ele = document.getElementById(id);
        //console.log(ele);
        if(ele == undefined){return;}
        //console.log('<div id="' + id + '" data-loop="' + loop + '" data-src="' + ogg + '"></div>');
        ele.setAttribute("data-loop", loop);
        ele.setAttribute("data-src", ogg);

        //ele.innerHTML='<div id="' + id + '" data-loop="' + loop + '" data-src="' + ogg + '"></div>';
    }
    console.log('Change Require');

    async function setLoop() {
        for(let i=0;i<=20;i++){
            //$("#refund-audio").attr("data-loop", "1");
            //$("#new-order-audio").attr("data-src", "newOrderx.ogg");
            //$("#reminder-audio").attr("data-loop", "1");
            changeEle("refund-audio", "1", "refundSound1.ogg");
            changeEle("reminder-audio", "1", "reminderSound1.ogg");
            await sleep(500);
        }
            console.log("Auto change end");
    }
    console.log("Start modify loop");

    window.onload = ()=>{
        changeEle("refund-audio", "1", "refundSound1.ogg");
        changeEle("reminder-audio", "1", "reminderSound1.ogg");
        setLoop();
    }


    // Your code here...
})();