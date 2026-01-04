// ==UserScript==
// @name         AtCoderUnratedButtonDisabler
// @namespace    https://github.com/tagokoro
// @version      1.0
// @description  Disables the "Unrated Entry" button on AtCoder contest pages.
// @match        https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537742/AtCoderUnratedButtonDisabler.user.js
// @updateURL https://update.greasyfork.org/scripts/537742/AtCoderUnratedButtonDisabler.meta.js
// ==/UserScript==

(function () {
  'use strict';

   const buttons = document.querySelectorAll('button');
   buttons.forEach(btn => {
     if (btn.textContent === 'Unrated参加登録') {
       btn.disabled = true;
       btn.textContent = '現在ご利用いただけません';
     }
   });
})();
