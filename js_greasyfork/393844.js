// ==UserScript==
// @name         银行从业继续教育挂机
// @namespace    David Chan
// @version      1.0
// @description  银从再教育挂机不要停
// @author       David Chan
// @match        *://ucollege.china-cbi.net/index.php?a=studyDetail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393844/%E9%93%B6%E8%A1%8C%E4%BB%8E%E4%B8%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/393844/%E9%93%B6%E8%A1%8C%E4%BB%8E%E4%B8%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onfocus = function(){console.log('当前')};
    window.onblur = function(){console.log('离开')};
    window.custom_seek = function(){
      window.tiper("随便拖,可劲地造!");
};
    // Your code here...
})();