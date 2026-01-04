// ==UserScript==
// @name         关闭百度网盘失效链接标签页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当打开百度分享链接时，如果链接失效，自动关闭标签页
// @author       kakasearch
// @match        https://pan.baidu.com/s/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/411600/%E5%85%B3%E9%97%AD%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%A4%B1%E6%95%88%E9%93%BE%E6%8E%A5%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/411600/%E5%85%B3%E9%97%AD%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%A4%B1%E6%95%88%E9%93%BE%E6%8E%A5%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
        if(/链接不存在/.test(document.querySelector("head > title").innerText)){
        window.close()
        }

    // Your code here...
})();