// ==UserScript==
// @name         小米搶折價卷250
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/sales2020/cny
// @include      https://event.mi.com/tw/sales2020/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374166/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7250.user.js
// @updateURL https://update.greasyfork.org/scripts/374166/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7250.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert=function(){};
    window.addEventListener('load', function() {
    setInterval(function() {
        $.getJSON( "https://hd.c.mi.com/tw/eventapi/api/raffle/drawinfo?tag=cny-tw-ym", function( json ) {
            var check_num = json.data.info["1371"];
            var display = $(".J_couponArea:nth-child(1) > .received-coupon").css('display');

            if(check_num == 2){ //可以抽獎
                if(display == "none") //頁面無刷新
                    location.reload();
                else if(display == "inline")
                    $(".J_couponArea:nth-child(1)").click();
            }
        });
    }, 300);
    /*
    setInterval(function() {
        $(".J_couponArea:nth-child(1)").click();
    }, 300);
    */
    }, false);
/*
    $(".J_couponArea:nth-child(1)").click(function(){
        $(".J_couponArea").removeAttr("disabled");
    });
*/

})();