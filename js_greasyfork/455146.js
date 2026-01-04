// ==UserScript==
// @name         Steam自动勾选同意用户协议
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @version      0.2.5
// @description  Steam自动勾选同意用户协议复选框
// @author       shiquda
// @include      https://store.steampowered.com/*
// @include      https://steamcommunity.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455146/Steam%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/455146/Steam%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //读取网址
    var $href = window.location.href
    if ($href.indexOf('checkout') != -1){
        //console.log('checkout')
        $('accept_ssa').defaultChecked = true
        var tab1 = document.querySelector(".cart_totals_area"),
        tab2 = document.querySelector("#checkout_content_review"),
        a = document.querySelector("#cart_area")
        a.insertBefore(tab2,a.firstChild)
        a.insertBefore(tab1,a.firstChild)
    }
    else if ($href.indexOf('inventory') != -1){
        //console.log('inventory')
        window.onload = function(){
        var marketsell = document.getElementById('market_sell_dialog_accept_ssa')
        marketsell.checked = true
        }
    }
    else if ($href.indexOf('store.steampowered.com/cart') != -1){
        var tab3 = document.querySelector("div.checkout_content.cart.cart_totals")
        var head = document.querySelector("div.page_background > div.page_content")
        head.insertBefore(tab3,head.firstChild)
    }
})()

