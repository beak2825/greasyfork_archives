// ==UserScript==
// @name         it1352 view all
// @name:zh-CN   it1352 view all
// @name:zh-TW   it1352 view all
// @name:en      it1352 view all
// @version      0.1
// @author       LoganGong
// @namespace    http://tampermonkey.net/
// @description  it1352.com 查看全部内容，不必登陆
// @description:zh-CN  it1352.com 查看全部内容，不必登陆
// @description:zh-TW  it1352.com 查看全部内容，不必登陆
// @description:en  it1352.com view all the content
// @match        *://it1352.com/*
// @match        *://www.it1352.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/442447/it1352%20view%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/442447/it1352%20view%20all.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var IT1352 = "www.it1352.com";
    var HOST = document.location.host;
    var SELECTOR = ".arc-body-main";
    var MORESELECTOR = ".arc-body-main-more";
    if(HOST === IT1352) {
        var mains = document.querySelectorAll(SELECTOR);
        var mores = document.querySelectorAll(MORESELECTOR);
        setTimeout(function() {
            if(mains && mains.length) {
                mains.forEach(function(item) { item.style.height = "auto" });
            }
            if(mores && mores.length) {
                mores.forEach(function(item) {item.style.display = "none" });
            }
        }, 500);
    }
})();