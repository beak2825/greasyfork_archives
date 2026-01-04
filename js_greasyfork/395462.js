// ==UserScript==
// @name         代码块强制等宽字符
// @name:en      Website code block enforces monospace characters
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  网站代码块强制等宽字符
// @description:en Website code block enforces monospace characters for all website
// @include     *://*/*
// @author       wusheng
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395462/%E4%BB%A3%E7%A0%81%E5%9D%97%E5%BC%BA%E5%88%B6%E7%AD%89%E5%AE%BD%E5%AD%97%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/395462/%E4%BB%A3%E7%A0%81%E5%9D%97%E5%BC%BA%E5%88%B6%E7%AD%89%E5%AE%BD%E5%AD%97%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
  'use strict';
    var myNodeList = document.querySelectorAll('code');
    myNodeList.forEach(element => {
        element.style.cssText = 'font-family:"Ubuntu Mono","Consolas","Source Code Pro","monospace"!important;'
      });
})();