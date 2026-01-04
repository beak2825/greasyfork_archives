// ==UserScript==
// @name         Login Collback
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Encrypt account and password using RSA for specific URLs and auto fill form on button click
// @author       Your Name
// @match        */dxdsapi/dologin
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/516787/Login%20Collback.user.js
// @updateURL https://update.greasyfork.org/scripts/516787/Login%20Collback.meta.js
// ==/UserScript==


(function () {
  'use strict';
  console.log('Content script loaded')


  GM_addStyle(`
    .entry {
      font-family: Fira Code, Consolas !important;
    }
    pre {
      word-wrap: break-word;
      white-space: normal;
      font-family: Fira Code, Consolas !important;
      font-size: 14px;
      font-weight: 300;
      line-height: 30px;
      color: #000;
      border: 1px solid #000;
      padding: 20px 30px;
    }
  `);


  window.addEventListener('load', () => {
    console.log('init')
    const json = JSON.parse(document.querySelectorAll(' pre')[0].innerText)

    if (json.code === '1') {
      const data = json?.data
      localStorage.setItem('userInfo', JSON.stringify(data))

      console.log('userINfo已保存到localStorage')
    }
  });
})();
