// ==UserScript==
// @name         萌娘百科去广告
// @namespace    https://greasyfork.org/zh-CN/scripts/459124
// @version      1.0
// @description  萌娘百科去除广告弹窗
// @author       You
// @match        *://*.moegirl.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moegirl.org.cn
// @grant        none
// @license none
// @downloadURL https://update.greasyfork.org/scripts/459124/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/459124/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    document.querySelector("body").addEventListener('DOMNodeInserted', function(){
        var ad = document.querySelector("button.fc-close")
        if (ad !== null) {
            ad.click()
        }
    })
})();