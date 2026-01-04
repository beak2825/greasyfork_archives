// ==UserScript==
// @name         关闭微软小冰
// @namespace    http://bulan-zade.top/
// @version      0.0.5
// @description  关掉智障小冰，去除广告
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @author       bulan_zade
// @match        https://*.bing.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465498/%E5%85%B3%E9%97%AD%E5%BE%AE%E8%BD%AF%E5%B0%8F%E5%86%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/465498/%E5%85%B3%E9%97%AD%E5%BE%AE%E8%BD%AF%E5%B0%8F%E5%86%B0.meta.js
// ==/UserScript==
!function(){"use strict";window.addEventListener("load",(()=>{!function(){const e=document.getElementById("ev_talkbox_wrapper");e&&e.remove()}();const e=function(){const e=document.getElementsByClassName("sb_add");for(const t of e)t.remove();const t=document.querySelectorAll("div.b_caption p");let n=0;for(const e of t)e.className.includes("b_algoSlug")||(e.parentElement.parentElement.remove(),n++);return n}();e&&console.log(`去除 ${e} 条广告`)}))}();
