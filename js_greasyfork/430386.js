// ==UserScript==
// @name         樱花动漫去广告
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  去除樱花动漫的广告，包括左侧、右侧、右下角、红包页面。未去除暂停界面的广告。(Safari不可用，原因未知)
// @author       Roxbili
// @include      *://*yhdm*
// @include      *://*yinghuacd*
// @include      *://*imomoe*
// @include      *://*sakuradm*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430386/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/430386/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// 下面这段话为了在该js中使用jquery
/* globals jQuery, $, waitForKeyElements */

$(function() {
    console.info('started');
    var startTime = new Date().getTime();// 运行开始时间
    var max_running_time = 3000;// 函数最大运行时间
    var interval_time = 100;// 函数间隔多长时间重新运行, 100ms

    function wait_until_exist(ad_name, callback) {// 间隔时间运行的函数
        var checkExist = setInterval(function() {
            if (new Date().getTime() - startTime > max_running_time) {clearInterval(checkExist);}// 超时就停止函数
            var ad = $(ad_name);
            console.info(ad);
            if (ad.length > 0) {
                callback(ad);
                clearInterval(checkExist);
            }
        }, interval_time);
    }

    wait_until_exist('#HMimageleft', function(ad){ad.hide();});// 左侧图片
    wait_until_exist('#HMimageright', function(ad){ad.hide();});// 右侧图片
    wait_until_exist('#HMRichBox', function(ad){ad.hide();});// 右下角图片
    // 在其他页面可能存在的图片
    wait_until_exist("[alt='']", function(ad){ad.hide();});// 外卖红包扫码图片
    console.info('ended');
})();