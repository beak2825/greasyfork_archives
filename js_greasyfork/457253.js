// ==UserScript==
// @name         游侠网显示下载链接
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  游侠网显示下载链接脚本,删除部分广告，增加新的按钮一处
// @author       You
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @match        https://down.ali213.net/pcgame/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ali213.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457253/%E6%B8%B8%E4%BE%A0%E7%BD%91%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/457253/%E6%B8%B8%E4%BE%A0%E7%BD%91%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".detail_game_l_r_down_l2 a").addClass("xzdz").css("background-color","#40c048").attr({"href":"http://www.soft5566.com:880/down/" + downID+ "-1.html","target":"_blank"});
    $(".detail_game_l_r_down_l2 a span").text("偷偷下载")
    $(".zwxz").text("").append('<a target="_blank" href="http://www.soft5566.com:880/down/' + downID+ '-1.html">立即下载</a>')
    setTimeout(function(){
        $(".ali-index-bg span").click();
        $(".box514").remove();
    },2000)
})();