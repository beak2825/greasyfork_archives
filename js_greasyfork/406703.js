// ==UserScript==
// @name         google搜索去除CSDN结果
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除CSDN结果
// @author       melongz
// @grant        none
// @include      *www.google.com/search*
// @downloadURL https://update.greasyfork.org/scripts/406703/google%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4CSDN%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/406703/google%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4CSDN%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
  document.querySelectorAll('#search .g').forEach(item => {
    const isCSDN = item.querySelector('.iUh30.bc.tjvcx').innerHTML.indexOf('blog.csdn.net') !== -1;
    if (isCSDN) {
      item.remove();
    }
  })
})();
