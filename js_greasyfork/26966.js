// ==UserScript==
// @name         Amazonの商品ページのURLから商品名とrefを消す
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       kuma
// @match        https://www.amazon.co.jp/*/dp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26966/Amazon%E3%81%AE%E5%95%86%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AEURL%E3%81%8B%E3%82%89%E5%95%86%E5%93%81%E5%90%8D%E3%81%A8ref%E3%82%92%E6%B6%88%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/26966/Amazon%E3%81%AE%E5%95%86%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AEURL%E3%81%8B%E3%82%89%E5%95%86%E5%93%81%E5%90%8D%E3%81%A8ref%E3%82%92%E6%B6%88%E3%81%99.meta.js
// ==/UserScript==

(function() {
  'use strict';
  history.pushState(null, null, location.href.replace(/co.jp\/(.*)\/dp/, 'co.jp/dp').replace(/ref=.*$/, ''));
})();