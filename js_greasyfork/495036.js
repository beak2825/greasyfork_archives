// ==UserScript==
// @name         下载站密码保存器
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  保存密码不用再次输入
// @author       Owwk
// @match        *://*.linglong521.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/495036/%E4%B8%8B%E8%BD%BD%E7%AB%99%E5%AF%86%E7%A0%81%E4%BF%9D%E5%AD%98%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/495036/%E4%B8%8B%E8%BD%BD%E7%AB%99%E5%AF%86%E7%A0%81%E4%BF%9D%E5%AD%98%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取保存的密码并设置到输入框中
    function setFormPassword() {
        var savedPassword = GM_getValue("savedPassword", "");
        var formInput = document.querySelector('input[name="page_pwd"]');
        if (formInput && savedPassword) {
            formInput.value = savedPassword;
        }
    }

    // 劫持表单提交事件，保存密码并提交表单
    function hijackFormSubmission() {
        var form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                var passwordInput = document.querySelector('input[name="page_pwd"]');
                if (passwordInput) {
                    var password = passwordInput.value.trim();
                    GM_setValue("savedPassword", password);
                }
            });
        }
    }

    // 定期检查页面元素是否加载完成
    var checkExist = setInterval(function() {
        var formInput = document.querySelector('input[name="page_pwd"]');
        if (formInput) {
            clearInterval(checkExist);
            setFormPassword();
            hijackFormSubmission();
        }
    }, 200);

    // 最长等待5秒钟
    setTimeout(function() {
        clearInterval(checkExist);
    }, 5000);
})();
