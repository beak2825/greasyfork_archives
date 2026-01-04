// ==UserScript==
// @name         江西工业自动登录校园网
// @namespace    https://github.com/gulinb666
// @version      1.3
// @description  仅支持江西工业校园网自动登录
// @author       guli
// @match        *://172.16.3.1/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3.1
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479589/%E6%B1%9F%E8%A5%BF%E5%B7%A5%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E6%A0%A1%E5%9B%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/479589/%E6%B1%9F%E8%A5%BF%E5%B7%A5%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E6%A0%A1%E5%9B%AD%E7%BD%91.meta.js
// ==/UserScript==
// 如果没有生效请在@match修改地址
(function() {
    'use strict';
    // 用户信息 username=用户名 password=密码 operator=运营商 1、校园网 2、中国移动 3、中国电信
    var userInfo = {
        username: '你的账号',
        password: '你的密码',
        operator: 2
    };
    var operatorNum = [1,2,3];
    setTimeout(connect,3000);
    function getArrayIsExist(num,array) {
        try {
            if (typeof num !== 'number' || array.length === 0 || typeof array !== 'object') {
                throw new TypeError('类型错误');
            }
            for (var i = 0; i < array.length; i++) {
                if (num === array[i]) {
                    return true;
                }
            }
            return false;
        } catch(err) {
            throw new TypeError('类型错误');
        }
    }
    function connect() {
        var account = document.querySelector('.edit_row input[name=DDDDD]');
        var password = document.querySelector('.edit_row input[name=upass]');
        var submit = document.querySelector('form[name=f3] input');
        if (account != null && password != null) {
            account.value = userInfo.username;
            password.value = userInfo.password;
        }
        if (!getArrayIsExist(userInfo.operator,operatorNum)) {
            alert('未选择运营商或不支持该运营商！');
            throw new TypeError('未选择运营商或不支持该运营商！');
        }
        var radioInputs = document.querySelectorAll('.edit_radio span');
        if (radioInputs != null && radioInputs.length !== 0) {
            for (var j = 1; j <= radioInputs.length; j++) {
                var radioInput = radioInputs[userInfo.operator].children[0];
                if (radioInput != null) {
                    var display = radioInput.style.display;
                    if (display !== 'none') {
                        radioInput.click();
                        if (submit != null) {
                            submit.click();
                        }
                    }
                }
            }
        }
    }
})();