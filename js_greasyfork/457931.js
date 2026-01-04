// ==UserScript==
// @name         所有字体改成Papyrus和华文行楷
// @name:en      All fonts are changed to Papyrus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将你的网页上的所有文字字体改成华文行楷和Papyrus（纸莎草），没有华文行楷字体的将用其他行楷代替。
// @description:en Change all the text fonts on your web pages to Chinese lineal and Papyrus, those without Chinese lineal fonts will be replaced with other lineal fonts.
// @author       LoadOverload
// @match        http*://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457931/%E6%89%80%E6%9C%89%E5%AD%97%E4%BD%93%E6%94%B9%E6%88%90Papyrus%E5%92%8C%E5%8D%8E%E6%96%87%E8%A1%8C%E6%A5%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/457931/%E6%89%80%E6%9C%89%E5%AD%97%E4%BD%93%E6%94%B9%E6%88%90Papyrus%E5%92%8C%E5%8D%8E%E6%96%87%E8%A1%8C%E6%A5%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.document.head.innerHTML +=`<style>*{font-family : papyrus,STXingkai,FZYaoti,KaiTi !important;}</style>"`
    // Your code here...
})();