// ==UserScript==
// @name         feishu_common_toolbar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  飞书网页通用工具栏
// @author       dong.luo@happyelements.com
// @include      /^http[s]*:\/\/.*\.feishu\.cn\/.*$/
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454491/feishu_common_toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/454491/feishu_common_toolbar.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //==========================================
    // var $ = window.jQuery;
    var $ = window.jQuery.noConflict(true);


    //==========================================
    // 隐藏浏览器不兼容提示条
    //------------------------------------------
    // 计数器
    var announceCheckCntTotal = 50;
    var announceCheckCntLeft = announceCheckCntTotal;

    // 开启定时检查
    var commonToolbarCheckTimer = setInterval(function() {
        if (announceCheckCntLeft > 0) {
            var targetDev = $(".not-compatible__announce");
            if(targetDev && targetDev.size() == 1) {
                // 提示条
                var flag = targetDev.attr("ld-flag");
                if (flag != "1") {
                    targetDev.attr("ld-flag", "1").css({"display": "none"});
                    announceCheckCntLeft = announceCheckCntTotal; // 重置检查次数
                }else {
                    announceCheckCntLeft--; // 扣除一次检查次数
                }
            }else {
                announceCheckCntLeft--; // 扣除一次检查次数
            }

        }else {
            // 清除定时器
            clearInterval(commonToolbarCheckTimer);
        }

    }, 500);


})();

