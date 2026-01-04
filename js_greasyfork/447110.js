// ==UserScript==
// @name         人力-DEMO機-新增自動登入按扭
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  本機/測試機 新增自動登入按扭
// @author       涵德
// @match        https://lcahr.lingcheng.tw/TalentMatchDemo/Front/Login*
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447110/%E4%BA%BA%E5%8A%9B-DEMO%E6%A9%9F-%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%E6%8C%89%E6%89%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/447110/%E4%BA%BA%E5%8A%9B-DEMO%E6%A9%9F-%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%E6%8C%89%E6%89%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在這裡新增你的帳號清單 ['密碼', '帳號', '要顯示的按扭名稱(可省略)']
    const accountList = [
        ['qq1234567890', 'testahr01', '外展單位'],
        ['1234567890adminlc', 'admin'],
    ];


    // -----------------------------------------------------------------------------------
    $(function() {
        const $passwordInput = $("#Password"); // 密碼 input
        const $accountInput = $("#Account");   // 帳號 input
        const $loginBtn = $(".btn_login");     // 登入按扭
        const $btnContainer = $('<div>', {class: "form-inline position-absolute p-4 justify-content-end d-flex", style: "transform: translateY(-10px); right: 0; width: 700px;z-index:20;background-color: rgb(255,255,255,0.8);"});

        // 添加登入按扭
        const NewLoginBtn = function([password, account, btnText]) {
            let $newLoginBtn = $("<button>", {
                type: 'button',
                class: 'btn btn-primary form-control m-1 quicklogin-btn',
                title: account + "  |  " + password,
                html: btnText || account,
                'data-toogle': 'tooltip',
            });
            $newLoginBtn.click(() => {
                $accountInput.val(account);
                $passwordInput.val(password);
                $loginBtn.click();
                $.blockUI();
            })
            $btnContainer.append($newLoginBtn);
        }
        accountList.forEach(options => NewLoginBtn(options));

        // 添加 隱藏/顯示 按扭
        const $toggleBtn = $("<button>", {
            style: "top:10px; right: -10px; transform: translate(0%, -56px)",
            type: 'button',
            class: 'btn btn-danger m-1 position-absolute m-4 p-2',
            html: "隱藏/顯示",
            title: "隱藏/顯示自動登入按扭",
            'data-toogle': 'tooltip',
        })
        $toggleBtn.click(function() {
            $btnContainer.find('.quicklogin-btn').toggle(-1);
        });
        $btnContainer.append($toggleBtn);

        $(".login-left").prepend($btnContainer);
        $btnContainer.find("[data-toggle='tooltip']").tooltip();
    });
})();