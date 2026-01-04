// ==UserScript==
// @name         swagger 助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改请求响应的显示窗口的高度
// @author       You
// @match        http://*/swagger-ui.html*
// @icon         https://static1.smartbear.co/swagger/media/assets/swagger_fav.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430231/swagger%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/430231/swagger%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(window).scroll(function () {
        //为了保证兼容性，这里取两个值，哪个有值取哪一个
        //scrollTop就是触发滚轮事件时滚轮的高度
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 300) {
            // 修改请求响应的显示窗口的高度
            $('.json').css('min-height','800px')
        }
        //console.log("滚动距离" + scrollTop);
    });
})();