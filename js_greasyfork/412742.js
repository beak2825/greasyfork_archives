// ==UserScript==
// @name         桂林理工校园网自动登录
// @namespace    github.com/Mrgrtt
// @version      0.0.1
// @description  用于桂林理工校园网自动登录
// @author       haylen
// @include       *://172.16.2.2/*
// @grant        None
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/412742/%E6%A1%82%E6%9E%97%E7%90%86%E5%B7%A5%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/412742/%E6%A1%82%E6%9E%97%E7%90%86%E5%B7%A5%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    var username = '账号';
    var password = '密码';
    // 1 -> 校园网，2 -> 电信，3 -> 移动，4 -> 联通
    var type = 1;

    setTimeout(() => {
        if (document.getElementsByClassName('edit_lobo_cell')[1]
           && document.getElementsByClassName('edit_lobo_cell')[1].name !== 'logout') {
            document.getElementsByClassName('edit_lobo_cell')[1].value = username;
        }

        if (document.getElementsByClassName('edit_lobo_cell')[2]) {
            document.getElementsByClassName('edit_lobo_cell')[2].value = password;
        }

        if (document.getElementsByName('network')[type]) {
            document.getElementsByName('network')[type].click();
        }

        if (document.getElementsByClassName('edit_lobo_cell')[0]) {
            document.getElementsByClassName('edit_lobo_cell')[0].click();
        }
    }, 500);
})();