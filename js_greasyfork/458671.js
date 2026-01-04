// ==UserScript==
// @name         淘宝列表页面的宽度
// @version      1.3
// @author       amer0798
// @icon         https://www.taobao.com/favicon.ico
// @description  淘宝列表页面的宽度以适合宽屏显示 6个
// @match        *://s.taobao.com/*
// @include      https://s.taobao.com/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        none
// @namespace    https://greasyfork.org/users/740997
// @downloadURL https://update.greasyfork.org/scripts/458671/%E6%B7%98%E5%AE%9D%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/458671/%E6%B7%98%E5%AE%9D%E5%88%97%E8%A1%A8%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = `
        .grid-right{display:none!important}.grid-left{width:100%!important}.m-header-fixed .header-inner{left:50%;margin-left:-534px}.response-wider .grid-total{width:1664px!important}
        .tb-side{left:96.5%}
        `;
        
    var style=document.createElement("style");
    style.innerText=css;
    document.getElementsByTagName('head')[0].appendChild(style);
})();