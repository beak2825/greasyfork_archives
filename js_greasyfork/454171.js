// ==UserScript==
// @name         Ruby REx 
// @name:ja      Ruby REx ページ移動の矢印キーボードショートカット
// @name:en      Ruby REx key shortcut
// @namespace    https://greasyfork.org/ja/users/570127
// @version      1.0.1
// @description  You can turn page by left and right key shortcut. Ruby RExサイト上で、左右の矢印キーで、ページを移動できます。
// @description:ja RExで、右キーで｢解答する｣、左キーで｢前の問題へ｣となります。
// @description:en You can turn page by left and right key shortcut.
// @author       universato
// @license      MIT
// @match        https://rex.libertyfish.co.jp/exam_histories/*
// @supportURL   https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/454171/Ruby%20REx.user.js
// @updateURL https://update.greasyfork.org/scripts/454171/Ruby%20REx.meta.js
// ==/UserScript==

(function() {
  document.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft'){
          document.querySelector('a.pull-left').click(); // 前の問題へ
      }else if(event.key === 'ArrowRight'){
          document.querySelector('input.pull-right').click(); // 解答する
      }
  });
})();
