// ==UserScript==
// @name         CSDN 复制代码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy the code as you like
// @author       haoxingxiao
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blog.csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457719/CSDN%20%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/457719/CSDN%20%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ele = document.getElementsByTagName("style")[0]
    if(ele.innerText.includes("#content_views pre code")) {
        ele.parentNode.removeChild(ele)
        console.warn("已经为你屏蔽掉讨厌的登录复制了！")
    }
})();