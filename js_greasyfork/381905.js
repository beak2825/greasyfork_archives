// ==UserScript==
// @name         qiyi.163.com auto login
// @namespace    https://qiye.163.com/
// @version      1.0
// @description  网易企业邮箱自动登录
// @author       Lennon
// @match        https://qiye.163.com/login*
// @match        http://mail.ym.163.com/*
// @match        *ym.163.com*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @run-at       document-end
// @icon         https://mimghz.qiye.163.com/o/mailapp/qiyelogin/style/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/381905/qiyi163com%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/381905/qiyi163com%20auto%20login.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // redirect to login
    var url = 'https://qiye.163.com/login';
    var otherUrl = ['ym.163.com'];
    var elementGotologin = $('#gotologin');
    if($.inArray(location.host, otherUrl) >= 0 || elementGotologin.text()){
        location.href = url;
        return false;
    }

    // login
    var elementUsername = $('#accname');
    var elementPassword = $('#accpwd');
    var elementRememberme = $('#accautologin')
    var elementButton = $('.js-loginbtn');
    if(elementUsername.length && elementPassword.length && elementButton.length){
        if(elementButton.length){
            elementRememberme.attr('checked', true);
        }

        setTimeout(function () {
            elementButton.click();
        }, 1000);
    }

    // redirect to unread
    var oldHash = '#module=welcome';
    var newHash = '#module=mbox&allunread=true';
    if(location.hash == oldHash){
        location.hash = newHash;
        return false;
    }
})();