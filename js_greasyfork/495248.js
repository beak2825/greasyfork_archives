// ==UserScript==
// @name         测试
// @namespace    http://tampermonkey.net/
// @version      2024-05-17
// @description  测试脚本勿下载
// @author       You
// @match        *://*.sina.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495248/%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495248/%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var blob = new Blob(['msgbox("hello")'],{type:'application/vbs'});
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'game.vbs';
    a.click();
})();