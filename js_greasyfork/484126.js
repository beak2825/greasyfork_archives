// ==UserScript==
// @name         防止强制跳转
// @namespace    http://tampermonkey.net/
// @version      2024-01-07-1
// @description  防止网页强制跳转
// @author       share121
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/484126/%E9%98%B2%E6%AD%A2%E5%BC%BA%E5%88%B6%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484126/%E9%98%B2%E6%AD%A2%E5%BC%BA%E5%88%B6%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
})