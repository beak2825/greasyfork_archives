// ==UserScript==
// @name         Lure宝可梦替换
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  替换lure的卡牌，展示为宝可梦
// @author       N
// @match        https://boardgamearena.com/*lure*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamearena.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507989/Lure%E5%AE%9D%E5%8F%AF%E6%A2%A6%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/507989/Lure%E5%AE%9D%E5%8F%AF%E6%A2%A6%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    // 创建一个新的<style>元素
    var style = document.createElement('style');
    style.type = 'text/css';

    // 写入新的CSS规则
    style.appendChild(document.createTextNode(`
        .card {
            background-image: url(https://s21.ax1x.com/2024/08/29/pAAcPns.jpg) !important;
            background-size: 1500% 300%
        }
    `));
    document.head.appendChild(style);
})();