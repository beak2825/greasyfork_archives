// ==UserScript==
// @name         所有超链接跳转新页面打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将所有的连接变为点击跳转新页面打开
// @author       BLT
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386071/%E6%89%80%E6%9C%89%E8%B6%85%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/386071/%E6%89%80%E6%9C%89%E8%B6%85%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var doc = Array.prototype.slice.call(document.getElementsByTagName('a'));
    doc.map(function(item,index){
        item.setAttribute("target", "_blank");
    })
})();