// ==UserScript==
// @name         安徽省高等教育自考网络助学平台清楚答案
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  为了方便重复做题背题，添加了一个清楚答案的按钮。
// @author       lyl
// @match        https://*.edu-edu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu-edu.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462529/%E5%AE%89%E5%BE%BD%E7%9C%81%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E8%80%83%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0%E6%B8%85%E6%A5%9A%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462529/%E5%AE%89%E5%BE%BD%E7%9C%81%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E8%80%83%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0%E6%B8%85%E6%A5%9A%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $(".ui-logo").append("<button style='margin-top: 14px;' id='clearBtn'>清楚答案</button>");
        $("#clearBtn").click(function(){
            let r=confirm("确定清楚吗？");
            if (r==true){
                $(".ui-paper-iframe").contents().find("li").removeClass("ui-option-selected");
            }
        })
        $(".ui-logo").append("<button style='margin-top: 14px;margin-left: 8px;' id='shuffleBtn'>乱序选项</button>");
        $("#shuffleBtn").click(function(){
            console.log( $(".ui-paper-iframe").contents().find("ul"))
            let ulList = $(".ui-paper-iframe").contents().find("ul").each(function(u){
                 console.log($(this).children());
                 $(this).children().each(function(){
                     if(parseInt(Math.random()*2)==0){
                         $(this).prependTo($(this).parent());
                     }
                 })
            });
        })
    });
})();