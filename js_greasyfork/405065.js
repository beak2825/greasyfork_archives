// ==UserScript==
// @name         掘金自动去除底部广告
// @namespace    bingyang
// @version      0.1
// @description  掘金自动去除底部广告，避免手动关闭
// @author       bingyang
// @match        https://juejin.im/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405065/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E5%BA%95%E9%83%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/405065/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E5%BA%95%E9%83%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!localStorage.getItem('hideExtension')){
        localStorage.setItem('hideExtension',true)
    }

    // Your code here...
})();