// ==UserScript==
// @name         asianOdds
// @namespace    http://tampermonkey.net/
// @version      1599286043912
// @@updateURL   http://192.168.1.2:44444/monkey/parse
// @description  try to take over the world!
// @author       You
// @match        http://vip.win007.com/AsianOdds_n.aspx*
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.0/jquery.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/413110/asianOdds.user.js
// @updateURL https://update.greasyfork.org/scripts/413110/asianOdds.meta.js
// ==/UserScript==
(function () {
    $("#oddsDetail tr").each(function (i) {
        if ($(this).attr("bgcolor") === "#ffffff") {
            // language=CSS
            let gun = $(this).find("td:nth-last-of-type(2)").text();
            if (gun) {
                $(this).css("display", "none");
            }
        }
    })
})();