// ==UserScript==
// @name         taojinyun auto login
// @namespace    https://taojinyun.rong360.com
// @version      2.2
// @description  cause I'm busy
// @author       Lennon
// @match        https://taojinyun.rong360.com/*
// @match        https://taojinyundev.rong360.com/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @run-at       document-end
// @icon         https://www.rong360.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/381920/taojinyun%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/381920/taojinyun%20auto%20login.meta.js
// ==/UserScript==
(function () {
    'use strict';

    setTimeout(function () {
        var elementUsername = $('#mobile');
        var elementPassword = $('#password');
        var elementCaptcha = $('#check');
        var elementCaptchaUrl = location.origin + $('#yw0').attr('src');
        var elementButton = $('.submit');
        if (elementUsername.val() && elementPassword.val() && elementCaptcha.length && elementCaptchaUrl && elementButton.length) {
            // product
            urlToBase64(elementCaptchaUrl, function (base64) {
                var pic_str = ajax(base64);
                if (!pic_str) {
                    return false;
                }

                elementCaptcha.val(pic_str);
                elementButton.click();
            });
        } else {
            $('body').bind('DOMNodeInserted', function() {
                setTimeout(function () {
                    devLogin();
                }, 800);

                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function() {
                        devLogin();
                    });
                });

                var elementLoginDialog = document.querySelector('.login-layer-box');
                if(elementLoginDialog){
                    observer.observe(elementLoginDialog, { attributes : true, attributeFilter : ['style'] });
                    devLogin();
                }
            });
        }
    }, 800);

    function urlToBase64(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    function ajax(base64) {
        var pic_str = '';
        $.ajax({
            url: 'https://upload.chaojiying.net/Upload/Processing.php',
            type: 'POST',
            async: false,
            data: {
                user: 'a123456789',
                pass: 'a123456789',
                softid: '',
                codetype: '1902',
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

    function devLogin() {
        var elementUsername = $('.tel-num');
        var elementPassword = $('.pwd-info');
        var elementCaptcha = $('.auth-num');
        var elementCaptchaUrl = location.origin + $('.auth-img').attr('src');
        var elementButton = $('.submit-btn');

        if (devIsLogin() && $('.login-layer-box').length){
            location.reload();
            return false;
        }

        if (elementUsername.val() && elementPassword.val() && elementCaptcha.length && elementCaptchaUrl && elementButton.length) {
            urlToBase64(elementCaptchaUrl, function (base64) {
                var pic_str = ajax(base64);
                if (!pic_str) {
                    return false;
                }

                elementCaptcha.val(pic_str);
                elementButton.click();
            });
        }
    }

    function devIsLogin() {
        var isLogin = false;
        $.ajax({
            url: 'https://taojinyundev.rong360.com/sandbox/info',
            type: 'GET',
            async: false,
            success: function (result) {
                if (result.status !== 1) {
                    return false;
                }

                isLogin = true;
            }
        });

        return isLogin;
    }
})();