// ==UserScript==
// @name         VNDB标签布局修正
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  中文化后会导致布局出现问题,修正浮动
// @author       aotmd
// @match        https://vndb.org/*
// @noframes
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458284/VNDB%E6%A0%87%E7%AD%BE%E5%B8%83%E5%B1%80%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/458284/VNDB%E6%A0%87%E7%AD%BE%E5%B8%83%E5%B1%80%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function () {

    addStyle(`
    .tagtree > li:nth-child(7n+1) {
        /* height: 120px; */
        clear: left;
    }
    `);
    //添加css样式
    function addStyle(rules) {
        let styleElement = document.createElement('style');
        styleElement["type"] = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
})();