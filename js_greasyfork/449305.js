// ==UserScript==
// @name         金山文档解除复制限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.kdocs.cn/l/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kdocs.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449305/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/449305/%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){
	window.APP.canCopy=function a(){ return true;}
}
    // Your code here...
})();