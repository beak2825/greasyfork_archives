// ==UserScript==
// @name         B站开播设置页不显示封面建议
// @namespace    B站开播设置页不显示封面建议
// @version      0.1
// @description  阻止开播设置页弹出“直播封面标题有待优化，更改后观看人数预计提升”的提示气泡和元素
// @author       Lui5
// @match        https://link.bilibili.com/p/center/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457483/B%E7%AB%99%E5%BC%80%E6%92%AD%E8%AE%BE%E7%BD%AE%E9%A1%B5%E4%B8%8D%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2%E5%BB%BA%E8%AE%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/457483/B%E7%AB%99%E5%BC%80%E6%92%AD%E8%AE%BE%E7%BD%AE%E9%A1%B5%E4%B8%8D%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2%E5%BB%BA%E8%AE%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //防止前端判断并显示toast
    localStorage.setItem('showAdvice', 'true');
    //隐藏底下三张示例的内容
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
         .cover-advice {
             display: none !important;
         }
    `;
    document.querySelector('head').appendChild(style);
})();