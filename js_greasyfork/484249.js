// ==UserScript==
// @name         修复游侠图片不展示问题
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  fix img display
// @author       Xuanqing Lu
// @match        https://down.ali213.net/pcgame/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ali213.net
// @grant        none
// @license      MIT
// @homepage     https://github.com/LuXuanqing/fix-ali213/tree/main
// @supportURL   https://github.com/LuXuanqing/fix-ali213/tree/main
// @downloadURL https://update.greasyfork.org/scripts/484249/%E4%BF%AE%E5%A4%8D%E6%B8%B8%E4%BE%A0%E5%9B%BE%E7%89%87%E4%B8%8D%E5%B1%95%E7%A4%BA%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/484249/%E4%BF%AE%E5%A4%8D%E6%B8%B8%E4%BE%A0%E5%9B%BE%E7%89%87%E4%B8%8D%E5%B1%95%E7%A4%BA%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // fix pcgame list img src 
    const nodes = document.querySelectorAll('.content-a>img')
    for (const node of nodes) {
        const url = node.getAttribute('data-original')
        if (url) {
            node.src = url
        }
    }

    // scroll to game list smoothly
    const list = document.querySelector('.famous-ul-container')
    if (list) {
        list.scrollIntoView({ behavior: 'smooth' })
    }
})();