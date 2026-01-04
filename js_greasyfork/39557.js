// ==UserScript==
// @name         未登陆天猫不转跳登陆页面
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  未登陆天猫不转跳登陆页面。
// @author       only1wrod
// @include     /http(?:s|):\/\/(?:chaoshi\.detail|detail|item)\.tmall\.(?:[^./]+)\/item\.htm/
// @run-at      document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39557/%E6%9C%AA%E7%99%BB%E9%99%86%E5%A4%A9%E7%8C%AB%E4%B8%8D%E8%BD%AC%E8%B7%B3%E7%99%BB%E9%99%86%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/39557/%E6%9C%AA%E7%99%BB%E9%99%86%E5%A4%A9%E7%8C%AB%E4%B8%8D%E8%BD%AC%E8%B7%B3%E7%99%BB%E9%99%86%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

if(!/^(.*;)?\s*_nk_\s*=\s*[^;]/.test(document.cookie)){
   Object.freeze(location);
}