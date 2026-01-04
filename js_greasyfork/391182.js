// ==UserScript==
// @name         login
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       cx
// @match        https://passport.damai.cn/login*
// @run-at       document-end
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391182/login.user.js
// @updateURL https://update.greasyfork.org/scripts/391182/login.meta.js
// ==/UserScript==
var time;
(function() {
    time = setInterval(function () {
        console.log("点击登录按钮");
        $(".fm-btn>button").click();
    },5000);
})();

function setCookie(c_name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 550000);
    document.cookie = c_name + "=" + escape(value)+ ";expires=" + exp.toGMTString();
}

// 读取cookie
function getCookie(c_name) {
    if (document.cookie.length > 0)     {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1){
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1)
                c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}