// ==UserScript==
// @name               Behemoth Anti-AdBlocker Canceller
// @name:zh-TW         貝希摩斯廣告過濾反制消除器
// @description        This userscript is used to cancel the anti-AdBlock mechanism in m.gamer.com.tw
// @description:zh-TW  AdBlock無罪！反抗有理！貝西摩斯廣告過濾反制消除器幫你對抗巴哈姆特電玩資訊站手機版網站那太離譜太超過的廣告過濾反制機制，讓你無須停用AdBlock套件仍可正常瀏覽！
// @namespace          http://rjhsiao.me/gmscripts
// @version            1.0
// @author             RJ Hsiao
// @supportURL         https://github.com/RJHsiao/behemoth-anti-adblocker-canceller
// @license            gpl
// @compatible         chrome
// @match              http://m.gamer.com.tw/home/creationDetail.php?sn=*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/18737/%E8%B2%9D%E5%B8%8C%E6%91%A9%E6%96%AF%E5%BB%A3%E5%91%8A%E9%81%8E%E6%BF%BE%E5%8F%8D%E5%88%B6%E6%B6%88%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/18737/%E8%B2%9D%E5%B8%8C%E6%91%A9%E6%96%AF%E5%BB%A3%E5%91%8A%E9%81%8E%E6%BF%BE%E5%8F%8D%E5%88%B6%E6%B6%88%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var parser = new DOMParser();
    var $ = jQuery;

    $.get(location.href).done(function(data, textStatus, jqXHR){
        if ($("header").length > 0) {
            return;
        }
        var html = parser.parseFromString(data, "text/html");
        var body = $(html.body);
        body.find("script:last").remove();
        document.body.innerHTML = body.html();
    });
})();