// ==UserScript==
// @name         楽天メルマガ自動解除
// @name:ja      楽天メルマガ自動解除
// @name:en      rakuten auto uncheck email optins
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bruh.
// @description:ja  bruh.
// @description:en  bruh.
// @license      MIT
// @author       You
// @match        https://basket.step.rakuten.co.jp/rms/mall/bs/mconfirmorderquicknormalize/*
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/456154/%E6%A5%BD%E5%A4%A9%E3%83%A1%E3%83%AB%E3%83%9E%E3%82%AC%E8%87%AA%E5%8B%95%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/456154/%E6%A5%BD%E5%A4%A9%E3%83%A1%E3%83%AB%E3%83%9E%E3%82%AC%E8%87%AA%E5%8B%95%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

document.querySelectorAll('img[alt=すべて解除]').forEach(a => a.click())
