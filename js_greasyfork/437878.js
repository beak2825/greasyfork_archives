// ==UserScript==
// @name         无代理访问aurakingdom.to
// @namespace    https://space.bilibili.com/52159566
// @version      0.1
// @description  无代理访问aurakingdom.to官网
// @author       苏芣苡
// @match        *://aurakingdom.to/*
// @icon         https://q.qlogo.cn/g?b=qq&s=100&nk=318328258
// @connect      aurakingdom.to
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437878/%E6%97%A0%E4%BB%A3%E7%90%86%E8%AE%BF%E9%97%AEaurakingdomto.user.js
// @updateURL https://update.greasyfork.org/scripts/437878/%E6%97%A0%E4%BB%A3%E7%90%86%E8%AE%BF%E9%97%AEaurakingdomto.meta.js
// ==/UserScript==

let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://code.jquery.com/jquery-3.2.1.js";
document.documentElement.appendChild(script);