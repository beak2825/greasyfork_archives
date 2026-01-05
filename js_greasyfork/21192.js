// ==UserScript==
// @name         知乎外链免确认
// @version      0.13
// @description  RT
// @author       Erimus
// @match        *link.zhihu.com/*
// @grant        none
// @namespace http://erimus.cc/
// @downloadURL https://update.greasyfork.org/scripts/21192/%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E5%85%8D%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/21192/%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E5%85%8D%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var pAll = document.getElementsByTagName("p");
    for(var i=0;i<pAll.length;i++){
        if(pAll[i].innerHTML.indexOf("http")!=-1){
            window.location=pAll[i].innerHTML;
        }
    }
})();