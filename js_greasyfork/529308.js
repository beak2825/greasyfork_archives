// ==UserScript==
// @name         Auto Send 200 Requests (Show on Page)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gửi 200 request POST & hiển thị trạng thái trên trang
// @author       Bạn
// @match        http://14.225.254.182/truyen/qidian/1/1043426243/827187774/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529308/Auto%20Send%20200%20Requests%20%28Show%20on%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529308/Auto%20Send%20200%20Requests%20%28Show%20on%20Page%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🟢 Tạo thanh thông báo trên trang
    const statusDiv = document.createElement("div");
    statusDiv.style.position = "fixed";
    statusDiv.style.top = "0";
    statusDiv.style.left = "0";
    statusDiv.style.width = "100%";
    statusDiv.style.padding = "10px";
    statusDiv.style.backgroundColor = "rgba(0, 128, 0, 0.9)"; // Màu xanh lá
    statusDiv.style.color = "white";
    statusDiv.style.fontSize = "18px";
    statusDiv.style.textAlign = "center";
    statusDiv.style.fontWeight = "bold";
    statusDiv.style.zIndex = "9999";
    statusDiv.innerText = "⏳ Đang gửi request...";
    document.body.prepend(statusDiv);

    async function sendRequests() {
        const url = "http://14.225.254.182/index.php?bookid=1043426243&h=qidian&c=827187774&ngmar=readc&sajax=readchapter&sty=1&exts=";
        const headers = {
            "Referer": "http://14.225.254.182/truyen/qidian/1/1043426243/827187774/",
            "User-Agent": navigator.userAgent,
            "Content-Type": "application/x-www-form-urlencoded"
        };
        const cookies = document.cookie;
        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i <= 200; i++) {
            try {
                console.log(`🚀 [${i}/200] Đang gửi request...`);
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        ...headers,
                        "Cookie": cookies
                    },
                    body: ""
                });

                if (response.ok) {
                    successCount++;
                    console.log(`✅ [${i}/200] Thành công!`);
                } else {
                    errorCount++;
                    console.error(`⚠ [${i}/200] Lỗi:`, response.status);
                }
            } catch (error) {
                errorCount++;
                console.error(`❌ [${i}/200] Lỗi khi gửi request:`, error);
            }

            // ⏳ Chờ 1 giây tránh bị chặn
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 🎯 Cập nhật trạng thái trên trang
            statusDiv.innerText = `⏳ Đã gửi: ${i}/200 | ✅ Thành công: ${successCount} | ❌ Lỗi: ${errorCount}`;
        }

        // 🎉 Hoàn thành → Cập nhật trạng thái
        if (successCount === 200) {
            statusDiv.style.backgroundColor = "rgba(0, 128, 0, 1)"; // Xanh lá
            statusDiv.innerText = `✅ Hoàn thành! Gửi thành công 200/200 request.`;
        } else {
            statusDiv.style.backgroundColor = "rgba(255, 0, 0, 0.9)"; // Đỏ
            statusDiv.innerText = `⚠ Hoàn tất: Thành công ${successCount}/200, Lỗi ${errorCount}.`;
        }
    }

    // 🏁 Chạy script khi trang load xong
    window.addEventListener('load', sendRequests);
})();
