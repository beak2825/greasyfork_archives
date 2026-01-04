// ==UserScript==
// @name         人力-測試機-新增自動登入按扭
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  本機/測試機 新增自動登入按扭
// @author       涵德
// @match        http://localhost:30942/Front/Login*
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/Front/Login*
// @match        https://lcahr.lingcheng.tw/TalentMatch/Front/Login*
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443784/%E4%BA%BA%E5%8A%9B-%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%E6%8C%89%E6%89%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/443784/%E4%BA%BA%E5%8A%9B-%E6%B8%AC%E8%A9%A6%E6%A9%9F-%E6%96%B0%E5%A2%9E%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5%E6%8C%89%E6%89%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在這裡新增你的帳號清單 ['密碼', '帳號', '要顯示的按扭名稱(可省略)']
    const accountList = [
        ['ab1234567890', 'linkchain24'],
        ['ab1234567890', 'a2334521'],
        ['ab1234567890', 'chienwu000002', '* 分協會'],
        ['qaz1234567890', 'chien000001', '* chien000001'],
        ['1234567890qaz', 'chien00000A', '* chien00000A (小慧農場)'],
        ['ab0933448508', 'ab0933448508', '* 農糧署中區分署(本機)'],
        ['a0953353720', 'ab1234567890', '* 農糧署分署'],
        ['qaz1234567890', 'claire17', '* 農糧署本署'],
        ['0987654321CD', 'CD1234567890', '(正式機)農場主/求職者(CD1234567890)'],
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