// ==UserScript==
// @name        复制 CSDN 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉CSDN代码复制限制
// @author       StarsOne
// @match       *://*.csdn.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442221/%E5%A4%8D%E5%88%B6%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/442221/%E5%A4%8D%E5%88%B6%20CSDN.meta.js
// ==/UserScript==

(function() {
    var elements = document.getElementsByTagName("code");
    for (var i = 0; i < elements.length; i++) {
        let item = elements[i]
        item.style.userSelect = "text"
    }
})();