// ==UserScript==
// @name         谷歌搜索链接改为新窗口打开
// @namespace    none
// @version      1
// @description  Google search link changed to new window open  //谷歌搜索链接改为新窗口打开
// @author       XBX
// @include      https://www.google.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372546/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5%E6%94%B9%E4%B8%BA%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/372546/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5%E6%94%B9%E4%B8%BA%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementById('res').getElementsByTagName('a');
    var len = links.length;
    for(var i = 0; i < len; i++){
        links[i].setAttribute('target','_blank');
    }
    // Your code here...
})();