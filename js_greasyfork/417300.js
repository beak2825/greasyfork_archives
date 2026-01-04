// ==UserScript==
// @name         AutoCheckTswLog
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  check tsw log
// @author       Minilong
// @match        https://*.tswjs.org/log/view/xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417300/AutoCheckTswLog.user.js
// @updateURL https://update.greasyfork.org/scripts/417300/AutoCheckTswLog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let userName = localStorage.getItem('tUserName') || saveUserName();
    if(!userName) return;
    const url = getTargetURL(userName);
    redirectToMyLog(url)
})();

// 获取目标url
function getTargetURL(username) {
    const curURL = `${window.location.origin}/log/view/${username}`
  return curURL
}

// 重定向到目标url
function redirectToMyLog(url) {
    window.location.replace(url)
}

// 设置用户名
function saveUserName() {
    const userName = prompt('输入测试号码', '');
    if(!userName) return;
    localStorage.setItem("tUserName",userName);
    return userName;
}




