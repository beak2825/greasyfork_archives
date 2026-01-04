// ==UserScript==
// @name         白水腾讯视频跳转
// @namespace    https://greasyfork.org/zh-CN/users/1390554-baishui1134
// @version      0.2.0
// @description  腾讯视频快捷跳转到欧乐影院、唐人街影院
// @author       You
// @match        https://v.qq.com/x/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_addStyle
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/515665/%E7%99%BD%E6%B0%B4%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/515665/%E7%99%BD%E6%B0%B4%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(
  ".tiaozhuan{margin:5px; background-color: #008CBA;border: none;color: white;border-radius: 16px;padding: 5px 15px;text-align: center;text-decoration: none;display: inline-block;font-size: 12px;transition-duration: 0.4s;cursor: pointer;}"
);
GM_addStyle(
  ".tiaozhuan:hover{background-color:red}"
);

const title = document.querySelector(".playlist-intro__title").innerText;
const tname = document.querySelector(".playlist-intro__title");
const sourceBox = document.createElement("div");

tname.insertAdjacentElement("beforebegin", sourceBox);

const buttons = [
  { name: "欧乐影院", url: "https://www.olehdtv.com/index.php/vod/search/wd/" },
  {
    name: "唐人街影院",
    url: "https://www.trjvod.com/index.php/vod/search.html?wd=",
  },
];

let html = "";

buttons.forEach((item) => {
  html += `<button class="tiaozhuan" data-url="${item.url}">${item.name}</button>`;
});

sourceBox.innerHTML = html;

sourceBox.addEventListener("click", function (event) {
  const target = event.target;
  if (target.tagName === "BUTTON") {
    const url = target.getAttribute("data-url");
    window.open(url + title);
  }
});

})();