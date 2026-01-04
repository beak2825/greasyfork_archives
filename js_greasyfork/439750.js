// ==UserScript==
// @name         去除一兜糖限制
// @description  允许复制文章
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       li02
// @include      *://*.yidoutang.com/*
// @icon         https://www.google.com/s2/favicons?domain=yidoutang.com
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439750/%E5%8E%BB%E9%99%A4%E4%B8%80%E5%85%9C%E7%B3%96%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/439750/%E5%8E%BB%E9%99%A4%E4%B8%80%E5%85%9C%E7%B3%96%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    let a = document.getElementById("guide-detail");
    let b = document.createElement("div");
    b.className="guide-detail";
    b.innerHTML=a.innerHTML;
    let parent = a.parentElement;
    parent.removeChild(a);
    let c = document.querySelector(".guide-gift")
    parent.insertBefore(b, c);
    //c.appendChild(b)
})();