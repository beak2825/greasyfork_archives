// ==UserScript==
// @name         四川学法练习题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开练习题页面使用
// @author       panda_v
// @match        http*://xxpt.scxfks.com/study/exercise/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521104/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E7%BB%83%E4%B9%A0%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/521104/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E7%BB%83%E4%B9%A0%E9%A2%98.meta.js
// ==/UserScript==

(function(){'use strict';var c=document.querySelectorAll('.question-title');for(var a=0;a<c.length;a++){var d=c[a];var g=d.querySelector('.answer').getAttribute('val');var e=d.parentNode.querySelectorAll('.question-option');for(var b=0;b<e.length;b++){var h=e[b];var f=h.querySelector('input');if(g.includes(f.value)){f.click()}}}})();
