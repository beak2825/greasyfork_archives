// ==UserScript==
// @name         jiedianqian auto login
// @namespace    http://openapidev.jiedianqian.com/
// @version      1.0
// @description  cause I'm busy
// @author       Lennon
// @match        http://openapidev.jiedianqian.com/*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @run-at       document-end
// @icon         http://www.33lc.com/uploadfile/2016/0523/20160523022229737.png
// @downloadURL https://update.greasyfork.org/scripts/381993/jiedianqian%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/381993/jiedianqian%20auto%20login.meta.js
// ==/UserScript==
(function () {
    'use strict';

    setTimeout(function () {
        $('body').bind('DOMNodeInserted', function (e) {
            if ($(e.target).attr('placeholder') !== '请输入验证码') {
                return false;
            }

            setTimeout(function () {
                devLogin();
            }, 800);

            // event element style change
            var elementLoginDialog = document.querySelector('.ivu-modal-mask');
            if (elementLoginDialog) {
                new MutationObserver(function () {
                    devLogin();
                }).observe(elementLoginDialog, {attributes: true, attributeFilter: ['style']});
            }
        });
    }, 800);

    /**
     * 验证码图片 解析成 真正可输入的验证码
     * @param {string} base64
     * @returns {string}
     */
    function img2code(base64) {
        var pic_str = '';
        $.ajax({
            url: 'https://upload.chaojiying.net/Upload/Processing.php',
            type: 'POST',
            async: false,
            data: {
                user: 'lennon',
                pass: 'Lennon7c7chaojiying',
                softid: '',
                codetype: '8001',
                userfile: '',
                file_base64: base64.replace(/data:image\/[a-z]+;base64,/, '')
            },
            success: function (result) {
                /** @var result.err_no */
                /** @var result.err_str */
                if (result.err_no !== 0 || result.err_str !== 'OK') {
                    return false;
                }

                pic_str = result.pic_str;
            }
        });

        return pic_str;
    }

    /**
     * 判断是否需要登录
     * @returns {boolean}
     */
    function devIsLogin() {
        var isLogin = false;
        $.ajax({
            url: 'http://openapidev.jiedianqian.com/sand-box-api/admin/account/checkLogin',
            async: false,
            success: function (result) {
                if (result.code !== 0 || result.msg !== 'OK') {
                    return false;
                }

                isLogin = true;
            }
        });

        return isLogin;
    }

    /**
     * 执行登录操作
     */
    function devLogin() {
        var elementUsername = $('input[placeholder="请输入登录账号"]');
        var elementPassword = $('input[placeholder="请输入密码"]');
        var elementCaptchaBase64 = $('.img-code').attr('src');
        var elementLoginDialog = $('.ivu-modal-mask');
        if (elementLoginDialog.is(':hidden')) {
            return false;
        }

        if (!elementUsername.val() || !elementPassword.val() || !elementCaptchaBase64) {
            return false;
        }

        if (devIsLogin()) {
            $('.ivu-modal-close').click();
            return false;
        }

        var verifyCode = img2code(elementCaptchaBase64);
        if (!verifyCode) {
            return false;
        }

        $.ajax({
            url: 'http://openapidev.jiedianqian.com/sand-box-api/admin/account/login',
            type: 'POST',
            contentType: 'application/json',
            async: false,
            data: JSON.stringify({
                'dataModel': {
                    'account': elementUsername.val(),
                    'password': elementPassword.val(),
                    'verifyCode': verifyCode
                }
            }),
            success: function (result) {
                if (result.code !== 0 || result.msg !== 'OK') {
                    return false;
                }
            }
        });
    }
})();
