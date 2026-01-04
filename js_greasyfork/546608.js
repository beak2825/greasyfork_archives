// ==UserScript==
// @name         语雀页面优化
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  语雀页面章节标题标红显示
// @author       interest2
// @match        https://www.yuque.com/*
// @license       GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/546608/%E8%AF%AD%E9%9B%80%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546608/%E8%AF%AD%E9%9B%80%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("my script start");

    let site = "";
    let url = window.location.href;
    setTimeout(startUp, 2000);
    // setInterval(monitor, 500);

    function startUp(){
        document.querySelectorAll('.ne-toc-depth-1 .ne-toc-item-text a')
            .forEach(a => a.style.color = "#f64242");
    }


    function isEmpty(item){
        if(item===null || item===undefined || item.length===0){
            return true;
        }else{
            return false;
        }
    }
})();