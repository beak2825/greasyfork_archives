// ==UserScript==
// @name         Video Time Saver (Firebase)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Lưu và khôi phục thời gian xem video từ Firebase
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529149/Video%20Time%20Saver%20%28Firebase%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529149/Video%20Time%20Saver%20%28Firebase%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 🔹 Cấu hình Firebase
      const FIREBASE_URL = "PASTE YOUR FIREBASE LINK";

    let video = null;
    let VIDEO_ID = "";

    // 🔍 1. Hàm lấy ID video
    function getVideoID() {
        const url = new URL(window.location.href);
        if (url.hostname.includes("youtube.com")) {
            return "youtube_" + url.searchParams.get("v"); // ID video YouTube
        }
        return window.location.pathname.replace(/[^a-zA-Z0-9]/g, ""); // ID cho trang khác
    }

    // 🔍 2. Tìm video (hỗ trợ cả video chuẩn & Plyr.js)
    function findVideo() {
        video = document.querySelector("video") || findPlyrVideo();
        if (video) {
            console.log("🎥 Video found:", video);
            loadVideoTime();
            video.addEventListener("timeupdate", saveVideoTime);
        } else {
            console.log("⏳ Chờ video tải...");
            setTimeout(findVideo, 1000);
        }
    }

    // 🔍 3. Kiểm tra Plyr.js hoặc Video.js
    function findPlyrVideo() {
        if (typeof Plyr !== "undefined" && Plyr.instances.length > 0) {
            return Plyr.instances[0].elements.container.querySelector("video");
        }
        return null;
    }

    // ⬇️ 4. Lấy thời gian video từ Firebase
    function loadVideoTime() {
        GM_xmlhttpRequest({
            method: "GET",
            url: FIREBASE_URL,
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                if (data && data[VIDEO_ID]) {
                    const savedTime = data[VIDEO_ID].time;
                    console.log("⏩ Khôi phục video tại:", savedTime);
                    video.currentTime = savedTime;
                }
            },
        });
    }

    // ⬆️ 5. Lưu thời gian video lên Firebase mỗi 5 giây
    function saveVideoTime() {
        if (!video || video.paused || video.ended) return;

        const time = Math.floor(video.currentTime);
        console.log("💾 Lưu thời gian:", time);

        GM_xmlhttpRequest({
            method: "PATCH",
            url: FIREBASE_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ [VIDEO_ID]: { time: time } }),
        });
    }

    // 🔄 6. Theo dõi thay đổi URL trên YouTube (hỗ trợ SPA)
    function observeURLChanges() {
        let lastURL = window.location.href;
        setInterval(() => {
            if (window.location.href !== lastURL) {
                console.log("🔄 URL changed, reloading script...");
                lastURL = window.location.href;
                VIDEO_ID = getVideoID();
                findVideo();
            }
        }, 1000);
    }

    // 🚀 Chạy script
    VIDEO_ID = getVideoID();
    findVideo();
    observeURLChanges(); // Theo dõi sự thay đổi URL trên YouTube
})();
