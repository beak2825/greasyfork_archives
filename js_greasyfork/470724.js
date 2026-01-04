// ==UserScript==
// @name         黄黑警示条
// @namespace    your-namespace
// @version      1.1
// @description  将指定页面背景修改为黄黑警示条效果
// @match        https://mis.aplum.com/mis/*
// @match        https://mis-pre.aplum.com:7443/*
// @match        https://pre-c2b.hongbulin.net/*
// @match        https://c2b.hongbulin.net/*
// @grant        none
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/470724/%E9%BB%84%E9%BB%91%E8%AD%A6%E7%A4%BA%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/470724/%E9%BB%84%E9%BB%91%E8%AD%A6%E7%A4%BA%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建警示条元素
    var Warning_strip = document.createElement('div');
    Warning_strip.style.position = 'fixed';
    Warning_strip.style.top = '0';
    Warning_strip.style.left = '0';
    Warning_strip.style.width = '100%';
    Warning_strip.style.height = '5PX';
    Warning_strip.style.backgroundColor = 'yellow';
    Warning_strip.style.backgroundImage = 'repeating-linear-gradient(45deg, yellow, yellow 10px, black 10px, black 20px)';
    Warning_strip.style.zIndex = '9999';

    // 将警示条添加到页面中
    document.body.appendChild(Warning_strip);
})();
