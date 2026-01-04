// ==UserScript==
// @name         OPC运维中心-定时刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  OPC运维中心定时刷新
// @author       You
// @match        https://10.4.33.59/shterm/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @icon         https://10.4.33.59/shterm/resources/3.2.8-1/image/top_logo.ico
// @grant        none
// @license     none
// @downloadURL https://update.greasyfork.org/scripts/437784/OPC%E8%BF%90%E7%BB%B4%E4%B8%AD%E5%BF%83-%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/437784/OPC%E8%BF%90%E7%BB%B4%E4%B8%AD%E5%BF%83-%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var time = 10;
    jQuery.noConflict();
    jQuery(function(){
        setTimeout(function(){
            jQuery("button.close:nth-child(2) > span:nth-child(1)").click();
        }, 1000);

        setInterval(function(){
            time--;
            if(time <= 0){
                location.reload();
            }
            console.log(new Date().toLocaleTimeString() + " -> " + time + "分钟后刷新页面");
        }, 60000);
    });
})();