// ==UserScript==
// @icon         https://www.52pojie.cn/favicon.ico
// @name         52pojie论坛风格
// @namespace    https://zfdev.com
// @version      0.6
// @description  修改了一下论坛界面
// @author       Greendev
// @match        *://*.52pojie.cn/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/373888/52pojie%E8%AE%BA%E5%9D%9B%E9%A3%8E%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/373888/52pojie%E8%AE%BA%E5%9D%9B%E9%A3%8E%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".fl .bm_h{background:#eeeeee;background:-moz-linear-gradient(top,#eeeeee 0%,#cccccc 100%);background:-webkit-linear-gradient(top,#eeeeee 0%,#cccccc 100%);background:linear-gradient(to bottom,#eeeeee 0%,#cccccc 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#eeeeee',endColorstr='#cccccc',GradientType=0);}#wp a,.xi2{color:#4fb1ba;border-color:rgba(79,177,186,0.2);border-top-color:rgba(79,177,186,0.2);border-right-color:rgba(79,177,186,0.2);border-bottom-color:rgba(79,177,186,0.2);border-left-color:rgba(79,177,186,0.2);}#wp a:visited{color:#759598!important;}body{color:#333;background:#dddddd;font-weight:400;font-weight:700;font-weight:400;text-muted:#888;gray-bg:rgba(0,0,0,0.025);gray-text:#666;menu-text:#bbb;-webkit-transition:background .6s !important;transition:background .6s !important;-webkit-transition-timing-function:cubic-bezier(.2,1,.3,1) !important;transition-timing-function:cubic-bezier(.2,1,.3,1);}#wp{padding:3px 15px;background:#e9e9e9;box-sizing:border-box;-webkit-box-shadow:0 0.5em 1em 0.5em rgba(0,0,0,0.19);box-shadow:0 0.5em 1em 0.5em rgba(0,0,0,0.19);border-bottom-left-radius:0.3em;border-bottom-right-radius:0.3em;}i.pstatus{color:#888;}table.plhin{-webkit-transition:box-shadow .6s !important;transition:box-shadow .6s !important;-webkit-transition-timing-function:cubic-bezier(.2,1,.3,1) !important;transition-timing-function:cubic-bezier(.2,1,.3,1);}table.plhin:hover{-webkit-box-shadow:0 0 0.2em 0.1em rgba(0,0,0,0.19);box-shadow:0 0 0.2em 0.1em rgba(0,0,0,0.19);}.bm{margin-bottom:10px;}.pls{background-color:#193747!important;}.xi2 .notabs{color:#888!important;}.pls,dl > span,.xi2 a,.xi3 a{color:#fff!important;}.xg2{color:rgba(255,255,255,0.75)!important;}.xg2,.poston{color:#888!important;}td.plc{background:whitesmoke;}.pi strong a{border:1px solid #e5e5e5;}.quote{color:#8f8f8f;}html:not(.widthauto) .ct2_a .mn{width:760px;}form#postform{margin:5px;}.ct2_a,.ct3_a{background:#e9e9e9;background-color:#e9e9e9;}.pattl img,.sign img,.t_f img{-webkit-box-shadow:0 0.5em 1em 0.3em rgba(0,0,0,0.19);box-shadow:0 0.5em 1em 0.3em rgba(0,0,0,0.19);border-bottom-left-radius:0.3em;border-bottom-right-radius:0.3em;}");
})();