// ==UserScript==
// @name         TokyoTech / SciTokyo Wi-Fi Login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  キャンパス無線 LAN へのログイン作業を自動化します (チェックボックス・ログインボタンのクリックを省略)
// @author       yosswi414
// @match        https://n513.network-auth.com/splash/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=network-auth.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482025/TokyoTech%20%20SciTokyo%20Wi-Fi%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/482025/TokyoTech%20%20SciTokyo%20Wi-Fi%20Login.meta.js
// ==/UserScript==

// Put your ID / Password here
let secret_id = '12B34567';
let secret_pw = 'password';

(function(d,id,pw) {
    'use strict';
    let input_id = d.getElementById('email_field');
    let input_pw = d.getElementById('password_field');
    let input_checkbox = d.getElementById('gdpr_checkbox');
    let input_login = d.getElementById('sign_in')
    if (input_id === null) return;
    if (input_pw === null) return;
    if (input_checkbox === null) return;
    if (input_login === null) return;
    input_id.value = id;
    input_pw.value = pw;
    input_checkbox.click();
    input_login.click();
})(document, secret_id, secret_pw);
