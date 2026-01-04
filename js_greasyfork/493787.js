// ==UserScript==
// @name         さくたいF4ToStart
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  f4でスタートできるようにする
// @author       You
// @match        http://typing.tsurizamurai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493787/%E3%81%95%E3%81%8F%E3%81%9F%E3%81%84F4ToStart.user.js
// @updateURL https://update.greasyfork.org/scripts/493787/%E3%81%95%E3%81%8F%E3%81%9F%E3%81%84F4ToStart.meta.js
// ==/UserScript==

// F4キーのキーコード
const F4_KEY_CODE = 115;

// キーイベントのリスナーを追加
document.addEventListener('keydown', function(event) {
  // F4キーが押された場合
  if (event.keyCode === F4_KEY_CODE) {
    // ページ上でスクリプトを実行する
    const scriptCode = `
      startFunc();
    `;
    const script = document.createElement('script');
    script.textContent = scriptCode;
    document.body.appendChild(script);
  }
});