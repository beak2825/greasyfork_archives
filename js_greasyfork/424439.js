// ==UserScript==
// @name         抢场地 - 中山大学体育场馆管理与预订系统
// @namespace    a23187.cn
// @version      1.0.1
// @description  fucking SYSU gym booking system
// @author       A23187
// @match        http://gym.sysu.edu.cn/order/show.html?id=*
// @match        http://gym.sysu.edu.cn/product/show.html?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424439/%E6%8A%A2%E5%9C%BA%E5%9C%B0%20-%20%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E7%AE%A1%E7%90%86%E4%B8%8E%E9%A2%84%E8%AE%A2%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/424439/%E6%8A%A2%E5%9C%BA%E5%9C%B0%20-%20%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E7%AE%A1%E7%90%86%E4%B8%8E%E9%A2%84%E8%AE%A2%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

/* global applySeat:readonly, reserve1:readonly */

(function () {
    'use strict';

    const btn = document.getElementById('reserve');
    if(btn.style.display === 'none') {
        btn.style.display = 'inline-block';
        btn.classList.remove('button-disable');
        if(document.location.pathname.startsWith('/order')) {
            // for 'http://gym.sysu.edu.cn/order/show.html?id=*'
            btn.classList.remove('normal-button-mid');
            btn.onclick = reserve1;
        } else {
            // for 'http://gym.sysu.edu.cn/product/show.html?id=*'
            btn.onclick = applySeat;
        }
    }
}());