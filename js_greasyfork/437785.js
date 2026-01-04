// ==UserScript==
// @name         洛谷插件·通过率
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  在洛谷题库通过率中添加百分数
// @author       Kali_linux
// @match        *://www.luogu.com.cn/problem/list*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437785/%E6%B4%9B%E8%B0%B7%E6%8F%92%E4%BB%B6%C2%B7%E9%80%9A%E8%BF%87%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/437785/%E6%B4%9B%E8%B0%B7%E6%8F%92%E4%BB%B6%C2%B7%E9%80%9A%E8%BF%87%E7%8E%87.meta.js
// ==/UserScript==
(function() {
    var ba = true;
    'use strict';
    function run()
    {
        if(ba == true) {
            ba = false;
            var study = document.getElementsByClassName("progress-frame has-tooltip");
            var up = document.getElementsByClassName("progress");
            var l = study.length
            var i;
            for (i = 0; i < l; i++) {
                var a;
                a = study[i].innerHTML;
                var st = a.split(' ');
                var str = st[3].replace(";", "");
                var Stri = up[i + 1].innerHTML;
                up[i + 1].innerHTML = "<p>" + str + "<\p>" + Stri;
            }
        }
    }
    window.onload = run;
    window.history.state
    var _pushState = window.history.pushState;
    window.history.pushState = function() {
        setTimeout(run, 3000);
        ba = true;
        return _pushState.apply(this, arguments);
    }
})();