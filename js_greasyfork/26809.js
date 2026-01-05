// ==UserScript==
// @name         SPDBCCC 
// @namespace    https://www.fireawayh.ml/
// @version      0.1
// @description  让官方不支持的系统和浏览器支持密码输入 Enable Password Input On Non-Supported Browsers & OS
// @author       FireAwayH
// @match        https://cardsonline.spdbccc.com.cn/icard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26809/SPDBCCC.user.js
// @updateURL https://update.greasyfork.org/scripts/26809/SPDBCCC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var txt = '<input name="Password" id="Password" type="password" onkeypress="mustDigit()"><input name="Passwordkeytype" id="Passwordkeytype" type="hidden" value="IcardPublicKey">';
    var pwd = document.getElementsByClassName("pwdShow")[0];
    pwd.outerHTML = txt;
})();