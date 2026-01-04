// ==UserScript==
// @name         微信网页版简明主题
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  使得微信网页版不那么花哨，低调简洁
// @author       zhou.feng
// @match        https://wx.qq.com/*
// @match        https://wx2.qq.com/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373773/%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E7%AE%80%E6%98%8E%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/373773/%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E7%AE%80%E6%98%8E%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pMap = {
        "body": {
            "background": "white"
        },
        ".panel" : {
            "background": "white"
        },
        ".chat_item.active" : {
            "background": "#eee"
        },
        ".chat_item .info .nickname" : {
            "color": "black"
        },
        ".chat_item.active .ext, .chat_item.active .info .msg" : {
            "color": "black"
        },
        ".bubble.bubble_default" : {
            "background-color": "white"
        },
        ".bubble.bubble_primary" : {
            "background-color": "white"
        },
        ".box": {
            "background-color": "white"
        },
        ".header .info .nickname .display_name": {
            "color": "black"
        },
        ".box_hd .title_wrap": {
            "background-color": "white"
        },
        ".members": {
            "background-color": "white"
        },
        ".search_bar .frm_search": {
            "background-color": "white",
            "color": "#333"
        },
        ".recommendation": {
            "background-color": "white"
        },
        ".recommendation .contact_title": {
            "background-color": "white"
        },
        ".recommendation .contact_item.on": {
            "background-color": "#eee"
        },
        ".recommendation .contact_item": {
            "background-color": "white"
        },
        ".recommendation .info .nickname": {
            "color": "black"
        },
        ".contact_list .contact_title": {
            "background-color": "white"
        },
        ".contact_list .info .nickname": {
            "color": "black"
        },
        ".contact_list .active": {
            "background-color": "#eee"
        }
    }
    for(var selector in pMap){
        var cssText = "";
        for(var property in pMap[selector]) {
            cssText += (property + ":" + pMap[selector][property] + "!important;");
        }
        document.styleSheets[0].addRule(selector, cssText)
    }

    // 关闭下载桌面端的提示
    $("a.opt[ng-click='closeDownloadEntry()']").click();
})();