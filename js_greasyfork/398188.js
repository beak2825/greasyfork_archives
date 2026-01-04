// ==UserScript==
// @name         知乎跳转
// @namespace    知乎跳转
// @version      0.1
// @description  知乎自动跳转
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398188/%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/398188/%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    if (document.URL.indexOf("answer/")>0){
    window.location.href=document.URL.replace(/\/answer.*/,"");
    }
})();