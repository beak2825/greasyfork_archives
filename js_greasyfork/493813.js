// ==UserScript==
// @name         所有锚点链接改为新页面打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  open in new tab!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chrome.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493813/%E6%89%80%E6%9C%89%E9%94%9A%E7%82%B9%E9%93%BE%E6%8E%A5%E6%94%B9%E4%B8%BA%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/493813/%E6%89%80%E6%9C%89%E9%94%9A%E7%82%B9%E9%93%BE%E6%8E%A5%E6%94%B9%E4%B8%BA%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load',()=>{
        document.querySelectorAll('a[href]').forEach((el)=>{el.target = '_blank'})
    })
})();