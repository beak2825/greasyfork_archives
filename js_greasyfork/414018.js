// ==UserScript==
// @name         简书隐藏标题
// @namespace    https://www.jianshu.com
// @version      0.1
// @description  v0.1:简书隐藏标题
// @author       shadowyy
// @match        https://*.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414018/%E7%AE%80%E4%B9%A6%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/414018/%E7%AE%80%E4%B9%A6%E9%9A%90%E8%97%8F%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==
(function() {
  'use strict';
  console.log('hide jianshu title')
  // home page: hide logo and title
  var func = function() {
    // hide title
    document.getElementsByClassName('_2zeTMs')[0].innerHTML='';
  }

  func();

  // home page: hide when scroll
  window.onscroll = function () {
    func();
  }
})();