// ==UserScript==
// @name         【个人】隐藏飞书警告栏
// @namespace    eezTool
// @description  隐藏飞书警告栏
// @version      0.02
// @author       啊啊啊
// @match        *://*.feishu.cn/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440907/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E9%9A%90%E8%97%8F%E9%A3%9E%E4%B9%A6%E8%AD%A6%E5%91%8A%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/440907/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E9%9A%90%E8%97%8F%E9%A3%9E%E4%B9%A6%E8%AD%A6%E5%91%8A%E6%A0%8F.meta.js
// ==/UserScript==
(function() {
  'use strict';

  var pbStyle = document.createElement('style');

  pbStyle.textContent = `
  div.not-compatible__announce {
    display: none !important;
  }`

  document.head.appendChild(pbStyle);


})();