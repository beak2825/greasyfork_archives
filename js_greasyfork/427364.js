// ==UserScript==
// @name         有道云笔记隐藏蓝色标题栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏蓝色 header
// @author       You
// @match        https://note.youdao.com/web/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427364/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E9%9A%90%E8%97%8F%E8%93%9D%E8%89%B2%E6%A0%87%E9%A2%98%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/427364/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E9%9A%90%E8%97%8F%E8%93%9D%E8%89%B2%E6%A0%87%E9%A2%98%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
    window.setTimeout(e => {
        let target = document.querySelector('.main-container')
        let top = document.querySelector('.top-banner')
        top.style.zIndex = 0
        target.style.top = 0
        target.style.translation = 'all 0.5s'
    }, 100)
})();