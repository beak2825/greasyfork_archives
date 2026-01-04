// ==UserScript==
// @name         电影盒子工具集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  电影盒子去广告等工具
// @author       yankj12
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @match        *://m.tv1box.com/*
// @match        *://m.tv1box.com/vod-play-id-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387582/%E7%94%B5%E5%BD%B1%E7%9B%92%E5%AD%90%E5%B7%A5%E5%85%B7%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/387582/%E7%94%B5%E5%BD%B1%E7%9B%92%E5%AD%90%E5%B7%A5%E5%85%B7%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
//iframe  name='__main_iframe__'
    $("iframe[name=__main_iframe__]").remove();

    // img id='close2' class='btnclose' 根据这些条件找父级div，删除父级div
    var adDiv = $("img#close2").parent();
    //console.log(adDiv)
    if(adDiv != null){
        adDiv.remove();
    }
    // Your code here...
})();