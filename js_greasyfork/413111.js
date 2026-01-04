// ==UserScript==
// @name         detail
// @namespace    http://tampermonkey.net/
// @version      1599286044183
// @@updateURL   http://daboss.f3322.net:44444/monkey/detail
// @description  try to take over the world!
// @author       You
// @match        http*://vip.win007.com/AsianOdds*
// @match        http*://vip.win007.com/changeDetail*
// @match        http*://vip.win0168.com/AsianOdds*
// @match        http*://vip.win0168.com/changeDetail*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.0/jquery.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/413111/detail.user.js
// @updateURL https://update.greasyfork.org/scripts/413111/detail.meta.js
// ==/UserScript==
(function () {
    //详情页左边的table删除
    if ($("span[id^=odds]").length > 1) {
        $("#odds").parent("td").css("display", "none");
    }
    let minTr = document.getElementById("minTr");
    let observer = new MutationObserver(function (mutations, observe) {
        let allTr = $("#odds > tbody > tr").filter(function (i) {
            return this.bgColor && $(this).css("display") !== 'none' && this.id !== 'maxTr' && this.id !== 'minTr';
        });

        allTr.each(function (i) {
            let firstZ = $(this).children("td:nth-of-type(3)").text();
            let firstK = $(this).children("td:nth-of-type(5)").text();

            let lastZ = $(this).children("td:nth-last-of-type(4)").text();
            let lastK = $(this).children("td:nth-last-of-type(2)").text();

            if (!firstZ && !firstK && !lastZ && !lastK) {
                return true;
            }

            let firstSum = (parseFloat(firstZ) + parseFloat(firstK)).toFixed(2);
            let lastSum = (parseFloat(lastZ) + parseFloat(lastK)).toFixed(2);
            //增加列
            let firstBgcolor = firstSum < 1.80 ? 'green' : '#FDFCCC';
            $(this).children("td:nth-of-type(2)").after("<td width='40' bgcolor='" + firstBgcolor + "'>" + firstSum + "</td>");
            //临场的改变下颜色
            let bgcolor = firstSum < lastSum ? '#ff7f7f' : '#408040';

            $(this).children("td:nth-last-of-type(1)").before("<td width='40' bgcolor='" + bgcolor + "'>" + lastSum + "</td>");

            $("#webmain").css("width", 990);
        });

        let firstTr = $("#odds > tbody > tr").eq(0);
        firstTr.children("td:nth-of-type(2)").after("<td rowspan='2'>早餐</td>");
        firstTr.children("td:nth-last-of-type(1)").before("<td rowspan='2'>临场</td>");
    });
    if (minTr) observer.observe(minTr, {subtree: true, characterData: true, childList: true});
})();

