// ==UserScript==
// @name        天眼查助手
// @description 天眼查移除公司图标、人物图标
// @match       *://www.tianyancha.com/*
// @version     2.4.0
// @grant       none
// @run-at      document-end
// @license MIT
// @namespace https://greasyfork.org/users/197174
// @downloadURL https://update.greasyfork.org/scripts/447762/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447762/%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

async function 屏蔽图标() {
  setInterval(() => {
    [...document.querySelectorAll('.left-logo')].map(x=>x.style.display='none')
  }, 100)
}

(async function() {
    'use strict';
    屏蔽图标();
})();