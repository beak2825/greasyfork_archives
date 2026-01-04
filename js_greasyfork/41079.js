// ==UserScript==
// @name         去除csdn中左栏和右下角的百度推广
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除csdn中左栏和右下角的百度推广广告
// @author       ljj(920645236@qq.com)
// @match        https://www.baidu.com/s?*
// @match        https://m.baidu.com/*
// @match        https://blog.csdn.net/*
// @match        http://aoyouzi.iteye.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41079/%E5%8E%BB%E9%99%A4csdn%E4%B8%AD%E5%B7%A6%E6%A0%8F%E5%92%8C%E5%8F%B3%E4%B8%8B%E8%A7%92%E7%9A%84%E7%99%BE%E5%BA%A6%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/41079/%E5%8E%BB%E9%99%A4csdn%E4%B8%AD%E5%B7%A6%E6%A0%8F%E5%92%8C%E5%8F%B3%E4%B8%8B%E8%A7%92%E7%9A%84%E7%99%BE%E5%BA%A6%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var filter = $("iframe");
    for (var i = 0; i < filter.length; i++) {
        var src = $(filter[i]).attr("src");
        if (src != null && src.indexOf("pos.baidu.com") > 0) {
            filter[i].remove();
            //console.log(i);
            // console.log($(filter[i]).parent().parent());
            // $(filter[i]).parent().parent().remove();
        }
    }


    //删除底部的csnd登陆框框
    //console.log( $(".pulllog-box"));
    $(".pulllog-box").remove();
    // Your code here...
})();