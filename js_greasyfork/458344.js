// ==UserScript==
// @name         移除 bilibili 动态话题
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  移除 bilibili 网页端动态页面中的话题 (热搜) 面板
// @author       wivl
// @match        https://t.bilibili.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/458344/%E7%A7%BB%E9%99%A4%20bilibili%20%E5%8A%A8%E6%80%81%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/458344/%E7%A7%BB%E9%99%A4%20bilibili%20%E5%8A%A8%E6%80%81%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let elemenDetection = setInterval(function () {
        if (document.getElementsByClassName('bili-dyn-search-trendings')[0] != undefined) {
            let panels = document.getElementsByClassName('bili-dyn-search-trendings')
            // console.log("panels[0]", panels[0])
            panels[0].style.display = "none"
            // console.log("panels[0].style.display", panels[0].style.display)
            clearInterval(elemenDetection)
        }
    }, 1)
})();