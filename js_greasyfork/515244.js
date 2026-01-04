// ==UserScript==
// @name         치지직 광고 팝업 삭제
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  치지직 광고 팝업 삭제 합니다
// @match        *://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515244/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%ED%8C%9D%EC%97%85%20%EC%82%AD%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/515244/%EC%B9%98%EC%A7%80%EC%A7%81%20%EA%B4%91%EA%B3%A0%20%ED%8C%9D%EC%97%85%20%EC%82%AD%EC%A0%9C.meta.js
// ==/UserScript==

(function () {
  const interval = setInterval(() => {
    const adbb = document.querySelector(`[class^="ad_block_title"]`);
    if (adbb) {
      document.querySelector(`[class^=popup_cell] > button`)?.click();
      console.log("Remove adblock")
    }
  }, 100);
})();
