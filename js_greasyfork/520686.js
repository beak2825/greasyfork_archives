// ==UserScript==
// @name         企鹅标注界面优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  企鹅标注界面优化一些字体，方便识别
// @author       Jiyao
// @match        https://qlabel.tencent.com/*
// @license      AGPL-3.0
// @grant        GM_addStyle
// @grant        GM_addElement
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/520686/%E4%BC%81%E9%B9%85%E6%A0%87%E6%B3%A8%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520686/%E4%BC%81%E9%B9%85%E6%A0%87%E6%B3%A8%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    GM_addStyle('#warterMK{background-image: none !important;}.z-log {color: #fff !important;}');

    GM_addStyle('.ivu-checkbox-wrapper{font-size: 28px !important;}.ivu-input{font-size: 28px !important;color: blue !important;}.mlm{font-size: 28px !important;color: lime !important;}.mtm{font-size: 28px !important;color: blue !important;}.customInput horizontalLtr{font-size: 28px !important;color: lime !important;}.ivu-btn-large{height: 120px !important;font-size: 48px !important;}.button-board{height: 32px !important;line-height: 32px !important;font-size: 32px !important;}.key-board{height: 32px !important;line-height: 32px !important;font-size: 32px !important;}.customInput{color: lime !important;font-size: 32px !important;}.ivu-icon{color: lime !important;font-size: 48px !important;}.ivu-split-pane.top-pane{bottom: 67% !important;}.ivu-split-vertical>.ivu-split-trigger-con{top: 33% !important;}.ivu-split-pane.bottom-pane{top: 34% !important;}.icon-button{width: auto !important;}.customLayoutInput .select{top: -50px !important;}');
    
})();