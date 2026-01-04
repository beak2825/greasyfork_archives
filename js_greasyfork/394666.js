// ==UserScript==
// @name         辅助签到助手
// @namespace    AutoSigninHelper
// @version      1.0.0
// @description  个别网站辅助签到助手，包括18AMSR, 宅男龜, South Plus, Javbus論壇, 福利吧論壇, CCCAT
// @author       Monkey-Neet
// @update       2020-01-05 191926
// @include      http*://18asmr.org/
// @include      http*://zhainangui.net/
// @include      http*://www.wnflb66.com/
// @include      http*://www.wnflb66.com/forum.php?mod=forumdisplay&fid=2
// @include      http*://south-plus.org/plugin.php?H_name-tasks.html
// @include      http*://south-plus.org/plugin.php?H_name-tasks-actions-newtasks.html
// @include      http*://www.javbus.com/forum/forum.php?mod=viewthread&tid=15172&extra=page%3D1
// @include      http*://cccat.io/user/index.php
// @downloadURL https://update.greasyfork.org/scripts/394666/%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/394666/%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    // 18asmr
    if (matchURL("18asmr.org")) {
        var sign = document.querySelector('.mar5-l');
        if (sign.parentElement.textContent.indexOf('签到奖励') != -1) {
            sign.click();
        }
    }

    // 宅男龟
    if (matchURL("zhainangui.net")) {
        sign = document.querySelector('.b2-gift2e');
        if (sign.parentElement.textContent.indexOf('签到奖励') != -1) {
            sign.click();
        }
    }

    // 福利吧论坛
    if (matchURL("wnflb66.com")) {
        sign = document.querySelector('#fx_checkin_b');
        if (sign.alt == '签到领奖') {
            sign.click();
        }
    }


    // south-plus 申请任务
    if (matchURL("south-plus.org/plugin.php?H_name-tasks.html")) {
        var x = document.querySelectorAll("a");
        for (var i = 0; i < x.length; i++) {
            if (x[i].title == '按这申请此任务') {
                x[i].click();
            }
        }
    }

    // south-plus 领取奖励
    if (matchURL("south-plus.org/plugin.php?H_name-tasks-actions-newtasks.html")) {
        x = document.querySelectorAll("a");
        for (i = 0; i < x.length; i++) {
            if (x[i].title == '领取此奖励') {
                x[i].click();
            }
        }
    }

    // Javbus論壇
    if (matchURL("https://www.javbus.com/forum/forum.php?mod=viewthread&tid=15172&extra=page%3D1")) {
        sign = document.querySelector('.sign-button');
        sign.click();
    }

    // CCCAT
    if (matchURL('https://cccat.io/user/index.php')){
        sign = document.querySelector('#checkin1');
        if (sign.textContent == '点击签到'){
            sign.click();
        }
    }

    function matchURL(x) {
        return window.location.href.indexOf(x) != -1;
    }
})();