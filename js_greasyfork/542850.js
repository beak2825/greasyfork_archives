// ==UserScript==
// @name         轟印者帳密輸完點完機器人驗證就登入開遊
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通過驗證後自動登入，登入成功自動啟動遊戲（只執行一次），支援自動填密碼與多子網域！
// @author       You
// @match        https://www.mangot5.com/Index/Member/Login*
// @match        https://*.mangot5.com/*/index*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/542850/%E8%BD%9F%E5%8D%B0%E8%80%85%E5%B8%B3%E5%AF%86%E8%BC%B8%E5%AE%8C%E9%BB%9E%E5%AE%8C%E6%A9%9F%E5%99%A8%E4%BA%BA%E9%A9%97%E8%AD%89%E5%B0%B1%E7%99%BB%E5%85%A5%E9%96%8B%E9%81%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/542850/%E8%BD%9F%E5%8D%B0%E8%80%85%E5%B8%B3%E5%AF%86%E8%BC%B8%E5%AE%8C%E9%BB%9E%E5%AE%8C%E6%A9%9F%E5%99%A8%E4%BA%BA%E9%A9%97%E8%AD%89%E5%B0%B1%E7%99%BB%E5%85%A5%E9%96%8B%E9%81%8A.meta.js
// ==/UserScript==
(function () {
    'use strict';

    console.log("[TMK] 腳本啟動：" + location.href);

    // 讀取 Cookie
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // 設置 Cookie
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; domain=.mangot5.com`;
    }

    // 刪除 Cookie
    function deleteCookie(name) {
        setCookie(name, "", -1);
    }

    // ✅ STEP 1：登入頁邏輯
    if (location.hostname === "www.mangot5.com" && location.pathname.includes("/Login")) {
        let clickedLogin = false;

        const captchaInterval = setInterval(() => {
            const captcha = document.getElementById("g-recaptcha-response");
            const submitBtn = document.querySelector("#submitBtn");
            const username = document.querySelector('[name="userID"]');
            const password = document.querySelector('[name="password"]');
            const otherElement = document.querySelector('.some-element');

            if (username?.value) {
                username.dispatchEvent(new Event("input", { bubbles: true }));
            }
            if (password?.value) {
                password.dispatchEvent(new Event("input", { bubbles: true }));
            }

            if (username && !username.value && otherElement) {
                console.log("[TMK] 強制觸發點擊事件來啟動自動填充");
                otherElement.click();
            }

            if (
                captcha && captcha.value.trim() !== "" &&
                password?.value && !clickedLogin
            ) {
                console.log("[TMK] 通過 reCAPTCHA，帳密已填，自動點擊登入");
                clickedLogin = true;
                clearInterval(captchaInterval);
                submitBtn?.click();
            }
        }, 300);

        setTimeout(() => {
            const username = document.querySelector('[name="userID"]');
            const password = document.querySelector('[name="password"]');
            if (username && !username.value) {
                console.log("[TMK] 嘗試填充帳號和密碼");
                username.dispatchEvent(new Event("input", { bubbles: true }));
                password.dispatchEvent(new Event("input", { bubbles: true }));
            }
        }, 2000);

        // 攔截 bootbox.dialog 來確認登入成功
        const interceptLoginSuccess = () => {
            const originalBootbox = window.bootbox?.dialog;
            if (!originalBootbox) {
                console.warn("[TMK] bootbox.dialog 尚未載入，延遲重試");
                setTimeout(interceptLoginSuccess, 1000);
                return;
            }

            window.bootbox.dialog = function (options) {
                const messageText = typeof options === 'string' ? options : options?.message || "";
                if (messageText.includes("您已成功登入帳號")) {
                    console.log("[TMK] 攔截到登入成功彈窗，設定啟動遊戲 flag");
                    setCookie("triggerGameStartOnce", "true", 1);
                }
                return originalBootbox.apply(this, arguments);
            };

            console.log("[TMK] 已攔截 bootbox.dialog");
        };

        interceptLoginSuccess();
    }

    // ✅ STEP 2：任一子網域或 www 的 index 頁面，啟動遊戲（只一次）
    if (
        location.hostname.endsWith(".mangot5.com") &&
        location.pathname.includes("/clo/index")
    ) {
        console.log("[TMK] 嘗試自動啟動遊戲，flag 狀態：", getCookie("triggerGameStartOnce"));

        let clicked = false;

        const tryClickGame = () => {
            const btn = document.querySelector('a[id$="_gamestart"]');
            const href = btn?.getAttribute("href") || "";

            if (
                btn &&
                href.startsWith("javascript:launcher_call") &&
                getCookie("triggerGameStartOnce") === "true" &&
                !clicked
            ) {
                console.log("[TMK] 自動啟動遊戲！");
                btn.click();
                clicked = true;
                deleteCookie("triggerGameStartOnce");
            } else {
                console.log("[TMK] 尚未符合條件啟動遊戲。btn:", !!btn, "href:", href);
            }
        };

        const observer = new MutationObserver(() => {
            const btn = document.querySelector('a[id$="_gamestart"]');
            if (btn) {
                tryClickGame();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(tryClickGame, 800); // 備援延遲執行
    }
})();