// ==UserScript==
// @name         AutoLogin uatebs01.wahshing.com(測試環境)
// @namespace    http://uatebs01.wahshing.com:8000/OA_HTML/AppsLogin
// @version      1.2
// @description  自動登錄wahshing.com網站，退出登錄後不再自動登錄
// @author       CavensHong
// @match        *://uatebs01.wahshing.com:8000/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502842/AutoLogin%20uatebs01wahshingcom%28%E6%B8%AC%E8%A9%A6%E7%92%B0%E5%A2%83%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502842/AutoLogin%20uatebs01wahshingcom%28%E6%B8%AC%E8%A9%A6%E7%92%B0%E5%A2%83%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 賬號密碼, 下載後手動修改這裡, 在單引號內填入賬號密碼, 替換xxx和yyy, 否則會提示賬號密碼不正確
    var username = 'xxx'; // Oracle賬號
    var password = 'yyy'; // Oracle密碼

    function autoLogin() {
        if (window.location.search.includes('_logoutRedirect')) {
            return; // 退出登錄後不不執行腳本, 否則會導致無法切換賬號
        }

        var usernameField = document.getElementById('usernameField');
        var passwordField = document.getElementById('passwordField');
        var languageSelect = document.getElementById('slang');
        var form = document.getElementById('login');

        if (usernameField && passwordField && languageSelect && form) {
            languageSelect.value = 'US'; // 默認語言環境, 若要默認進入中文簡體界面, 可將US替換為CHS, 繁體CHT, 越難越VN, 注意是大寫
            usernameField.value = username;
            passwordField.value = password;
            form.submit();
        }
    }

    window.addEventListener('load', autoLogin);
    setTimeout(autoLogin, 2000);

})();
