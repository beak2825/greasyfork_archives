// ==UserScript==
// @name         UCAS-SessionTimeoutHelper
// @namespace    http://tampermonkey.net/
// @version      0.40
// @description  block the deadline alert from ucas website to avoid session expire
// @author       y4ung
// @match        https://course.ucas.ac.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397403/UCAS-SessionTimeoutHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/397403/UCAS-SessionTimeoutHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("Run script BlockAlertHelper. By y4ung");
    window.setInterval(function(){
        checkSessionTimeoout();
    }, 60000);

})();

function checkSessionTimeoout(){//检查会话是否快要过期
    var timeout_alert_body = document.getElementById("timeout_alert_body");
    if (null !== (timeout_alert_body)){//timeout_alert_body不为空，即已经出现会话过期的提示窗口
        console.log("[INFO] 检测到会话过期提示框: %s", new Date().toLocaleString());
        clickBtn(timeout_alert_body.children[1]);

    }
}

function clickBtn(btn) { // 模拟浏览器的鼠标点击事件
    const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    btn.dispatchEvent(event);
}