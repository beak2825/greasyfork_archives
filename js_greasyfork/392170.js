// ==UserScript==
// @name         小米有品1元秒杀助手
// @namespace    http://www.abmbio.xin/
// @version      0.1
// @description  小米有品1元秒杀助手，By www.abibio.xin
// @author       Tony
// @include      https://www.xiaomiyoupin.com/detail?gid=1*
// @include      https://www.xiaomiyoupin.com/checkoutcard?quickOrder=1*
// @icon         https://www.abmbio.xin/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392170/%E5%B0%8F%E7%B1%B3%E6%9C%89%E5%93%811%E5%85%83%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/392170/%E5%B0%8F%E7%B1%B3%E6%9C%89%E5%93%811%E5%85%83%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

            var _hmt = _hmt || [];
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?7f9964d6e2815216bcb376aa3325f971";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);

    if(window.location.href.indexOf("www.xiaomiyoupin.com/detail?gid=") !==-1){
        var dotimer = setInterval(function(){
            if(document.readyState == 'complete'){
                console.log("%c Tony Blog %c","background:#f26522; color:#ffffff","","https://www.abmbio.xin");
                console.log("%c  温馨提示    %c","background:#f26522; color:#ffffff","","页面加载完毕");
                if($('.m-btn-gradient').length){
                    setTimeout(function(){

                        setInterval(function(){
                            $('.m-btn-gradient').click();
                        },100);
                    },2000);
                }else{
                    //alert('当前页面没开启秒杀状态！,1s后自动刷新！')
                    setTimeout(function(){
                        location.reload();
                    },2000);
                }
                clearInterval(dotimer);
            }else{
                console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","等待网页加载完全。。。");
            }
        },200);


    }

    if(window.location.href.indexOf("https://www.xiaomiyoupin.com/checkoutcard?quickOrder=1") !==-1){
        var dotimer2 = setInterval(function(){
            if($('.freeInfo-value')){
                console.log("%c Tony Blog %c","background:#f26522; color:#ffffff","","https://www.abmbio.xin");
                console.log("%c  温馨提示    %c","background:#f26522; color:#ffffff","","页面加载完毕");
                if($('.freeInfo-value').text().indexOf('11') !== -1){
                    setInterval(function(){
                        $('.m-btn-brown').click();
                    },100);
                }
                else{
                    alert('价格不对,停止提交！')
                }
                clearInterval(dotimer2);
            }
            else{
                console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","等待网页加载完全。。。");
            }
        },200);
    }
})();