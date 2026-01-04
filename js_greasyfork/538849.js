// ==UserScript==
// @name         YouTube 加入 Vtuber 待看 與 新待播清單 按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 YouTube 側邊欄「稍後觀看」按鈕下方加入「Vtuber 待看」與「新待播清單」按鈕（點擊後於原窗口開啟）
// @author       shanlan(ChatGPT o3-mini)
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538849/YouTube%20%E5%8A%A0%E5%85%A5%20Vtuber%20%E5%BE%85%E7%9C%8B%20%E8%88%87%20%E6%96%B0%E5%BE%85%E6%92%AD%E6%B8%85%E5%96%AE%20%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/538849/YouTube%20%E5%8A%A0%E5%85%A5%20Vtuber%20%E5%BE%85%E7%9C%8B%20%E8%88%87%20%E6%96%B0%E5%BE%85%E6%92%AD%E6%B8%85%E5%96%AE%20%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
"use strict";

// 新增自訂按鈕 CSS 樣式
const customCSS = `
.vtuber-button {
display: block;
margin: 1px auto;
padding: 10px 16px;
font-size: 14px;
font-weight: 500;
color: #f1f1f1;
background-color: #0F0F0F;
border-radius: 4px;
text-decoration: none;
cursor: pointer;
padding-left: 52px;
}
.vtuber-button:hover {
background-color: #272727;
}
`;
const styleNode = document.createElement("style");
styleNode.innerHTML = customCSS;
document.head.appendChild(styleNode);

// 同時加入兩個按鈕
function addButtons() {
// 根據「稍後觀看」按鈕做參考判斷
const laterElement = document.querySelector('a#endpoint[href*="playlist?list=WL"]');
if (!laterElement) return;

// 加入 Vtuber 待看 按鈕（先以 data-type 區別防止重複）
if (!document.querySelector('a.vtuber-button[data-type="vtuber"]')) {
const vtuberBtn = document.createElement("a");
vtuberBtn.className = "vtuber-button style-scope ytd-guide-entry-renderer";
vtuberBtn.href = "https://www.youtube.com/playlist?list=PL9sRqF9w4wp_NGZyhvGQehVKNK31yD-U_";
vtuberBtn.dataset.type = "vtuber";
vtuberBtn.textContent = "Vtuber 待看";
laterElement.parentNode.insertAdjacentElement("afterend", vtuberBtn);
}

// 加入 新待播清單 按鈕，置於 Vtuber 按鈕前面
const vtuberButton = document.querySelector('a.vtuber-button[data-type="vtuber"]');
if (vtuberButton && !document.querySelector('a.vtuber-button.new-list')) {
const newBtn = document.createElement("a");
newBtn.className = "vtuber-button new-list style-scope ytd-guide-entry-renderer";
newBtn.href = "https://www.youtube.com/playlist?list=PL9sRqF9w4wp_L9uXCGEBUgdvTeEoi_a0F";
newBtn.textContent = "新待播清單";
vtuberButton.insertAdjacentElement("beforebegin", newBtn);
}
}

// 初次執行
addButtons();

// 監聽 DOM 變動以因應 SPA 頁面切換
const observer = new MutationObserver(() => {
addButtons();
});
observer.observe(document.body, { childList: true, subtree: true });
})();