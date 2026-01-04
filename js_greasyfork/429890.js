// ==UserScript==
// @name         掘金自动去除扩展广告
// @namespace    zzz
// @version      1.2
// @description  掘金自动去除扩展广告，避免手动关闭
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @author       rt
// @match        https://juejin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429890/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E6%89%A9%E5%B1%95%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/429890/%E6%8E%98%E9%87%91%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E6%89%A9%E5%B1%95%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if(!localStorage.getItem('hideExtension')){
        localStorage.setItem('hideExtension',true)
    }
    // Your code here...
})();