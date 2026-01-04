// ==UserScript==
// @name         btc38-beautifier
// @version      0.0.1
// @description  突出显示比特时代(btc38)部分页面中的关键信息. 注意默认会隐藏行情(交易)界面的蜡烛图.
// @match        *://*.btc38.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @icon         http://www.btc38.com/statics/images/coin_logos/BTC_logo.png
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @namespace    userscripts.henryfour.com
// @homepageURL  https://github.com/henryfour/userscripts
// @supportURL   https://github.com/henryfour/userscripts/issues
// @author       HenryFour
// @copyright    2017, HenryFour
// @downloadURL https://update.greasyfork.org/scripts/30762/btc38-beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/30762/btc38-beautifier.meta.js
// ==/UserScript==

GM_addStyle(
);

(function() {
    'use strict';
    // 用户 ID
    var $loginId = $("#login_id");
    $loginId.text("\t  " + $loginId.text());
    $loginId.css("color", "black").css("font-size", "18px").css("font-weight", "bold");

    var href = window.location.href;
    // 行情页面
    if (href.indexOf("trade.html") >= 0) {
        // 隐藏蜡烛图
        $("#graphbox").hide();
    }

    // 提币界面
    if (href.indexOf("trade_setaddr.html") >= 0) {
        // 强调高亮显示当前提币地址
        var $currAddress = $("#currAddress");
        $currAddress.css("color", "red").css("font-size", "20px").css("font-weight", "bold").css("text-align", "center");

        // 比特股 MEMO 输入框修改样式
        var $btsMemoInput = $("#btsMemo2 input");
        if ($btsMemoInput.length) {
            //console.log("find bts memo input");
            $btsMemoInput.css("color", "blue").css("font-size", "14px").css("width", "180px");
        }
    }
})();
