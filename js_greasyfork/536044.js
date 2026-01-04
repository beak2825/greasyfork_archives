// ==UserScript==
// @name         小说ID自动复制（番茄小说专用）
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  自动提取番茄小说ID并复制，方便粘贴使用
// @author       YourName
// @match        *://*.fanqienovel.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536044/%E5%B0%8F%E8%AF%B4ID%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%EF%BC%88%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536044/%E5%B0%8F%E8%AF%B4ID%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%EF%BC%88%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取小说ID，路径中包含 book/ 或 novel/ 后跟6位以上数字
    const match = location.href.match(/\/(?:book|novel|reader)?\/?(\d{6,})/i);
    if (!match) return;

    const novelId = match[1];

    // 复制ID到剪贴板
    if (typeof GM_setClipboard !== "undefined") {
        GM_setClipboard(novelId);
    } else {
        const input = document.createElement("textarea");
        input.value = novelId;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    }

    // 显示提示信息
    const msg = document.createElement("div");
    msg.innerText = `小说ID ${novelId} 已复制到剪贴板`;
    Object.assign(msg.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#28a745",
        color: "white",
        padding: "10px 15px",
        borderRadius: "10px",
        zIndex: 9999,
        fontSize: "14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
})();
