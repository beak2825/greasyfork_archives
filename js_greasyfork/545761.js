// ==UserScript==
// @name         tapd-dialog-clear
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  移除tapd授权人数提醒弹窗
// @author       JackZhouMine(zhouqijun4job@163.com)
// @match        https://www.tapd.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545761/tapd-dialog-clear.user.js
// @updateURL https://update.greasyfork.org/scripts/545761/tapd-dialog-clear.meta.js
// ==/UserScript==
(function(){"use strict";f();const a=["/api/company/company/get_company_renew_info"],c=e=>{if(!e)return!1;const t=String(e).toLowerCase();return a.some(r=>r instanceof RegExp&&r.test(t)||r.endsWith(t)||r.startsWith(t)?!0:t.includes(r.toLowerCase()))};p(),l();let o=!1,s;const i=setInterval(u,500);setTimeout(u,2e3);function u(){s=document.querySelector(".el-dialog__headerbtn"),o&&clearInterval(i),s&&(s.click(),clearInterval(i))}function l(){const e=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(r,n){return this.__url=n,e.apply(this,arguments)};const t=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.send=function(){if(c(this.__url)){console.log("Blocked XHR:",this.__url),o=!0,this.abort();return}return t.apply(this,arguments)}}function p(){const e=window.fetch;window.fetch=function(t,r){const n=typeof t=="string"?t:t?.url;return c(n)?(console.warn("Blocked fetch:",n),o=!0,Promise.reject(new DOMException("Blocked by userscript","AbortError"))):e.apply(this,arguments)}}function f(){window.addEventListener("unhandledrejection",e=>{console.error(e.reason),e.preventDefault()}),window.onerror=function(e,t,r,n,d){return console.error("\u5168\u5C40\u9519\u8BEF:",e,t,r,n,d),!0}}})();
