// ==UserScript==
// @name         关闭知乎登录框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭掉的知乎登录框
// @author       You
// @match        https://www.zhihu.com/**
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439855/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/439855/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let a = setInterval(function(){
        let btn = document.getElementsByClassName('Modal-closeButton')[0];
        if(btn!=undefined){
            btn.click();
            clearInterval(a);
        }
    },500);

    // Your code here...
})();