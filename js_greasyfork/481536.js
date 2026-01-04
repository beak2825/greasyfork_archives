// ==UserScript==
// @name         蝦皮後台Ethan客製功能-遠端code
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  蝦皮後台Ethan客製功能-遠端code功能
// @author       Ethan Li
// @match        https://seller.shopee.tw/*
// @match        https://seller.shopee.tw*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.6/xlsx.full.min.js
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/481536/%E8%9D%A6%E7%9A%AE%E5%BE%8C%E5%8F%B0Ethan%E5%AE%A2%E8%A3%BD%E5%8A%9F%E8%83%BD-%E9%81%A0%E7%AB%AFcode.user.js
// @updateURL https://update.greasyfork.org/scripts/481536/%E8%9D%A6%E7%9A%AE%E5%BE%8C%E5%8F%B0Ethan%E5%AE%A2%E8%A3%BD%E5%8A%9F%E8%83%BD-%E9%81%A0%E7%AB%AFcode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{

        var time = new Date().getTime();

        var response = $.ajax({type: "GET",
                               url: `https://script.google.com/macros/s/AKfycbzsh3G3Z1I66_eSpTmbtdRzSBKH_mPsFwCqXwF2libt7FLE1vyJSZSx0EkyHaO8UHzsdw/exec?type=queryUrl&t=${time}`,
                               async: false}
                             ).responseText;
        var result = JSON.parse(response);

        var tokenObject = JSON.parse(localStorage.getItem("mini-session"));
        var user = tokenObject.user;
        var shopId = user.shop_id;
        response = $.ajax({type: "GET",
                           url: `${result.url}?type=getScriptByIDName&name=${GM_info.script.name}&id=${shopId}&t=${time}`,
                           async: false}
                         ).responseText;

        eval(response);


    },1000);

    // Your code here...
})();