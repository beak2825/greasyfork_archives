// ==UserScript==
// @name         包子漫画去弹窗广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  删广告
// @author       鲜榨芒果汁
// @match        *://cn.czmanga.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baozimh.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499794/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%94%BB%E5%8E%BB%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/499794/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%94%BB%E5%8E%BB%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    window.onload = function(){
    $("#dlsads").remove();
    $("#drsads").remove();
    $(".div_adhost").remove();
    $(".div_close_ads").click();
    }
})();