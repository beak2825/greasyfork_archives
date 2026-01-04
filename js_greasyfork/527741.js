// ==UserScript==
// @name         最简单的油猴脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在网页上添加一个红色方块
// @author       你
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527741/%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527741/%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个红色的方块
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.right = '20px';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.backgroundColor = 'red';
    div.style.borderRadius = '5px';

    // 将方块添加到页面上
    document.body.appendChild(div);
})();