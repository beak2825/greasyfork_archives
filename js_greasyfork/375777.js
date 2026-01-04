 // ==UserScript==
// @name         QQ空间去除广告改背景
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       B.Author.H
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match        https://user.qzone.qq.com/414641729/infocenter
// @match        *://user.qzone.qq.com/*
// @match        https://user.qzone.qq.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375777/QQ%E7%A9%BA%E9%97%B4%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E6%94%B9%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/375777/QQ%E7%A9%BA%E9%97%B4%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E6%94%B9%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    document.getElementById("layBackground").style.cssText="background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);";
    document.getElementsByClassName("layout-body")[0].style.cssText="background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);";
    document.getElementById("applist_html").parentNode.style.visibility="hidden";
    var adhtml = '<li id="tab_menu_changebg" type="mv"><a href="javascript:;" class="qz-grid" accesskey="m"><div class="qz-left"><i class="ui-icon sp-video"></i></div><div class="qz-right"><span class="sn-count none" id="tab_menu_mv_changebg">0</span></div><div class="qz-main"><span class="sn-title">切换背景</span></div></a></li>';
    document.getElementById("tab_menu_list").insertAdjacentHTML("afterbegin",adhtml);
    var ct = 5;
    document.getElementById("tab_menu_changebg").addEventListener('click',function(){
            if(ct == 5){
                document.getElementById("layBackground").style.cssText="background-image: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);";
                document.getElementsByClassName("layout-body")[0].style.cssText="background-image: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);";
            }else if(ct == 4){
                document.getElementById("layBackground").style.cssText="background-image: linear-gradient(to right, #ec77ab 0%, #7873f5 100%);";
                document.getElementsByClassName("layout-body")[0].style.cssText="background-image: linear-gradient(to right, #ec77ab 0%, #7873f5 100%);";
            }
            else if(ct == 3){
                document.getElementById("layBackground").style.cssText="background-image: linear-gradient(-225deg, #20E2D7 0%, #F9FEA5 100%);";
                document.getElementsByClassName("layout-body")[0].style.cssText="background-image: linear-gradient(-225deg, #20E2D7 0%, #F9FEA5 100%);";
            }
            else if(ct == 2){
                document.getElementById("layBackground").style.cssText="background-image: linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%);";
                document.getElementsByClassName("layout-body")[0].style.cssText="background-image: linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%);";
            }
            else if(ct == 1){
                document.getElementById("layBackground").style.cssText="background-image: linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%);";
                document.getElementsByClassName("layout-body")[0].style.cssText="background-image: linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%);";
            }
            if(ct == 0){
                document.getElementById("layBackground").style.cssText="background-image: linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%);";
                document.getElementsByClassName("layout-body")[0].style.cssText="background-image: linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%);";
                 ct=5;
            }
        ct--;
    });

})();