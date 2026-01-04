// ==UserScript==
// @name tingyun-userid
// @namespace Violentmonkey Scripts
// @author https://github.com/LinusLing
// @match https://report.tingyun.com/mobile-web/
// @version 1.1.1
// @grant none
// @description 支持听云查看自定义上传的 UserId 字段
// @downloadURL https://update.greasyfork.org/scripts/389960/tingyun-userid.user.js
// @updateURL https://update.greasyfork.org/scripts/389960/tingyun-userid.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // tingyun.com already got jquery, if set @require it will crash on TyChoiceDatePicker
    window.addEventListener("load",
    function(event) {
        // match crashDetail pages
        if (window.location.href.indexOf("mobile-web/#/detail/crashDetail?") < 0) {
            return;
        }
        // this script does not support Android
        if ($("div:contains('Android-Agent')").length > 0) {
            return;
        }
        var th = $("th:first")[0]; // find the first element of "th" type
        var userid_column = '<th><div class="th-text" ng-reflect-ng-class="th-text"><span>UserId</span><em></em></div></th>';
        console.log(th);
        $(th.parentNode).addClass("").append(userid_column); // call the parentNode to append userid_column
        // add click function for crash
        $("tr[style='cursor: default;']").click(function() {
            if ($(".tr-selected>td").hasClass("userid")) {
                // if td already append userid then return
                return;
            }

            $("li[target='userDiyInfo']").trigger("click"); // trigger an click event for userDiyInfo(which includes userid)
            // grap the userid from tab_cust
            var str = $("#tab_cust")[0].innerText;
            var userid_str = str.split("\n")[0].split(":").pop().trim();

            var y = $(".tr-selected")[0]; // find the selected tr for showing userid
            var userid_html = '<td class="userid"><div >' + userid_str + '</div></td>'; // build the td element with userid
            $(y).addClass("").append(userid_html); // append userid to the table
            $("li[target='stackTrace']").trigger("click"); // restore stackTrace tab
        });

        $(".tr-selected").trigger("click");

    });
})();