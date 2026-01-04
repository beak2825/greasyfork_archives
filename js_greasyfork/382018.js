// ==UserScript==
// @name         mesio wiki auto login
// @namespace    http://wiki.mesio.cn:28282
// @version      1.1
// @description  cause I'm busy
// @author       Lennon
// @match        *.mesio.cn:28282/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @run-at       document-end
// @icon         http://juzikuaidai.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/382018/mesio%20wiki%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/382018/mesio%20wiki%20auto%20login.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // redirect to login
    var url = '/login';
    var elementGotologin = $('#gotologin');
    var otherError = ['HTTP 403 ： 权限不足'];
    if($.inArray($('.title').text(), otherError) >= 0){
        location.href = url;
        return false;
    }

    setTimeout(function () {
        var elementUsername = $('#account');
        var elementPassword = $('#password');
        var elementButton = $('#btn-login');
        if(!elementUsername.val() || !elementPassword.val() || !elementButton.length){
            return false;
        }

        elementButton.click();
    }, 800);
})();