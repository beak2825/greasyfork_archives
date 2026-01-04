// ==UserScript==
// @name           hwm_ban_hammer
// @namespace      omne
// @description    ban hammer
// @version        1.0
// @include        /^https{0,1}:\/\/((www|qrator|)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(forum_messages|pl_info|forum_ban).php/
// @downloadURL https://update.greasyfork.org/scripts/502019/hwm_ban_hammer.user.js
// @updateURL https://update.greasyfork.org/scripts/502019/hwm_ban_hammer.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if (location.pathname.indexOf("pl_info.php") >= 0) {
        let el = document.querySelector("a[href^='sms-create.php']");
        let el2 = document.querySelector(".wblight").querySelector("a[href^='pl_warlog.php?id=']");
        let pid = (/\d+/).exec( el2.href );
        let item_name = document.querySelector('.wb').innerHTML.match(/>([^<]+)<\/h1>/)[1].replaceAll("&nbsp;", " ");
        if (item_name) {
            let span = document.createElement('span');
            span.innerHTML = "<p style='margin-top:0px; margin-left:8px;'><a style='text-decoration:none;' href='forum_ban.php?mid=19096766&pid="+pid+"&y=1'><b><font style='color:red;'>Бан на год</font></b></a></p>";
            el.parentNode.insertBefore(span, el.nextSibling);
        }
    }
    if (location.pathname.indexOf("forum_ban") > 0) {
        if (location.href.indexOf("y=1") > 0) {
            document.documentElement.querySelectorAll("input")[3].value = 365;
            document.documentElement.querySelector("select").value="1440";
            document.querySelector("form").submit();
        }
    }

})();