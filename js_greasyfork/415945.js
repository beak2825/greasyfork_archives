// ==UserScript==
// @name         国开大学刷课脚本—快速、精准
// @namespace    https://blog.lvvv.cc
// @version      1.0
// @description  国家开放大学自动刷课脚本
// @author       Juran
// @match        *://*.ouchn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415945/%E5%9B%BD%E5%BC%80%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%E2%80%94%E5%BF%AB%E9%80%9F%E3%80%81%E7%B2%BE%E5%87%86.user.js
// @updateURL https://update.greasyfork.org/scripts/415945/%E5%9B%BD%E5%BC%80%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%E2%80%94%E5%BF%AB%E9%80%9F%E3%80%81%E7%B2%BE%E5%87%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i
    var href = location.href
    if(href.indexOf("sectionid=")!=-1){
        //获取当前课件
        var current = document.getElementsByClassName("act")[0].innerText
        //是文本的话直接跳到下一个课件
        if(current){
            for(i = 0; i < document.getElementsByTagName("li").length; i++){
                if(document.getElementsByTagName("li")[i].className == "act"){
                    document.getElementsByTagName("li")[i+1].click()
                    break;
                }
            }
        }
    }
})();