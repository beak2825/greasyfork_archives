// ==UserScript==
// @name         淘宝定时开抢
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  如果需要选择商品类型，请提前选择好类型会自动刷新，速度取决于您的当前网络！
// @author       Freeze
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmall.com
// @grant        none

// @include      *://item.taobao.com/*
// @include      *://s.taobao.com/search*
// @include      *://list.tmall.com/search_product.htm*
// @include      *://detail.tmall.com/*
// @include      *://chaoshi.detail.tmall.com/*
// @include      *://detail.tmall.hk/*

// @grant        GM_setClipboard
// @run-at       document-end
// @connect      shangxueba365.com
// @connect      api.wandhi.com
// @connect      cdn.jsdelivr.net
// @connect      tool.manmanbuy.com
// @connect      xbeibeix.com
// @connect      gwdang.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @compatible   firefox
// @compatible   chrome
// @compatible   opera safari edge
// @compatible   safari
// @compatible   edge
// @antifeature  referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450123/%E6%B7%98%E5%AE%9D%E5%AE%9A%E6%97%B6%E5%BC%80%E6%8A%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/450123/%E6%B7%98%E5%AE%9D%E5%AE%9A%E6%97%B6%E5%BC%80%E6%8A%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dom = document.querySelector('#J_LinkBuy') || document.querySelector('.J_LinkBuy');
    window.setInterval(fn, 100);

    function fn() {
        if(!dom) return;

        dom.offsetParent ? dom.click() :window.location.reload();
    }
})();