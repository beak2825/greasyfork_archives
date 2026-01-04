// ==UserScript==
// @name               『小助手』腾讯微云 - 离线下载
// @name:zh-CN         『小助手』腾讯微云 - 离线下载
// @namespace          ttps://github.com/Hunlongyu
// @version            0.0.2
// @author             Hunlongyu
// @description        One click offline download, no need to click 2 steps.
// @description:zh-CN  一键离线下载，不需要点2步。
// @license            MIT
// @copyright          Copyright (c) [2024] [hunlongyu]
// @icon               https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @homepage           https://github.com/Hunlongyu/userscript
// @supportURL         https://github.com/Hunlongyu/userscript/issues
// @match              *://www.weiyun.com/*
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/485630/%E3%80%8E%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%8F%E8%85%BE%E8%AE%AF%E5%BE%AE%E4%BA%91%20-%20%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/485630/%E3%80%8E%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%8F%E8%85%BE%E8%AE%AF%E5%BE%AE%E4%BA%91%20-%20%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const btButton = document.createElement("div");
  btButton.innerHTML = `
<div class="action-item">
  <div class="action-item-con">
    <span class="act-txt">BT下载</span>
  </div>
</div>
`;
  btButton.setAttribute("class", "mod-action-wrap clearfix");
  btButton.addEventListener("click", () => {
    document.querySelectorAll("li.menu-item")[5].click();
    setTimeout(function() {
      document.querySelectorAll(".tab-nav-item")[0].click();
    }, 10);
  });
  const mgnetButton = document.createElement("div");
  mgnetButton.innerHTML = `
<div class="action-item">
  <div class="action-item-con">
    <span class="act-txt">链接下载</span>
  </div>
</div>
`;
  mgnetButton.setAttribute("class", "mod-action-wrap clearfix");
  mgnetButton.addEventListener("click", () => {
    document.querySelectorAll("li.menu-item")[5].click();
    setTimeout(function() {
      document.querySelectorAll(".tab-nav-item")[1].click();
    }, 10);
    setTimeout(function() {
      document.querySelector(".input-block").focus();
    }, 20);
  });
  window.onload = () => {
    const nav = document.querySelector(".mod-nav");
    nav.appendChild(btButton);
    nav.appendChild(mgnetButton);
  };

})();