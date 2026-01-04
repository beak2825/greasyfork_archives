// ==UserScript==
// @name        Amazon.co.jpの検索バーを選択
// @description Amazon.co.jpの検索バーを選択する。
// @match       *://amazon.co.jp/*
// @match       *://www.amazon.co.jp/*
// @author      toshi (https://github.com/k08045kk)
// @license     MIT License
// @see         https://opensource.org/licenses/MIT
// @version     1.3
// @see         1.20190831 - 初版
// @grant       none
// @namespace https://www.bugbugnow.net/
// @downloadURL https://update.greasyfork.org/scripts/389609/Amazoncojp%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%90%E3%83%BC%E3%82%92%E9%81%B8%E6%8A%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/389609/Amazoncojp%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%83%90%E3%83%BC%E3%82%92%E9%81%B8%E6%8A%9E.meta.js
// ==/UserScript==
 
(function() {
  document.getElementById('twotabsearchtextbox').select();
})();