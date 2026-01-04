// ==UserScript==
// @name         javdb本地视频 python脚本搜索
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  有时候有的片子已看过，但不记得是否看过。本脚本配合Everything 和 python3 搜索本地文件和显示搜索结果
// @author       zero2200 
// @match        https://javdb*.com/v/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/471496/javdb%E6%9C%AC%E5%9C%B0%E8%A7%86%E9%A2%91%20python%E8%84%9A%E6%9C%AC%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/471496/javdb%E6%9C%AC%E5%9C%B0%E8%A7%86%E9%A2%91%20python%E8%84%9A%E6%9C%AC%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var number = document.querySelector("body > section > div > div.video-detail > h2 > strong:nth-child(1)").innerHTML;
    console.log(number);
    var cmd = "openExe:"+number;
    console.log(cmd);
    window.open(cmd);
    // Your code here...
})();