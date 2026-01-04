// ==UserScript==
// @name         delete-security-code
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  解除北科的驗證碼
// @author       onon1101
// @license      MIT
// @match        https://nportal.ntut.edu.tw/index.do*
// @match        https://nportal.ntut.edu.tw/login.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/qs/6.11.2/qs.min.js
// @require      http://ajax.googleapis.com/ajax/libs/dojo/1.17.3/dojo/dojo.js
// @downloadURL https://update.greasyfork.org/scripts/471454/delete-security-code.user.js
// @updateURL https://update.greasyfork.org/scripts/471454/delete-security-code.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('start');
})();

if (location.href === 'https://nportal.ntut.edu.tw/login.do') {
    document.getElementsByTagName("font")[0].remove;
    const errorMsg = document.getElementsByTagName("center")[0].innerText.split('\n')[7];
    if (errorMsg === '「驗證碼」輸入錯誤，請重新輸入。') {
        document.getElementsByTagName("body")[0].remove();
        // document.getElementsByClassName("vsc-initialized")[0].remove();
        location.reload();
    }
    return ;
}

window.login1 = function login1() {
    document.getElementById('mpassword').type = 'password';
    document.getElementById('eyes').src = 'images/pwdhide.png';
    var thisform = document.login;
    var encodePwd = "{ENCODE}" + dojox.encoding.crypto.Blowfish.encrypt(thisform.mpassword.value, thisform.muid.value.toLowerCase());
    thisform.mpassword.value = encodePwd;
    thisform.submit();
}

document.getElementById("authcode").remove();
document.getElementsByClassName("authcode co")[0].remove();
document.getElementsByClassName("title")[2].remove();

 let styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.innerText = ".notifyjs-bootstrap-base {width: 200px;float: left;margin: 10px 0 0 10px;text-align: left;font-size: 16px;}";
        document.getElementById("wrap").appendChild(styleElement); 