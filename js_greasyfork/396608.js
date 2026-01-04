// ==UserScript==
// @name         显示警告次数
// @version      0.3
// @include      https://www.mcbbs.net/*
// @author       xmdhs
// @description  显示警告次数。
// @namespace https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/396608/%E6%98%BE%E7%A4%BA%E8%AD%A6%E5%91%8A%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/396608/%E6%98%BE%E7%A4%BA%E8%AD%A6%E5%91%8A%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==

(function () {
    var raw = document.getElementsByClassName("pil cl");
    for (var index = 0; index < raw.length; index++) {
        var uidtemp = raw[index].childNodes[2].innerHTML;
        var aa = uidtemp.indexOf('<a href="home.php?mod=space&amp;uid=');
        var bb = uidtemp.indexOf('&amp;do=profile" target="_blank" class="xi2">');
        var uid = uidtemp.substring(aa + 36, bb);
        set(uid, index)
    }
   function set(uid, index) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "forum.php?mod=misc&action=viewwarning&tid=233&uid=" + uid + "&infloat=yes&handlekey=viewwarning&inajax=1&ajaxtarget=fwin_content_viewwarning", true);
    xmlhttp.onload = function () {
        var a = xmlhttp.responseText;
        var b = a.indexOf('已被累计警告');
        var c = a.indexOf('次，5 天内累计被警告 3 次');
        var d = a.substring(b + 7, c - 1);
        var e = location.origin + "/forum.php?mod=misc&action=viewwarning&tid=233&uid=" + uid
       if (d > 0) {
        raw[index].innerHTML += '<b><a href="' + e + '" target="_blank" onclick="showWindow(\'viewwarning\', this.href)"><font size="4" color="red"><dt>警告</dt><dd><font size="4" color="red">' + d + ' 次</dd></font></a></b>'
       };
    };
    xmlhttp.send();
}
}
)();

