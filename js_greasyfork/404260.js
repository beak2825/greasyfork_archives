// ==UserScript==
// @name         更新OA中入职年限
// @namespace    http://tampermonkey.net/
// @version      0.38
// @description  更新OA中入职年限!
// @author       shareyang
// @match        *://www.e-cology.com.cn/wui/index.html
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404260/%E6%9B%B4%E6%96%B0OA%E4%B8%AD%E5%85%A5%E8%81%8C%E5%B9%B4%E9%99%90.user.js
// @updateURL https://update.greasyfork.org/scripts/404260/%E6%9B%B4%E6%96%B0OA%E4%B8%AD%E5%85%A5%E8%81%8C%E5%B9%B4%E9%99%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
$(document).ready(function(){
console.error(1);
    var str = "main/hrm/card/cardInfo?menuIds=5,43";
    var url = window.location.href;
    console.error(url);
    if(url.indexOf(str)>=0){
        console.error(3);
console.error($(".hrm-my-card-basicInfo .wea-info-group-new-content-cell-value div").eq(12).text("10"));
       $(".hrm-my-card-basicInfo .wea-info-group-new-content-cell-value div").eq(12).text("10");
    }

})
    
})();