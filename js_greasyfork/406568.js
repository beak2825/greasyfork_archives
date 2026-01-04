// ==UserScript==
// @name         任性添加到Steam购物车
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  就是这么任性
// @author       Raka-loah
// @match        *://store.steampowered.com/agecheck/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406568/%E4%BB%BB%E6%80%A7%E6%B7%BB%E5%8A%A0%E5%88%B0Steam%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/406568/%E4%BB%BB%E6%80%A7%E6%B7%BB%E5%8A%A0%E5%88%B0Steam%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var appid = /\/app\/(\d+)/g.exec(window.location.href)[1];
    document.getElementById('error_box').insertAdjacentHTML('beforeend', '<br><br><a id="skip" href="javascript:;">从探索队列跳过此项目（如果在你的探索队列中）</a></button><br><br><a href="javascript:addToCart(' + appid + ')">任性尝试添加到购物车（厂商锁区游戏无法添加）</a>');
    document.getElementById('skip').addEventListener("click", () => { $J.post("/app/7", { sessionid: g_sessionID, appid_to_clear_from_queue: appid }); location.href='https://store.steampowered.com/explore/'; });

})();