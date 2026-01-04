// ==UserScript==
// @name         💻 Chrome控制台日志过滤脚本
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  开发环境脚本控制台过滤!
// @author       Boz
// @run-at       document-start
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539718/%F0%9F%92%BB%20Chrome%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%97%A5%E5%BF%97%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539718/%F0%9F%92%BB%20Chrome%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%97%A5%E5%BF%97%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();
const originalConsoleLog = unsafeWindow.console.log;

unsafeWindow.console.log = function (...args) {
  const message = args.join(" ");
  if (message.includes("=>") || message.includes(":")) {
    originalConsoleLog(...args);
  }
};


console.log('—————————————————————— console过滤脚本进行中 ——————————————————————');
