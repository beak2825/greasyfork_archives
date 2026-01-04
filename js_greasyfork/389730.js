
// ==UserScript==
// @name         小可去转无限搜
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       suertang
// @match        *://www.xiaokesoso.com/*
// @match        *://www.quzhuanpan.com/download/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389730/%E5%B0%8F%E5%8F%AF%E5%8E%BB%E8%BD%AC%E6%97%A0%E9%99%90%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/389730/%E5%B0%8F%E5%8F%AF%E5%8E%BB%E8%BD%AC%E6%97%A0%E9%99%90%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // code here
    const ele = document.querySelector('button[data-downloadurl]');
    if(ele){
        const jumpUrl = "http://norefer.mimixiaoke.com/api/jump?target=" + ele.dataset.downloadurl;
        window.location.href = jumpUrl;
    }
})();
