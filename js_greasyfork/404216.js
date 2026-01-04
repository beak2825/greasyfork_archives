// ==UserScript==
// @name         腾讯课堂自动签到、答题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to fuck over the fucking teachers who care you a lot
// @author       BowenYou
// @match        https://ke.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404216/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E3%80%81%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/404216/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E3%80%81%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timer = setInterval(function () {
        var date = new Date();
        let sj = date.getHours() + "-" + date.getMinutes();
        let signIn = document.getElementsByClassName("s-btn--m")[0];
        if (signIn) {
            let signInValue = signIn.innerHTML;
            if (signInValue == "签到") {
                console.log(sj + "签到");
                signIn.click();
                // clearInterval(timer);
            }else {
                console.log(sj + "回答问题")
                signIn.click();
            }
            return;
        }
        console.log(sj + "不存在");
    }, 1000)
    })();