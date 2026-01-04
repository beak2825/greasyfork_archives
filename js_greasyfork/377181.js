// ==UserScript==
// @name        bingStyle
// @namespace   http://tampermonkey.net/
// @version     0.4.0
// @description bing样式修改
// @author      Aldaris
// @include     *://*.bing.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/377181/bingStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/377181/bingStyle.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //背景图片
    var bgUrl = getCookie("bgUrl");
    //搜索框的左边距
    var sboxLeft = "calc(50vw - 530px)";

    var head = document.getElementsByTagName("head")[0];
    //开始生成meta
    var meta = document.createElement("meta");
    meta.setAttribute("name", "referrer");
    meta.setAttribute("content", "no-referrer-when-downgrade");
    head.appendChild(meta);
    //开始生成style
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(".img_cont{background-image:url(" + bgUrl + ") !important;}div#sbox.sw_sform{left:" + sboxLeft + " !important;}#vid{display:none !important;}"));
    //左上角与右上角的黑色渐变背景
    style.appendChild(document.createTextNode(".shader_left{background:none !important;}.shader_right{background:none !important;}"));
    //国际版下方黑色渐变背景
    style.appendChild(document.createTextNode("#bottom_shader{background:none !important;}"));
    style.appendChild(document.createTextNode(".hp_sw_logo{visibility:hidden;}"));
    style.appendChild(document.createTextNode("#focus_ovr{height:100% !important;}#hp_tbar{visibility:hidden;}#hp_ctrls{display:none;}#hp_bottomCell{display:none;}"));
    //设置
    //style.appendChild(document.createTextNode("#customBG{margin-right:8px}"));
    head.appendChild(style);
    setTimeout(function () {
        //添加设置
        var setting = document.createElement("a");
        setting.id = "customBG";
        setting.className = "hb_section";
        setting.innerHTML = "设置";
        setting.onclick = function () {
            var bgUrl = prompt("请输入图片地址", "");
            if (bgUrl != "" && bgUrl != null) {
                setCookie("bgUrl", bgUrl);
                location.reload();
            }
        }
        document.getElementById("HBContent").appendChild(setting);
    }, 2000)
})();

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}