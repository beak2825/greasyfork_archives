// ==UserScript==
// @name         鸿蒙文档 侧边目录宽度调整
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  调整鸿蒙OS文档的侧边目录的宽度
// @author       Asjun
// @match        https://developer.harmonyos.com/cn/docs/*
// @icon         https://www.google.com/s2/favicons?domain=harmonyos.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428261/%E9%B8%BF%E8%92%99%E6%96%87%E6%A1%A3%20%E4%BE%A7%E8%BE%B9%E7%9B%AE%E5%BD%95%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/428261/%E9%B8%BF%E8%92%99%E6%96%87%E6%A1%A3%20%E4%BE%A7%E8%BE%B9%E7%9B%AE%E5%BD%95%E5%AE%BD%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() { setWidth(); }, 2000);
})();

function setWidth() {
    if (document.querySelector("#documentMenu") == undefined) {
         return;
    }
    var width = '216px';
    var node = document.querySelector("#auiAnchorTarget > div > app-document-page > div:nth-child(1) > nz-layout > nz-sider.left-sider.ant-layout-sider");

    node.style.minWidth = width;
    node.style.maxWidth = width;
    node.style.width = width;

    node = document.querySelector("#documentMenu");
    node.style.width =width;
    
    node = document.querySelector("#documentMenu > div");
    node.style.marginLeft='16px';
    
    node = document.querySelector("#auiAnchorTarget > div > app-document-page > div:nth-child(1) > nz-layout > nz-content > div");
    node.style.marginLeft = '32px';
    node.style.marginRight = '32px';
}