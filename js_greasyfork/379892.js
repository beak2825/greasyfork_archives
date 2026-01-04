// ==UserScript==
// @name         虎牙样式
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ToveLo No.1!
// @author       Wuzhiji
// @match        *://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379892/%E8%99%8E%E7%89%99%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/379892/%E8%99%8E%E7%89%99%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('.J_msg > .msg-normal     > .msg-normal-decorationSuffix { display: none}');
    addStyle('.J_msg > .msg-nobleSpeak > .msg-nobleSpeak-decorationSuffix { display: none}');
    addStyle('.J_msg > .msg-normal     > * { font-size: 12px;-webkit-font-smoothing: antialiased;}');
    addStyle('.J_msg > .msg-nobleSpeak > * { font-size: 12px;-webkit-font-smoothing: antialiased;}');
    addStyle('.J_msg > .msg-normal     > .name { max-width: none}');
    addStyle('.J_msg > .msg-nobleSpeak > .name { max-width: none}');
})();