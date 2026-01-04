// ==UserScript==
// @name         yapi 左侧优化
// @namespace    http://mrlb.cc/
// @version      0.2
// @description   yapi 左侧菜单栏 优化
// @author       mrlb.cc

// @match        *://*.juhesaas.com/*
// @icon         https://www.google.com/s2/favicons?domain=juhesaas.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430023/yapi%20%E5%B7%A6%E4%BE%A7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430023/yapi%20%E5%B7%A6%E4%BE%A7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
      setTimeout(function(){
        var head = document.getElementsByClassName("tree-wrappper")[0];
        head.style.maxHeight = null;
    },1000)
    setTimeout(function(){
        var head = document.getElementsByClassName("tree-wrappper")[0];
        head.style.maxHeight = null;
    },2000)
    setTimeout(function(){
        var head = document.getElementsByClassName("tree-wrappper")[0];
        head.style.maxHeight = null;
    },3000)
})();