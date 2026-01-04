"use strict";function t(t,e){const n="style",i=[],o=Object.entries(e);for(const[t,e]of o)i.push(`${t}:${e};`);let a=t.getAttribute(n);a+=i.join(""),t.setAttribute(n,a)}const e="展开",n=()=>document.querySelector(".main3 .left");function i(){const i=Array.from(n().querySelectorAll(".contyishang a")).filter((t=>t.innerText.includes(e)));for(const e of i)t(e,{width:"100%"})}function o(){const t=[];let e=()=>{};t.push("#threeWeixin2{z-index:-1000;opacity:0;}"),["/shiwenv_","/authorv_","/book_"].some((t=>location.pathname.includes(t)))&&(t.push(".main3 .left{width:100%;clear:left;float:left;}.main3 .right,.main3 .right div{width:0!important;height:0!important;overflow:hidden;}"),e=i),t.push("#btmwx{width:0!important;height:0!important;overflow:hidden;}.main3 > div.right > div.abcd,.main3 > div.right > div.abcd div{width:0!important;height:0!important;overflow:hidden;}"),["/guwen/book_"].some((t=>location.pathname.includes(t)))&&t.push(".main3 .left .bookcont{width:100%!important;}"),t.length&&(console.info("Hello GushiwenDelads!"),function(t){const e=document.createElement("style");e.type="text/css",e.rel="stylesheet";try{e.appendChild(document.createTextNode(t))}catch(n){e.styleSheet.cssText=t}document.getElementsByTagName("head")[0].appendChild(e)}(t.join("")),window.onload=function(){e()})}
// ==UserScript==
// @name         GushiwenDelads
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  适用于古诗文网，tampermonkey的去广告脚本
// @author       You
// @match        https://so.gushiwen.cn/*
// @grant        none
// @license      https://github.com/isaaxite/tampermonkey-gusiwen_delads/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/467864/GushiwenDelads.user.js
// @updateURL https://update.greasyfork.org/scripts/467864/GushiwenDelads.meta.js
// ==/UserScript==
o();
