// ==UserScript==
// @name        GoogleStyle
// @namespace   http://tampermonkey.net/
// @version     0.2.11
// @description Google样式修改
// @author      Aldaris
// @include     https://www.google.com/*
// @include     https://www.google.com.*/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/377180/GoogleStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/377180/GoogleStyle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //背景图片
    var bgUrl=getCookie("bgUrl");
    //背景图左边距
    var bgLocFixLeft="0px";
    //背景图上边距
    var bgLocFixTop="-51px";
    var style = document.createElement("style");
    style.type = "text/css";
    //style.appendChild(document.createTextNode("a{color:#fff !important}"));
    style.appendChild(document.createTextNode("div#viewport{background:url('"+bgUrl+"') "+bgLocFixLeft+" "+bgLocFixTop+";}"));
    style.appendChild(document.createTextNode("#prm-pt{display:none;}.FPdoLc{display:none;}"));
    style.appendChild(document.createTextNode(".b0KoTc{display:none;}.b2hzT{display:none;}#fbar{background:rgba(0,0,0,0) !important;border:0px !important;}.sfbg{background:rgba(0,0,0,0) !important;}"));
    style.appendChild(document.createTextNode("#fsl{display:none;}"));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
    //添加设置
    window.onload=function(){
        var setting=document.createElement("a");
        setting.id="customBG";
        setting.innerHTML="设置";
        setting.onclick=function(){
            var bgUrl = prompt("请输入图片地址", "");
            if(bgUrl!=""&&bgUrl!=null){
                setCookie("bgUrl",bgUrl);
                location.reload();
            }
        }
        document.getElementById("fsett").appendChild(setting);

    }
})();

function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}