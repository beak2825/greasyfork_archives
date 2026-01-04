// ==UserScript==
// @name         阻止网站监听返回事件
// @version      0.2.0
// @author       Anonymous
// @description  某些中国特色垃圾网站会通过监听返回事件来吸引用户流量到自己首页（比如 `*.news.sina.cn`），这个脚本则会替换掉原先网页定义的返回事件。
// @namespace    https://misakamikoto.example.org/
// @match        https://*.sina.cn/*
// @match        https://*.sina.com/*
// @match        https://*.sina.com.cn/*
// @match        http://*.sina.cn/*
// @match        http://*.sina.com/*
// @match        http://*.sina.com.cn/*
// @grant         none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370680/%E9%98%BB%E6%AD%A2%E7%BD%91%E7%AB%99%E7%9B%91%E5%90%AC%E8%BF%94%E5%9B%9E%E4%BA%8B%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/370680/%E9%98%BB%E6%AD%A2%E7%BD%91%E7%AB%99%E7%9B%91%E5%90%AC%E8%BF%94%E5%9B%9E%E4%BA%8B%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    var pushState = window.history.pushState;
    var replaceState = window.history.replaceState;
    var HISTORY_OBJECTS = [pushState, replaceState, window.history.length];
    var RUN_TIMES = 0;
    replaceFunctions();
    function sinaMaMa() {
        if (RUN_TIMES >= 50) {
            window.clearInterval(SINA_SIMA);
        }
        RUN_TIMES++;
        var isTypeError = false;
        try {
            window.history.pushState('新浪的🐎💀了吗'); // 针对💀🐎新浪把 Object 直接替换掉的方法
        } catch (TypeError) {
            isTypeError = true;
        }
        if (!isTypeError) {
            replaceFunctions();
            console.log('新浪🐎🐎美丽');
            window.clearInterval(SINA_SIMA);
        }
    };
    var SINA_SIMA = setInterval(sinaMaMa, 50);
    /*window.addEventListener("popstate", function (event) {
        var backLength = window.history.length - HISTORY_OBJECTS[2];
        if (backLength > 0) {
            var state = {
                title: "title",
                url: "#"
            };
            HISTORY_OBJECTS[0](state, "title", "#");
            window.history.back(0 - backLength - 1);
        }
    }, false);*/

    function checkMethodStatus() {
        try {
            HISTORY_OBJECTS[0]();
            HISTORY_OBJECTS[1]();
            return false;
        } catch (Exception) {
            return true;
        }
    }

    function fixPushState() {
        window.history.pushState = HISTORY_OBJECTS[0];
    };

    function fixReplaceState() {
        window.history.replaceState = HISTORY_OBJECTS[1];
    };

    function replaceFunctions() {
        window.history.pushState = hisPush = function(...args) {
            if (args.length <= 1) {
                throw new TypeError();
            }
            var args_length = args.length;
            var result_msg = '';
            for (var i = 0; i < args_length; i++) {
                var now_str = args[i];
                result_msg += '[' + i + '] ' + now_str + '\n';
            }
            if (!checkMethodStatus()) {
                alert("该网站疑似恶意修改返回记录\n" + window.location.host + " 正在尝试加入如下数据：\n" + result_msg + "由于浏览器接口已被该页面修改，无法向您确认是否屏蔽，已被拦截。");
            } else {
                var userConfirm = confirm("该网站正在请求修改返回记录的权限：\n" + window.location.host + " 正在尝试加入如下数据：\n" + result_msg + "请在下方选择是否拦截此操作。");
                if (!userConfirm) {
                    fixReplaceState();
                    window.history.replaceState(...args);
                    replaceFunctions();
                }
            }
        };
        window.history.replaceState = hisReplace = function(...args) {
            if (args.length <= 1) {
                throw new TypeError();
            }
            var args_length = args.length;
            var result_msg = '';
            for (var i = 0; i < args_length; i++) {
                var now_str = args[i];
                result_msg += '[' + i + '] ' + now_str + '\n';
            }
            if (!checkMethodStatus()) {
                alert("该网站疑似恶意修改返回记录：\n" + window.location.host + " 正在尝试加入如下数据：\n" + result_msg + "由于浏览器接口已被该页面修改，无法向您确认是否屏蔽，已被拦截。");
            } else {
                var userConfirm = confirm("该网站正在请求修改返回记录的权限：\n" + window.location.host + " 正在尝试加入如下数据：\n" + result_msg + "请在下方选择是否拦截此操作。");
                if (!userConfirm) {
                    fixReplaceState();
                    window.history.replaceState(...args);
                    replaceFunctions();
                }
            }
        };
    }
})();