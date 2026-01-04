// ==UserScript==
// @name         nti56 dev token refresh
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  1、自动填充验证码 2、从json数据中取值单独放一份到localStorage中
// @author       niushuai233
// @run-at       document-start
// @match        *://*.nti56.com/*
// @match        http://localhost/*
// @match        http://boot.jeecg.com/*
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428263/nti56%20dev%20token%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/428263/nti56%20dev%20token%20refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    filterCodeRequest();

    function autoRefreshToken() {
        var localStorage = window.localStorage;
        var token = localStorage.getItem('pro__Access-Token');
        var imestoken = '根据key[pro__Access-Token]未找到[token]'
        if (token && token.length > 0) {
            imestoken = JSON.parse(token).value;
        }
        localStorage.setItem('imes_token', imestoken);
        //console.log('imes token refresh success', imestoken);
    }

    function filterCodeRequest() {

        var code_url = '/ils/sys/getCheckCode';
        var isCodeUrl = false;
        ah.proxy({
            //请求发起前进入
            onRequest: (config, handler) => {
                var url_arr = config.url.split("?")
                //console.log(url_arr, new Date().toLocaleString())
                if (code_url == url_arr[0]) {
                    isCodeUrl = true
                }
                handler.next(config);
            },
            onError: (err, handler) => {
                console.log(err.type)
                handler.next(err)
            },
            //请求成功后进入
            onResponse: (response, handler) => {
                autoRefreshToken()
                var res = response.response;
                if (isCodeUrl && response.status == 200) {
                    res = JSON.parse(res);
                    //console.log(new Date().toLocaleString(), 'res=', res);
                    autoFillCode(res.result.code);
                    isCodeUrl = false
                }
                handler.next(response)
            }
        });
    }

    function autoFillCode(code) {

        const inputArr = document.querySelectorAll('.ant-input')

        if (!inputArr) {
            return;
        }

        var findInput = null;
        for(var i=0; i< inputArr.length; i++) {
            var tmp = inputArr[i];
            if (tmp.placeholder && tmp.placeholder == '请输入验证码') {
                findInput = tmp;
            }
        }

        if (!findInput) {
            return;
        }

        const button = document.querySelector('.login-button')

        const event = document.createEvent('HTMLEvents')
        event.initEvent('input', false, true)

        findInput.value = code // 修改用户名输入框的值
        findInput.dispatchEvent(event) // 手动触发输入框的input事件

        button.click() // 触发按钮点击事件
    }



})();