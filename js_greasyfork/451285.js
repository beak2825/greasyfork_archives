// ==UserScript==
// @name         Bing 中国版重定向
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  将中国版 Bing 重定向到国际版
// @author       TGSAN
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @icon         https://www.google.cn/s2/favicons?sz=64&domain=bing.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/451285/Bing%20%E4%B8%AD%E5%9B%BD%E7%89%88%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/451285/Bing%20%E4%B8%AD%E5%9B%BD%E7%89%88%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

let area_code = "us";
let lang_code = "en-US";
let force_use_lang_code = false;

(function() {
    'use strict';

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
            if (pair[0] != variable && pair[0] && pair[1]) {
                new_vars += pair[0] + "=" + pair[1];
                if (i < vars.length - 1) {
                    new_vars += "&";
                }
            }
        }
        return new_vars;
    }

    function deleteAllCookies() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    let mkt = getQueryVariable("mkt");
    let cc = getQueryVariable("cc");
    if ((force_use_lang_code == true && (cc == false || mkt == false)) || mkt == "zh-CN" || mkt == "cn") {
        deleteAllCookies();
        window.localStorage.clear();
        window.sessionStorage.clear();
        let args = getAndDelVariable("mkt") + "&setmkt=" + lang_code + "&mkt=" + lang_code + "&cc=" + area_code + "&toWww=1";
        if (args.startsWith("&")) {
            args = args.substring(1);
        }
        let new_url;
        if (args) {
            new_url = window.location.pathname + "?" + args;
        } else {
            new_url = window.location.pathname;
        }
        let setting = "https://www.bing.com/account/action?cc=" + area_code + "&settingpage=1&ntb=1&ru=" + encodeURIComponent(new_url) + "&setmkt=" + lang_code + "&mkt=" + lang_code + "&toWww=1";
        window.location = setting;
    }
})();