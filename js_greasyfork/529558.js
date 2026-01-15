// ==UserScript==
// @name         芋道文档破解
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  dddd
// @author       C-racker
// @match        https://doc.iocoder.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iocoder.cn
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/529558/%E8%8A%8B%E9%81%93%E6%96%87%E6%A1%A3%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/529558/%E8%8A%8B%E9%81%93%E6%96%87%E6%A1%A3%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

!function(){"use strict";document.cookie="88974ed8-6aff-48ab-a7d1-4af5ffea88bb=vip_bypass; path=/; max-age=31536000";const t=()=>{if("undefined"!=typeof $&&$.get){const t=$.get;return $.get=function(e,n,a){if(!e||!e.includes("/zsxq/auth"))return t.apply(this,arguments);"function"==typeof a?setTimeout(()=>a(!0),10):"function"==typeof n&&setTimeout(()=>n(!0),10)},!0}return!1};if(!t()){const e=setInterval(()=>{t()&&clearInterval(e)},50);setTimeout(()=>clearInterval(e),1e4)}}();