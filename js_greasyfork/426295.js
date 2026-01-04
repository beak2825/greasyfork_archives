// ==UserScript==
// @name         Bilibili Evolved Issues Partial and Temporary Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fix Bilibili Evolved issue: video description color and auto-spread
// @author       Tianbao
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426295/Bilibili%20Evolved%20Issues%20Partial%20and%20Temporary%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/426295/Bilibili%20Evolved%20Issues%20Partial%20and%20Temporary%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function() {
        document.getElementsByClassName('desc-info desc-v2 open')[0].style.color = 'grey'
        console.log('视频简介区文字显示修复, 颜色: 灰')
        document.getElementsByClassName('desc-info desc-v2 open')[0].style.height = 'auto'
        console.log('视频简介区自动展开修复, 高度: 自动')
    };

})();