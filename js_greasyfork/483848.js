// ==UserScript==
// @name         广东工贸登录保存账号密码
// @namespace    http://tampermonkey.net/
// @version      2024-05-31
// @description  给 教务系统、优慕课、统一登录 添加记住账号密码功能（狗屎工贸，这点功能都不做）
// @author       577fkj (Github @577fkj)
// @match        https://sfrz.gdgm.cn/authserver/login**
// @match        https://umooc.gdgm.cn/**
// @match        https://jw.gdgm.cn/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdgm.cn
// @grant        none
// @run-at       document-idle
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/483848/%E5%B9%BF%E4%B8%9C%E5%B7%A5%E8%B4%B8%E7%99%BB%E5%BD%95%E4%BF%9D%E5%AD%98%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/483848/%E5%B9%BF%E4%B8%9C%E5%B7%A5%E8%B4%B8%E7%99%BB%E5%BD%95%E4%BF%9D%E5%AD%98%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.createElement('div');
    var rem_user = document.createElement('input');
    var user_text = document.createElement('label');
    var rem_pass = document.createElement('input');
    var passr_text = document.createElement('label');

    user_text.textContent = '记住账号';
    passr_text.textContent = '记住密码';

    rem_user.type = 'checkbox';
    rem_pass.type = 'checkbox';

    div.style = 'text-align: center;margin: 10px auto;'

    rem_user.onclick = () => {
        if (!rem_user.checked) {
            rem_pass.checked = false;
        }
        save();
    };

    rem_pass.onclick = save;

    div.appendChild(rem_user);
    div.appendChild(user_text);
    div.appendChild(rem_pass);
    div.appendChild(passr_text);

    var getData;
    var setData;

    function save() {
        var { username, password } = getData();

        if (rem_user.checked) {
            localStorage.setItem('u_name', username);
        } else {
            localStorage.removeItem('u_name');
        }
        if (rem_pass.checked) {
            localStorage.setItem('u_pass', password);
            rem_user.checked = true;
        } else {
            localStorage.removeItem('u_pass');
        }
    }

    if ($ === void 0){
        return;
    }

    var casLoginForm;
    if ((casLoginForm = $("#casLoginForm")) && casLoginForm.length !== 0) {
        console.log("统一认证");
        getData = () => {
            var username = casLoginForm.find("#username").val();
            var password = casLoginForm.find("#password").val();
            return { username, password };
        };
        setData = (user, pass) => {
            casLoginForm.find("#username").val(user);
            casLoginForm.find("#password").val(pass);
        };

        $("#cpatchaDiv").before(div);
        casLoginForm.submit(save);
    } else if ((casLoginForm = $(".login-button")) && casLoginForm.length !== 0) {
        console.log("Umooc");
        getData = () => {
            var username = $("#userName").val();
            var password = $("#passWord").val();
            return { username, password };
        }
        setData = (user, pass) => {
            $("#userName").val(user);
            $("#passWord").val(pass);
        };
        casLoginForm.before(div);
        $(".login-button").children().click(save);
    } else if (window.location.href.startsWith('https://jw.gdgm')) {
        console.log("教务");
        getData = () => {
            var username = $("#userAccount").val();
            var password = $("#userPassword").val();
            return { username, password };
        }
        setData = (user, pass) => {
            $("#userAccount").val(user);
            $("#userPassword").val(pass);
        };

        var btn = $('.btn')
        if (btn.text().replaceAll(' ', '') === '登录') {
            btn.before(div);
            btn.click(save);
        }
    }

    var userName = '';
    var passWord = '';

    if (localStorage.getItem('u_name')) {
        userName = localStorage.getItem('u_name');
        rem_user.checked = true;
        if (localStorage.getItem('u_pass')) {
            passWord = localStorage.getItem('u_pass')
            rem_pass.checked = true;
        }
    }
    setData && setData(userName, passWord);
})();