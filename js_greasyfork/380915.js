// ==UserScript==
// @name         个人使用_背景色
// @namespace    undefined
// @version      0.0.2
// @description  个人使用_背景色插件
// @author       个人使用_背景色
// @match        file:///Users/wangyongjie/Desktop/E-image/*
// @match        *:///Users/wangyongjie/Desktop/E-image/*
// @match        *:/Users/wangyongjie/Desktop/E-image/*
// @match        */:/Users/wangyongjie/Desktop/E-image/*
// @match        *//:/Users/wangyongjie/Desktop/E-image/*
// @match        file:///Users/wangyongjie/Desktop/E-image/*
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/pageinfo_list.do
// @match        file:///Users/wangyongjie/Desktop/E-image/%E5%A5%BD%E8%B4%A7%E9%9B%86%E7%BB%93-A.png
// @match        *://wangyongjie.top/*
// @match        *
// @match        个人使用_背景色
// @downloadURL https://update.greasyfork.org/scripts/380915/%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8_%E8%83%8C%E6%99%AF%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/380915/%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8_%E8%83%8C%E6%99%AF%E8%89%B2.meta.js
// ==/UserScript==

$(document).ready(function(){
    function colorRandom() {
        var a, b, c;
        var a = parseInt(255 - Math.random() * 255).toString(16);
        var b = parseInt(255 - Math.random() * 255).toString(16);
        var c = parseInt(255 - Math.random() * 255).toString(16);
        colorStr = '#' + a + b + c;
    } colorRandom();

    $("body").css({
        background: colorStr
    })
    console.log("变色成功")
})