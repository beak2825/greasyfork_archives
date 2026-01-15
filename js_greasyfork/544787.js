// ==UserScript==
// @name         Steam 語言切換下拉選單
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 Steam 網頁右上角插入語言切換下拉選單，支援繁中、簡中、日文、英文快速切換
// @author       shanlan(ChatGPT o3-mini)
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544787/Steam%20%E8%AA%9E%E8%A8%80%E5%88%87%E6%8F%9B%E4%B8%8B%E6%8B%89%E9%81%B8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/544787/Steam%20%E8%AA%9E%E8%A8%80%E5%88%87%E6%8F%9B%E4%B8%8B%E6%8B%89%E9%81%B8%E5%96%AE.meta.js
// ==/UserScript==

{
// 注入自定義樣式
let style = document.createElement("style");
style.textContent = `
.steam-lang-dropdown {
position: relative;
display: inline-block;
font-size: 14px;
font-family: sans-serif;
vertical-align: top;
}
.steam-lang-dropdown-btn {
background-color: rgba(255,255,255,0.1);
color: #fff;
padding: 5px 10px;
border: none;
cursor: pointer;
user-select: none;
}
.steam-lang-dropdown-btn:hover {
background-color: rgba(255,255,255,0.2);
}
.steam-lang-dropdown-content {
display: none;
position: absolute;
background-color: #282828;
box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
z-index: 1000;
border-radius: 3px;
overflow: hidden;
right: 0;
}
.steam-lang-dropdown-content a {
color: #fff;
padding: 5px 10px;
text-decoration: none;
display: block;
cursor: pointer;
white-space: nowrap;
}
.steam-lang-dropdown-content a:hover {
background-color: rgba(255,255,255,0.1);
}
`;
document.head.appendChild(style);

// 定義各語言，[按鈕顯示文字, URL 語言參數, ISO 語言代碼]
let langs = [
["繁體", "tchinese", "zh-tw"],
["简体", "schinese", "zh-cn"],
["日本語", "japanese", "ja"],
["English", "english", "en"]
];

// 取得目前語言狀態
let urlObj = new URL(window.location);
let currentParam = urlObj.searchParams.get("l");
let currentISO = document.documentElement.lang;
let selected = langs.find(v => v[1] === currentParam || v[2] === currentISO) || langs[0];

// 建立下拉選單結構
let dropdown = document.createElement("div");
dropdown.className = "steam-lang-dropdown";

// 建立下拉按鈕
let btn = document.createElement("button");
btn.className = "steam-lang-dropdown-btn";
btn.textContent = selected[0];
dropdown.appendChild(btn);

// 建立下拉內容容器
let dropdownContent = document.createElement("div");
dropdownContent.className = "steam-lang-dropdown-content";
langs.forEach(lang => {
let a = document.createElement("a");
a.textContent = lang[0];
a.addEventListener("click", () => {
let newURL = new URL(window.location);
newURL.searchParams.set("l", lang[1]);
window.location = newURL.href;
});
dropdownContent.appendChild(a);
});
dropdown.appendChild(dropdownContent);

// 切換下拉內容顯示/隱藏
btn.addEventListener("click", (e) => {
e.stopPropagation();
dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
});
document.addEventListener("click", () => {
dropdownContent.style.display = "none";
});

// 插入下拉選單到 id="global_action_menu" 右側 (直接加入該容器)
let container = document.getElementById("global_action_menu");
if (container && container.parentNode) {
container.parentNode.insertBefore(dropdown, container.nextSibling);
}
}