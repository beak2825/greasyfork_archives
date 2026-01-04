// ==UserScript==
// @name         屏蔽知乎不能关闭的登录框
// @namespace    https://lab.wsl.moe/
// @version      0.2
// @description  屏蔽知乎进入网页即加载的登录框
// @author       You
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/417178/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E4%B8%8D%E8%83%BD%E5%85%B3%E9%97%AD%E7%9A%84%E7%99%BB%E5%BD%95%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/417178/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E4%B8%8D%E8%83%BD%E5%85%B3%E9%97%AD%E7%9A%84%E7%99%BB%E5%BD%95%E6%A1%86.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const executeRemoveFunctionDelay = 500; // 执行延迟间隔（毫秒）
    const executeTimes = 11; // 进入页面以后重复执行次数

    const removeModalFunction = () => {
        const backgroundMasks = document.getElementsByClassName('Modal-backdrop');
        for (const i of backgroundMasks){
            i.className = '';
            i.innerHTML = '';
        }

        const loginModals = document.getElementsByClassName('Modal-enter-done');
        for (const i of loginModals){
            i.className = '';
            i.innerHTML = '';
        }

        document.getElementsByTagName('html')[0].style = '';
    };

    for (let i = 0; i <= executeTimes; i++) {
        setTimeout(removeModalFunction, executeRemoveFunctionDelay * i);
    }
})();