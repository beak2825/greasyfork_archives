// ==UserScript==
// @name         Garena ChangePass Checker (UI đẹp - Fix 10p)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Kiểm tra change_password trong 10 phút gần nhất, chạy tốt trên ADB/Violentmonkey
// @match        https://account.garena.com/faq*
// @grant        none
// @author       Hynnie Software (mod by GPT)
// @downloadURL https://update.greasyfork.org/scripts/547074/Garena%20ChangePass%20Checker%20%28UI%20%C4%91%E1%BA%B9p%20-%20Fix%2010p%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547074/Garena%20ChangePass%20Checker%20%28UI%20%C4%91%E1%BA%B9p%20-%20Fix%2010p%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Tạo UI ---
    const blurOverlay = document.createElement('div');
    blurOverlay.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        backdrop-filter: blur(6px) brightness(0.5); z-index: 9998;
        pointer-events: none;
    `;
    document.body.appendChild(blurOverlay);

    const ui = document.createElement('div');
    ui.style.cssText = `
        position: fixed; top:50%; left:50%; transform: translate(-50%, -50%);
        z-index: 9999; font-family: Arial, sans-serif;
    `;
    const card = document.createElement('div');
    card.style.cssText = `
        background: rgba(30,30,30,0.95); padding: 30px 40px; border-radius:16px;
        text-align:center; box-shadow:0 8px 20px rgba(0,0,0,0.5); min-width:300px;
    `;
    const header = document.createElement('h1');
    header.innerText = "Hynnie Software x Acheaps";
    header.style.cssText = "color:white; font-size:20px; margin-bottom:10px;";
    const sub = document.createElement('p');
    sub.innerText = "Website: Acheaps.com | Zalo: 056.22222.60";
    sub.style.cssText = "color:#bbb; font-size:13px; margin-bottom:20px;";
    const resultDiv = document.createElement('div');
    resultDiv.innerText = "...";
    resultDiv.style.cssText = `
        font-size:36px; font-weight:bold; margin-bottom:20px; padding:10px 0; border-radius:8px;
    `;
    const logoutBtn = document.createElement('button');
    logoutBtn.innerText = "Đăng xuất";
    logoutBtn.style.cssText = `
        padding:10px 30px; background:#e63946; color:white; border:none; border-radius:8px;
        cursor:pointer; font-size:15px; font-weight:bold; transition:0.2s;
    `;
    logoutBtn.onmouseover = () => logoutBtn.style.background = "#d62828";
    logoutBtn.onmouseout = () => logoutBtn.style.background = "#e63946";
    logoutBtn.onclick = () => {
        const nativeLogoutBtn = document.querySelector('.hd-operation');
        if (nativeLogoutBtn) nativeLogoutBtn.click();
        else alert("Không tìm thấy nút logout gốc.");
    };

    card.append(header, sub, resultDiv, logoutBtn);
    ui.appendChild(card);
    document.body.appendChild(ui);

    // --- Hàm check change_password ---
    async function checkChangePassword() {
        try {
            const res = await fetch("https://account.garena.com/api/account/init", {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();

            const now = new Date();

            let found = false;

            if (Array.isArray(data.sensitive_operation) && data.sensitive_operation.length) {
                const latestOp = data.sensitive_operation.reduce((a,b) => (b.timestamp>a.timestamp)?b:a);

                if (latestOp.operation === "change_password" && latestOp.timestamp) {
                    const logTime = new Date(latestOp.timestamp * 1000);
                    const diff = Math.abs(now - logTime);

                    if (diff <= 10 * 60 * 1000) found = true;
                }
            }

            if (found) {
                resultDiv.innerText = "OK";
                resultDiv.style.background = "green";
                resultDiv.style.color = "white";
            } else {
                resultDiv.innerText = "NO";
                resultDiv.style.background = "red";
                resultDiv.style.color = "white";
            }

        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
            resultDiv.innerText = "Lỗi API";
            resultDiv.style.background = "red";
            resultDiv.style.color = "white";
        }
    }

    // --- Chờ session sẵn sàng rồi check ---
    async function waitForSession(retry = 0) {
        try {
            const res = await fetch("https://account.garena.com/api/account/init", {
                method: "GET",
                credentials: "include"
            });
            if (res.ok) {
                checkChangePassword();
            } else if (retry < 5) {
                setTimeout(() => waitForSession(retry+1), 1000);
            }
        } catch {
            if (retry < 5) setTimeout(() => waitForSession(retry+1), 1000);
        }
    }

    window.addEventListener("load", () => {
        waitForSession();
    });

})();
