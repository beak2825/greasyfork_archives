// ==UserScript==
// @name         屏蔽百度热搜、资讯、搜索页右侧相关网站、热榜
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  屏蔽百度热搜、百度首页资讯、百度首页热榜、百度搜索页右侧相关网站.
// @author       ysypnbh
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420976/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E3%80%81%E8%B5%84%E8%AE%AF%E3%80%81%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%8F%B3%E4%BE%A7%E7%9B%B8%E5%85%B3%E7%BD%91%E7%AB%99%E3%80%81%E7%83%AD%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/420976/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E3%80%81%E8%B5%84%E8%AE%AF%E3%80%81%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%8F%B3%E4%BE%A7%E7%9B%B8%E5%85%B3%E7%BD%91%E7%AB%99%E3%80%81%E7%83%AD%E6%A6%9C.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 未登录，关闭百度首页热榜
    if (document.getElementById("s-hotsearch-wrapper")) {
        document.getElementById("s-hotsearch-wrapper").className += ' hide'
    }
    if (document.getElementById("head_wrapper")) {
        document.getElementById("head_wrapper").className += ' s-ps-islite'
    }
    // 已登录，关闭百度首页资讯
    if (document.getElementsByClassName("s-manhattan-index")) {
        document.getElementsByClassName("s-manhattan-index").className += ' is-lite'
    }
    if (document.getElementById("s_menu_gurd")) {
        document.getElementById("s_menu_gurd").style.display = 'none'
    }
    if (document.getElementById("s_wrap")) {
        document.getElementById("s_wrap").style.display = 'none'
    }
    // 已登录，关闭百度placeholder
    setTimeout(() => {
        // 已登录，关闭百度placeholder
        if (document.getElementById('kw')) {
            let kw_elem = document.getElementById("kw");
            if (kw_elem.hasAttribute("placeholder")) {
                document.getElementById('kw').setAttribute('placeholder', '');
            }
        }
        if (document.getElementById('chat-textarea')) {
            let chat_textarea_elem = document.getElementById("chat-textarea");
            if (chat_textarea_elem.hasAttribute("placeholder")) {
                document.getElementById('chat-textarea').setAttribute('placeholder', '');
            }
        }
    }, 1000);


    function closeContentRight() {
        if (location.hostname == "www.baidu.com") {
            var myVar = setInterval(function () {
                // 屏蔽百度搜closeContentRight索页右侧相关网站、百度热榜等
                if (document.getElementById('content_right')) {
                    document.getElementById('content_right').style.display = "none";
                }
                if (document.getElementById('rrecom-container')) {
                    document.getElementById('rrecom-container').style.display = "none";
                }
                if (document.getElementsByClassName("opr-recommends-merge-content")[0]) {
                    document.getElementsByClassName("opr-recommends-merge-content")[0].style.display = "none";
                }
                // popup-advert 关闭华为广告 制作屏蔽该广告日期25-11-18
                if (document.getElementsByClassName("popup-advert")[0]) {
                    document.getElementsByClassName("popup-advert")[0].style.display = 'none'
                }
                // 清除placeholder缓存
                if (localStorage.getItem('placeholderData')) {
                    localStorage.removeItem('placeholderData');
                }
            }, 150);
        }
    }
    closeContentRight()
    // Your code here...
})();