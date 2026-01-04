// ==UserScript==
// @name         解决uid1谜题问题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  我厉害
// @author       yangrou
// @match        *://gitblock.cn/Missions/20236/View
// @match        *://aerfaying.com/Missions/20236/View
// @match        *://gitblock.cn/Missions/20202/View
// @match        *://aerfaying.com/Missions/20202/View
// @icon         https://cdn.gitblock.cn/Media?name=11E4D54652FE811D8AE24371393C95C2.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463042/%E8%A7%A3%E5%86%B3uid1%E8%B0%9C%E9%A2%98%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/463042/%E8%A7%A3%E5%86%B3uid1%E8%B0%9C%E9%A2%98%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("head").append("<style>.ReactModal__Overlay{display:none;}</style>");
})();