// ==UserScript==
// @name         山东继续教育
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  模拟人工采用音频模式学习
// @author       GuoYP
// @match        *://*.yxlearning.com/*
// @grant        none
// @license      kwt2mm
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @downloadURL https://update.greasyfork.org/scripts/498509/%E5%B1%B1%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/498509/%E5%B1%B1%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    clearInterval(myTimer);
    function enterCourse() {
        var b = document.getElementsByTagName("span");
        for (var j = 0; j < b.length; j++) {
            if(b[j].innerHTML=="音频"){
                if(b[j].className!="pv-active") {
                    b[j].click();
                }
            }
        }
        var a = document.getElementsByTagName("BUTTON");
        for (var i = 0; i < a.length; i++) {
            if(a[i].innerHTML=="跳过"){
                a[i].click();
            }else if(a[i].className=="pv-playpause pv-iconfont pv-icon-btn-play"){
                a[i].click();
            }
        }
    }
    var myTimer = setInterval(enterCourse, 3000);

})();
