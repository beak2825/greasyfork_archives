// ==UserScript==
// @name         解鎖右鍵與自動填密碼（myppt.cc、lurl.cc）
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  對於myppt.cc、lurl.cc，解除右鍵、拖曳等限制，並根據上傳日期自動填入密碼。
// @author       Tunafin
// @match        https://myppt.cc/*
// @match        https://lurl.cc/*
// @icon         https://i.imgur.com/SVE5rda.jpeg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542986/%E8%A7%A3%E9%8E%96%E5%8F%B3%E9%8D%B5%E8%88%87%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%86%E7%A2%BC%EF%BC%88mypptcc%E3%80%81lurlcc%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542986/%E8%A7%A3%E9%8E%96%E5%8F%B3%E9%8D%B5%E8%88%87%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%86%E7%A2%BC%EF%BC%88mypptcc%E3%80%81lurlcc%EF%BC%89.meta.js
// ==/UserScript==

// 解除右鍵、拖曳等事件的監聽器
(function () {
    'use strict';

    // 1. 解除 document 上的事件屬性
    document.oncontextmenu = null;
    document.ondragstart = null;
    document.onmousedown = null;
    document.onkeydown = null;

    // 2. 解除 addEventListener 加上的事件
    // 支援的事件型別
    const events = ['contextmenu', 'drag', 'drop'];

    events.forEach(eventType => {
        // 先複製原始 document
        const clone = document.cloneNode(true);
        // 對 document 和 body 移除所有對應事件
        document.removeEventListener(eventType, preventer, true);
        document.body && document.body.removeEventListener(eventType, preventer, true);
    });

    // 3. 解除所有可能的 preventDefault 監聽（粗暴方式）
    setTimeout(() => {
        events.forEach(eventType => {
            window.addEventListener(eventType, function (e) {
                e.stopImmediatePropagation();
            }, true);
        });
    }, 500);

    // 處理已經註冊的監聽器（防止阻擋右鍵和拖曳）
    function preventer(e) {
        e.stopImmediatePropagation();
    }

    // 4. 移除自定義 show_msg 影響
    window.show_msg = "0";

    // 5. 防止 show_toast 被觸發（非必要，可選）
    window.show_toast = function () {};

})();

//  根據上傳日期，將4位數填入密碼框
(function () {
    'use strict';

    // 取得所有 span.login_span
    const spans = document.querySelectorAll('span.login_span');
    let mmdd = '';

    for (const span of spans) {
        // 僅取第一個符合「上傳日期」格式的 span
        const dateMatch = span.textContent.match(/上傳日期：(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
            mmdd = dateMatch[2] + dateMatch[3];
            break;
        }
    }

    if (mmdd) {
        // 針對 myppt.cc 與 lurl.cc 不同欄位，皆嘗試填入
        const pwdInput1 = document.querySelector('input#pasahaicsword.form-control');
        if (pwdInput1) {
            pwdInput1.value = mmdd;
        }
        const pwdInput2 = document.querySelector('input#password');
        if (pwdInput2) {
            pwdInput2.value = mmdd;
        }
    }
})();
