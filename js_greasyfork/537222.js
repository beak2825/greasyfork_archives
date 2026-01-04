// ==UserScript==
// @name        每0.3秒移除YouTube登出按鈕
// @namespace   每0.3秒移除YouTube登出按鈕
// @match       https://*.youtube.com/*
// @run-at      document-idle
// @grant       none
// @version     1.1
// @author      fen
// @description 移除YouTube登出按鈕
// @downloadURL https://update.greasyfork.org/scripts/537222/%E6%AF%8F03%E7%A7%92%E7%A7%BB%E9%99%A4YouTube%E7%99%BB%E5%87%BA%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/537222/%E6%AF%8F03%E7%A7%92%E7%A7%BB%E9%99%A4YouTube%E7%99%BB%E5%87%BA%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==
    "use strict";
    const logPrefix = "[YouTube 移除登出按鈕]";
    setInterval(() => {
        let removedCount = 0;
        const logoutButtons = Array.from(document.querySelectorAll("tp-yt-paper-item"))
            .filter(el => el.innerText.includes("登出"));
        if (logoutButtons.length > 0) {
            logoutButtons.forEach(btn => {
                btn.remove();
                removedCount++;
            });
            console.log(`${logPrefix} 已移除 ${removedCount} 個登出按鈕。`);
        }
    }, 300);