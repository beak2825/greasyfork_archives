// ==UserScript==
// @name         timemory-limit-emphasizer
// @namespace    https://github.com/hotarupoyo
// @version      0.0.0
// @author       hotarupoyo
// @description  AtCoderで実行時間制限が2 secでないとき、メモリ制限が1024 MBでないときに強調する
// @license      MIT
// @match        https://atcoder.jp/contests/*/tasks/*
// @downloadURL https://update.greasyfork.org/scripts/480675/timemory-limit-emphasizer.user.js
// @updateURL https://update.greasyfork.org/scripts/480675/timemory-limit-emphasizer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (() => {
    const pTags = document.getElementsByTagName("p");
    let limitP = void 0;
    for (let i = 0; i < pTags.length; i++) {
      const pTag = pTags[i];
      if (pTag.innerText.includes("実行時間制限: ") || pTag.innerText.includes("Time Limit: ")) {
        limitP = pTag;
        break;
      }
    }
    if (limitP == null) {
      return;
    }
    const timeLimit = limitP.innerText.match(/(実行時間制限|Time Limit): \d+(\.\d+)? sec/);
    if (timeLimit != null) {
      const s = timeLimit[0];
      if (!s.endsWith(" 2 sec")) {
        const replaced = s.replace(/\d+(\.\d+)?/, "<span style='color: red; font-size: 28px; '>$&</span>");
        limitP.innerHTML = limitP.innerHTML.replace(/(実行時間制限|Time Limit): \d+(\.\d+)? sec/, replaced);
      }
    }
    const memoryLimit = limitP.innerText.match(/(メモリ制限|Memory Limit): \d+(\.\d+)? MB/);
    if (memoryLimit != null) {
      const s = memoryLimit[0];
      if (!s.endsWith(" 1024 MB")) {
        const replaced = s.replace(/\d+(\.\d+)?/, "<span style='color: red; font-size: 28px; '>$&</span>");
        limitP.innerHTML = limitP.innerHTML.replace(/(メモリ制限|Memory Limit): \d+(\.\d+)? MB/, replaced);
      }
    }
  })();

})();