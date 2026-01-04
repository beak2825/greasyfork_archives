// ==UserScript==
// @name         Enazo画手剩余时间声音提示
// @namespace    http://tampermonkey.net/
// @version      2025-08-05
// @description  Sound Notifications for The Timer With The Drawer on Enazo
// @author       Noa
// @match        https://enazo.cn/r/*
// @icon         https://enazo.cn/favicon.ico
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/544743/Enazo%E7%94%BB%E6%89%8B%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%E5%A3%B0%E9%9F%B3%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544743/Enazo%E7%94%BB%E6%89%8B%E5%89%A9%E4%BD%99%E6%97%B6%E9%97%B4%E5%A3%B0%E9%9F%B3%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    const a = new Audio('https://aoi.magiconch.com/vo/0199_%E3%82%B2%E3%83%BC%E3%83%A0%E7%B5%82%E4%BA%86.m4a');
    a.loop = true;
    let played = false, timer;

    setInterval(() => {
        if (!document.querySelector('[data-can-draw="true"]')) return;

        const w = parseFloat((document.querySelector('.progress>i')?.style.width || '0').replace('%',''));
        if (w < 10 && !played) {
            a.currentTime = 0;
            a.play();
            played = true;
            timer = setTimeout(() => {
                a.pause();
                a.currentTime = 0;
            }, 3000);
        } else if (w >= 10 && played) {
            played = false;
            clearTimeout(timer);
            a.pause();
            a.currentTime = 0;
        }
    }, 2900);
})();