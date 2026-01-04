// ==UserScript==
// @name         Grass UserID Viewer
// @namespace    https://app.grass.io
// @version      1.1
// @description  Show userId from localStorage with a copy button + Telegram and YouTube links on Grass.io
// @author       itsmesatyavir
// @license      MIT
// @match        https://app.grass.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540373/Grass%20UserID%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/540373/Grass%20UserID%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Main box
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.background = "#fff";
    box.style.border = "2px solid #4CAF50";
    box.style.padding = "14px";
    box.style.zIndex = 9999;
    box.style.borderRadius = "12px";
    box.style.fontFamily = "monospace";
    box.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    box.style.textAlign = "center";
    box.style.minWidth = "250px";

    // User ID display
    const idText = document.createElement("div");
    idText.textContent = "userId: " + userId;
    idText.style.marginBottom = "10px";

    // Copy Button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋 Copy";
    copyBtn.style.padding = "6px 12px";
    copyBtn.style.marginBottom = "10px";
    copyBtn.style.border = "none";
    copyBtn.style.background = "#4CAF50";
    copyBtn.style.color = "#fff";
    copyBtn.style.borderRadius = "6px";
    copyBtn.style.cursor = "pointer";
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(userId).then(() => {
            copyBtn.textContent = "✅ Copied!";
            setTimeout(() => copyBtn.textContent = "📋 Copy", 2000);
        });
    };

    // Telegram Button
    const telegramBtn = document.createElement("a");
    telegramBtn.href = "https://t.me/forestarmy";
    telegramBtn.target = "_blank";
    telegramBtn.textContent = "Join Telegram";
    telegramBtn.style.display = "inline-block";
    telegramBtn.style.background = "#0088cc";
    telegramBtn.style.color = "#fff";
    telegramBtn.style.padding = "6px 12px";
    telegramBtn.style.marginTop = "6px";
    telegramBtn.style.marginBottom = "6px";
    telegramBtn.style.textDecoration = "none";
    telegramBtn.style.borderRadius = "6px";

    // YouTube Button
    const youtubeBtn = document.createElement("a");
    youtubeBtn.href = "https://www.youtube.com/@forestarmy";
    youtubeBtn.target = "_blank";
    youtubeBtn.textContent = "Subscribe YouTube";
    youtubeBtn.style.display = "inline-block";
    youtubeBtn.style.background = "#FF0000";
    youtubeBtn.style.color = "#fff";
    youtubeBtn.style.padding = "6px 12px";
    youtubeBtn.style.marginTop = "6px";
    youtubeBtn.style.textDecoration = "none";
    youtubeBtn.style.borderRadius = "6px";

    // Append all to box
    box.appendChild(idText);
    box.appendChild(copyBtn);
    box.appendChild(telegramBtn);
    box.appendChild(document.createElement("br")); // Line break
    box.appendChild(youtubeBtn);

    // Add to page
    document.body.appendChild(box);
})();