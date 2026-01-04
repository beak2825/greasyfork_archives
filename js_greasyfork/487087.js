// ==UserScript==
// @name         btsow磁力提取
// @namespace    hoothin
// @version      2024-02-07
// @description  与https://greasyfork.org/zh-CN/scripts/22590-easy-offline配合食用
// @author       hoothin
// @match        https://btsow.motorcycles/search/*
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';
    [].forEach.call(document.querySelectorAll(`.row>a`), link => {
        const magnetLink = document.createElement("a");
        magnetLink.innerText = "🧲";
        magnetLink.style.cssText = "float: left; top: -25px; position: relative; left: -10px; margin-bottom: -25px;";
        magnetLink.href = link.href.replace(/.*\/hash\/(.*)/, "magnet:?xt=urn:btih:$1");
        link.parentNode.appendChild(magnetLink);
    });
})();