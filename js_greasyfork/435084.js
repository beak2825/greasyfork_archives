// ==UserScript==
// @name         为b站(bilibili)添加更多倍速
// @namespace    none
// @version      1.00
// @description  为b站(bilibili)添加更多倍速:0.1X;0.2X;2.5X;3X;4X;5X;10x.
// @author       DuckBurnIncense
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/435084/%E4%B8%BAb%E7%AB%99%28bilibili%29%E6%B7%BB%E5%8A%A0%E6%9B%B4%E5%A4%9A%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/435084/%E4%B8%BAb%E7%AB%99%28bilibili%29%E6%B7%BB%E5%8A%A0%E6%9B%B4%E5%A4%9A%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

//bilibili-player-video-btn-speed-menu

$(".bilibili-player-video-btn-speed-menu").prepend("<li class='bilibili-player-video-btn-speed-menu-list' data-value='3'>3.0x</li>");