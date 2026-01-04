// ==UserScript==
// @name         福建技术师范学院安全实验室脚本
// @description  自动跳过
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       权辉
// @match        http://syaqks.fpnu.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453962/%E7%A6%8F%E5%BB%BA%E6%8A%80%E6%9C%AF%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E5%AE%89%E5%85%A8%E5%AE%9E%E9%AA%8C%E5%AE%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453962/%E7%A6%8F%E5%BB%BA%E6%8A%80%E6%9C%AF%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E5%AE%89%E5%85%A8%E5%AE%9E%E9%AA%8C%E5%AE%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
  console.log('running....') //打印日志
  function a(){
    console.log('confirm')   //输出控制台
    return true;    
  }

  window.confirm = a;   // 关闭弹窗


})();