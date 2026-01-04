// ==UserScript==
// @name         有道单词自动发音
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  把手松开！安心查你的单词去！
// @author       rainbowpi
// @match        http://dict.youdao.com/w/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426745/%E6%9C%89%E9%81%93%E5%8D%95%E8%AF%8D%E8%87%AA%E5%8A%A8%E5%8F%91%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/426745/%E6%9C%89%E9%81%93%E5%8D%95%E8%AF%8D%E8%87%AA%E5%8A%A8%E5%8F%91%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let voice = document.getElementsByClassName("dictvoice")[0];
    if (voice == null) {
       alert("该网页的发音图片的class名已经发生了改变，请检查网页元素并且修正！");
    }
    console.log("发音脚本开始工作...");
    voice.click();

    setTimeout(() => { voice.click() }, 3000);

})();