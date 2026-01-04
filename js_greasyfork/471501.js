// ==UserScript==
// @name         Execute Quicker Command
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute Quicker command after page load
// @match        https://getquicker.net/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/471501/Execute%20Quicker%20Command.user.js
// @updateURL https://update.greasyfork.org/scripts/471501/Execute%20Quicker%20Command.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 在页面加载完成后执行指定的Quicker指令
function runQuickerCommand() {
    var command = 'quicker:runaction:7ad9d9b7-dd7c-4619-b1d7-f0f710c85842'; // 替换为你要执行的Quicker指令
    // 执行Quicker指令
    window.location.href = command; // 在当前标签页中加载指令URL
}

// 监听页面加载完成事件
window.addEventListener('load', runQuickerCommand);

})();