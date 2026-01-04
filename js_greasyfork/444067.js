// ==UserScript==
// @name         labuladong 算法小抄优化
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  无需其他操作，即可阅读
// @author       Hunter Hwang
// @license MIT
// @match        https://labuladong.github.io/algo/*
// @match        https://labuladong.gitee.io/algo/*
// @icon         https://labuladong.github.io/algo/images/avatar.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444067/labuladong%20%E7%AE%97%E6%B3%95%E5%B0%8F%E6%8A%84%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444067/labuladong%20%E7%AE%97%E6%B3%95%E5%B0%8F%E6%8A%84%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.getElementById('body-inner').style.maxHeight = 'none';
  document.getElementById('read_all_wrapper').style.display = 'none';
})();
