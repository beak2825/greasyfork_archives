// ==UserScript==
// @name         关闭115右下角广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  关闭115右下角浮动广告
// @author       Ashin
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @match        *://v.anxia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459588/%E5%85%B3%E9%97%AD115%E5%8F%B3%E4%B8%8B%E8%A7%92%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/459588/%E5%85%B3%E9%97%AD115%E5%8F%B3%E4%B8%8B%E8%A7%92%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
       var floatAd = $("#js_common_mini-dialog");
       floatAd.remove();
    });
})();