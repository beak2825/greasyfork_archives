// ==UserScript==
// @name         github results跳转打开新页面
// @namespace    http://tampermonkey.net/
// @version      2023-12-20
// @description  github内A标签跳转打开新页面
// @license      GPL-3.0
// @author       snail
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482737/github%20results%E8%B7%B3%E8%BD%AC%E6%89%93%E5%BC%80%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/482737/github%20results%E8%B7%B3%E8%BD%AC%E6%89%93%E5%BC%80%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 添加属性target
    function addTarget() {
        setTimeout(()=>{
            let resultsList = document.querySelector('div[data-testid="results-list"]')
            if (resultsList){
             let a = resultsList.querySelectorAll('a')
             if(a.length > 0){
               a.forEach(val => {
                 val.setAttribute('target', '_Blank')
               })
             }
            }
        }, 2000)
    }

    function watchUpdate() {
        // 检测浏览器是否支持 MutationObserver
        const MutationObserver =
            window.MutationObserver ||
            window.WebKitMutationObserver ||
            window.MozMutationObserver;
        // 获取当前页面的 URL
        let getCurrentURL = () => location.href;
        getCurrentURL.previousURL = getCurrentURL();

        const observer = new MutationObserver((mutations, observer1) => {
            const currentURL = getCurrentURL();
            if (currentURL !== getCurrentURL.previousURL) {
                console.log(`链接变化 `);
                getCurrentURL.previousURL = currentURL;
                addTarget()
            }
        })

        // 配置 MutationObserver
        const config = {
            characterData: true,
            subtree: true,
            childList: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'data-confirm'], // 仅观察特定属性变化
        };

        // 开始观察 document.body 的变化
        observer.observe(document.body, config);
    }

    function init() {
        console.log('初始化')
        addTarget()
        watchUpdate()
    }

    init()
})();
