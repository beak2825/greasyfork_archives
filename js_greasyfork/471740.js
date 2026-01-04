// ==UserScript==
// @name         山东大学高校邦鼠标监视废除
// @namespace    https://jenway.github.io
// @version      0.1
// @description  废除自动暂停
// @author       Jenway
// @match        *.class.gaoxiaobang.com/class/*
// @icon         https://static-gs.class.gaoxiaobang.com/image/favicon/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471740/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E9%AB%98%E6%A0%A1%E9%82%A6%E9%BC%A0%E6%A0%87%E7%9B%91%E8%A7%86%E5%BA%9F%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/471740/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E9%AB%98%E6%A0%A1%E9%82%A6%E9%BC%A0%E6%A0%87%E7%9B%91%E8%A7%86%E5%BA%9F%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 废除鼠标监视，这里强制拦截了事件监听
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if(args.length!==0&&args[0]==='blur'){
            console.log('成功')
            return;
        }
        return oldadd.call(this,...args)
    }

})();
