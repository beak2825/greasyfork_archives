// ==UserScript==
// @name         硬币站自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  硬币站签到
// @author       zaqw6414
// @match        https://www.chrono.gg*
// @match        https://www.chrono.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371229/%E7%A1%AC%E5%B8%81%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/371229/%E7%A1%AC%E5%B8%81%E7%AB%99%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
var a1 = document.getElementById('reward-coin');
setInterval(function(){a1.click();window.location.reload();},30000);
})();