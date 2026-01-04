// ==UserScript==
// @name         自動點擊4Gamers已滿18歲按鈕
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自動點擊按鈕，哪次沒滿18歲
// @author       鮪魚大師
// @match        https://www.4gamers.com.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476937/%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A4Gamers%E5%B7%B2%E6%BB%BF18%E6%AD%B2%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/476937/%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A4Gamers%E5%B7%B2%E6%BB%BF18%E6%AD%B2%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

!function(){"use strict";let e=0;async function t(e){return new Promise((t=>setTimeout(t,e)))}new MutationObserver((async function(n,o){for(const c of n){const n=document.querySelector(".text-white.bg-black.border-black");if(n&&(n.click(),o.disconnect()),e++,e>=3)return void(e=0);await t(100)}})).observe(document.documentElement,{childList:!0,subtree:!0})}();

