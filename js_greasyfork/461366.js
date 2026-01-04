// ==UserScript==
// @name         蓝奏云登录界面修改
// @namespace    https://viayoo.com/
// @version      1.0
// @description  适用于移动端
// @author       ChatGPT
// @run-at       document-start
// @match        https://up.woozooo.com/account*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461366/%E8%93%9D%E5%A5%8F%E4%BA%91%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/461366/%E8%93%9D%E5%A5%8F%E4%BA%91%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Remove div elements
    ['div.ves', 'div.pc', 'div.d1'].forEach(function(selector) {
      var element = document.querySelector(selector);
      if(element) {
        element.parentNode.removeChild(element);
      }
    });

    // Change height of div element
    var p9 = document.querySelector('div.p9');
    if(p9) {
      p9.style.height = '100vh';
    }
  });
})();
