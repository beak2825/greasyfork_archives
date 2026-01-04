// ==UserScript==
// @name         清除bDiv样式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除所有class为bDiv的div的style属性
// @author       Caesarloo
// @license    	 MIT
// @match        http://eitp.cnsuning.com/itp-web-in/completeDispatch.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512335/%E6%B8%85%E9%99%A4bDiv%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/512335/%E6%B8%85%E9%99%A4bDiv%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取所有class为bDiv的div元素
    var bDivs = document.getElementsByClassName('bDiv');
    // 遍历这些元素并清除它们的style属性
    for (var i = 0; i < bDivs.length; i++) {
        bDivs[i].removeAttribute('style');
    }
})();