// ==UserScript==
// @name         乐读下载免扫码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://commonapiv2.txtbook.com.cn/api/EbookDown/Down/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377481/%E4%B9%90%E8%AF%BB%E4%B8%8B%E8%BD%BD%E5%85%8D%E6%89%AB%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/377481/%E4%B9%90%E8%AF%BB%E4%B8%8B%E8%BD%BD%E5%85%8D%E6%89%AB%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 删除自带的提示
    document.querySelector(".txt-box div button").onclick = "";

    // 点击按钮下载
    document.querySelector(".txt-box div button").addEventListener("click", function(ev){
        location.assign(document.querySelector("#downurl").value);
    });
})();