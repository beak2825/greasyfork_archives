// ==UserScript==
// @name         洛谷提交记录难度显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在提交记录页面显示题目难度
// @author       xyf007
// @match        https://www.luogu.com.cn/record/list*
// @icon         https://www.luogu.com.cn/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448778/%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E9%9A%BE%E5%BA%A6%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448778/%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E9%9A%BE%E5%BA%A6%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const COLOR = ['rgb(191, 191, 191)', 'rgb(254, 76, 97)',
    'rgb(243, 156, 17)', 'rgb(255, 193, 22)', 'rgb(82, 196, 26)',
    'rgb(52, 152, 219)', 'rgb(157, 61, 207)', 'rgb(14, 29, 105)',
  ];
  /**
   * change color
   */
  function f() {
    setTimeout(() => {
      const RES = window._feInstance.currentData.records.result;
      // console.log(RES);
      const PID = document.querySelectorAll('.pid');
      for (let i = 0; i < PID.length; i++) {
        PID[i].style.color = COLOR[RES[i].problem.difficulty];
        PID[i].style.fontWeight = 'bold';
      }
    }, 500);
  }
  f();
  window._feInstance.$watch('currentData.records.result', (value) => {
    f();
  });
})();
