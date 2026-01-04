// ==UserScript==
// @name         SUP后台辅助工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一个打酱油的工具而已
// @author       九零
// @match        http*://192.168.8.215:7001/*
// @match        http*://sup.900sup.cn/*
// @match        http*://sup1.900sup.cn/*
// @match        http*://localhost:*/*
// @match        http*://192.168.9.7:8082/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455188/SUP%E5%90%8E%E5%8F%B0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/455188/SUP%E5%90%8E%E5%8F%B0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    let src="http://162.14.66.2:9099/SUPTools.js?t="+Math.random();
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = src;
    document.documentElement.appendChild(script);
})();