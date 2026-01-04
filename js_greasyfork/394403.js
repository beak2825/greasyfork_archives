// ==UserScript==
// @name         360问答侧边栏清除
// @namespace    http://23.244.64.104/
// @version      0.1
// @description  简单的360问答侧边栏清除工具!
// @author       语谦
// @match        https://wenda.so.com/q/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394403/360%E9%97%AE%E7%AD%94%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/394403/360%E9%97%AE%E7%AD%94%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var side = document.getElementsByClassName('side-flow')[0];
    side.parentNode.removeChild(side);
    document.getElementById('js-detail').style.width = "1200px";

    //var link = document.createElement("style");
    //var css = document.createTextNode(".grid .article{float:right;margin-top:170px;min-height:490px;}");
    //link.appendChild(css);
    //document.getElementsByTagName("head")[0].appendChild(link);
})();