// ==UserScript==
// @name         SCP-CN Wiki Recently Created Page Show Rating
// @namespace    https://greasyfork.org/zh-CN/scripts/443218
// @version      0.4
// @description  SCP中分最近发布页面显示实际评分
// @author       chouchoui
// @match        *://scp-wiki-cn.wikidot.com/most-recently-created-cn
// @match        *://scp-wiki-cn.wikidot.com/most-recently-created-cn/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scp-wiki-cn.wikidot.com
// @grant        none
// @esversion    6.0.0
// @downloadURL https://update.greasyfork.org/scripts/443218/SCP-CN%20Wiki%20Recently%20Created%20Page%20Show%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/443218/SCP-CN%20Wiki%20Recently%20Created%20Page%20Show%20Rating.meta.js
// ==/UserScript==

// js
(function () {
  "use strict";
  document.querySelectorAll(".rating-tag").forEach((r) => {
    const rating = document.querySelector(`#${r.id}-hovertip .content p:nth-child(2)`).innerText.replace("评分：", "");
    r.innerHTML = `<span style="margin-left:10px">${rating}</span>`;
  });
})();
