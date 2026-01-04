// ==UserScript==
// @name         Huawei Extend
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  中文
// @author       You
// @match        *://*.huaweicloud.com/*
// @icon         https://www.google.com/s2/favicons?domain=huaweicloud.com
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438721/Huawei%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/438721/Huawei%20Extend.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url = location.href;
    var timer1, timer2, timer3;
    //自动填充密码
    if (url.indexOf('auth.huaweicloud.com/authui/login.html') > -1) {

        timer1 = setInterval(function () {
            console.log('timer1监听中...');
            //IAM账号
            var iamacid = document.getElementById("IAMAccountInputId");
            if (null != iamacid) {
                $("#IAMAccountInputId").off('change').on('change', function () {
                    var account = $("#IAMAccountInputId").val();
                    if (account == 'hw74475355') {
                        var evt = document.createEvent('HTMLEvents');
                        evt.initEvent('input', true, true);

                        var userName = document.getElementById('IAMUsernameInputId');
                        userName.value = 'edu';
                        userName.dispatchEvent(evt);
                        setTimeout(function(){
                            var iamid = document.getElementById('IAMPasswordInputId');
                            iamid.value = 'edu@huawei';
                            iamid.dispatchEvent(evt);
                        },500);
                       
                    }
                });
                clearInterval(timer1);
                console.log('timer1监听取消');
            }
        }, 1000);

        timer2 = setInterval(function () {
            console.log('timer监听中...');
            var submitBtn = document.getElementById("submitBtn");
            if (null != submitBtn) {
                clearInterval(timer2);
                console.log('timer2监听取消');
                var myEvent = new Event('click');
                submitBtn.dispatchEvent(myEvent); // => true
            }
        }, 1000);
    }

    timer3 = setInterval(function () {
        console.log('timer3监听中...');
        var div = document.getElementById("cf-service-consult-menu");
        if (null != div) {

            clearInterval(timer3);
            console.log('timer3监听取消');
            div.remove();
        }

    }, 1000);

    setInterval(function () {
        console.log('Interval1监听中...');
        // 自动使用白色背景
        if ($('.night-icon').length == 1) {
            $('[ng-click="btn.theme.night(btn.theme.isNight)"]').click();
            setTimeout(function () {
                $('[ng-click="btn.theme.day(btn.theme.isNight)"]').click()
            }, 1000);
        }

        $('[ng-if="!apisTableMode.columns[1].show"]').attr('style', 'width: 300px;');
    }, 2000);


})();