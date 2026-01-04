// ==UserScript==
// @name         修改Google搜索结果新页面默认打开方式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过修改搜索结果的a标签属性实现效果
// @author       Static Jelly
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392809/%E4%BF%AE%E6%94%B9Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E9%A1%B5%E9%9D%A2%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/392809/%E4%BF%AE%E6%94%B9Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E9%A1%B5%E9%9D%A2%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x = document.getElementsByClassName("r");
    var i,j;
    for(i = 0; i < x.length; i++){
        var b = x[i].children[0];
        b.setAttribute("target","_blank");
    }

})();