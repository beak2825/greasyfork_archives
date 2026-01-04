// ==UserScript==
// @name         大数金融服务治理平台自动刷新脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动跑数页面自动刷新按钮
// @author       You
// @match        https://mloan.dashuf.com/srgpweb//
// @match      https://mloan.dashuf.com/*
// @icon         https://www.google.com/s2/favicons?domain=dashuf.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446162/%E5%A4%A7%E6%95%B0%E9%87%91%E8%9E%8D%E6%9C%8D%E5%8A%A1%E6%B2%BB%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446162/%E5%A4%A7%E6%95%B0%E9%87%91%E8%9E%8D%E6%9C%8D%E5%8A%A1%E6%B2%BB%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var url = location.href;
  if (!url.includes('devops-casescenarioresultdetail')) return;
  var timer = null;
  setTimeout(function() {
    var parentDom = document.querySelector('.el-col.el-col-3');
    var btnDom = document.querySelector('.el-button.el-button--primary.el-button--mini');
    var startDom = document.createElement('button');
    startDom.setAttribute('class', 'el-button el-button--default el-button--mini');
    startDom.innerText = '开启自动刷新';
    parentDom.appendChild(startDom);
    startDom.onclick = function() {
      if (startDom.innerText === '开启自动刷新') {
        timer = autoRefersh();
        return;
      }
      if (startDom.innerText === '关闭自动刷新') {
        closeRefresh(timer);
      }
    };
    function autoRefersh(dom) {
      var timer = null;
      if (btnDom) {
        startDom.innerText = '关闭自动刷新';
        timer = setInterval(function() {
          btnDom.click();
        }, 5000);
      }
      return timer;
    }
    function closeRefresh(timer) {
      if (timer) {
        clearInterval(timer);
        startDom.innerText = '开启自动刷新';
      }
    }
  }, 2000);
  // Your code here...
})();
