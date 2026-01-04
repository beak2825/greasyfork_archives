// ==UserScript==
// @name         Bing AI 图像拓展
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解锁NewBing的GPT4识图能力的脚本，教程来自https://github.com/Vanda688/Using-GPT4-image-recognition-on-NewBing
// @author       Tianli
// @match        https://www.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471001/Bing%20AI%20%E5%9B%BE%E5%83%8F%E6%8B%93%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/471001/Bing%20AI%20%E5%9B%BE%E5%83%8F%E6%8B%93%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var code = `
        _w["_sydConvConfig"].sydOptionSets += ",iycapbing,iyxapbing",
        _w["_sydConvConfig"].enableVisualSearch = true;
    `;

    var script = document.createElement('script');
    script.textContent = code;

    document.head.appendChild(script);
})();