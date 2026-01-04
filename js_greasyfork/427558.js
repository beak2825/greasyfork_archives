// ==UserScript==
// @name         小程序文档 固定搜索按钮
// @version      1.2
// @author       Finn
// @namespace    https://github.com/Germxu
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey
// @description  小程序开发文档 固定搜索按钮
 
// @match        https://developers.weixin.qq.com/miniprogram/*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427558/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%96%87%E6%A1%A3%20%E5%9B%BA%E5%AE%9A%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/427558/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%96%87%E6%A1%A3%20%E5%9B%BA%E5%AE%9A%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
   const search =`.search__wrp{display: inline-block;
    vertical-align: middle;
    width: 360px;
    position: fixed;
    top: 80px;
    width: 280px!important;
    right: 8px;
    transition:all 0.2s;
    box-shadow: 0 0 20px rgb(0 0 0 / 23%);}
    .search__wrp:focus-within{
        width: 450px!important;
        right:88px;
    }`;
GM_addStyle(search)
})();