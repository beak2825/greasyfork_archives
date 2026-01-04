// ==UserScript==
// @name        Background playback for Via Browser
// @namespace   Violentmonkey Scripts
// @match       https://*.youtube.com/*
// @match       https://*.youtube.com/
// @match       https://m.youtube.com/*
// @match       https://m.youtube.com/
// @match       https://*.youtube-nocookie.com/*
// @match       *://*.youtube.com/*
// @match       *://*.youtube-nocookie.com/*
// @grant       none
// @version     1.2 beta
// @author      Johnny Inc.
// @description 11/2/2023, 4:29:15 PM
// @downloadURL https://update.greasyfork.org/scripts/478848/Background%20playback%20for%20Via%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/478848/Background%20playback%20for%20Via%20Browser.meta.js
// ==/UserScript==
'use strict';

const lactRefreshInterval = 5 * 60 * 1000; // 5 phút (mili giây)
const initialLactDelay = 1000; // 1 giây (độ trễ ban đầu trước khi kiểm tra _lact)

console.log("Bắt đầu script giữ tab hoạt động nền...");

// --- Cố gắng ép buộc trạng thái "visible" bằng Page Visibility API ---
try {
    Object.defineProperties(document, {
        'hidden': { value: false },
        'visibilityState': { value: 'visible' }
    });
    window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
    console.log("Thao tác Page Visibility API thành công.");
} catch (error) {
    console.warn("Thao tác Page Visibility API thất bại. Hoạt động nền có thể kém tin cậy hơn.", error);
}

// --- Hàm chờ _lact và sau đó cập nhật định kỳ ---
function waitForYoutubeLactInit(delay = initialLactDelay) {
    if (typeof window !== 'undefined' && window && window.hasOwnProperty('_lact')) {
        console.log("_lact đã được tìm thấy. Bắt đầu cập nhật định kỳ.");
        window.setInterval(() => {
            try {
                if (typeof window !== 'undefined' && window) {
                    window._lact = Date.now();
                    // console.debug("_lact đã được cập nhật:", window._lact); // Gỡ lỗi tùy chọn - có thể gây tràn console
                } else {
                    console.warn("Đối tượng window không còn khả dụng trong interval. Dừng cập nhật lact.");
                    clearInterval(this); // Dừng interval nếu window biến mất (khó xảy ra trong trình duyệt, nhưng để an toàn)
                }
            } catch (error) {
                console.error("Lỗi trong interval cập nhật _lact:", error); // Xử lý lỗi trong interval
                clearInterval(this); // Dừng interval nếu có lỗi liên tục
            }
        }, lactRefreshInterval);
    } else {
        console.debug("_lact chưa được tìm thấy. Thử lại sau", delay, "ms");
        window.setTimeout(() => waitForYoutubeLactInit(delay * 2), delay); // Backoff độ trễ theo cấp số nhân
    }
}

// --- Bắt đầu quá trình ---
if (typeof window !== 'undefined' && window) {
    waitForYoutubeLactInit();
    console.log("waitForYoutubeLactInit đã được khởi động.");
} else {
    console.warn("Script không chạy trong môi trường trình duyệt có đối tượng 'window'.");
}

// --- Metadata Userscript (nếu cần cho trình quản lý userscript) ---
// ==UserScript==
// @name        Giữ Tab Hoạt Động Nền (Lact Keep-Alive)
// @description Giữ cho tab hoạt động trong nền bằng cách cập nhật _lact. Có thể cải thiện độ tin cậy khi chạy nền.
// @match       *://*/*  /* Khớp với tất cả các URL - điều chỉnh nếu cần cho các trang cụ thể */
// @run-at      document-start /* Hoặc document-idle nếu document-start quá sớm */
// @grant       none
// @all-frames  true
// ==/UserScript==