// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         인스타그램 이미지 우클릭 제한 해제
// @description  인스타그램에서 이미지의 우클릭 기능이 활성화됩니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.14
// @author       Won Choi
// @connect      instagram.com
// @grant        GM_addStyle
// @match        *://instagram.com
// @match        *://instagram.com/*
// @match        *://www.instagram.com
// @match        *://www.instagram.com/*
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @downloadURL https://update.greasyfork.org/scripts/428654/%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%9A%B0%ED%81%B4%EB%A6%AD%20%EC%A0%9C%ED%95%9C%20%ED%95%B4%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/428654/%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%9A%B0%ED%81%B4%EB%A6%AD%20%EC%A0%9C%ED%95%9C%20%ED%95%B4%EC%A0%9C.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  GM_addStyle(`
    ._9AhH0 { display: none; }
    .PyenC, .fXIG0 { margin: auto; left: 0; right: 0; top: 0; bottom: 0; width: 135px; height: 135px; }
 `);
});