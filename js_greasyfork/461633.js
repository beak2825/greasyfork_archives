// ==UserScript==
// @name         lavida關閉自動更新訂單
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  lavida 關閉自動更新訂單
// @author       You
// @match        https://www.lavida.tw/adm_PPot4F/order/?q1=*&desc=*&action=edit&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lavida.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461633/lavida%E9%97%9C%E9%96%89%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E8%A8%82%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/461633/lavida%E9%97%9C%E9%96%89%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E8%A8%82%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        window.close();

    },600);
    // Your code here...
})();