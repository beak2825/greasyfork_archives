// ==UserScript==
// @name         Acfun Ad Helper
// @namespace    http://tampermonkey.net/
// @icon         https://tx-free-imgs.acfun.cn/content/2020_4_5/1.5860178587515075E9.png
// @version      0.23
// @description  移动暂停广告并缩小至右下角，点击×关闭后不再显示
// @author       zyl315
// @match        *://www.acfun.cn/v/*
// @exclude      *://www.acfun.cn/v/list**
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410652/Acfun%20Ad%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/410652/Acfun%20Ad%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    let timer = setInterval(function () {
        if ($('.pause-display').length == 0) {
            console.log("AcFun Ad Helper: Not find class 'pause-display'.");
        } else {
            move_pause_ad();
            close_pause_ad();
            window.clearInterval(timer);
            console.log('AcFun Ad Helper: Ad was moved.')
        }
    }, 1000);

    $(document).ready(function () {
        setTimeout(function () {
            window.clearInterval(timer);
        }, 8000);
    });
})();

function move_pause_ad() {
    let pause_ad = $('.pause-display')
    pause_ad.css({
        'position': 'absolute',
        'max-width': '15%',
        'min-width': '0',
        'bottom': '5%',
        'right': '1%'
    });
}
function close_pause_ad() {
    $('.close-icon').click(function () {
        $('.pause-display').css('display', 'none');
    });
}