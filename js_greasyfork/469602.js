// ==UserScript==
// @name         许昌职业技术学院校园网（自动登录）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动登录校园网
// @author       HUAJIEN
// @match        http://222.89.165.34/*
// @match        http://www.msftconnecttest.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469602/%E8%AE%B8%E6%98%8C%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469602/%E8%AE%B8%E6%98%8C%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const currentPageURL = window.location.href;
    if (currentPageURL.includes('msftconnecttest.com')) {
        window.location.href = 'http://222.89.165.34/srun_portal_pc?ac_id=1&theme=pro';
    }

    const usernameInput = document.getElementById('username');      // 获取登录表单元素
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-account');
    //------------------------------------------------------------------------------------------------------------------------------------------------// 
    usernameInput.value = '这是校园网账号';     //这里填写账号
    passwordInput.value = '这是校园网密码';         //这里填写密码
    //------------------------------------------------------------------------------------------------------------------------------------------------// 



    //  _______
    // < HUAJI >
    //  -------
    //       \                    / \  //\
    //        \    |\___/|      /   \//  \\
    //             /0  0  \__  /    //  | \ \
    //            /     /  \/_/    //   |  \  \
    //            @_^_@'/   \/_   //    |   \   \
    //            //_^_/     \/_ //     |    \    \
    //         ( //) |        \///      |     \     \
    //       ( / /) _|_ /   )  //       |      \     _\
    //     ( // /) '/,_ _ _/  ( ; -.    |    _ _\.-~        .-~~~^-.
    //   (( / / )) ,-{        _      `-.|.-~-.           .~         `.
    //  (( // / ))  '/\      /                 ~-. _ .-~      .-~^-.  \
    //  (( /// ))      `.   {            }                   /      \  \
    //   (( / ))     .----~-.\        \-'                 .~         \  `. \^-.
    //              ///.----..>        \             _ -~             `.  ^-`  ^-_
    //                ///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~
    //                                                                   /.-~



    if (usernameInput.value === "这是校园网账号" || passwordInput.value == "这是校园网密码") {  //这不用改
        alert("请去用户脚本管理器中，找到此脚本的第 23、24 行代码，添加自己的账号与密码");
    } else {
        // 提交登录
        loginButton.click();

        // 等待登录完成
        setTimeout(() => {
            // 检查登录状态并执行其他操作
        }, 5000);
    }
})();