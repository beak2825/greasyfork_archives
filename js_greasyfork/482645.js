// ==UserScript==
// @name         VNDB对条件文本完全显示,而不显示...省略
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  这里输入描述
// @author       aotmd
// @match        https://vndb.org/*
// @noframes
// @license MIT
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/482645/VNDB%E5%AF%B9%E6%9D%A1%E4%BB%B6%E6%96%87%E6%9C%AC%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA%2C%E8%80%8C%E4%B8%8D%E6%98%BE%E7%A4%BA%E7%9C%81%E7%95%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/482645/VNDB%E5%AF%B9%E6%9D%A1%E4%BB%B6%E6%96%87%E6%9C%AC%E5%AE%8C%E5%85%A8%E6%98%BE%E7%A4%BA%2C%E8%80%8C%E4%B8%8D%E6%98%BE%E7%A4%BA%E7%9C%81%E7%95%A5.meta.js
// ==/UserScript==

(function () {
    let styleElement = document.createElement('style');
    styleElement["type"] = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(`
    .xsearch .elm_dd_input {
        width: auto;
    }
    `));
})();