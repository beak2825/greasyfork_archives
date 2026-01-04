// ==UserScript==
// @name         解除B站专栏复制限制（2022）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  B站复制限制解除
// @author       popyoung
// @match        https://www.bilibili.com/read/cv*
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444536/%E8%A7%A3%E9%99%A4B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%882022%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444536/%E8%A7%A3%E9%99%A4B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%882022%EF%BC%89.meta.js
// ==/UserScript==

function trueCopy(e)
{
    e.clipboardData.setData("text",window.getSelection().toString())
    e.stopImmediatePropagation();
}

(function() {
    var a=document.querySelector('div.article-content');
    a.addEventListener('copy',trueCopy);
}

)();