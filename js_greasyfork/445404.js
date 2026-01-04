// ==UserScript==
// @name         自动登录天翼云
// @version      1.0
// @description  自动登录天翼云盘
// @author       zhang6666j
// @match        *://*.e.189.cn/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/894511
// @downloadURL https://update.greasyfork.org/scripts/445404/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%A4%A9%E7%BF%BC%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445404/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%A4%A9%E7%BF%BC%E4%BA%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($('#userName.ui-input.tianyi-user-input')==null)
    {
        return;
    }
    $('#userName.ui-input.tianyi-user-input').val('') //在' '中输入账号
    $('#password.ui-input.password-input').val('')//在' '中输入密码
    $('#j-login.ui-button.login-button').click();



})();