// ==UserScript==
// @name         南昌工程学院校园网自动登录
// @namespace    http:www.yowayimono.cn
// @version      1.3.1
// @description  用于自动登录南昌工程学院校园网（NIT），不用每次手动登录，支持电信,移动，联通，和教师校园网
// @author       You
// @match        http://182.98.163.154:1500/*
// @match        http://223.84.144.29/*
// @match        http://10.0.0.2/*
// @match        http://118.212.160.67:18082/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499597/%E5%8D%97%E6%98%8C%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499597/%E5%8D%97%E6%98%8C%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {

        // 获取当前页面的 URL
        var currentUrl = window.location.href;

        // 检查 localStorage 中是否已经存储了账号和密码
        var storedUsername = localStorage.getItem('username');
        var storedPassword = localStorage.getItem('password');

        console.log(storedUsername);
        console.log(storedPassword);
        if (!storedUsername || storedUsername === null || storedUsername === "" || !storedPassword || storedPassword === null || storedPassword === "" || storedUsername === "null" || storedPassword==="null"){
            // 如果没有存储账号和密码，弹出小窗口请求输入
            var username = prompt("请输入您的账号:");
            var password = prompt("请输入您的密码:");

            // 保存账号和密码到 localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            username = storedUsername;
            password = storedPassword;
        }

        
        if (currentUrl.includes('http://182.98.163.154:1500/')) {
            // 执行针对 电信校园网 的逻辑
            // 设置账号和密码
            // 获取表单元素
            var elements1 = document.querySelectorAll('.edit_lobo_cell');
            console.log(elements1.length);
            elements1[1].value = username;
            elements1[2].value = password;
            elements1[0].click();
            setTimeout(()=>{window.close();},1000);
        } else if (currentUrl.includes('http://223.84.144.29/')) {
            // 执行针对 移动校园网 的逻辑
            // 获取表单元素
            var elements2 = document.querySelectorAll('.edit_lobo_cell');
            console.log(elements2.length);
            elements2[2].value = username;
            elements2[3].value = password;
            elements2[1].click();
            setTimeout(()=>{window.close();},1000);
        } else if(currentUrl.includes('http://10.0.0.2/')){
            var elements3 = document.querySelectorAll('.input-box');
            console.log(elements3.length);

            elements3[0].value = username;
            elements3[1].value = password;


            var elements4 = document.querySelectorAll('.btn-login');
            elements4[0].click();
            console.log("已点击登录");
            console.log(elements4.length);

            setTimeout(()=>{window.close();},1000);

         } else if (currentUrl.includes('http://118.212.160.67:18082/')) {
            // 执行针对 联通校园网 的逻辑
            // 获取表单元素
            var UserName = document.getElementById('UserName');
            var PassWord = document.getElementById('PassWord');
            var Login = document.getElementById('logonbtn');
            UserName.value = username;
            PassWord.value = password;
            Login.click();
            console.log('点击登录！');
            setTimeout(()=>{window.close();},1000);
        }
        else {

            // 默认逻辑
            console.log('未匹配到任何网址');
        }
    };
})();