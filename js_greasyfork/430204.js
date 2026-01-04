// ==UserScript==
// @name         天天基金网，基金推荐
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  基金推荐!
// @include     https://fund.eastmoney.com/data/fundranking.html*
// @downloadURL https://update.greasyfork.org/scripts/430204/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E7%BD%91%EF%BC%8C%E5%9F%BA%E9%87%91%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/430204/%E5%A4%A9%E5%A4%A9%E5%9F%BA%E9%87%91%E7%BD%91%EF%BC%8C%E5%9F%BA%E9%87%91%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let $ = jQuery;
    setTimeout(() => {
        $("#dbtable > tbody > tr").each(function () {
            let tax = parseFloat($(this).find("td").eq(18).text());
            let week = parseFloat($(this).find("td").eq(8).text());
            let month = parseFloat($(this).find("td").eq(9).text());
            if (!tax && week / 7 >= 1 && month / 30 >= 1) {
                $(this).append("<td style='font-weight:bold;background-color:#00fa'>买啊</td>");
                $(this).find("td").css("background-color", "#0f09");
            }
        });
    }, 600);
})();