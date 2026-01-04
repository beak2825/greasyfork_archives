// ==UserScript==
// @name         一键屏蔽B站直播画面
// @namespace    https://link.bilibili.com/p/center/index?visit_id=7nl8rbvvch00#/user-center/my-info/operation
// @version      0.1
// @description  一键屏蔽B站直播间的画面，保留声音
// @author       Vladimir_Silin
// @match        https://live.bilibili.com/*
// @match        https://bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503752/%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BDB%E7%AB%99%E7%9B%B4%E6%92%AD%E7%94%BB%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/503752/%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BDB%E7%AB%99%E7%9B%B4%E6%92%AD%E7%94%BB%E9%9D%A2.meta.js
// ==/UserScript==

let id = GM_registerMenuCommand(
  "一键屏蔽",
  function () {
    alert("已屏蔽");
      var domName = document.querySelector('video');
      domName.setAttribute('style', 'display:none;')
  },
  "h"
);
