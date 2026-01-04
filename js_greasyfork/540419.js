// ==UserScript==
// @name         나무위키 루비 문자 아래만 선택
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  나무위키에서 루비 문자를 복사할 때 위랑 섞여서 귀찮은 거 수정
// @author       noipung
// @match        https://namu.wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namu.wiki
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540419/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EB%A3%A8%EB%B9%84%20%EB%AC%B8%EC%9E%90%20%EC%95%84%EB%9E%98%EB%A7%8C%20%EC%84%A0%ED%83%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/540419/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EB%A3%A8%EB%B9%84%20%EB%AC%B8%EC%9E%90%20%EC%95%84%EB%9E%98%EB%A7%8C%20%EC%84%A0%ED%83%9D.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`rt { user-select: none; }`);
})();
