// ==UserScript==
// @name         console日志过滤脚本
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  开发环境脚本console过滤!
// @author       石小石Orz
// @run-at       document-start
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533962/console%E6%97%A5%E5%BF%97%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/533962/console%E6%97%A5%E5%BF%97%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalConsoleLog = unsafeWindow.console.log;

    unsafeWindow.console.log = function (...args) {
      if (
        args.length === 2 &&
        typeof args[0] === "string" &&
        args[0].includes(":")
      ) {
        originalConsoleLog(...args);
      }
    };
  
    console.log("---------console过滤脚本运行中----------");
  
})();