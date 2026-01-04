// ==UserScript==
// @name     gm22951背景白化
// @description タイピングゲームの背景を白にする
// @version  3
// @license CC0
// @grant    none
// @run-at   document-end
// @match    https://resource.game.nicovideo.jp/games/gm22951/18/index.html
// @namespace https://greasyfork.org/users/976333
// @downloadURL https://update.greasyfork.org/scripts/453892/gm22951%E8%83%8C%E6%99%AF%E7%99%BD%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/453892/gm22951%E8%83%8C%E6%99%AF%E7%99%BD%E5%8C%96.meta.js
// ==/UserScript==
document.querySelector('head').appendChild(document.createElement('style')).textContent = '#container canvas{filter:invert(1)}';
