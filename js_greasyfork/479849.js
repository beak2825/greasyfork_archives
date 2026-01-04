// ==UserScript==
// @name         m网站跳转移除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  missav网站跳转移除
// @author       jiangliuer
// @match        https://missav.com/*
// @icon         
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479849/m%E7%BD%91%E7%AB%99%E8%B7%B3%E8%BD%AC%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/479849/m%E7%BD%91%E7%AB%99%E8%B7%B3%E8%BD%AC%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let elements = document.getElementsByClassName('aspect-w-16 aspect-h-9');
    let tagetElement = elements[11];
    tagetElement.removeAttribute('@click');
    tagetElement.removeAttribute('@keyup.space.window')
})();