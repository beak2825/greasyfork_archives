// ==UserScript==
// @name         超链接新窗口打开
// @namespace    御坂美琴
// @version      0.1
// @description  点击超链接新窗口打开
// @author       Misaka
// @match       
// @grant        none
// @include     
// @downloadURL https://update.greasyfork.org/scripts/412666/%E8%B6%85%E9%93%BE%E6%8E%A5%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/412666/%E8%B6%85%E9%93%BE%E6%8E%A5%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.getElementsByTagName('a');
    for (var i=0;i<elements.length;i++){
        elements[i].target='_blank';
    }
})();