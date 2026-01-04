// ==UserScript==
// @name         ksuweb
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  喀什大学校园网自动登录（本脚本不会收集任何信息）使用时必须修改账号密码
// @author       cinderhk
// @match         *://172.31.0.10/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446585/ksuweb.user.js
// @updateURL https://update.greasyfork.org/scripts/446585/ksuweb.meta.js
// ==/UserScript==
(function() {
    var username = '账号';
    var password = '密码';
    setTimeout(() => {
        if (document.getElementsByClassName('edit_lobo_cell')[2]
           && document.getElementsByClassName('edit_lobo_cell')[1].name !== 'logout') {
            document.getElementsByClassName('edit_lobo_cell')[2].value = username;
        }
        if (document.getElementsByClassName('edit_lobo_cell')[3]) {
            document.getElementsByClassName('edit_lobo_cell')[3].value = password;
        }
         if (document.getElementsByClassName('edit_lobo_cell')[1]) {
            document.getElementsByClassName('edit_lobo_cell')[1].click();
        }
    }, 500);
})();