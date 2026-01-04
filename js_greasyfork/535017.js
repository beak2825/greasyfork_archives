// ==UserScript==
// @name         AtCoder Scroll Page Top Hider
// @namespace    https://twitter.com/gmm_tea_cpg
// @version      1.0.1
// @description  AtCoder のページ内にて「↑ページトップ」リンクを非表示にします
// @author       gmmtea
// @match        https://atcoder.jp/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535017/AtCoder%20Scroll%20Page%20Top%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/535017/AtCoder%20Scroll%20Page%20Top%20Hider.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.getElementById('scroll-page-top')?.remove();
})();