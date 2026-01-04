// ==UserScript==
// @name         安理工校园网登录
// @namespace    http://tampermonkey.net/
// @version      2024-03-08
// @description  try to take over the world!
// @author       qiaobusi
// @match        http://10.255.0.19/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.19
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489137/%E5%AE%89%E7%90%86%E5%B7%A5%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/489137/%E5%AE%89%E7%90%86%E5%B7%A5%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var severs = ["@aust", "@unicom", "@cmcc"];
    window.onload = function () {



        var button = document.createElement('button');
        button.style.position = 'fixed';
          button.innerText = "修改登录信息";
    button.style.top = '20px';
    button.style.left = '20px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px';
        document.body.appendChild(button);

        // 为按钮添加点击事件监听器
        button.addEventListener('click', changeInfo);

        function changeInfo() {
            promptUserInput();
            alert("修改成功，请刷新")
        }
        function promptUserInput() {
            var username = prompt("请输入用户名:");
            localStorage.setItem('username', username);
            var password = prompt("请输入密码:");
            localStorage.setItem('password', password);
            var service = prompt("请输入运营商（0是电信，1是联通，2是移动）:")
            localStorage.setItem('service', severs[Number(service)]);
        }

        function tyrLogin() {
            var username = localStorage.getItem('username');
            var password = localStorage.getItem('password');
            var sever = localStorage.getItem('service');
            if (username != "null" && password != "null" && sever != null) {
                console.log("用户名:", username);

                console.log("密码:", password);
                console.log("运营商：", sever)
                login(username, password, sever);
            } else {
                promptUserInput();
            }
        }


        tyrLogin();

        function login(username, password, sever) {


            document.getElementsByName("DDDDD")[1].value = username;
            document.getElementsByName("upass")[1].value = password;
            document.getElementsByName('ISP_select')[0].value = sever;
            document.getElementsByName('0MKKey')[1].click()
            console.log("登陆成功")


        }
        getStoredCredentials();

    }





})();