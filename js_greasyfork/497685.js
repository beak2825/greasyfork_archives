// ==UserScript==
// @name         sy私有云
// @namespace    http://192.10.53.45:5244
// @version      0.2
// @description  word预览
// @author       You
// @require      http://cdn.bootcss.com/jquery/1.11.0/jquery.min.js
// @match        http://192.10.53.45:5244/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497685/sy%E7%A7%81%E6%9C%89%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/497685/sy%E7%A7%81%E6%9C%89%E4%BA%91.meta.js
// ==/UserScript==
window.onload=function(){


    var currentUrl = window.location.href;

    // 检查 URL 是否包含 "doc" 字符串并且不包含 "SyCloud" 字符串
    if(currentUrl.indexOf('SyCloud') === -1){
        if (currentUrl.indexOf('doc') !== -1) {
            console.log(currentUrl);
            var modifiedUrl = currentUrl.replace(':5244', '/SyCloud');

            window.open(modifiedUrl)
        } else {
            console.log('URL 不同时包含 "doc" 字符串且不包含 "SyCloud" 字符串');
        }
    }
}