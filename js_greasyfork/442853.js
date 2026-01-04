// ==UserScript==
// @name         topPost
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  置顶v2ex高赞回复
// @author       yuyinws
// @match        *://v2ex.com/t/*
// @match        *://*.v2ex.com/t/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.v2ex.com/static/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442853/topPost.user.js
// @updateURL https://update.greasyfork.org/scripts/442853/topPost.meta.js
// ==/UserScript==
(() => {
  // star限制值
  let starLimit = GM_getValue("starLimit") || 5;
  // 菜单注册
  GM_registerMenuCommand(`star限制值:${starLimit}(点击修改)`, () => {
    let starLimit = prompt("请输入");
    GM_setValue("starLimit", starLimit);
  });

  let postMap = new Map();

  let topEl = document.createElement("div");
  topEl.className = "box";

  let refEl = document.querySelector("#Main").childNodes[5];

  let sepEl = document.createElement("div");
  sepEl.className = "sep20";

  let cellEl = document.createElement("div");
  cellEl.className = "cell";
  cellEl.innerText = "高赞回复";

  // 获取所有有star的回复
  document.querySelectorAll("div[id^=r_]").forEach((item) => {
    let clonedItem = item.cloneNode(true);
    if (clonedItem.querySelector(".fade")) {
      let star = Number(clonedItem.querySelector(".fade").innerText);
      if (star >= starLimit) {
        postMap.set(clonedItem, Number(item.querySelector(".fade").innerText));
      }
    }
  });

  // 排序
  const sortMap = new Map([...postMap].sort((a, b) => b[1] - a[1]));
  if (sortMap.size > 0) {
    topEl.appendChild(cellEl);
    for (let [key] of sortMap) {
      topEl.appendChild(key);
    }
    refEl.parentNode.insertBefore(sepEl, refEl);
    refEl.parentNode.insertBefore(topEl, refEl);
  }
})();
