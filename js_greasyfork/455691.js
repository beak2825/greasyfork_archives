// ==UserScript==
// @name               網頁點亮腳本
// @name:zh-CN         网页点亮脚本
// @namespace          Anong0u0
// @version            0.1.1
// @description        點亮網頁，那麼灰誰看得下去?
// @description:zh-CN  点亮网页，那么灰谁看得下去?
// @author             Anong0u0
// @match              http://*/*
// @match              https://*/*
// @run-at             document-start
// @grant              none
// @license            beerware
// @downloadURL https://update.greasyfork.org/scripts/455691/%E7%B6%B2%E9%A0%81%E9%BB%9E%E4%BA%AE%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455691/%E7%B6%B2%E9%A0%81%E9%BB%9E%E4%BA%AE%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==


const css = document.createElement("style");

css.innerHTML = `
html, body, *, .fullgray, header-gray, .gray {
    -webkit-filter: grayscale(0) !important;
    -moz-filter: grayscale(0) !important;
    -ms-filter: grayscale(0) !important;
    -o-filter: grayscale(0) !important;
    filter: grayscale(0) !important;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=0) !important;
    filter: none !important;
}`;

document.documentElement.append(css);