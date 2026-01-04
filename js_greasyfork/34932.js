// ==UserScript==
// @name         2017双11小米抢券（智能配件）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Coande
// @match        https://www.mi.com/a/h/2937.html?client_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34932/2017%E5%8F%8C11%E5%B0%8F%E7%B1%B3%E6%8A%A2%E5%88%B8%EF%BC%88%E6%99%BA%E8%83%BD%E9%85%8D%E4%BB%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/34932/2017%E5%8F%8C11%E5%B0%8F%E7%B1%B3%E6%8A%A2%E5%88%B8%EF%BC%88%E6%99%BA%E8%83%BD%E9%85%8D%E4%BB%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCoupon() {
        // 抢券点击和计数
        var count = 0;
        localStorage.setItem('isWorking', '1');
        var id = setInterval(function() {
            $('#J_nav > li:nth-child(1) > a').text(`抢券ing...${count}`);
            $('#app > div > div:nth-child(54) > div > div:nth-child(3) > div.coupon.container > ul > li:nth-child(3) > a > img').click();
            $('#app > div > div:nth-child(54) > div > div:nth-child(3) > div.coupon.container > ul > li:nth-child(4) > a > img').click();
            ++count;
        },300);

        // 停止抢券：
        $("#getCoupon").unbind();
        $("#getCoupon").click(function(){
            localStorage.setItem('isWorking', '0');
            $('#J_nav > li:nth-child(1) > a').text('！！开始抢券！！');
            clearInterval(id);
            $("#getCoupon").unbind();
            $("#getCoupon").click(getCoupon);
        });
    }

    // 显示抢券按钮
    var id2 = setInterval(function(){
        if ($("#J_nav").length){
          clearInterval(id2);
          $("#J_nav > li.first").remove();
          $("#J_nav").prepend('<li id="getCoupon" style="background: rgb(219, 195, 146); border-left-color: rgb(255, 255, 255);"><a style="color: rgb(204, 61, 49);">！！开始抢券！！</a></li>');
          $("#getCoupon").click(getCoupon);

          //如果上次没停止则自动继续
          var isWorking = localStorage.getItem('isWorking');
          if (isWorking == '1') {
            $("#getCoupon").click();
          }
        }
    },300);
})();