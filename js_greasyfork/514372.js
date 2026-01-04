// ==UserScript==
// @name        New script 4399.com
// @namespace   Violentmonkey Scripts
// @match       https://news.4399.com/hxjy/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/10/28 02:57:49
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514372/New%20script%204399com.user.js
// @updateURL https://update.greasyfork.org/scripts/514372/New%20script%204399com.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 定义用户名和密码数组
    let usernames = ['3279343494', '3279647963', '3289164126']; // 替换为实际用户名数组
    let passwords = ['111111', '111111', '111111']; // 替换为实际密码数组

    let usernameIndex = 0;
    let passwordIndex = 0;

    function performLogin() {
        let usernameInput = document.getElementById('username');
        let passwordInput = document.getElementById('j - password');
        let submitButton = document.querySelector('.ptlogin_btn[type="submit"]');

        usernameInput.value = usernames[usernameIndex];
        passwordInput.value = passwords[passwordIndex];

        submitButton.click();
    }

    function waitForLinkAndClick() {
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                let link = document.querySelector('a:contains("联通一区")');
                if (link) {
                    clearInterval(interval);
                    link.click();
                    resolve();
                }
            }, 1000);
        });
    }

    function waitAndLogout() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let logoutButton = document.querySelector('.loginout');
                if (logoutButton) {
                    logoutButton.click();
                    resolve();
                }
            }, 3000);
        });
    }

    async function main() {
        while (usernameIndex < usernames.length && passwordIndex < passwords.length) {
            performLogin();
            await waitForLinkAndClick();
            await waitAndLogout();
            usernameIndex++;
            passwordIndex++;
        }
    }

    main();
})();