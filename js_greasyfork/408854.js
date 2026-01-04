// ==UserScript==
// @name         跳过新浪短网址安全检测
// @namespace    https://greasyfork.org/users/49622
// @version      0.1
// @description  跳过新浪短网址安全检测。
// @author       过去终究是个回忆
// @match        http://t.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/408854/%E8%B7%B3%E8%BF%87%E6%96%B0%E6%B5%AA%E7%9F%AD%E7%BD%91%E5%9D%80%E5%AE%89%E5%85%A8%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/408854/%E8%B7%B3%E8%BF%87%E6%96%B0%E6%B5%AA%E7%9F%AD%E7%BD%91%E5%9D%80%E5%AE%89%E5%85%A8%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var link = document.querySelector('.link')
    link && window.location.replace(link.textContent)
})();