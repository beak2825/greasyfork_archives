// ==UserScript==
// @name            快速谷歌搜索
// @author          hc
// @description     选中文本后按住快捷键alt+Q即可
// @match           *://*/*
// @require         https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @version         1.0
// @namespace https://greasyfork.org/users/727914
// @downloadURL https://update.greasyfork.org/scripts/469004/%E5%BF%AB%E9%80%9F%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/469004/%E5%BF%AB%E9%80%9F%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
(function () {
    'use strict';
    $("body")[0].addEventListener("keydown", function(){keyFunc(event)});
    var keyFunc = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 81 && e.altKey) { //alt+Q
            var selecter=window.getSelection().toString();
            if(selecter != "") {
                if(selecter.startsWith("https://")){//如果是https://开头的链接，那么直接新标签页打开
                    window.open(selecter)
                } else {
                var querystr = "https://www.google.com/search?q=" + selecter + "&ie=UTF-8";
                console.log(querystr);
                window.open(querystr);
                }
            }
        }
    };
})();