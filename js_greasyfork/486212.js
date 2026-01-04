// ==UserScript==
// @name         OU Auto Login
// @namespace    https://github.com/Raclamusi
// @version      1.1.3
// @description  大阪大学全学 IT 認証基盤サービスに自動でログインします。 Automatically log in to the Osaka University University Campus-wide IT Authentication Platform Service.
// @author       Raclamusi
// @supportURL   https://github.com/Raclamusi/OUAutoLogin
// @match        https://www.cle.osaka-u.ac.jp/*
// @match        https://ou-idp.auth.osaka-u.ac.jp/idp/idplogin*
// @match        https://ou-idp.auth.osaka-u.ac.jp/idp/sso_redirect*
// @match        https://ou-idp.auth.osaka-u.ac.jp/idp/authnPwd*
// @match        https://ou-idp.auth.osaka-u.ac.jp/idp/otpAuth*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486212/OU%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/486212/OU%20Auto%20Login.meta.js
// ==/UserScript==

// OU Auto Login
// Copyright (c) 2024 Raclamusi
// This software is released under the MIT License, see https://github.com/Raclamusi/OUAutoLogin/blob/main/LICENSE .

(function () {
    "use strict";

    // CLE
    if (document.location.hostname === "www.cle.osaka-u.ac.jp") {
        // 「ログイン(大阪大学個人IDを持っている方)」ボタンが存在したら、自動で押す
        const loginButton = document.querySelector('input#loginsaml');
        if (loginButton) {
            loginButton.click();
        }
        return;
    }

    // ログイン画面
    if (document.location.hostname === "ou-idp.auth.osaka-u.ac.jp") {
        const storageKeyPrefix = "ou_auto_login__";
        const load = key => localStorage.getItem(storageKeyPrefix + key);
        const store = (key, value) => localStorage.setItem(storageKeyPrefix + key, value);

        if (document.location.pathname === "/idp/authnPwd") {
            // エラー画面の場合はエラーフラグを立てる
            const errorh1 = document.querySelector('.errorh1');
            if (errorh1) {
                store("error", true);
                return;
            }
        }

        // ロールID選択画面の場合は大きいボタンを設置する
        const roleTable = document.querySelector('table.style_table2');
        if (roleTable) {
            const roleTRs = roleTable.querySelectorAll('tr:has(input)');
            const okButton = document.querySelector('input#ok')
            for (const tr of roleTRs) {
                const input = tr.querySelector('input');
                tr.addEventListener("click", () => {
                    input.click();
                    okButton.click();
                });
            }
        }

        const idInput = document.querySelector('input#USER_ID');
        const passwordInput = document.querySelector('input#USER_PASSWORD');
        const loginButton = document.querySelector('input[name="cmdForm.Submit"]');
        if (!(idInput && passwordInput && loginButton)) {
            return;
        }
        const id = load("id");
        const password = load("password");
        const error = load("error");
        if (id && password && !error) {
            // ID 、パスワードが保存されていて、前回がエラー出なければ、自動でログインする
            idInput.value = id;
            passwordInput.value = password;
            setTimeout(() => loginButton.click());
            setInterval(() => loginButton.click(), 100);
            return;
        }
        if (error) {
            // エラーフラグの解除
            store("error", "");
        }
        // 保存した ID 、パスワードがあれば、入力欄にそれを設定する
        // そうでなければ、入力された ID 、パスワードを自動保存する
        if (id) {
            idInput.value = id;
        }
        else {
            store("id", idInput.value);
        }
        if (password) {
            passwordInput.value = password;
        }
        else {
            store("password", passwordInput.value);
        }
        idInput.addEventListener("input", () => {
            store("id", idInput.value);
        });
        passwordInput.addEventListener("input", () => {
            store("password", passwordInput.value);
        });
        return;
    }
})();
