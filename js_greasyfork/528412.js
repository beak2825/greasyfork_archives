// ==UserScript==
// @name         Capture cookie to string like Chrome
// @name:vi     Sao chéop cookie thành dạng chuỗi
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CaptureCapture cookie to string like Chrome
// @description:vi  CaptureCaptureTampermonkey script này thêm một nút nổi ở góc dưới bên phải của trang web. Khi nhấn vào, nó sẽ lấy tất cả cookie có sẵn của trang hiện tại và sao chép vào clipboard theo định dạng giống như Chrome lưu trữ cookie. Một thông báo xác nhận sẽ hiển thị sau khi sao chép.

// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM.cookie
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528412/Capture%20cookie%20to%20string%20like%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/528412/Capture%20cookie%20to%20string%20like%20Chrome.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tạo nút float button
    let btn = document.createElement("button");
    btn.innerText = "🍪 Copy Cookies";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.padding = "10px 15px";
    btn.style.backgroundColor = "#007bff";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.2)";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "9999";
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "bold";

    // Khi hover, đổi màu sáng hơn
    btn.addEventListener("mouseenter", () => btn.style.backgroundColor = "#0056b3");
    btn.addEventListener("mouseleave", () => btn.style.backgroundColor = "#007bff");

    // Thêm vào trang web
    document.body.appendChild(btn);

    // Xử lý sự kiện khi nhấn vào nút
    btn.addEventListener("click", async function () {
        console.log("Capturing cookies...");

        const cookies = await GM.cookie.list();
        const cookieString = cookies.map(item => item.name + "=" + item.value).join("; ");

        GM_setClipboard(cookieString);
        console.log("Cookies copied to clipboard:", cookieString);
        alert("Cookies have been copied to clipboard!");
    });
})();