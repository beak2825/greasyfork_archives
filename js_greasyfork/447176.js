// ==UserScript==
// @name         bilibili回车登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  绑定回车和登录
// @author       AllureLove
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447176/bilibili%E5%9B%9E%E8%BD%A6%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447176/bilibili%E5%9B%9E%E8%BD%A6%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


document.onkeydown = function (e) { // 回车提交表单
// 兼容FF和IE和Opera
   var loginbtn = document.getElementsByClassName("universal-btn login-btn")[0];
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
       loginbtn.click();
    }
}
