// ==UserScript==
// @name         谷歌翻译 粘贴 去除换行
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   谷歌翻译 粘贴 去除 换行 Google translate paste remove delete line break new line
// @author        批小将
// @match         https://translate.google.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/391309/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%20%E7%B2%98%E8%B4%B4%20%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/391309/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%20%E7%B2%98%E8%B4%B4%20%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let txarea = document.getElementById('source');
    txarea.addEventListener('input', function(){
    //得到的是已经改变过后的内容，跟'paste' event不一样
    let text = txarea.value;
    let replace_text = text.replace(/\n/g, ' ');
    txarea.value = replace_text;
    });
})();