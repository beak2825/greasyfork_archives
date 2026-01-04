// ==UserScript==
// @name         天猫捡漏助手 By Tony
// @namespace    http://www.abmbio.xin/
// @version      1.1
// @description  天猫捡漏助手自动刷新工具，自动提醒，By www.abibio.xin
// @author       Tony
// @include      https://detail.tmall.com/item.htm?*
// @include      https://buy.tmall.com/order/confirm_order.htm?*
// @grant        none
// @icon         https://www.abmbio.xin/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/380384/%E5%A4%A9%E7%8C%AB%E6%8D%A1%E6%BC%8F%E5%8A%A9%E6%89%8B%20By%20Tony.user.js
// @updateURL https://update.greasyfork.org/scripts/380384/%E5%A4%A9%E7%8C%AB%E6%8D%A1%E6%BC%8F%E5%8A%A9%E6%89%8B%20By%20Tony.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('script');
    script.src = "https://www.abmbio.xin/default/js/jQuery-2.2.0.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    if(window.location.host == "detail.tmall.com"){
        setTimeout(function(){
            var dotimer = setInterval(function(){
                if(document.readyState == 'complete'){
                    console.log("%c Tony Blog %c","background:#f26522; color:#ffffff","","https://www.abmbio.xin");
                    console.log("%c  温馨提示    %c","background:#f26522; color:#ffffff","","页面加载完毕");
                    dothat();
                    clearInterval(dotimer);
                }else{
                    console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","等待网页加载完全。。。");
                }
            },2000);

        },1000);

    }else if(window.location.host == "buy.tmall.com"){
        var dotimer = setInterval(function(){
            if(document.readyState == 'complete'){
                console.log("%c Tony Blog %c","background:#f26522; color:#ffffff","","https://www.abmbio.xin");
                console.log("%c  温馨提示    %c","background:#f26522; color:#ffffff","","页面加载完毕");
                $('.order-submitOrder a').click();
                clearInterval(dotimer);
            }else{
                console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","等待网页加载完全。。。");
            }
        },200);
    }

    function dothat(){
        if($('.tb-action>span').text() == "还有机会"){
            location.reload();
        }else{
            document.getElementById('J_LinkBuy').click();
            console.log("%c  温馨提示    %c","background:#000; color:#ffffff","","搞到了，搞到了。。。");
            document.getElementById('tonyauto').src = "http://data.huiyi8.com/2017/gha/03/17/1702.mp3";
        }
    }

})();