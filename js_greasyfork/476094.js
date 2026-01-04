// ==UserScript==
// @name         Sa-Token官网去除Star验证
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动绕过Sa-Token官网的star校验
// @author       witt
// @match        https://sa-token.cc/*
// @icon         https://sa-token.cc/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476094/Sa-Token%E5%AE%98%E7%BD%91%E5%8E%BB%E9%99%A4Star%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/476094/Sa-Token%E5%AE%98%E7%BD%91%E5%8E%BB%E9%99%A4Star%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(localStorage.isStarRepo){
         console.log('无需绕过:', localStorage.isStarRepo);
        return;
    }

    // 设置 localStorage.isStarRepo
    localStorage.isStarRepo = new Date().getTime();

    console.log('已跳过检测:', localStorage.isStarRepo);
})();