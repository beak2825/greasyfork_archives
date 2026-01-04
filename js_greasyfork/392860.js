// ==UserScript==
// @name         知乎，掘金删除adblock 屏蔽提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.zhihu.com/*
// @match        https://juejin.im/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/392860/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E6%8E%98%E9%87%91%E5%88%A0%E9%99%A4adblock%20%E5%B1%8F%E8%94%BD%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/392860/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E6%8E%98%E9%87%91%E5%88%A0%E9%99%A4adblock%20%E5%B1%8F%E8%94%BD%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function(){
        var adb = $('.AdblockBanner');
        if(adb){
            adb.remove();
        }
        var juejinad = $('.extension');
        if(juejinad){
         juejinad.remove();
        }
        var juejiner = $('.request-health-alert');
        if(juejiner){
            juejiner.remove();
        }
    });
})();