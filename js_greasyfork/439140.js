// ==UserScript==
// @name         🔥持续更新🔥 自用脚本--界面美化
// @license MIT
// @namespace    https://gitee.com/flyinghat/tampermonkey-self.git
// @version      0.0.5
// @icon         data:image/png;base64,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
// @description  自用脚本--界面美化
// @author       FlyingHat
// @match        *://*.baidu.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/439140/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC--%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/439140/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC--%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var dom = {};
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
    "use strict";
    const callback = function () {
        // Use traditional 'for loops' for IE 11
        switch (location.host) {
            case "www.baidu.com":
                baidu($);
                break;
            default:
                break;
        }
    };
    var time=30000;
    callback();
    setInterval(callback, time);

});

function baidu($) {
    if(location.pathname=="/"){
        if($(".s-skin-container").length==0){
            var style = document.createElement('style');
            var css=".s-skin-container{position:fixed;_position:absolute;top:0;left:0;height:100%;width:100%;min-width:1000px;z-index:-10;background-position:center 0;background-repeat:no-repeat;background-size:cover;-webkit-background-size:cover;-o-background-size:cover;zoom:1}";
            style.innerHTML = css;
            document.head.appendChild(style);
            $("#wrapper").prepend('<div class="s-skin-container s-isindex-wrap rand" style="background-color: rgb(64, 64, 64); background-image: url(https://api.btstu.cn/sjbz/?lx=dongman&v=1643167664975);"></div>');
        }
        if($(".rand").length==1){
            var v=new Date().getTime();
            var imgUrl=['https://api.ixiaowai.cn/mcapi/mcapi.php','https://api.ixiaowai.cn/api/api.php','https://api.ixiaowai.cn/gqapi/gqapi.php',' https://api.dujin.org/bing/1920.php']
            var index= Math.floor(Math.random() * imgUrl.length)
            var url=imgUrl[index];
            $(".rand").css("background-image", "url("+url+"?v="+v+")");
        }
        if($(".s-skin-container").css("background-image")){
            $(".s-skin-container").addClass("rand");
        }
        $("#s_top_wrap").css("background","rgba(0,0,0,.2)");
        $(".c-color-t").css("color","rgba(255,255,255,.85)");
        $("#bottom_layer").remove();
        $("#form").css("opacity",0.8);
        $("#lg").css("opacity",0);
    }


}
