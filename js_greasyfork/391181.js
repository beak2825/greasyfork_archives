// ==UserScript==
// @name         index
// @namespace    http://tampermonkey.net/
// @version      0.2.11
// @description  try to take over the world!
// @author       You
// @match        https://www.damai.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391181/index.user.js
// @updateURL https://update.greasyfork.org/scripts/391181/index.meta.js
// ==/UserScript==
var url = 'https://detail.damai.cn/item.htm?spm=a2oeg.project.searchtxt.ditem_0.2a343376iMSq3f&id=610434443184';
(function() {
    setTimeout(function (e) {
        if(url != ''){
            location.href = url;
        }else{
            location.reload();
        }
    },2000);

})();

document.onkeydown = function(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 27) { // 按 Esc 停止自动跳转
        url= '';
    }
};

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