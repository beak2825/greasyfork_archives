// ==UserScript==
// @name         ios via屏蔽点击播放弹出广告
// @namespace    https://viayoo.com/
// @version      0.1
// @description  ios via屏蔽点击播放弹出广告1
// @author       You
// @run-at       document-start
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527630/ios%20via%E5%B1%8F%E8%94%BD%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E5%BC%B9%E5%87%BA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/527630/ios%20via%E5%B1%8F%E8%94%BD%E7%82%B9%E5%87%BB%E6%92%AD%E6%94%BE%E5%BC%B9%E5%87%BA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const player = document.querySelector(`div.order-first > div > div.relative > div`);
    if (player && player.hasAttribute("@click")) {
        player.removeAttribute("@click");
    }
    if (player && player.hasAttribute("@keyup.space.window")) {
        player.removeAttribute("@keyup.space.window");
    }
})();