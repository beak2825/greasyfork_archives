// ==UserScript==
// @name         蜜桃影像传媒去除广告
// @namespace    http://tampermonkey.net/
// @version      2024-08-09
// @description  蜜桃影像传媒去除广告，不会跳转广告了
// @author       You
// @match        https://*.*/
// @include      /^https:\/\/*.*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wtby.cc

// @require      https://update.greasyfork.org/scripts/484741/1311035/ajax-hook-thirde-V2.js
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/503094/%E8%9C%9C%E6%A1%83%E5%BD%B1%E5%83%8F%E4%BC%A0%E5%AA%92%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503094/%E8%9C%9C%E6%A1%83%E5%BD%B1%E5%83%8F%E4%BC%A0%E5%AA%92%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 直接去掉带有 ins 标签的广告
    var changeTime = null;
    changeTime = setInterval(startChangeTime , 1200);
    async function startChangeTime(){
        var ins = document.getElementsByTagName('ins');
        if (ins.length == 0 ){
            return;
        }
        console.log('======属于广告，隐藏广告')
        for (let item of ins) {
            item.style='display:none;'
        }
    }

})();