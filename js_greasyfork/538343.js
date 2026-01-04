// ==UserScript==
// @name         软著代理人自动填写
// @namespace    https://www.iuroc.com
// @version      v1.0.1
// @description  赚大钱
// @author       iuroc
// @match        https://ars.cpcccac.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cpcccac.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538343/%E8%BD%AF%E8%91%97%E4%BB%A3%E7%90%86%E4%BA%BA%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/538343/%E8%BD%AF%E8%91%97%E4%BB%A3%E7%90%86%E4%BA%BA%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

"use strict";(()=>{var d=!0,m=new MutationObserver(async()=>{if(location.pathname!="/register/R11-2"||!d)return;d=!1;let e=await u(()=>{let a=document.querySelector("div.mainContain.mid > form > div:nth-child(6)");if(!(!a||!a.querySelector(".titleA")))return a}),n=e.querySelector('[placeholder="\u9009\u62E9\u56FD\u5BB6"]'),[t,r]=e.querySelectorAll('[placeholder="\u9009\u62E9\u5730\u533A"]'),i=e.querySelector('[placeholder="\u9009\u62E9\u8EAB\u4EFD\u7C7B\u522B"]'),s=e.querySelector('[placeholder="\u9009\u62E9\u8BC1\u4EF6\u7C7B\u578B"]'),l=e.querySelector('[placeholder="\u8BF7\u8F93\u5165\u8BC1\u4EF6\u53F7\u7801"]'),w=document.querySelector('[placeholder="\u8BF7\u9009\u62E9\u8F6F\u4EF6\u5206\u7C7B"]'),c=document.querySelector('[placeholder="\u8BF7\u8F93\u5165\u7248\u672C\u53F7"]');if(!n)throw new Error("\u672A\u627E\u5230\u5143\u7D20: guojia");if(!t)throw new Error("\u672A\u627E\u5230\u5143\u7D20: diqu1");if(!r)throw new Error("\u672A\u627E\u5230\u5143\u7D20: diqu2");if(!i)throw new Error("\u672A\u627E\u5230\u5143\u7D20: shenfenleibie");if(!s)throw new Error("\u672A\u627E\u5230\u5143\u7D20: zhengjianleixing");if(!l)throw new Error("\u672A\u627E\u5230\u5143\u7D20: zhengjiahaoma");if(!w)throw new Error("\u672A\u627E\u5230\u5143\u7D20: softType");if(!c)throw new Error("\u672A\u627E\u5230\u5143\u7D20: version");c.value="V1.0",c.dispatchEvent(new Event("input")),await o(w,"\u5E94\u7528\u8F6F\u4EF6"),await o(n,"\u4E2D\u56FD"),await o(t,"\u5317\u4EAC"),await o(r,"\u901A\u5DDE"),await o(i,"\u4F01\u4E1A\u6CD5\u4EBA"),await o(s,"\u7EDF\u4E00\u793E\u4F1A\u4FE1\u7528\u4EE3\u7801\u8BC1\u4E66"),l.value="91110105MA006FC314",l.dispatchEvent(new Event("input")),window.scrollTo({top:0})});m.observe(document.body,{childList:!0,subtree:!0});async function o(e,n){e.click(),await u(()=>{let t=[...document.querySelectorAll("[x-placement] .el-select-dropdown__item")].filter(r=>r.textContent==n);if(t.length>0)return t[0].click(),!0}),await u(()=>!document.querySelector("[x-placement]"))}async function u(e,n=0){return new Promise(t=>{let r=setInterval(()=>{let i=e();i&&(t(i),clearInterval(r))},n)})}})();
// @license      MIT
