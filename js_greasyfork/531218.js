// ==UserScript==
// @name         Auto Inject Liveworksheets Show Answers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động chạy đoạn mã jQuery để hiển thị đáp án trong Console khi vào bài Liveworksheets
// @author       Sontung
// @match        https://www.liveworksheets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531218/Auto%20Inject%20Liveworksheets%20Show%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/531218/Auto%20Inject%20Liveworksheets%20Show%20Answers.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectConsoleCommand() {
        const code = `jQuery("#worksheet-preview").worksheetPreview("validation", {
    clicked: !1,
    showAnswers: !0,
    showRightAnswers: !0
});`;

        try {
            // Kiểm tra jQuery và phần tử tồn tại
            if (typeof jQuery !== "undefined" && jQuery("#worksheet-preview").length) {
                eval(code); // Thực thi đoạn mã như gõ vào Console
                console.log("[✔] Mã đã được tự động thực thi vào Console!");
            } else {
                console.warn("[!] jQuery hoặc phần tử #worksheet-preview chưa sẵn sàng.");
            }
        } catch (e) {
            console.error("❌ Lỗi khi chạy đoạn mã trong Console:", e);
        }
    }

    // Đợi trang và jQuery load xong rồi mới chạy
    window.addEventListener("load", () => {
        const interval = setInterval(() => {
            if (typeof jQuery !== 'undefined' && jQuery("#worksheet-preview").length) {
                clearInterval(interval);
                setTimeout(injectConsoleCommand, 1000);
            }
        }, 500);
    });
})();
