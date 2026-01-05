// ==UserScript==
// @name         蒸汽夏卖 - 自动探索
// @namespace    moe.jixun.auto-queue
// @version      1.01
// @description  自动探索下一个项目。
// @author       Jixun.Moe <https://jixun.moe/>
// @include      http://store.steampowered.com/app/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/21051/%E8%92%B8%E6%B1%BD%E5%A4%8F%E5%8D%96%20-%20%E8%87%AA%E5%8A%A8%E6%8E%A2%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/21051/%E8%92%B8%E6%B1%BD%E5%A4%8F%E5%8D%96%20-%20%E8%87%AA%E5%8A%A8%E6%8E%A2%E7%B4%A2.meta.js
// ==/UserScript==

/* jshint esnext: true */

window.addEventListener('DOMContentLoaded', function() {
    var queue_next = document.getElementsByClassName('next_in_queue_content');
    if (queue_next.length > 0) {
        let time = 10000 + (5000 * Math.random());
        console.info('Wait..');
        setTimeout(function () {
            queue_next[0].click();
        }, time);
    }
}, false);