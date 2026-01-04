// ==UserScript==
// @name         江西职业技术大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.2.9.1
// @description  可以用于校园网快速登录(无需手动操作),脚本的功能仅限于自动填充登录表单并模拟登录操作，没有执行任何超出这一范围的活动，也没有从外部网站加载任何代码或数据。
// @author       屑屑
// @match        *://10.31.0.10/*
// @icon         https://s2.loli.net/2024/04/28/WEkjH9iy51z63Of.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483773/%E6%B1%9F%E8%A5%BF%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/483773/%E6%B1%9F%E8%A5%BF%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始化用户账号信息
    function initializeAccount() {
        if (!GM_getValue('initialized')) {
            let user_account = prompt("请输入您的学号:");
            let user_password = prompt("请输入您的身份证后六位:");
            let lsp = prompt("根据您的运营商选择相应的数字（0 校园网、1 中国移动、2 中国联通、3 中国电信）:");

            GM_setValue('user_account', user_account);
            GM_setValue('user_password', user_password);
            GM_setValue('lsp', parseInt(lsp, 10));
            GM_setValue('initialized', true);  // 标记初始化完成
        }
    }

    // 登录函数
    function login() {
        let account = GM_getValue('user_account');
        let password = GM_getValue('user_password');
        let lsp = GM_getValue('lsp');

        var inputOfAccount = '#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(4)';
        var inputOfPassword = '#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(5)';
        var buttonOfLSP = '#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > div.edit_lobo_cell.edit_radio > span:nth-child(' + (lsp + 1) + ') > input';
        var buttonOfLogin = '#edit_body > div:nth-child(3) > div.edit_cell.edit_moreTabs.ui-resizable-autohide > div > div.mt_body > div:nth-child(1) > div > form > input:nth-child(2)';
        var buttonOfLogout = '#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > form > input';  // 登出按钮选择器

        // 检查是否存在登出按钮，若存在则认为已登录
        if (document.querySelector(buttonOfLogout)) {
            window.close();  // 关闭页面
        } else {
            // 填充登录信息并尝试登录
            document.querySelector(inputOfAccount).value = account;
            document.querySelector(inputOfPassword).value = password;
            document.querySelector(buttonOfLSP).checked = true;
            window.setTimeout(function () { document.querySelector(buttonOfLogin).click(); }, 200);
            setTimeout(function () {
                window.close();  // 关闭页面
            }, 1000);
        }
    }

    // 在页面加载时执行
    window.addEventListener('load', function () {
        initializeAccount(); // 首次运行时初始化账号
        login(); // 登录或关闭页面
    });
})();