// ==UserScript==
// @name        pingcexue解除调试限制
// @namespace   Violentmonkey Scripts
// @match       https://www.pingcexue.com/*
// @grant       none
// @license     GPL-3.0-or-later
// @version     1.0
// @author      -
// @run-at       document-start
// @description 2024/3/24 下午3:54:58
// @downloadURL https://update.greasyfork.org/scripts/490726/pingcexue%E8%A7%A3%E9%99%A4%E8%B0%83%E8%AF%95%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/490726/pingcexue%E8%A7%A3%E9%99%A4%E8%B0%83%E8%AF%95%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

// QQ 947357389

(function() {
    'use strict';
    //全局变量 监控

 var _monitorDevTools = {};
    window.banDevTools={};
    var window_flag = 'banDevTools';
    var window_value = window[window_flag];
    Object.defineProperty(window, window_flag, {

      get: function() {
            console.log('Getting window._t',window_value);
            return ()=>{};
        },
        set: function(val) {
            console.log('Setting window._t', val);
            //debugger;
            _monitorDevTools = ()=>{};
            return ;
        }
    });
   // setTimeout(() => {function monitorDevTools(){}},1300)
})();

