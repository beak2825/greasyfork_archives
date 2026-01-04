// ==UserScript==
// @name         京麦商家shop.jd.com订单详情页面美化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  qq806350554
// @author       You
// @match        https://neworder.shop.jd.com/order/orderDetail?*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422327/%E4%BA%AC%E9%BA%A6%E5%95%86%E5%AE%B6shopjdcom%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/422327/%E4%BA%AC%E9%BA%A6%E5%95%86%E5%AE%B6shopjdcom%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('head').append("<style>\
.wb-table thead {background-color: #ffffff33;}\
.wb-table .act, .wb-table tbody tr:hover {background-color: #fdf6f022;}\
.wb-btn-gray-bd:hover {color: #3f3e3e}\
.state-contant {border: 0px solid #d0e4c2;background: #fcfffa77;border-radius: 5px;box-shadow:inset 2px 2px 2px #c0c0c0, inset -2px -2px 2px #ffffff;}\
#ycfhtx{display:none}.wb-btn-s:hover:before {left: 100%;}\
.wb-btn-l:hover, .wb-btn-m:hover,.wb-btn-s:hover{box-shadow: inset 4px 3px 4px -5px #000, inset -4px -3px 4px -5px #fff;}\
.wb-btn-s{background: #ffffff00;text-decoration: none; border: 0px solid rgb(146, 148, 248);box-shadow:-1px -1px 7px 0px #fff, 1px 1px 8px -2px #000;border-radius: 3px;position: relative;overflow: hidden;}\
.wb-btn-s:before{content:'';position: absolute;top: 0;left: -100%;width: 100%;height: 100%;background:linear-gradient( 120deg, transparent, rgba(146, 148, 248, 0.4),transparent);transition: all 650ms;}\
.thickbox {background: #ffffff33;backdrop-filter: blur(10px);}\
.thickbox {box-shadow: -1px -2px 3px #fff, 2px 2px 4px #5c5c5c;border: 0px solid #e1e1e1;}\
.notes-info textarea {border: 0px solid #D7D7D7;    box-shadow: inset 2px 2px 2px #c0c0c0, inset -2px -2px 2px #ffffff;background: #ffffffdd;border-radius: 5px;}\
.wb-btn-l, .wb-btn-m {background: #ffffffa1;border: 0px solid rgb(146, 148, 248);box-shadow: -1px -1px 7px 0px #fff, 1px 1px 8px -2px #000;border-radius: 3px;    color: red;}\
.wb-btn-loading, .wb-btn-red, .wb-btn-red:hover {border: 0px;}\
</style>");


var player = new Audio("https://downsc.chinaz.net/Files/DownLoad/sound1/202004/12838.mp3");


$("button").hover(function(){
//   player.play();

});

    let bd={
       "background":"url( https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images) no-repeat",
        "background-repeat-y": "repeat",
        "background-attachment":"fixed",
        "background-size":"100%",
        "height":"2100px"
    }
    let maindiv={
        "background-color": "rgba(255, 255, 255,0.55)",
        "border-radius": "6px",
         "backdrop-filter":"blur(10px)",
        "box-shadow": "rgba(0, 0, 0, 0.267) 6px 6px 10px 1px",
        "background-image":"linear-gradient(-20deg, #e9defa55 0%, #fbfcdb55 100%)",
         "border-top": "1px solid #fff",
        "border-left": "1px solid #fff"
    }
    let main={
        "background-color":"rgba(255,255,255,0)"
    }
    let foot={
        "display":"none"
    }

    $("body").css(bd)
    $(".main>div").css(maindiv)
    $(".main").css(main)
    $(".order-footer-text").css(foot)
    $(".commodity_img").css("border-radius","50%")
    $("#viewOrderMobile").click()
    $(".pubwhite").slice(0,5).html("")
    $("p[name='dongdongICON']").css("display","none")
    // Your code here...
})();