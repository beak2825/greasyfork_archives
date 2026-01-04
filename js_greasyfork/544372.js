// ==UserScript==
// @name         T24 - Keep Alive + Chuyen CN (frame BANNER only)
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Giữ phiên T24 + Nút chuyển chi nhánh 205-209, 876 chỉ hiển thị ở frame BANNER
// @match        *://*/BrowserWeb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544372/T24%20-%20Keep%20Alive%20%2B%20Chuyen%20CN%20%28frame%20BANNER%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544372/T24%20-%20Keep%20Alive%20%2B%20Chuyen%20CN%20%28frame%20BANNER%20only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const name = window.name.toLowerCase();
    const isMenuFrame = name.includes("menu");
    const isBannerFrame = name.includes("banner");
    const isMainWindow = (window === window.top && !isMenuFrame && !isBannerFrame);

    console.log("🟨 T24 Script đang chạy trong window.name:", window.name);
    console.log("📍 isMainWindow =", isMainWindow, "| isBannerFrame =", isBannerFrame);

    // === 1. GIỮ PHIÊN (chỉ ở main window) ===
    if (isMainWindow) {
        console.log("✅ Bắt đầu Keep Alive...");

        const user = window.name?.split("_")[0] || "DEFAULT";
        const enquiryCode = "CBS.CUSTOMER.POSITION.DETAIL";

        function createPayload() {
            const width = 640, height = 480;
            const routineArgs = `ENQ:${enquiryCode}:0:0:${width}:${height}`;
            const windowName = `${user}_ENQ_${enquiryCode.replace(/\./g, "_")}_${Date.now()}`;
            return new URLSearchParams({
                command: "globusCommand",
                requestType: "NO.REQUEST",
                routineArgs: routineArgs,
                unlock: "ENQ",
                closing: "Y",
                pwprocessid: "undefined",
                windowName: windowName,
                screenMode: ""
            }).toString();
        }

        function sendKeepAlive() {
            const payload = createPayload();
            console.log("🔁 Gửi ENQUIRY giữ phiên lúc", new Date().toLocaleTimeString());

            fetch("/BrowserWeb/servlet/BrowserServlet", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: payload
            }).then(res => {
                if (res.ok) console.log("✅ Giữ phiên thành công", new Date().toLocaleTimeString());
                else console.warn("⚠️ Giữ phiên thất bại:", res.status);
            }).catch(err => {
                console.error("❌ Lỗi giữ phiên:", err);
            });
        }

        setInterval(sendKeepAlive, 60000);
    }

    // === 2. Nút chuyển CN (chỉ trong frame BANNER) ===
    if (isBannerFrame) {
        console.log("🧩 Đang tạo nút chuyển CN trong frame BANNER");

        const branches = {
            '205': 'VN0010064',
            '206': 'VN0010065',
            '207': 'VN0010066',
            '208': 'VN0010067',
            '209': 'VN0010068',
            '876': 'VN0010306'
        };

        const container = document.createElement('div');
        container.id = 'nut-chuyen-cn';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            gap: '8px',
            background: 'rgba(255,255,255,0.8)',
            padding: '6px 10px',
            borderRadius: '10px',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)'
        });

        const colors = ['#0078D7', '#6c63ff', '#17a2b8', '#28a745', '#ff9800', '#9c27b0'];
        let i = 0;

        for (const [label, code] of Object.entries(branches)) {
            const btn = document.createElement('button');
            btn.innerText = label;
            Object.assign(btn.style, {
                padding: '6px 10px',
                background: colors[i % colors.length],
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '13px'
            });
            btn.onclick = () => {
                console.log('🔁 Chuyển chi nhánh sang:', code);
                if (typeof window.doloadCompany === 'function') {
                    window.doloadCompany(code);
                } else {
                    alert("Không tìm thấy hàm chuyển chi nhánh (doloadCompany)");
                }
            };
            container.appendChild(btn);
            i++;
        }

        document.body.appendChild(container);
    }
})();