// ==UserScript==
// @name         Google 搜索助手
// @namespace    CloudMoeGoogleSearchTools
// @namespace    TGSAN
// @version      1.1
// @description  Google Search Tools
// @author       TGSAN
// @run-at       document-start
// @include      /^https?:\/\/www\.google.co.*\/search.*$/
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/420362/Google%20%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420362/Google%20%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var lang_list = [
    [
        "中文",
        "lang_zh-CN%7Clang_zh-TW"
    ],
    [
        "繁体中文",
        "lang_zh-TW"
    ],
    [
        "英文",
        "lang_en"
    ],
    [
        "日文",
        "lang_ja"
    ],
];

(function () {
    "use strict";

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

    function getAndDelVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        var new_vars = '';
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] != variable) {
                new_vars += pair[0] + "=" + pair[1];
                if (i < vars.length - 1) {
                    new_vars += "&";
                }
            }
        }
        return new_vars;
    }

    function callbackTest(lang_code, lang_str) {
        window.location = "/search?" + getAndDelVariable("lr") + "&lr=" + lang_code;
    }

    function addButton(lang_obj) {
        GM_registerMenuCommand("仅显示 " + lang_obj[0] + " 结果",
            function () {
                callbackTest(lang_obj[1], lang_obj[0]);
            });
    }

    GM_registerMenuCommand("恢复不限语言",
    function () {
        callbackTest("", "不限语言");
    });

    lang_list.forEach(lang_obj => addButton(lang_obj));

})();
