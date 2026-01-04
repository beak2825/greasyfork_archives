// ==UserScript==
// @name         笔趣阁去广告z
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  笔趣阁去广告,上方,左右,右下角!
// @author       MorningBOBO(Fix by ZghSgi，只是修改一下网址，方便用于其他类似笔趣阁阅读的网站)
// @include      *://www.ciymao.com/chapter/*/*.html
// @include      /.*www\.bqg44\.net\/book\/\d+\/\d+\.html/
// @include      /.*www\.shubao2s\.net\/\d+_\d+\/\d+\.html/
// @include      *biquge.*

// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/425504/%E7%AC%94%E8%B6%A3%E9%98%81%E5%8E%BB%E5%B9%BF%E5%91%8Az.user.js
// @updateURL https://update.greasyfork.org/scripts/425504/%E7%AC%94%E8%B6%A3%E9%98%81%E5%8E%BB%E5%B9%BF%E5%91%8Az.meta.js
// ==/UserScript==

(function() {
    var h1 = $('h1')[0];
    var content = $('#content');
    var bottem;
    var bottems=$('[class^=bottem]');
    if(bottems.length==0){
        bottem = $('.read_nav')[0];
    }else{
        bottem=bottems[0];
    }
    //清除正文中的广告
    $("#content > p").remove();
    $("[src*='baidu.com']").remove();
    setTimeout(function(){
        $("#cs_DIV_cscpvrich9192B").remove();
        $("#cs_CFdivdlST_B_0").remove();
        $("#cs_CFdivdlST_B_1").remove();
        console.log("删除了");
    },1000);

    var boxs = document.getElementsByClassName('box_con');
    boxs[0].children[3].remove()

})();