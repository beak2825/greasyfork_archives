// ==UserScript==
// @name         GDUF自动认证
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  什么？还需要点击登录认证？说实话，我懒得点。
// @author       rainbowpi
// @match        http://10.69.69.72/portal.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425572/GDUF%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/425572/GDUF%E8%87%AA%E5%8A%A8%E8%AE%A4%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //此处填入账号
    var account = "";
    //此处填入密码
    var password = "";

    var tasker;
    var isStop = false;
    let footer = document.getElementsByClassName("modal")[0];
    let mask = document.getElementsByClassName("mask")[0];
    console.log(footer);
    footer.style = "display:none;";
    mask.style = "display:none;";
    var userid = document.getElementById("userid");
    var passwd = document.getElementById("passwd");
    userid.value = account;
    passwd.value = password;
    var btn = document.getElementById("loginsubmit");
    //document.getElementById("loginsubmit").click();
    //document.body.onmouseover = login();

    tasker = setInterval(login, 150);
    function login() {
        if (account == "" || passwd == "") {
            isStop = confirm("赶紧去把你的账号密码填上！麻溜点！（按确定可停止自动提交！）");
            stop();
        } else {
            btn.click();
        }
    }
    //停止定时器
    function stop() {
        if (isStop) {
            clearInterval(tasker);
        }
    }

})();



