// ==UserScript==
// @name         乐清人才网增强脚本
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  功能1：只在当前标签打开新页面
// @author       kizj
// @match        *://www.yqrc.com/*
// @grant        none
// @icon         https://www.yqrc.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/438464/%E4%B9%90%E6%B8%85%E4%BA%BA%E6%89%8D%E7%BD%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438464/%E4%B9%90%E6%B8%85%E4%BA%BA%E6%89%8D%E7%BD%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...

  // 页面加载完成后
  $(document).ready(function(){

    // 功能1：只在当前标签打开新页面
    $('a').each(function(){
      $(this).removeAttr('target');
    })

  })


})();