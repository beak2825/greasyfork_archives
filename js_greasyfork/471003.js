// ==UserScript==
// @name         禁止 learnku 复制内容时添加后缀
// @namespace    dongdong
// @version      0.1
// @description  在 learnku 复制内容时，自动移除剪切板后缀
// @author       dongdong
// @match        https://learnku.com/*
// @icon         https://cdn.learnku.com/uploads/images/201901/27/1/jdor3lMsMw.png!/both/44x44
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471003/%E7%A6%81%E6%AD%A2%20learnku%20%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E6%97%B6%E6%B7%BB%E5%8A%A0%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/471003/%E7%A6%81%E6%AD%A2%20learnku%20%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%E6%97%B6%E6%B7%BB%E5%8A%A0%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("copy", (event) => {
        navigator.clipboard.readText().then(function(clipText){
            const regex = /—+([\s\S]*?)(转载请保留原文链接|&#25991;&#38142;&#25509;)/;
            const newtxt = clipText.replace(regex, '');

            navigator.clipboard.writeText(newtxt)
        });
    });
})();