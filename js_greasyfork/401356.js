// ==UserScript==
// @name         New Script 
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自已使用
// @author       William_ni
// @match        http://*/*
// @match        https://*/*
// @exclude      *.wuhaneduyun.cn
// @exclude      *.wuhaneduyun.cn/*
// @exclude      *.wuhaneduyun.cn/* 
// @exclude      *.baidu.com/*
// @exclude      *.greasyfork.org/*
// @grant        
// @downloadURL https://update.greasyfork.org/scripts/401356/New%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/401356/New%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
if (/游戏|游戏玩法/.test(document.body.innerText) ) document.body.innerText = '请好好学习，同学！  ^_^';
    // document.body.innerText = '好好学习';
    // && !/学习/.test(document.body.innerText)  alert('又走神啦！');

})();