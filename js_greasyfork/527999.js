// ==UserScript==
// @name         免登录解除小艺提问限制
// @namespace    https://www.yffjglcms.com/
// @version      2025-02-17
// @description  解除小艺限制
// @author       yffjglcms
// @match        https://xiaoyi.huawei.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://xiaoyi.huawei.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527999/%E5%85%8D%E7%99%BB%E5%BD%95%E8%A7%A3%E9%99%A4%E5%B0%8F%E8%89%BA%E6%8F%90%E9%97%AE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/527999/%E5%85%8D%E7%99%BB%E5%BD%95%E8%A7%A3%E9%99%A4%E5%B0%8F%E8%89%BA%E6%8F%90%E9%97%AE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function recursiveTimeout(func, timeout) {
        // 执行传入的函数
        func();
        // 延迟 timeout 毫秒后递归调用自身
        setTimeout(() => {
            recursiveTimeout(func, timeout);
        }, timeout);
    }

    function check(){

        let ct = localStorage.qaCount
        if(ct > 5){
            console.log(`重置qa数量`)
            localStorage.qaCount = 1
        }

    }

    recursiveTimeout(check, 1000)

})();