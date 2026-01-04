// ==UserScript==
// @name         谷歌翻译跳过代码片段
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  谷歌翻译 【翻译此页功能】跳过代码片段；GoogleTranslateSkipCodeSnippet
// @author       n3taway
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390439/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E8%B7%B3%E8%BF%87%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/390439/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E8%B7%B3%E8%BF%87%E4%BB%A3%E7%A0%81%E7%89%87%E6%AE%B5.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
    'use strict';
    const nodeNames = [
        'pre',//常规代码片段 例如github
        '.gist',
        '.type-powershell',
        '.type-javascript',
        '.type-css',
        '.js-file-line',
    ];
    nodeNames.forEach((name)=>{
       [...document.querySelectorAll(name)].forEach( node => {
           node.classList.add('notranslate')
       })
    });
})();