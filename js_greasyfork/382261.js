// ==UserScript==
// @name         返回顶部、生成二维码脚本
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  返回顶部、生成二维码
// @author       xianlechuanshuo
// @include      *
// @exclude      *://*bilibili*/*
// @exclude      *://pan.baidu.com/*
// @exclude      *://ghbtns.com/*
// @exclude      *://tampermonkey.net/*
// @exclude      *://pagead2.googlesyndication.com/*
// @exclude      *://googleads.g.doubleclick.net/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382261/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E3%80%81%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/382261/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E3%80%81%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var JQ1=jQuery.noConflict();
JQ1(function() {
    'use strict';
    let toTopHtml=`<div id='qrCode' data-status='0'>生成QR</div>
                   <div id="to_top">返回顶部</div>`;

    JQ1("body").append(toTopHtml);
    JQ1("#qrCode,#to_top").css(
    {
        "box-sizing": "content-box",//某些网站会设置为"border-box"，手动改回来默认值"content-box"
        "z-index":"100001",
        "width":"30px",
        "height":"40px",
        "padding":"20px",
        "font":"14px/20px arial",
        "text-align":"center",
        "background":"#06c",
        "position":"fixed",
        "display": "block",
        "right":"1px",
        "bottom":"100px",
        "cursor":"pointer",
        "color":"#fff"
    });
    JQ1("#to_top").css(
    {
        "display": "none",
        "bottom":"10px"
    });
    //绑定【返回顶部】点击事件
    JQ1("#to_top").click(function(){
        JQ1(document).scrollTop(0);
    });
    //绑定【生成QR】点击事件
    JQ1("#qrCode").click(function(){
        let status=JQ1(this).data("status");//"0"表示还没生成过二维码
        if(status=='0'){
            JQ1(this).data("status","1");//"1"表示生成过二维码
            let url=window.location.href;
            // 生成二维码图片
            JQ1("#qrCode").qrcode(encodeURI(url));//针对中文使用encodeURI转码
            JQ1("#qrCode canvas").css(
                {
                    "width":"180px",
                    "height":"180px",
                    "position":"fixed",
                    "right":"1px",
                    "bottom":"100px"
                });
        }
        else{//复原，去掉二维码
           JQ1(this).data("status","0");
           JQ1("#qrCode canvas").remove();
        }
    });
    JQ1(window).scroll(function(){
        //let t=document.documentElement.scrollTop||document.body.scrollTop;
        let t=JQ1(window).scrollTop();
        if(t>100){
            JQ1("#to_top").show();
        }
        else{
            JQ1("#to_top").hide();
        }
    });
});
