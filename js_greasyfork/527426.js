// ==UserScript==
// @name         BTSOW磁力提取
// @namespace    hoothin
// @version      2024-02-07
// @description  BT4G
// @author       You
// @match        https://btsow.motorcycles/search/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/527426/BTSOW%E7%A3%81%E5%8A%9B%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/527426/BTSOW%E7%A3%81%E5%8A%9B%E6%8F%90%E5%8F%96.meta.js
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